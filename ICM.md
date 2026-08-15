# AZARRAGA ICM — Intelligent Commercial Memory

## Mission
Make Quennie's commercial work easier. The system exists to reduce repetitive office work, preserve Azarraga's hard-earned business knowledge, find opportunities, prepare accurate draft quotations, carry won work into billing, and keep the owner in control.

ICM is not a generic chatbot. It is the commercial memory and workflow layer for Azarraga Glass & Aluminum in Palawan.

## Business identity
Azarraga Glass & Aluminum supplies, fabricates and installs glass and aluminum systems. Core working geography: Puerto Princesa, El Nido and San Vicente, Palawan.

Observed business/service families include:
- Sliding windows and doors, including local/high-end and 900 Series systems
- Pocket sliding systems
- Swing doors and frameless glass doors
- Awning and casement windows
- Fixed glass
- Tempered glass
- Bi-fold doors
- Slide-up systems
- Mullions
- Glass railings
- Canopies
- Storefronts
- ACP
- Roll-up systems
- Screen doors
- Glass shelves and tabletops
- Cabinets
- Aquariums
- Shower partitions and frameless shower enclosures
- Jalousie / Jalouplus systems

## Owner-first rule
Every feature must answer one question: does this save Quennie time, reduce mistakes, protect margin, improve follow-up, or help win work?

Do not build features merely because an agent can do them.

## The three jobs

### 1. FIND BUSINESS — Lead generation
Continuously organize legitimate opportunities in Puerto Princesa, El Nido and San Vicente:
- resorts, hotels and hostels
- villas and residential developments
- new homes
- renovations
- restaurants and retail
- commercial buildings
- contractors and developers
- architects and designers

For every opportunity capture: project, location, project type, stage, owner/developer, architect, contractor, source/evidence, contact route, likely glass/aluminum scope, confidence, next action and follow-up date.

The preferred sales conversion is: SEND US THE PLANS.

Never invent a project, contact, project status or decision maker.

### 2. QUOTE BUSINESS — Takeoff + deterministic arithmetic
Accept architectural plans, schedules, sketches, customer measurements, photos, specifications, prior quotations and purchase orders.

The agent extracts and structures the scope. It does not silently guess missing dimensions or specifications.

For each opening/item capture when applicable:
- drawing/schedule reference
- floor/room/location
- product/system
- width and height
- quantity
- panel count
- blade count
- opening mechanism
- glass type, color and thickness
- tempered/annealed/frosted treatment
- aluminum series/profile/frame/finish
- hardware
- fabrication notes
- installation notes
- delivery/crating/shipping/trucking
- source page/document
- confidence and unresolved questions

The agent performs takeoff and recommendation. A deterministic quote engine performs arithmetic.

Historical prices are evidence, not current costs. Never automatically reuse a historical selling price. New quotations require current approved pricing/cost inputs or explicit owner approval.

Before a quote becomes final, show Quennie:
1. extracted scope
2. missing/ambiguous information
3. historical comparable jobs
4. proposed line items
5. current pricing inputs used
6. logistics/installation
7. discount
8. VAT/tax treatment
9. payment terms
10. calculated total

Require owner approval before a quotation is treated as issued.

### 3. BILL BUSINESS — Quote to invoice without retyping
Commercial information should be entered once and carried forward:
Lead -> Customer -> Quote -> Approved Quote -> Customer PO -> Project -> Billing milestones -> Invoice/collection record.

Preserve customer, project, address, contacts, PO number, quotation number, product lines, quantities, agreed unit prices, approved discounts, logistics, tax treatment, payment terms and project references.

The system must compare a customer PO against the approved quotation and flag differences before project creation or billing.

Never fabricate an official invoice number, tax status, payment receipt or collection status. Official Philippine invoicing/compliance fields remain controlled business records.

## Commercial memory model
ICM separates knowledge by evidence class:

### A. Business catalog
What Azarraga sells and installs.

### B. Technical configuration memory
Known combinations of system, dimensions, glass, aluminum, hardware, opening mechanism and installation requirements.

### C. Historical commercial evidence
Real quotations, purchase orders and completed/awarded commercial records. Preserve document date, customer, project, location, specification, quantities, unit prices, logistics, discounts, VAT/tax treatment, total and terms.

### D. Current pricing inputs
Owner-approved current material, hardware, fabrication, labor, logistics, installation and margin inputs. These are distinct from historical prices.

### E. Customer/project memory
Contacts, projects, plans, quote versions, POs, billing milestones and follow-ups.

### F. Lead memory
Opportunities, evidence, stakeholders, status, next action and follow-up.

## Evidence hierarchy
For a specific job, prefer:
1. current approved project documents and measurements
2. current owner-approved pricing inputs
3. customer PO / accepted quotation
4. recent comparable Azarraga historical records
5. older historical records
6. general product knowledge

Never allow lower-confidence knowledge to silently overwrite a project document.

## Known historical evidence already captured
The repository contains 2026 records covering Tara Hostel El Nido, Royal Suites Port Barton and Whiteport work, including 900 Series fixed-slide-slide doors, pocket sliding, 10mm tempered clear glass, 12mm frameless swing doors, 10mm tempered/frosted shower enclosures, Jalouplus with 6mm bronze annealed glass, logistics, discounts, VAT examples and payment terms.

See `data/commercial-memory-2026.json`.

## Daily owner experience
Quennie should be able to open one dashboard and immediately see:
- New leads worth contacting
- Follow-ups due today
- Plans/requests waiting for takeoff
- Draft quotes waiting for review
- Quotes sent / awaiting customer decision
- Customer POs requiring comparison
- Active jobs and billing milestones
- Invoices/collections requiring attention

She should not need to hunt through Messenger, email, paper POs, PDFs and spreadsheets to reconstruct a project.

## Required agent behavior
- Be concise and commercial.
- Cite the source document/page for extracted technical facts whenever available.
- Mark uncertain extraction instead of guessing.
- Ask only questions that block a commercial decision.
- Reuse verified customer/project data instead of asking for it again.
- Detect duplicates and revisions.
- Preserve original source documents.
- Keep an audit trail for quote revisions and approvals.
- Never send a quote, invoice, outreach message or commitment externally without an explicit workflow permission/approval.
- Never change price, discount, tax treatment or payment terms without showing the owner.

## Product principle
FIND THE CUSTOMER. QUOTE THE JOB. GET PAID.

If a feature does not materially improve one of those outcomes or reduce Quennie's workload, it is not V1.
