export const PRODUCTS = [
  '900 Series sliding','Pocket sliding','Frameless swing door','Shower enclosure',
  'Jalousie / Jalouplus','Fixed glass','Awning / casement','Bi-fold','Slide-up',
  'Mullion','Glass railing','Canopy','Storefront','ACP','Roll-up','Screen door',
  'Tabletop / shelves','Aquarium'
]

export const GLASS_TYPES = [
  '6mm bronze annealed','10mm tempered clear','10mm tempered frosted','12mm tempered clear'
]

export function lineTotal({ qty = 0, unitPrice = 0 }) {
  return Number(qty || 0) * Number(unitPrice || 0)
}

export function quoteTotals(items = [], charges = {}) {
  const products = items.reduce((sum, item) => sum + lineTotal(item), 0)
  const installation = Number(charges.installation || 0)
  const logistics = Number(charges.logistics || 0)
  const crating = Number(charges.crating || 0)
  const discount = Number(charges.discount || 0)
  const subtotal = Math.max(0, products + installation + logistics + crating - discount)
  const vatRate = Number(charges.vatRate || 0)
  const vat = subtotal * vatRate
  return { products, installation, logistics, crating, discount, subtotal, vat, total: subtotal + vat }
}

export function quoteReadiness(quote) {
  const issues = []
  if (!quote.customer?.trim()) issues.push('Customer required')
  if (!quote.project?.trim()) issues.push('Project required')
  if (!quote.location?.trim()) issues.push('Location required')
  if (!quote.items?.length) issues.push('At least one quote item required')
  quote.items?.forEach((item, i) => {
    if (!item.product) issues.push(`Item ${i + 1}: product required`)
    if (!Number(item.qty)) issues.push(`Item ${i + 1}: quantity required`)
    if (!Number(item.unitPrice)) issues.push(`Item ${i + 1}: current unit price needs review`)
  })
  return { ready: issues.length === 0, issues }
}
