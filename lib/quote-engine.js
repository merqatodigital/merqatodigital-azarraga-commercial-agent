import memory from '../data/commercial-memory-2026.json'
import {id} from './commercial-store'

const records=memory.records||[]
const text=v=>String(v||'').trim()
const finite=v=>{const n=Number(v);return Number.isFinite(n)?n:0}
export const toCentavos=v=>Math.round((finite(v)+Number.EPSILON)*100)
export const fromCentavos=v=>Math.round(finite(v))/100

export function quoteTotals(items=[],logistics=0,discount=0){
 const normalized=items.map((x,i)=>{
  const qty=finite(x.qty)
  const unitPriceCentavos=toCentavos(x.unitPrice)
  const amountCentavos=Math.round(qty*unitPriceCentavos)
  return {...x,line:i+1,qty,unit:x.unit||'set',widthMm:finite(x.widthMm),heightMm:finite(x.heightMm),unitPrice:fromCentavos(unitPriceCentavos),unitPriceCentavos,amount:fromCentavos(amountCentavos),amountCentavos}
 })
 const subtotalCentavos=normalized.reduce((s,x)=>s+x.amountCentavos,0)
 const logisticsCentavos=toCentavos(logistics)
 const discountCentavos=toCentavos(discount)
 const totalCentavos=subtotalCentavos+logisticsCentavos-discountCentavos
 return {items:normalized,subtotal:fromCentavos(subtotalCentavos),subtotalCentavos,logistics:fromCentavos(logisticsCentavos),logisticsCentavos,discount:fromCentavos(discountCentavos),discountCentavos,total:fromCentavos(totalCentavos),totalCentavos,currency:'PHP',calculation:'deterministic-centavos'}
}

function evidencePrices(r){return r.observed_unit_prices_php||[r.unit_price_php].filter(Boolean)}
export function findEvidence(item){const product=text(item.product||item.description).toLowerCase(),glass=text(item.glass).toLowerCase(),frame=text(item.frame).toLowerCase();return records.map(r=>{const s=JSON.stringify(r).toLowerCase();let score=0;if(product&&s.includes(product))score+=6;product.split(/\s+/).filter(x=>x.length>3).forEach(x=>{if(s.includes(x))score++});if(glass&&s.includes(glass))score+=3;if(frame&&s.includes(frame))score+=2;return {r,score}}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,5).map(({r,score})=>({document:r.document,date:r.date,customer:r.customer,project:r.project,category:r.category,glass:r.glass||'',observedUnitPricesPhp:evidencePrices(r),score,note:'Historical evidence only — never auto-applied as current price.'}))}

export function buildQuote(input={}){
 const calc=quoteTotals(input.items,input.logistics,input.discount),warnings=[]
 if(!text(input.customer))warnings.push('Customer is required')
 if(!text(input.project))warnings.push('Project is required')
 if(!calc.items.length)warnings.push('At least one line item is required')
 calc.items.forEach((x,i)=>{if(!text(x.description)&&!text(x.product))warnings.push(`Line ${i+1}: product/description required`);if(x.qty<=0)warnings.push(`Line ${i+1}: quantity must be greater than zero`);if(x.unitPriceCentavos<=0)warnings.push(`Line ${i+1}: current unit price requires owner entry/approval`)})
 if(calc.totalCentavos<0)warnings.push('Quote total cannot be negative')
 return {id:input.id||id('Q'),status:warnings.length?'draft_needs_review':'draft_ready',customer:text(input.customer),project:text(input.project),location:text(input.location),date:input.date||new Date().toISOString().slice(0,10),terms:text(input.terms),leadTime:text(input.leadTime),notes:text(input.notes),...calc,evidence:calc.items.map(findEvidence),warnings,pricingRule:'Historical prices are evidence only. Current quote prices must be explicitly entered or approved by owner.'}
}
