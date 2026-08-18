import type { Env } from "./index";
import { buildQuote, findEvidence } from "./lib.ts";
import {
  PALAWAN_TARGET_LOCATIONS,
  TARGET_PROJECT_TYPES,
  LEAD_PIPELINE,
  qualifyLead,
} from "../src/leads/index";

export class AzarragaState extends DurableObject {
  private state: AzarragaStateData;
  private env: Env;
  private ctx: DurableObjectState;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.ctx = state;
    this.env = env;
    this.state = this.load();
  }

  private load(): AzarragaStateData {
    const rows = this.ctx.storage.sql`SELECT value FROM state_data WHERE key = 'data'`;
    if (rows && rows.length > 0) {
      try {
        return JSON.parse(rows[0][0] as string);
      } catch {
        // fall through
      }
    }
    return {
      quotes: [],
      invoices: [],
      leads: [],
      documents: [],
      jobs: [],
      settings: { currency: "PHP", agentModel: "openrouter/free", humanReviewRequired: true },
      updatedAt: new Date().toISOString(),
    };
  }

  private save(): void {
    this.state.updatedAt = new Date().toISOString();
    this.ctx.storage.sql`INSERT OR REPLACE INTO state_data (key, value) VALUES ('data', ${JSON.stringify(this.state)})`;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    if (method === "OPTIONS") {
      return new Response(null, {
        headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,PATCH" },
      });
    }

    try {
      switch (url.pathname) {
        case "/quotes":
          if (method === "GET") return this.getQuotes();
          if (method === "POST") return this.createQuote(await request.json());
          break;
        case "/quotes/preview":
          if (method === "POST") return this.previewQuote(await request.json());
          break;
        case "/quotes/calculate":
          if (method === "POST") return this.calculateQuote(await request.json());
          break;
        case "/quotes/sample":
          if (method === "GET") return this.quoteSample();
          break;
        case "/leads":
          if (method === "GET") return this.getLeads();
          if (method === "POST") return this.createLead(await request.json());
          break;
        case "/invoices":
          if (method === "GET") return this.getInvoices();
          if (method === "POST") return this.createInvoice(await request.json());
          break;
        case "/documents":
          if (method === "GET") return this.getDocuments();
          if (method === "POST") return this.ingestDocument(await request.json());
          break;
        case "/commercial-records":
          if (method === "GET") return this.commercialRecords();
          break;
        case "/dashboard":
          if (method === "GET") return this.dashboard();
          break;
        case "/agent/models":
          if (method === "GET") return this.agentModels();
          break;
        case "/agent":
          if (method === "POST") return this.agentChat(await request.json());
          break;
        case "/quote-evidence":
          if (method === "POST") return this.quoteEvidence(await request.json());
          break;
        case "/health":
          return Response.json({ status: "ok", timestamp: new Date().toISOString() });
      }
    } catch (err) {
      return Response.json({ error: String(err) }, { status: 500 });
    }

    return new Response("Not found", { status: 404 });
  }

  // ─── Quotes ──────────────────────────────────────────────────

  private getQuotes(): Response {
    return Response.json({ quotes: this.state.quotes, count: this.state.quotes.length });
  }

  private createQuote(input: any): Response {
    const quote = buildQuote(input);
    this.state.quotes.push(quote);
    this.save();
    return Response.json({ quote }, { status: 201 });
  }

  private previewQuote(input: any): Response {
    const quote = buildQuote(input);
    if (!quote.warnings.length) {
      this.state.quotes.push(quote);
      this.save();
    }
    return Response.json({
      quote,
      warnings: quote.warnings,
      pricingRule:
        "Historical selling prices are evidence only. Current quote prices must be explicitly entered or approved by owner.",
    });
  }

  private calculateQuote(input: any): Response {
    const quote = buildQuote(input);
    return Response.json({
      quote,
      total: quote.total,
      totalCentavos: quote.totalCentavos,
      warnings: quote.warnings,
      calculation: "deterministic-centavos",
    });
  }

  private quoteSample(): Response {
    const input = {
      customer: "Royal Suites",
      project: "Shower Partition",
      location: "Port Barton, San Vicente",
      terms: "70% down payment; 30% full payment upon installation",
      leadTime: "30-45 working days upon receipt of down payment and final measurement",
      logistics: 25000,
      discount: 0,
      items: [
        {
          description: "10mm Tempered Clear Glass, Shower Partition with Stainless Steel Support, 1.61 x 2.00",
          product: "shower partition",
          glass: "10mm tempered clear",
          qty: 5,
          unit: "sets",
          unitPrice: 12320,
        },
      ],
    };
    const quote = buildQuote(input);
    return Response.json({
      expectedTotal: 86600,
      calculatedTotal: quote.total,
      passes: quote.total === 86600 && quote.warnings.length === 0,
      quote,
    });
  }

  // ─── Leads ──────────────────────────────────────────────────

  private getLeads(): Response {
    return Response.json({
      leads: this.state.leads,
      count: this.state.leads.length,
      pipeline: LEAD_PIPELINE,
      targetLocations: PALAWAN_TARGET_LOCATIONS,
      targetProjectTypes: TARGET_PROJECT_TYPES,
    });
  }

  private createLead(input: any): Response {
    const lead = {
      id: uid("LEAD"),
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
      score: input.score ?? qualifyLead({
        location: input.location || "Palawan",
        projectType: input.projectType || "Unqualified",
        evidenceCount: 0,
        decisionMakerKnown: !!input.owner,
      }).score,
      nextAction: qualifyLead({
        location: input.location || "Palawan",
        projectType: input.projectType || "Unqualified",
        evidenceCount: 0,
        decisionMakerKnown: !!input.owner,
      }).nextAction,
      status: input.status || "DISCOVERED",
      updatedAt: new Date().toISOString(),
    };

    this.state.leads.push(lead);
    this.save();
    return Response.json({ lead, qualified: lead.score >= 60 }, { status: 201 });
  }

  // ─── Invoices ───────────────────────────────────────────────

  private getInvoices(): Response {
    return Response.json({ invoices: this.state.invoices, count: this.state.invoices.length });
  }

  private createInvoice(input: any): Response {
    const invoice = {
      id: uid("INV"),
      projectId: input.projectId || "unknown",
      quoteId: input.quoteId || "unknown",
      poReference: input.poReference || undefined,
      type: (input.type as any) || "FINAL",
      status: "DRAFT",
      lines: (input.lines || []).map((l: any, i: number) => ({
        id: uid("IL"),
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
      createdAt: new Date().toISOString(),
    };
    this.state.invoices.push(invoice);
    this.save();
    return Response.json({ invoice }, { status: 201 });
  }

  // ─── Documents ─────────────────────────────────────────────

  private getDocuments(): Response {
    return Response.json({
      documents: this.state.documents,
      count: this.state.documents.length,
    });
  }

  private ingestDocument(input: any): Response {
    const record = {
      id: input.documentId || uid("DOC"),
      type: input.documentType || "unknown",
      filename: input.filename || undefined,
      reference: input.reference || undefined,
      customer: input.customer || undefined,
      project: input.project || undefined,
      date: input.date || undefined,
      ingestionStatus: "PENDING",
      extraction: undefined,
      createdAt: new Date().toISOString(),
    };
    this.state.documents.push(record);
    this.save();
    return Response.json({
      record,
      warnings: ["Document queued for extraction. Owner review required."],
    }, { status: 201 });
  }

  // ─── Commercial records ────────────────────────────────────

  private commercialRecords(): Response {
    const records = this.state.documents
      .filter((d) => d.ingestionStatus === "REVIEWED" && d.extraction)
      .map((d) => d.extraction || d);
    return Response.json({
      records,
      count: records.length,
      source: "Durable Object commercial memory",
    });
  }

  // ─── Dashboard ─────────────────────────────────────────────

  private dashboard(): Response {
    const quotesToReview = this.state.quotes.filter(
      (q) => q.status === "draft_needs_review" || (q.warnings && q.warnings.length > 0),
    ).length;
    const attention = [
      ...this.state.quotes
        .filter((q) => q.status === "draft_needs_review" || (q.warnings && q.warnings.length > 0))
        .map((q) => ({
          id: q.id,
          type: "quote",
          title: q.customer || "Quote needs review",
          detail: q.project || "Resolve quotation warnings",
          amount: q.total.amountCentavos,
          action: "Review quote",
        })),
      ...this.state.invoices
        .filter((inv) => inv.status !== "PAID" && inv.status !== "CANCELLED")
        .map((inv) => ({
          id: inv.id,
          type: "invoice",
          title: inv.id,
          detail: `Balance: ₱${inv.balance.amountCentavos}`,
          amount: inv.balance.amountCentavos,
          action: "Manage invoice",
        })),
      ...this.state.leads
        .filter((l) => l.status !== "WON" && l.status !== "LOST")
        .slice(0, 5)
        .map((l) => ({
          id: l.id,
          type: "lead",
          title: l.project,
          detail: `${l.location} · ${l.nextAction}`,
          action: "Review lead",
        })),
    ].slice(0, 10);

    return Response.json({
      brand: { primary: "#0F4C81" },
      territory: ["Puerto Princesa", "El Nido", "San Vicente"],
      counts: {
        historicalRecords: this.state.documents.filter((d) => d.ingestionStatus === "REVIEWED").length,
        documentsToReview: this.state.documents.filter((d) => d.ingestionStatus === "PENDING").length,
        quotesToReview,
        activeJobs: this.state.quotes.filter((q) => q.status === "ACCEPTED").length,
        invoices: this.state.invoices.length,
        openLeads: this.state.leads.filter((l) => l.status !== "WON" && l.status !== "LOST").length,
      },
      attention,
      source: "Durable Object commercial store",
    });
  }

  // ─── Agent models ─────────────────────────────────────────

  private agentModels(): Response {
    const models = [
      { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", contextLength: 128000, pricing: { prompt: 0.0001, completion: 0.0001 } },
      { id: "openai/gpt-4o", name: "GPT-4o", contextLength: 128000, pricing: { prompt: 0.005, completion: 0.015 } },
      { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash (free)", contextLength: 1000000, pricing: { prompt: 0, completion: 0 } },
      { id: "nvidia/nemotron-nano-9b-v2:free", name: "Nemotron Nano 9B v2 (free)", contextLength: 1024000, pricing: { prompt: 0, completion: 0 } },
    ];
    return Response.json({
      provider: "openrouter",
      freeOnly: true,
      models: models.filter((m) => m.pricing.prompt === 0 && m.pricing.completion === 0),
    });
  }

  // ─── Agent chat ──────────────────────────────────────────

  private async agentChat(input: any): Promise<Response> {
    const key = this.env.OPENROUTER_API_KEY;
    if (!key) {
      return Response.json({ error: "OPENROUTER_API_KEY is not configured." }, { status: 503 });
    }

    const message = String(input.message || "").trim();
    const model = String(input.model || "").trim() || this.env.OPENROUTER_MODEL || "nvidia/nemotron-nano-9b-v2:free";
    const intent = (input.intent && ["leads", "quotes", "invoices", "icm", "general"].includes(input.intent))
      ? input.intent
      : "general";

    if (!message) return Response.json({ error: "message is required" }, { status: 400 });

    const memory = this.state.documents
      .filter((d) => d.ingestionStatus === "REVIEWED" && d.extraction)
      .map((d) => ({
        document: d.filename || d.id,
        customer: d.extraction?.buyer?.name,
        project: d.extraction?.project?.name,
        total: d.extraction?.financial?.documentTotal,
        lines: d.extraction?.lines?.length,
        date: d.extraction?.documentDate,
      }))
      .slice(0, 10);

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
        documents: this.state.documents.map((d) => ({
          filename: d.filename,
          intelligence: d.intelligence,
          extraction: d.extraction,
        })),
      }),
    ].join("\n");

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "HTTP-Referer": this.env.NEXT_PUBLIC_APP_URL || "https://azarraga.vercel.app",
          "X-Title": "Azarraga Commercial Agent",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: message },
          ],
          temperature: 0.2,
          max_tokens: 4096,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        return Response.json(
          { error: json?.error?.message || `OpenRouter returned ${res.status}` },
          { status: res.status },
        );
      }

      const reply = json.choices?.[0]?.message?.content || "";
      return Response.json({
        provider: "openrouter",
        model,
        reply,
        usage: json.usage || null,
        humanReviewRequired: true,
      });
    } catch (err) {
      return Response.json({ error: "Agent request failed." }, { status: 502 });
    }
  }

  // ─── Quote evidence ─────────────────────────────────────

  private quoteEvidence(input: any): Response {
    const evidence = findEvidence(input);
    return Response.json({
      evidence,
      rule: "Historical selling prices are evidence only and are never auto-applied to a new quotation.",
    });
  }
}

// ─── Data ──────────────────────────────────────────────────

interface AzarragaStateData {
  quotes: any[];
  invoices: any[];
  leads: any[];
  documents: any[];
  jobs: any[];
  settings: { currency: string; agentModel: string; humanReviewRequired: boolean };
  updatedAt: string;
}

// ─── Helpers ───────────────────────────────────────────────

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
