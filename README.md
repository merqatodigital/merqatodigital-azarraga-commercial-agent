# Azarraga Commercial Agent

Commercial operating system for Azarraga Glass & Aluminum, Palawan, Philippines.

- **Live:** https://azarraga.vercel.app
- **Vercel project:** https://vercel.com/merqatodigital/merqatodigital-azarraga-commercial-agent
- **GitHub:** https://github.com/merqatodigital/merqatodigital-azarraga-commercial-agent

---

## What it does

A commercial workspace for quotes, invoices, and leads. The agent panel surfaces commercial memory and suggests next actions; the quote engine handles deterministic arithmetic; historical pricing is evidence only and never silently reused as today's price.

---

## Service areas

Puerto Princesa, El Nido, San Vicente, and projects across Palawan.

---

## Product memory

### Systems

- 900 Series sliding systems
- Pocket sliding systems
- Frameless swing doors
- Shower enclosures
- Jalousie / Jalouplus
- Fixed glass
- Awning / casement
- Bi-fold
- Slide-up
- Mullion
- Glass railings
- Canopies
- Storefront
- ACP
- Roll-up
- Screen doors
- Tabletop / shelves
- Aquarium

### Glass specifications

- 6mm bronze annealed
- 10mm tempered clear
- 10mm tempered frosted
- 12mm tempered clear
- Other historical specifications normalized from source documents

---

## Architecture

### Runtime

- **Framework:** Next.js 15, App Router
- **Frontend:** React 19, client components (`app/page.js`, `app/quotes/page.js`, `app/owner/page.js`, `app/components/AgentPanel.jsx`)
- **API:** Next.js Route Handlers under `app/api/*`
- **Deployment:** Vercel

### Domain logic (TypeScript)

The `src/` tree is the deterministic core. It is written in TypeScript and separated from the Next.js runtime so the arithmetic, evidence, and workflow rules can be read, tested, and reused independently.

| Path | Purpose |
|------|---------|
| `src/domain/index.ts` | Full type model — `Money`, `Currency`, `Provenance`, `Customer`, `Lead`, `Quote`, `Invoice`, `QuoteLine`, `InvoiceLine`, `CommercialEvidence`, `SourceDocument`, `Project`, etc. |
| `src/engine/quoteEngine.ts` | `calculateQuote()` — line subtotal, discounts, logistics, installation, tax from basis points, total. Rejects non-PHP arithmetic. |
| `src/engine/invoiceEngine.ts` | `draftInvoiceFromApprovedQuote()` — carries approved quote lines into an invoice at a billing percentage; `invoiceBalance()`. |
| `src/engine/poComparison.ts` | `comparePOToQuote()` — validates a purchase order against a quote; BLOCK vs REVIEW differences; decides whether a project can be created. |
| `src/engine/projectWorkflow.ts` | `createProjectFromWonQuote()` — creates a project only from an approved/accepted quote with reviewed pricing; `nextBillingStage()` cycles through DOWN_PAYMENT → PROGRESS → DELIVERY → FINAL. |
| `src/engine/quoteReadiness.ts` | `quoteReadiness()` — checks lines, descriptions, unit prices, pricing status, tax treatment, tax rate; returns issues list. |
| `src/engine/currency.ts` | `ExchangeRate` schema (Zod); `convertFromPHP()` — requires a matching, human-approved rate for USD/EUR; PHP stays the base currency. |
| `src/icm/index.ts` | Commercial memory queries — `findCommercialEvidence`, `findHistoricalPrices`, `findCustomerHistory`, `findProjectHistory`, `findSimilarDimensions`, `nearestEvidence`. |
| `src/icm/documentIngestion.ts` | Document ingestion types and state machine — `PENDING` → `EXTRACTED` → `REVIEWED`; facts, missing information, conflicts; `humanReviewRequired`. |
| `src/icm/seed/catalog.ts` | Seeded product catalog. |
| `src/leads/index.ts` | Lead qualification — `canTransitionLead()`, `qualifyLead()` with Palawan location fit, project type fit, evidence count, decision-maker known. |
| `src/agent/contracts.ts` | Agent contracts / schemas. |

### Data

- `data/commercial-memory-2026.json` — commercial memory snapshot
- `icm/commercial-history/*.json` — historical line items, purchase orders, quotation history
- `icm/products/*.json` — product catalog, glass types
- `lib/commercial-store.js` — in-memory store used by the API routes
- `lib/quote-engine.js` — quote build helper used by the API routes
- `lib/commercial.js` — commercial helpers
- `lib/seed.js` — seed data

### API routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/quotes` | GET | List quotes |
| `/api/quotes` | POST | Create quote |
| `/api/quotes` | PATCH | Approve quote |
| `/api/quotes/calculate` | POST | Calculate quote totals |
| `/api/quotes/preview` | POST | Preview quote |
| `/api/quotes/sample` | POST | Sample quote data |
| `/api/leads` | GET | List leads |
| `/api/leads` | POST | Create lead |
| `/api/invoices` | GET | List invoices |
| `/api/invoices` | POST | Create invoice |
| `/api/invoices` | PATCH | Update invoice |
| `/api/documents` | GET | List documents |
| `/api/documents` | POST | Upload document |
| `/api/commercial-records` | GET | Commercial memory snapshot |
| `/api/dashboard` | GET | Dashboard data |
| `/api/agent` | GET | Agent endpoint |
| `/api/agent/models` | GET | Available models |
| `/api/quote-evidence` | GET | Pricing evidence trace |

---

## Workflow

Lead → qualification → project/spec capture → measurement/site visit → quote draft → approval → customer quote → accepted job → invoice → payment tracking.

Billing stages: DOWN_PAYMENT → PROGRESS → DELIVERY → FINAL.

---

## Pricing model

- PHP is the base currency for all arithmetic.
- USD/EUR display requires a verified, human-approved exchange rate. There is no silent FX conversion.
- Historical selling prices are evidence only. They are never silently reused as today's price.
- Every quote and invoice carries `humanReviewRequired: true` until a human approves it.
- Quote readiness checks: lines present, descriptions present, current approved unit prices, pricing status, tax treatment, tax rate.

---

## Tests

- `tests/commercial.test.ts` — deterministic tests for the domain and engine logic.

---

## Project rules

- Independent from the existing Azarraga website repository.
- GitHub is the source of truth.
- Deployment target: Vercel.
- Runtime: Next.js 15 on Vercel.
- Domain logic: TypeScript in `src/`, separated from the Next.js runtime.
