# Brand Audit & Roadmap — The Agency + Azarraga + Quennie Ventures

> Live document. Updated as brand decisions are made. Owner: David / MerQato Digital.

---

## 1. What Exists Today

### The Agency (open-source, 17 divisions, ~200 agents)
- **Identity:** "A complete AI agency at your fingertips" — born from a Reddit thread
- **Tagline essence:** "Your dream team, except they're AI specialists who never sleep, never complain, and always deliver."
- **Visual:** dark-mode GitHub-first. No standalone brand system, no logo, no app branding beyond GitHub badges.
- **Audience:** developers, indie builders, agencies who install agents into Claude Code / Cursor / Codex / Gemini / OpenCode etc.
- **Distribution:** GitHub (stars, releases), desktop app at agencyagents.app, install scripts, integrations spanning 13+ tools.
- **Brand assets:** README sections per division, per-agent `.md` frontmatter (name, emoji, color, vibe), `divisions.json` (17 divisions, each with label/icon/color).
- **Gap:** No master brand book. No logo. No defined typography or color system beyond division colors. No voice guide beyond per-agent vibes. No dedicated marketing site. No investor / partner pitch.

### Azarraga Glass & Aluminum (commercial operating system)
- **Identity:** Azarraga Glass & Aluminum — supplier/fabricator/installer of glass & aluminum systems in Palawan (Puerto Princesa, El Nido, San Vicente).
- **Tagline:** "FIND THE CUSTOMER. QUOTE THE JOB. GET PAID."
- **Visual:** working Next.js 15 app at https://azarraga.vercel.app — dark navy shell, blue accent (#0F4C81 seen in owner metrics), currency toggles (₱/ $/ €), TALA agent panel on the right.
- **Audience:** Quennie (owner-operator), resort/hotel/villa/renovation customers in Palawan.
- **Brand assets:** README.md (150 lines), SYSTEM_ARCHITECTURE.md (783 lines), ICM.md (174 lines, business identity, 3 jobs, evidence hierarchy), commercial-memory-2026.json (20 records: Tara Hostel El Nido, Royal Suites Port Barton, Whiteport), quote-engine, invoice-engine, dashboard, TALA agent.
- **Gap:** No formal brand book. Visual identity lives in the app CSS. No documented brand voice (TALA personality is in code, not a document). No logo. No pitch deck. No partner/reseller brand.

### Quennie Ventures / MerQato Digital (your holding layer)
- **Identity:** MerQato Digital — builds sellable AI voice agents for resorts/tourism. San Vicente / Palawan.
- **Tagline:** not captured in a doc yet.
- **Audience:** resort buyers, tourists, partners, investors.
- **Brand assets:** GitHub org `merqatodigital`, the Azarraga app, the Palawan division README, PITCH-Resort-Booking-Agent.txt (in palawan/).
- **Gap:** No master brand narrative tying The Agency + Azarraga + Quennie together. No voice guide for Quennie. No roadmap doc.

### What's strong
- Real working systems (Azarraga app live, 12 API endpoints, TALA agent, deterministic quote/invoice engines, ICM commercial memory).
- A structured agent roster (17 divisions, each agent a persona with frontmatter).
- A real pipeline doctrine (NEXUS, 7 phases, quality gates, Dev↔QA loop).
- A real business (Azarraga sells, quotes, bills — not a concept).
- A real owner persona (Quennie) — the brand should serve her daily workflow.

---

## 2. Brand Position

### Core idea
Three layers that should feel like one company to a customer:

1. **Quennie Ventures / MerQato Digital** — the holding brand. Builds and owns AI-powered commercial systems for tourism/resorts.
2. **Azarraga Glass & Aluminum** — the operating brand. A real Palawan glass & aluminum business with a commercial OS running it.
3. **TALA** — the agentic interface. The warm, Taglish-speaking commercial assistant that helps Quennie find business, quote jobs, and bill business.

### Brand promise (working)
> For Quennie: one dashboard. Find the customer. Quote the job. Get paid.
> For customers/resorts: a real Palawan glass & aluminum supplier with fast quotes, accurate plans, and clear billing.
> For partners/investors: a working commercial operating system for a real business, with an agentic layer on top.

### Brand personality (working)
- **Quennie Ventures:** decisive, grounded, owner-operated, no-nonsense, Palawan-rooted.
- **Azarraga:** capable, dependable, commercial, warm, local.
- **TALA:** warm, Taglish, professional but friendly, emoji-lite, remembers your work.

### Voice (working, to be formalized)
- Lead with the outcome, not the technology.
- Speak to Quennie in her language (Taglish where natural, commercial terms she uses).
- Never over-promise. The system is a tool; Quennie approves. Say what the system did, what it needs, what Quennie should decide.
- For public/external brand: warm but credible. Not hype.

---

## 3. Visual Identity — Status & Gaps

### What exists
- App CSS: dark navy shell, blue accent, currency toggles, agent panel styling.
- Division color system in `divisions.json` (17 colors) — used by catalog tooling, not by brand marketing.
- Per-agent emoji + color in `.md` frontmatter.
- ICM.md has a clear product principle and business identity.

### What's missing (brand book needs)
1. **Logo** — no logo exists for Quennie Ventures, Azarraga, or TALA.
2. **Primary palette** — the app uses #0F4C81 (blue) as a visible accent. We should confirm this is the primary brand color or choose one deliberately.
3. **Typography** — no documented type system.
4. **Logo usage, clear space, minimum sizes** — nothing documented.
5. **Brand voice & messaging** — informal today; needs a short doc.
6. **Tone variations** — Quennie-internal vs public/external vs TALA chat.
7. **Asset library** — no shared folder of logos, banners, social templates.

### Quick visual direction (proposal, not final)
- Keep the working blue (#0F4C81) as Azarraga/Quennie primary unless there's a reason to change.
- Warm accent for TALA: coral/orange to signal warmth + Taglish friendliness, without clashing with the navy.
- Dark shell for the app (works for owner dashboards). Lighter, more human treatment for public/external pages.
- TALA logo/icon: something simple — a speech bubble, a wave, a small character mark. Not photoreal.

---

## 4. Brand Architecture

### Recommendation: endorsed brand model
- **Quennie Ventures** = master brand (parent).
- **Azarraga Glass & Aluminum** = endorsed operating brand ("an Azarraga business, powered by Quennie Ventures" or similar).
- **TALA** = product/agent name. Not a separate brand; the assistant inside Azarraga's commercial OS.

Why: customers see Azarraga as the business they buy from; Quennie Ventures is the entity behind it; TALA is the agentic layer that makes the business run faster.

---

## 5. Roadmap

### Phase 0 — Brand discovery (1-3 days)
- [ ] Interview Quennie: what does she call the business out loud? What words does she use with customers? What does she want the brand to feel like?
- [ ] Define 3 audiences explicitly: Quennie (owner), customers/resorts, partners/investors.
- [ ] Write the brand purpose, vision, mission, values for Quennie Ventures.
- [ ] Write the Azarraga positioning statement: who it serves, where, what it sells, what makes it credible.
- [ ] Capture TALA's personality doc from code into a short brand voice page.

### Phase 1 — Brand foundation (3-7 days)
- [ ] Brand book v1 (pdf/md): purpose, vision, mission, values, personality, voice, tone, messaging, audience.
- [ ] Logo: Quennie Ventures + Azarraga + TALA. At least primary + icon variants.
- [ ] Color system: primary, secondary, accent, neutrals, with hex/RGB/CMYK and accessible combos.
- [ ] Type system: headline + body + mono (if used), with weights and fallbacks.
- [ ] Logo usage rules: clear space, min sizes, do/don't, horizontal/stacked/icon variants.
- [ ] Taglines: one for Quennie Ventures, one for Azarraga, one for TALA.

### Phase 2 — Asset library (3-5 days)
- [ ] Logo files: SVG + PNG (light/dark), favicon, app icon.
- [ ] Social templates: profile headers, post templates, agent panel screenshot frames.
- [ ] Email/signature template for Quennie.
- [ ] Invoice/quote header treatment (brand on commercial documents — this matters a lot for Azarraga).
- [ ] "Powered by" / credit strip for agent surfaces.
- [ ] Simple one-page brand site or notion page anyone in the team can read.

### Phase 3 — Product brand integration (ongoing, start early)
- [ ] Put Azarraga logo + brand colors into the live app header (not just CSS variables — actual logo mark).
- [ ] Brand the commercial documents: quotes, invoices, POs, dashboard PDFs carry the mark.
- [ ] TALA panel branded: small mark + voice consistent with brand doc.
- [ ] Empty states, error states, onboarding copy written in brand voice.
- [ ] Currency, territory, owner-name placeholders all consistent.

### Phase 4 — Go-to-market brand (after product is solid)
- [ ] One-pager: Azarraga Glass & Aluminum — what it is, where, what it sells, how to buy.
- [ ] Partner/reseller sheet: for architects, contractors, developers in Palawan.
- [ ] Investor/partner narrative: Quennie Ventures + Azarraga + commercial OS + agentic layer.
- [ ] Public site copy (if you want one): homepage, about, services, contact.
- [ ] Social presence: handle consistency, bio, pinned content.

### Phase 5 — Brand protection & evolution
- [ ] Trademark check for key names (Azarraga, TALA, Quennie Ventures) — at least a first look.
- [ ] Brand monitoring: use the brand consistently; flag drift.
- [ ] Version the brand book; update when the business changes.
- [ ] Build a lightweight brand approval step into the NEXUS pipeline (Brand Guardian is already an agent).

---

## 6. Priorities (what matters first)

1. **Brand the commercial documents** — quotes and invoices are where the brand is most visible to real customers. Do this early.
2. **Logo + short brand book** — even a simple, clean mark + a one-page brand doc beats no brand at all.
3. **TALA voice doc** — pull the personality out of code into one page so it stays consistent as the agent grows.
4. **App header brand** — a real logo in the live app, not just CSS colors.
5. **One external-facing page** — so the business can be pointed to, shared, and understood.

---

## 7. Open questions (decide before Phase 1 lock-in)

- What is the master brand name? Quennie Ventures? MerQato Digital? Something else?
- Does Azarraga stay the customer-facing operating brand, or is it folded into a larger consumer brand?
- What is TALA's exact personality boundary — how Taglish, how emoji, how "character-like" vs "assistant-like"?
- Primary brand color: keep #0F4C81 (blue) or choose a new one deliberately?
- Logo style: wordmark, mark+wordmark, icon-only, character mark?
- Who is the brand for first — Quennie's daily use, or external customers, or both at once?

---

## 8. How to use this doc

- This is the source of truth for brand decisions across all projects.
- When a new surface is built (app page, doc, email, social post, agent reply), check it against this doc.
- When brand choices are made, update this doc — it's a living record, not a one-time deliverable.
- Brand Guardian (Design Division) is the agent for consistency reviews; use it before publishing anything external.
