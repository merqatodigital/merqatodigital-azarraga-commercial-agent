# Azarraga Commercial Agent — V1 Data Model

The product is intentionally limited to Leads, Quotes and Invoices with commercial memory supporting all three.

## leads
- id
- company_or_project
- location
- project_type
- owner
- developer
- architect
- contractor
- contact
- source_url
- evidence
- fit_score
- stage
- next_action
- notes
- created_at
- updated_at

## customers
- id
- name
- company
- phone
- email
- billing_address
- project_address

## projects
- id
- customer_id
- name
- location
- source_lead_id
- status

## quote_documents
- id
- project_id
- kind: plan | schedule | photo | customer_request | purchase_order
- filename
- storage_path
- extraction_status

## openings
- id
- project_id
- source_document_id
- mark
- product_family
- configuration
- width_mm
- height_mm
- quantity
- glass_spec
- frame_spec
- hardware_spec
- confidence
- needs_review

## quotes
- id
- project_id
- version
- status
- terms
- valid_until
- vat_treatment
- subtotal
- discount
- installation
- logistics
- crating
- vat
- total
- approved_at

## quote_items
- id
- quote_id
- opening_id
- description
- quantity
- width_mm
- height_mm
- unit_price
- total
- pricing_source
- pricing_date
- pricing_status

## invoices
- id
- project_id
- quote_id
- customer_po
- status
- invoice_type: down_payment | progress | final
- amount
- paid_amount
- balance
- due_date

## commercial_evidence
- id
- source_type
- source_reference
- project
- customer
- product_family
- specification
- dimensions
- quantity
- historical_selling_price
- date
- notes

## Hard rule
Historical selling price is evidence. It is never silently promoted to a current approved selling price. Missing current pricing must produce a review state rather than an invented number.
