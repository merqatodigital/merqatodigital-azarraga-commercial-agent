import {NextResponse} from 'next/server'
let invoices=[]
export async function GET(){return NextResponse.json({invoices})}
export async function POST(req){const b=await req.json();if(!b.quoteId||!b.customer)return NextResponse.json({error:'quoteId and customer are required'},{status:400});const invoice={id:`INV-${String(invoices.length+1).padStart(4,'0')}`,quote:b.quoteId,poNumber:b.poNumber||null,customer:b.customer,project:b.project||'',totalCentavos:Number(b.totalCentavos||0),paidCentavos:0,status:'DRAFT',createdAt:new Date().toISOString(),humanReviewRequired:true};invoices=[invoice,...invoices];return NextResponse.json({invoice},{status:201})}
export async function PATCH(req){const b=await req.json();const i=invoices.findIndex(x=>x.id===b.id);if(i<0)return NextResponse.json({error:'Invoice not found'},{status:404});invoices[i]={...invoices[i],...b,id:invoices[i].id};return NextResponse.json({invoice:invoices[i]})}
