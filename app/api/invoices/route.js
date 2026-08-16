import {NextResponse} from 'next/server'
import {store,id} from '../../../lib/commercial-store'
export async function GET(){return NextResponse.json({invoices:store.invoices})}
export async function POST(req){
 const b=await req.json()
 if(!b.quoteId||!b.customer)return NextResponse.json({error:'quoteId and customer are required'},{status:400})
 const invoice={id:id('INV'),quote:b.quoteId,poNumber:b.poNumber||null,customer:b.customer,project:b.project||'',location:b.location||'',items:Array.isArray(b.items)?b.items:[],totalCentavos:Number(b.totalCentavos||0),paidCentavos:Number(b.paidCentavos||0),status:'DRAFT',createdAt:new Date().toISOString(),humanReviewRequired:true,sourceEvidence:b.sourceEvidence||[]}
 store.invoices.unshift(invoice)
 return NextResponse.json({invoice},{status:201})
}
export async function PATCH(req){
 const b=await req.json();const i=store.invoices.findIndex(x=>x.id===b.id)
 if(i<0)return NextResponse.json({error:'Invoice not found'},{status:404})
 store.invoices[i]={...store.invoices[i],...b,id:store.invoices[i].id,humanReviewRequired:true}
 return NextResponse.json({invoice:store.invoices[i]})
}
