import {quoteTotals,toCentavos,fromCentavos} from '../../../../lib/quote-engine'

export async function POST(req){
 const body=await req.json()
 const items=Array.isArray(body.items)?body.items:[]
 const normalized=items.map(x=>({...x,unitPrice:x.unitPrice??x.unit??0}))
 const base=quoteTotals(normalized,body.logistics,body.discount)
 const installationCentavos=toCentavos(body.installation)
 const vatCentavos=toCentavos(body.vat)
 const totalCentavos=base.totalCentavos+installationCentavos+vatCentavos
 if(totalCentavos<0)return Response.json({error:'Quote total cannot be negative'},{status:400})
 return Response.json({...base,lines:base.items.map(x=>({...x,subtotal:x.amount,subtotalCentavos:x.amountCentavos})),installation:fromCentavos(installationCentavos),installationCentavos,vat:fromCentavos(vatCentavos),vatCentavos,total:fromCentavos(totalCentavos),totalCentavos,currency:'PHP',calculation:'deterministic-centavos'})
}
