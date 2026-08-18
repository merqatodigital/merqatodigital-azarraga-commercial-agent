// worker/lib.ts — self-contained worker-side helpers
// Does NOT import from src/ (that would pull in Node deps). Implements its own
// subset of the domain logic used by the Durable Object.

export interface QuoteLineInput {
  description?: string;
  product?: string;
  qty?: number;
  unit?: string;
  widthMm?: number;
  heightMm?: number;
  glass?: string;
  frame?: string;
  unitPrice?: number;
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

const php = (n = 0) => ({ amountCentavos: n, currency: "PHP" as const });
const amount = (m?: { amountCentavos: number; currency: string }) => m?.amountCentavos ?? 0;

export function buildQuote(input: {
  customer?: string;
  project?: string;
  location?: string;
  terms?: string;
  leadTime?: string;
  logistics?: number;
  discount?: number;
  items?: QuoteLineInput[];
  id?: string;
  date?: string;
  notes?: string;
}) {
  const items = (input.items || []).map((x, i) => ({
    id: uid("QL"),
    description: x.description || "",
    product: x.product || "",
    qty: Number(x.qty || 0),
    unit: x.unit || "set",
    widthMm: Number(x.widthMm || 0),
    heightMm: Number(x.heightMm || 0),
    glass: x.glass || "",
    frame: x.frame || "",
    unitPrice: Number(x.unitPrice || 0),
    pricingStatus: "NEEDS_PRICE_REVIEW" as const,
    evidenceIds: [] as string[],
  }));

  const calc = quoteTotals(items, input.logistics || 0, input.discount || 0);
  const warnings: string[] = [];

  if (!input.customer?.trim()) warnings.push("Customer is required");
  if (!input.project?.trim()) warnings.push("Project is required");
  if (!calc.items.length) warnings.push("At least one line item is required");

  calc.items.forEach((x: any, i: number) => {
    if (!x.description && !x.product) warnings.push(`Line ${i + 1}: product/description required`);
    if (x.qty <= 0) warnings.push(`Line ${i + 1}: quantity must be greater than zero`);
    if (x.unitPriceCentavos <= 0) warnings.push(`Line ${i + 1}: current unit price requires owner entry/approval`);
  });

  if (calc.totalCentavos < 0) warnings.push("Quote total cannot be negative");

  return {
    id: input.id || uid("Q"),
    status: warnings.length ? "draft_needs_review" : "draft_ready",
    customer: String(input.customer || "").trim(),
    project: String(input.project || "").trim(),
    location: String(input.location || "").trim(),
    date: input.date || new Date().toISOString().slice(0, 10),
    terms: String(input.terms || "").trim(),
    leadTime: String(input.leadTime || "").trim(),
    notes: String(input.notes || "").trim(),
    ...calc,
    evidence: calc.items.map((item: any) => findEvidence(item)),
    warnings,
    pricingRule:
      "Historical selling prices are evidence only. Current quote prices must be explicitly entered or approved by owner.",
  };
}

export function calculateQuote(quote: any) {
  if (quote.lines?.some((l: any) => !l.unitPrice || l.pricingStatus !== "CURRENT_APPROVED")) {
    return {
      status: "NEEDS_PRICE_REVIEW" as const,
      humanReviewRequired: true,
      lineSubtotal: php(0),
      total: php(0),
    };
  }

  const lineSubtotal = quote.lines.reduce((sum: number, l: any) => sum + l.quantity * amount(l.unitPrice), 0);
  const preTax = Math.max(
    0,
    lineSubtotal -
      amount(quote.discount) +
      amount(quote.crating) +
      amount(quote.shipping) +
      amount(quote.trucking) +
      amount(quote.delivery) +
      amount(quote.installation),
  );
  const tax =
    quote.taxRateBasisPoints === undefined
      ? undefined
      : Math.round(preTax * quote.taxRateBasisPoints / 10000);

  return {
    status:
      quote.taxTreatment === undefined ? ("NEEDS_TAX_REVIEW" as const) : ("READY_FOR_HUMAN_REVIEW" as const),
    humanReviewRequired: true,
    lineSubtotal: php(lineSubtotal),
    discount: php(amount(quote.discount)),
    logistics: php(
      amount(quote.crating) +
        amount(quote.shipping) +
        amount(quote.trucking) +
        amount(quote.delivery),
    ),
    installation: php(amount(quote.installation)),
    preTax: php(preTax),
    tax: tax === undefined ? undefined : php(tax),
    total: php(preTax + (tax ?? 0)),
  };
}

export interface QuoteTotalsResult {
  items: { unitPriceCentavos: number; quantity: number; subtotalCentavos: number; lineTotalCentavos: number }[];
  subtotalCentavos: number;
  logisticsCentavos: number;
  discountCentavos: number;
  totalCentavos: number;
}

export function quoteTotals(
  items: { unitPrice: number; qty: number }[],
  logisticsCentavos: number,
  discountCentavos: number,
): QuoteTotalsResult {
  const calcItems = items.map((x) => ({
    unitPriceCentavos: Math.round(Number(x.unitPrice) * 100),
    quantity: Number(x.qty),
    subtotalCentavos: Math.round(Number(x.unitPrice) * 100 * Number(x.qty)),
    lineTotalCentavos: Math.round(Number(x.unitPrice) * 100 * Number(x.qty)),
  }));
  const subtotalCentavos = calcItems.reduce((s, i) => s + i.subtotalCentavos, 0);
  const totalCentavos = Math.max(0, subtotalCentavos + logisticsCentavos - discountCentavos);
  return {
    items: calcItems,
    subtotalCentavos,
    logisticsCentavos,
    discountCentavos,
    totalCentavos,
  };
}

export function findEvidence(_item: any): string[] {
  return [];
}

export function toCentavos(peso: number): number {
  return Math.round(peso * 100);
}

export function fromCentavos(centavos: number): number {
  return centavos / 100;
}
