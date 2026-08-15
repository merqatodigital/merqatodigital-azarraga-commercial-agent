# ICM Data Dictionary

## Value classes
- **FACT**: directly supported by a source document or verified operational record.
- **DERIVED**: deterministically calculated from facts, e.g. quantity × approved unit price.
- **AGENT_INFERENCE**: interpretation/classification proposed by the agent; never silently promoted to fact.
- **HUMAN_APPROVED**: commercial value explicitly approved for use, including current selling price and quote approval.

## Money
`amountCentavos` is an integer. PHP is the base/accounting currency. USD and EUR are supported display/quotation currencies only when a verified or manually approved rate is supplied. Historical PHP values are never overwritten by display conversion.

## Provenance
Every commercial evidence record carries a source document ID/reference, confidence and value class. Exact historical values must not be seeded when the source document is absent.

## Pricing status
- `HISTORICAL_EVIDENCE`: what Azarraga charged historically; evidence only.
- `NEEDS_PRICE_REVIEW`: no current approved selling price exists.
- `CURRENT_APPROVED`: a human-approved current price that the deterministic engine may calculate with.

Historical proximity never promotes a price to `CURRENT_APPROVED`.

## Quote arithmetic
The agent proposes takeoff/classification and retrieves evidence. `quoteEngine` performs arithmetic in integer PHP centavos. Unknown tax treatment returns a review state. The final commercial document requires human approval.

## Invoice carry-forward
Only APPROVED/ACCEPTED quotes with reviewed pricing/tax may produce draft invoices. Generated invoices remain DRAFT and `humanApproved=false`; the engine does not issue or send them.

## Lead truth
A lead must be backed by evidence. No fake leads. Pipeline state changes represent actual commercial events; research output does not imply contact occurred.
