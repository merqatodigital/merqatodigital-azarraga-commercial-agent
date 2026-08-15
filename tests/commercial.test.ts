import {describe,it,expect} from 'vitest'
import {calculateQuote,convertDisplayCurrency} from '../src/engine/quoteEngine'
import {draftInvoiceFromApprovedQuote,invoiceBalance} from '../src/engine/invoiceEngine'
import {findSimilarDimensions} from '../src/icm'
import {CommercialEvidence} from '../src/domain'

const money=(p:number)=>({amountCentavos:p*100,currency:'PHP' as const})
const approvedQuote:any={id:'Q1',projectId:'P1',status:'APPROVED',lines:[{id:'L1',description:'900 Series',quantity:2,unitPrice:money(10000),pricingStatus:'CURRENT_APPROVED',evidenceIds:[]}],discount:money(1000),shipping:money(2000),installation:money(3000),taxTreatment:'explicit VAT',taxRateBasisPoints:1200,provenance:[]}
describe('quote engine',()=>{
 it('calculates PHP in integer centavos',()=>{const r=calculateQuote(approvedQuote);expect(r.preTax.amountCentavos).toBe(2400000);expect(r.tax?.amountCentavos).toBe(288000);expect(r.total.amountCentavos).toBe(2688000)})
 it('blocks historical evidence as current pricing',()=>{const q={...approvedQuote,lines:[{...approvedQuote.lines[0],pricingStatus:'HISTORICAL_EVIDENCE'}]};expect(calculateQuote(q).status).toBe('NEEDS_PRICE_REVIEW')})
 it('requires explicit FX rate',()=>expect(()=>convertDisplayCurrency(10000,'USD')).toThrow())
})
describe('invoice engine',()=>{
 it('carries approved quote into draft billing',()=>{const inv=draftInvoiceFromApprovedQuote(approvedQuote,{invoiceId:'I1',type:'DOWN_PAYMENT',percentageBasisPoints:7000});expect(inv.status).toBe('DRAFT');expect(inv.humanApproved).toBe(false);expect(inv.total.amountCentavos).toBe(1881600)})
 it('computes remaining balance',()=>{const inv=draftInvoiceFromApprovedQuote(approvedQuote,{invoiceId:'I1',type:'FINAL'});inv.payments=[{id:'P',invoiceId:'I1',amount:money(1000),date:'2026-08-15'}];expect(invoiceBalance(inv).amountCentavos).toBe(2588000)})
})
describe('ICM provenance/retrieval',()=>{
 it('validates provenance and finds nearby dimensions',()=>{const row:any={id:'E1',customer:'Tagusao',project:'Tara Hostel',location:'El Nido',productFamily:'900 Series sliding systems',configuration:{widthMm:2975,heightMm:2700,hardware:[]},quantity:1,historicalUnitPrice:money(34304),includedServices:[],source:{documentId:'DOC',sourceReference:'PO pending source verification'},provenance:{kind:'FACT',confidence:1,source:{documentId:'DOC',sourceReference:'PO pending source verification'},humanReviewRequired:false}};expect(CommercialEvidence.parse(row).id).toBe('E1');expect(findSimilarDimensions([row],3000,50)).toHaveLength(1)})
})
