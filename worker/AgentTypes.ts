import type { Env } from "./index";

export interface InvoiceDraftRequest {
  quoteId: string;
  poReference?: string;
  billingType: "DOWN_PAYMENT" | "PROGRESS" | "DELIVERY" | "FINAL";
}

export interface QuoteDraftRequest {
  projectId: string;
  takeoffId?: string;
  pricingEvidenceIds?: string[];
}

export interface LeadQualificationRequest {
  leadId: string;
  score: number;
  nextAction: string;
}

export interface PlanExtractionRequest {
  openings: Array<{
    mark?: string;
    widthMm?: number;
    heightMm?: number;
    quantity?: number;
    productFamily?: string;
  }>;
}

export interface TakeoffProposalRequest {
  projectId: string;
  items: Array<{
    productFamily: string;
    quantity: number;
    widthMm?: number;
    heightMm?: number;
    notes?: string;
  }>;
}

export interface POComparisonRequest {
  quoteId: string;
  poDocumentId: string;
  differences: Array<{
    field: string;
    quoteValue: unknown;
    poValue: unknown;
  }>;
}

export interface DocumentIngestionRequest {
  documentId: string;
  documentType: string;
  extractedFacts: Array<{
    field: string;
    value: unknown;
    source: { documentId: string; sourceReference: string; sourceDate?: string; page?: number; note?: string };
  }>;
}

export interface AgentRequest {
  message: string;
  model: string;
  intent?: string;
}

export interface AgentResponse {
  provider: string;
  model: string;
  reply: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost?: number;
  };
  humanReviewRequired: true;
}

export interface QuoteEnvelope {
  confidence: number;
  assumptions: string[];
  missingInformation: string[];
  sourceEvidence: Array<{
    documentId: string;
    sourceReference: string;
    sourceDate?: string;
    page?: number;
    note?: string;
  }>;
  humanReviewRequired: true;
}
