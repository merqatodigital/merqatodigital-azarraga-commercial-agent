import { Agent, callable, type Connection, type ConnectionContext } from "agents";
import { createInitialState } from "../src/agent/seed";
import {
  answerFromMemory as answerFromMemoryEngine,
  learnFromConversation as learnFromConversationEngine,
  learnFromDocument as learnFromDocumentEngine,
  learnFromQuote as learnFromQuoteEngine,
  suggestImprovements as suggestImprovementsEngine,
} from "../src/agent/knowledge";
import { detectDueFollowUps, mergeFollowUps } from "../src/agent/followups";
import {
  calculateQuote as domainCalculateQuote,
  draftInvoiceFromApprovedQuote,
  invoiceBalance,
} from "../src/engine/invoiceEngine";
import { findHistoricalPrices, findCustomerHistory, findProjectHistory, nearestEvidence } from "../src/icm/index";
import { qualifyLead, canTransitionLead } from "../src/leads/index";
import { convertFromPHP } from "../src/engine/currency";
import { comparePOToQuote, type POInput } from "../src/engine/poComparison";
import { createProjectFromWonQuote, BILLING_STAGES } from "../src/engine/projectWorkflow";
import { quoteReadiness } from "../src/engine/quoteReadiness";
import {
  createPendingIngestion,
  addExtractedFact,
  markIngestionReviewed,
} from "../src/icm/documentIngestion";
import {
  AgentEnvelope,
  DocumentIngestion,
  PlanExtraction,
  QuoteDraft,
  HistoricalPriceRetrieval,
  POComparison,
  InvoiceDraft,
  LeadQualification,
} from "../src/agent/contracts";
import type {
  AzarragaState,
  ChatMessage,
  DocumentRecord,
  FollowUpTask,
  Invoice,
  Lead,
  Quote,
  QuoteLine,
  AgentMethod,
  RpcRequest,
  RpcResponse,
  ServerMessage,
} from "../src/agent/types";

// ─── Environment ─────────────────────────────────────────────────

export interface Env {
  AzarragaAgent: DurableObjectNamespace;
  AI?: Ai;
  OPENROUTER_API_KEY?: string;
  OPENROUTER_SITE_URL?: string;
  OPENROUTER_MODEL?: string;
  NEXT_PUBLIC_APP_URL?: string;
}

// ─── Models ──────────────────────────────────────────────────────

const TEXT_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const VISION_MODEL = "@cf/meta/llama-3.2-11b-vision-instruct";
const DEFAULT_OPENROUTER_MODEL = "nvidia/nemotron-nano-9b-v2:free";

// ─── Durable Object ──────────────────────────────────────────────

export class AzarragaAgent extends Agent<Env, AzarragaState> {
  initialState: AzarragaState = createInitialState();

  async onStart() {
    // SQLite tables for permanent memory — never trimmed
    this.sql`CREATE TABLE IF NOT EXISTS activity (
      id TEXT PRIMARY KEY,
      kind TEXT,
      payload TEXT,
      created_at TEXT
    )`;
    this.sql`CREATE TABLE IF NOT EXISTS messages_log (
      id TEXT PRIMARY KEY,
      role TEXT,
      content TEXT,
      created_at TEXT
    )`;
    this.sql`CREATE TABLE IF NOT EXISTS facts_log (
      id TEXT PRIMARY KEY,
      kind TEXT,
      summary TEXT,
      source_ref TEXT,
      created_at TEXT
    )`;
  }

  async onConnect(connection: Connection, _ctx: ConnectionContext) {
    connection.send(JSON.stringify({ type: "cf_agent_state", state: this.state }));
  }

  async onMessage(connection: Connection, message: string) {
    let parsed: RpcRequest;
    try {
      parsed = JSON.parse(message);
    } catch {
      return;
    }
    if (parsed.type !== "rpc" || !parsed.method) return;

    try {
      const result = await this.dispatch(parsed.method, parsed.args ?? []);
      connection.send(
        JSON.stringify({ type: "rpc", id: parsed.id, success: true, result }),
      );
    } catch (error) {
      connection.send(
        JSON.stringify({
          type: "rpc",
          id: parsed.id,
          success: false,
          error: String(error),
        }),
      );
    }
  }

  // ─── Dispatch ──────────────────────────────────────────────────

  private async dispatch(method: string, args: unknown[]): Promise<unknown> {
    switch (method as AgentMethod) {
      case "refresh":
        this.patch({});
        return true;

      case "setModel":
        this.patch({ model: String(args[0]) });
        return true;

      case "addLead":
        return this.addLead(args[0] as any);

      case "createQuote":
        return this.createQuote(args[0] as any);

      case "advanceQuote":
        return this.advanceQuote(args[0] as string);

      case "declineQuote":
        return this.declineQuote(args[0] as string, args[1] as string | undefined);

      case "issueInvoice":
        return this.issueInvoice(args[0] as string);

      case "createInvoice":
        return this.createInvoice(args[0] as any);

      case "recordPayment":
        return this.recordPayment(args[0] as string);

      case "extractLeadFromUrl":
        return this.extractLeadFromUrl(args[0] as string);

      case "reprocessDocument":
        return this.reprocessDocument(args[0] as string);

      case "uploadDocument":
        return this.uploadDocument(args[0] as any);

      case "chat":
        return this.chat(args[0] as string);

      case "learnFromConversation":
        return this.learnFromConversation(args[0] as string | undefined);

      case "learnFromQuote":
        return this.learnFromQuote(args[0] as string);

      case "answerFromMemory":
        return this.answerFromMemory(args[0] as string);

      case "suggestImprovements":
        return this.suggestImprovements();

      case "runDueFollowUps":
        return this.runAutonomousCycle();

      case "approveFollowUp":
        return this.approveFollowUp(args[0] as string);

      case "dismissFollowUp":
        return this.dismissFollowUp(args[0] as string);

      default:
        throw new Error(`Unknown agent method: ${method}`);
    }
  }

  // ─── Persistence helpers ───────────────────────────────────────

  private patch(next: Partial<AzarragaState>) {
    this.setState({ ...this.state, ...next, updatedAt: new Date().toISOString() });
  }

  private pushMessage(content: string): void {
    const message: ChatMessage = {
      id: uid("msg"),
      role: "assistant",
      content,
      createdAt: new Date().toISOString(),
    };
    this.patch({ messages: [...this.state.messages, message].slice(-120) });
    this.archiveMessage(message);
  }

  private archiveMessage(message: ChatMessage) {
    this.sql`INSERT INTO messages_log (id, role, content, created_at)
      VALUES (${message.id}, ${message.role}, ${message.content}, ${message.createdAt})`;
  }

  private log(kind: string, payload: unknown) {
    this.sql`INSERT INTO activity (id, kind, payload, created_at)
      VALUES (${uid("act")}, ${kind}, ${JSON.stringify(payload)}, ${new Date().toISOString()})`;
  }

  // ─── Quote operations ──────────────────────────────────────────

  private createQuote(input: any): Quote {
    const lines: QuoteLine[] = (input.lines || []).map((l: any, i: number) => ({
      id: uid("ql"),
      description: l.description || "",
      quantity: l.qty || 0,
      unitPrice: l.unitPrice
        ? { amountCentavos: Math.round(l.unitPrice.amountCentavos ?? l.unitPrice * 100), currency: l.unitPrice.currency ?? "PHP" }
        : undefined,
      pricingStatus: l.unitPrice ? "CURRENT_APPROVED" : "NEEDS_PRICE_REVIEW",
      evidenceIds: [],
    }));

    const calc = domainCalculateQuote({
      id: uid("q"),
      projectId: input.project || "unknown",
      status: "DRAFT",
      lines,
      discount: input.discount,
      crating: input.crating,
      shipping: input.shipping,
      trucking: input.trucking,
      delivery: input.delivery,
      installation: input.installation,
      taxRateBasisPoints: input.taxRateBasisPoints,
      taxTreatment: input.taxTreatment,
      terms: input.terms,
      provenance: [],
    });

    const quote: Quote = {
      id: uid("q"),
      projectId: input.project || "unknown",
      status: "DRAFT",
      lines,
      discount: input.discount,
      crating: input.crating,
      shipping: input.shipping,
      trucking: input.trucking,
      delivery: input.delivery,
      installation: input.installation,
      taxRateBasisPoints: input.taxRateBasisPoints,
      taxTreatment: input.taxTreatment,
      terms: input.terms,
      provenance: [],
    };

    this.patch({ quotes: [quote, ...this.state.quotes] });
    this.log("quote.created", quote);
    return quote;
  }

  private advanceQuote(quoteId: string): boolean {
    const quote = this.state.quotes.find((q) => q.id === quoteId);
    if (!quote) return false;
    const nextStatus = quote.status === "DRAFT" ? "SENT" : quote.status === "SENT" ? "APPROVED" : quote.status;
    this.patch({ quotes: this.state.quotes.map((q) => (q.id === quoteId ? { ...q, status: nextStatus } : q)) });
    if (nextStatus === "APPROVED") {
      this.log("quote.approved", { quoteId, status: nextStatus });
    }
    return true;
  }

  private declineQuote(quoteId: string, reason?: string): boolean {
    const quote = this.state.quotes.find((q) => q.id === quoteId);
    if (!quote) return false;
    this.patch({ quotes: this.state.quotes.map((q) => (q.id === quoteId ? { ...q, status: "LOST" } : q)) });
    this.log("quote.declined", { quoteId, reason });
    return true;
  }

  private issueInvoice(quoteId: string): Invoice | false {
    const quote = this.state.quotes.find((q) => q.id === quoteId);
    if (!quote) return false;
    if (quote.status !== "APPROVED" && quote.status !== "ACCEPTED") {
      throw new Error("Can only issue invoice from approved/accepted quote");
    }
    const calc = domainCalculateQuote({
      ...quote,
      status: "APPROVED",
    });
    const invoice: Invoice = {
      id: uid("inv"),
      projectId: quote.projectId,
      quoteId: quote.id,
      poReference: null,
      type: "FINAL",
      status: "DRAFT",
      lines: quote.lines.map((l) => ({
        id: uid("il"),
        description: l.description,
        quantity: l.quantity,
        unitPrice: l.unitPrice!,
      })),
      subtotal: calc.lineSubtotal,
      tax: calc.tax,
      total: calc.total,
      payments: [],
      balance: calc.total,
      humanApproved: false,
    };
    this.patch({ invoices: [invoice, ...this.state.invoices] });
    this.log("invoice.issued", invoice);
    return invoice;
  }

  private createInvoice(input: any): Invoice {
    const invoice: Invoice = {
      id: uid("inv"),
      projectId: input.projectId || "unknown",
      quoteId: input.quoteId || "unknown",
      poReference: input.poReference || null,
      type: input.type || "FINAL",
      status: "DRAFT",
      lines: (input.lines || []).map((l: any, i: number) => ({
        id: uid("il"),
        description: l.description || "",
        quantity: l.quantity || 1,
        unitPrice: l.unitPrice || { amountCentavos: 0, currency: "PHP" },
      })),
      subtotal: input.subtotal || { amountCentavos: 0, currency: "PHP" },
      tax: input.tax || undefined,
      total: input.total || { amountCentavos: 0, currency: "PHP" },
      payments: [],
      balance: input.total || { amountCentavos: 0, currency: "PHP" },
      humanApproved: false,
    };
    this.patch({ invoices: [invoice, ...this.state.invoices] });
    this.log("invoice.created", invoice);
    return invoice;
  }

  private recordPayment(invoiceId: string): boolean {
    const invoice = this.state.invoices.find((i) => i.id === invoiceId);
    if (!invoice) return false;
    invoice.payments.push({
      id: uid("pay"),
      invoiceId,
      amount: invoice.balance,
      date: new Date().toISOString(),
      reference: null,
    });
    invoice.balance = { amountCentavos: 0, currency: "PHP" };
    invoice.status = "PAID";
    this.patch({ invoices: [...this.state.invoices] });
    this.log("invoice.paid", { invoiceId });
    return true;
  }

  // ─── Lead operations ───────────────────────────────────────────

  private addLead(input: any): Lead {
    const lead: Lead = {
      id: uid("lead"),
      project: input.project || "New opportunity",
      location: input.location || "Palawan",
      projectType: input.projectType || "Unqualified",
      projectStage: input.projectStage || undefined,
      owner: input.owner || undefined,
      developer: input.developer || undefined,
      architect: input.architect || undefined,
      contractor: input.contractor || undefined,
      contacts: [],
      sourceUrl: input.sourceUrl || undefined,
      sourceDate: input.sourceDate || undefined,
      evidence: [],
      relevance: input.relevance || undefined,
      score: input.score ?? 0,
      nextAction: input.nextAction || "Research project",
      status: input.status || "DISCOVERED",
      updatedAt: new Date().toISOString(),
    };

    const q = qualifyLead({
      location: lead.location,
      projectType: lead.projectType,
      evidenceCount: lead.evidence.length,
      decisionMakerKnown: !!lead.owner,
    });
    lead.score = q.score;
    lead.nextAction = q.nextAction;

    this.patch({ leads: [lead, ...this.state.leads] });
    this.log("lead.created", lead);
    return lead;
  }

  // ─── Document operations ───────────────────────────────────────

  private reprocessDocument(documentId: string): boolean {
    const doc = this.state.documents.find((d) => d.id === documentId);
    if (!doc) return false;
    this.patch({
      documents: this.state.documents.map((d) =>
        d.id === documentId ? { ...d, ingestionStatus: "PENDING" as const } : d,
      ),
    });
    this.log("document.reprocess", { documentId });
    return true;
  }

  private uploadDocument(input: any): DocumentRecord {
    const record: DocumentRecord = {
      id: uid("doc"),
      filename: input.filename || `document-${Date.now()}`,
      mime: input.mime || "application/octet-stream",
      sizeBytes: input.sizeBytes || 0,
      intelligence: "PENDING",
      storage: "private",
      uploadedAt: new Date().toISOString(),
      r2Key: input.r2Key || `uploads/${Date.now()}/${record.filename}`,
      extraction: undefined,
    };
    this.patch({ documents: [record, ...this.state.documents] });
    this.log("document.uploaded", record);
    return record;
  }

  // ─── Chat ──────────────────────────────────────────────────────

  private async chat(prompt: string): Promise<boolean> {
    if (!prompt.trim()) return false;

    const user: ChatMessage = {
      id: uid("msg"),
      role: "user",
      content: prompt,
      createdAt: new Date().toISOString(),
    };
    const assistant: ChatMessage = {
      id: uid("msg"),
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
      streaming: true,
    };

    this.patch({ messages: [...this.state.messages, user, assistant] });
    this.archiveMessage(user);

    const answer = await this.getAnswer(prompt);
    if (answer) {
      this.finishAssistant(assistant.id, answer);
      this.log("chat.openrouter", { prompt, model: this.state.model });
      const { knowledge, learned } = learnFromConversationEngine(this.state.knowledge, this.state.messages);
      if (learned.length) {
        this.patch({ knowledge });
        this.archiveFacts(knowledge.facts.slice(0, learned.length));
      }
      return true;
    }

    // Fallback to Workers AI
    try {
      const stream = (await this.env.AI!.run(TEXT_MODEL, {
        stream: true,
        max_tokens: 1200,
        messages: [
          { role: "system", content: "You are TALA, commercial agent for Azarraga Glass & Aluminum in Palawan." },
          { role: "user", content: prompt },
        ],
      })) as unknown as ReadableStream;

      const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
      let text = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += value;
        this.patch({
          messages: this.state.messages.map((m) =>
            m.id === assistant.id ? { ...m, content: text } : m,
          ),
        });
      }

      this.finishAssistant(assistant.id, text);
      return true;
    } catch {
      this.finishAssistant(assistant.id, "Sorry, I'm having trouble connecting right now. Please try again in a moment.");
      return true;
    }
  }

  private async getAnswer(prompt: string): Promise<string | null> {
    const key = this.env.OPENROUTER_API_KEY;
    if (!key) return null;

    const model = this.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL;
    const siteUrl = this.env.OPENROUTER_SITE_URL || this.env.NEXT_PUBLIC_APP_URL || "https://azarraga.vercel.app";

    const system = [
      "You are TALA — the warm, Taglish-speaking commercial agent for AZARRAGA GLASS & ALUMINUM in Palawan, Philippines.",
      "PERSONALITY:",
      "- Professional but warm. Enthusiastic about glass & aluminum.",
      "- You speak English + casual Filipino Taglish. Use 'po' and 'opo'.",
      "- You remember customer history and bring it up naturally.",
      "- Emoji usage is warm but not childish. 1-2 per message.",
      "",
      "GROUNDING RULES (CRITICAL):",
      "- Answer ONLY from the recorded commercial memory supplied below. Never invent customers, leads, prices, emails or documents.",
      "- When a field is missing say it is not recorded.",
      "- Never claim an email was sent. Amounts are Philippine pesos (₱).",
      "",
      "COMMERCIAL MEMORY SNAPSHOT:",
      JSON.stringify({
        leads: this.state.leads,
        quotes: this.state.quotes,
        invoices: this.state.invoices,
        followUps: this.state.followUps,
        documents: this.state.documents.map((d) => ({
          filename: d.filename,
          intelligence: d.intelligence,
          extraction: d.extraction,
        })),
      }),
    ].join("\n");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": siteUrl,
        "X-Title": "Azarraga Glass Agent",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) return null;
    const json = await response.json();
    return json.choices?.[0]?.message?.content?.trim() || null;
  }

  private finishAssistant(id: string, content: string) {
    this.patch({
      messages: this.state.messages.map((m) =>
        m.id === id ? { ...m, content, streaming: false } : m,
      ),
    });
  }

  // ─── Learning ──────────────────────────────────────────────────

  private learnFromConversation(company?: string): { learned: string[] } {
    const { knowledge, learned } = learnFromConversationEngine(this.state.knowledge, this.state.messages, company);
    this.patch({ knowledge });
    this.archiveFacts(knowledge.facts.slice(0, learned.length));
    this.pushMessage(
      learned.length
        ? `🧠 Natutunan ko po: ${learned.join("\n")}\nSalamat po!`
        : "Wala pa akong bagong natutunan — pero I'm always listening. 😊",
    );
    this.log("knowledge.conversation", { learned, company });
    return { learned };
  }

  private learnFromQuote(quoteId: string): { learned: string[] } {
    const quote = this.state.quotes.find((q) => q.id === quoteId);
    if (!quote) return { learned: [] };
    const { knowledge, learned } = learnFromQuoteEngine(this.state.knowledge, quote);
    this.patch({ knowledge });
    this.log("knowledge.quote", { quoteId, learned });
    return { learned };
  }

  private answerFromMemory(query: string): { answer: string } {
    const cacheKey = `memory:${query}`;
    const answer = answerFromMemoryEngine(this.state, query);
    return { answer };
  }

  private suggestImprovements(): { suggestions: any[] } {
    const { knowledge, suggestions } = suggestImprovementsEngine(this.state.knowledge);
    this.patch({ knowledge });
    this.pushMessage(
      suggestions.length
        ? `📈 Suggestions based on what I've learned:\n${suggestions.map((s) => `- ${s.title}: ${s.detail}`).join("\n")}`
        : "Wala pa akong sapat na data para mag-suggest. Keep quoting and I'll spot patterns! 🌱",
    );
    return { suggestions };
  }

  // ─── Autonomous cycle ─────────────────────────────────────────

  private async runAutonomousCycle(): Promise<void> {
    const due = detectDueFollowUps(this.state);
    if (due.length) {
      this.patch({ followUps: mergeFollowUps(this.state.followUps, due) });
      this.pushMessage(
        `👀 I noticed ${due.length} item${due.length === 1 ? "" : "s"} that need follow-up:\n${due.map((f) => `- ${f.title}: ${f.detail}`).join("\n")}\n\nDrafted na po ang messages — nasa "Needs your attention" para sa approval niyo.`,
      );
    }

    const { knowledge, suggestions } = suggestImprovementsEngine(this.state.knowledge);
    this.patch({ knowledge });
  }

  private approveFollowUp(followUpId: string): boolean {
    const fu = this.state.followUps.find((f) => f.id === followUpId);
    if (!fu) return false;
    fu.status = "approved";
    this.patch({ followUps: [...this.state.followUps] });
    return true;
  }

  private dismissFollowUp(followUpId: string): boolean {
    const fu = this.state.followUps.find((f) => f.id === followUpId);
    if (!fu) return false;
    fu.status = "dismissed";
    this.patch({ followUps: [...this.state.followUps] });
    return true;
  }

  // ─── Archives ──────────────────────────────────────────────────

  private archiveFacts(facts: Array<{ id: string; kind: string; summary: string; sourceRef: string; createdAt: string }>) {
    for (const fact of facts) {
      this.sql`INSERT OR IGNORE INTO facts_log (id, kind, summary, source_ref, created_at)
        VALUES (${fact.id}, ${fact.kind}, ${fact.summary}, ${fact.sourceRef}, ${fact.createdAt})`;
    }
  }
}

// ─── Helpers ─────────────────────────────────────────────────────

function uid(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

// ─── Types ───────────────────────────────────────────────────────

export type { Env };
