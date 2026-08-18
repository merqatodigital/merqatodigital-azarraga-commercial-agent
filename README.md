# Azarraga Commercial Agent

Commercial operating system for Azarraga Glass & Aluminum, Palawan, Philippines.

**Live:** https://azarraga.vercel.app

---

## What it does

An AI commercial agent — TALA — that handles the three core business pain points:

1. **Quotes** — draft, preview, calculate, and issue quotations for glass and aluminum jobs
2. **Invoices** — track invoices, record payments, follow up on overdue balances
3. **Lead generation** — capture leads from URLs, manage pipeline, re-engage cold prospects

TALA speaks English and Taglish, remembers commercial history, and suggests next actions without being asked.

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

Structured commercial memory — not an undifferentiated chat knowledge base.

Historical prices are evidence, not automatically current prices. Quote generation distinguishes known facts, calculated values, assumptions, and items requiring human approval.

### Tech stack

- **Frontend:** Next.js 15 (App Router)
- **API:** Next.js Route Handlers (`/api/*`)
- **Deployment:** Vercel

### API routes

| Route | Purpose |
|-------|---------|
| `GET /api/quotes` | List quotes |
| `POST /api/quotes` | Create quote |
| `POST /api/quotes/calculate` | Calculate quote totals |
| `POST /api/quotes/preview` | Preview quote before sending |
| `POST /api/quotes/sample` | Sample quote data |
| `GET /api/leads` | List leads |
| `POST /api/leads` | Create lead |
| `GET /api/invoices` | List invoices |
| `POST /api/invoices` | Create invoice |
| `GET /api/documents` | List documents |
| `POST /api/documents` | Upload document |
| `GET /api/commercial-records` | Commercial memory snapshot |
| `GET /api/dashboard` | Dashboard data |
| `GET /api/agent` | Agent endpoint |
| `GET /api/agent/models` | Available models |
| `GET /api/quote-evidence` | Pricing evidence trace |

---

## Workflow

Lead → qualification → project/spec capture → measurement/site visit → quote draft → approval → customer quote → accepted job → invoice → payment tracking.

---

## Repository

- **GitHub:** https://github.com/merqatodigital/merqatodigital-azarraga-commercial-agent
- **Live:** https://azarraga.vercel.app
- **Source of truth:** GitHub

---

## Project rules

- Independent from the existing Azarraga website repository.
- GitHub is the source of truth.
- Deployment target: Vercel.
