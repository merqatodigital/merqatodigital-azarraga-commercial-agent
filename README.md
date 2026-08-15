# Azarraga Commercial Agent

Standalone commercial operating system for Azarraga Glass & Aluminum, Palawan, Philippines.

## V1 mission

Turn Azarraga's commercial history and product knowledge into an operational agent focused on three business pain points:

1. Quotes
2. Invoices
3. Lead generation

## Scope

Service areas: Puerto Princesa, El Nido, San Vicente and projects across Palawan.

Core commercial memory includes product systems, glass specifications, configurations, historical jobs, customers, pricing evidence, delivery and installation costs, payment terms, and operational workflow.

## Product memory

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

## Known glass specifications

- 6mm bronze annealed
- 10mm tempered clear
- 10mm tempered frosted
- 12mm tempered clear
- Other historical specifications to be normalized from source documents

## Architecture direction

The system will maintain structured commercial memory rather than treating documents as an undifferentiated chat knowledge base. Historical prices are evidence, not automatically current prices. Quote generation must distinguish known facts, calculated values, assumptions, and items requiring human approval.

## Initial workflow

Lead -> qualification -> project/spec capture -> measurement/site visit -> quote draft -> approval -> customer quote -> accepted job -> invoice -> payment tracking.

## Project rules

- This repository is independent from the existing Azarraga website repository.
- No Hermes dependency.
- No Lovable dependency.
- GitHub is the source of truth.
- Deployment target: a new standalone Vercel project.
