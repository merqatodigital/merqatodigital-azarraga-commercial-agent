import {NextResponse} from 'next/server'
import {store,id} from '../../../lib/commercial-store'
export async function GET(){return NextResponse.json({invoices:store.invoices})}
export async function POST(req){
 const b=await req.json()
 if(!b.quoteId||!b.customer)return NextResponse.json({error:'quoteId and customer are required'},{status:400})
 const invoice={id:id('INV'),quote:b.quoteId,poNumber:b.poNumber||null,customer:b.customer,project:b.project||'',location:b.location||'',items:Array.isArray(b.items)?b.items:[],totalCentavos:Number(b.totalCentavos||0),paidCentavos:Number(b.paidCentavos||0),status:'DRAFT',createdAt:new Date().toISOString(),humanReviewRequired:true,sourceEvidence:b.sourceEvidence||[]}
 store.invoices.unshift(invoice)
 // Persist to data/invoices.json so invoices survive Vercel restarts
 try{
   const fs=require('fs');const path=require('path')
   const dataFile=path.join(process.cwd(),'data','invoices.json')
   const existing=fs.existsSync(dataFile)?JSON.parse(fs.readFileSync(dataFile,'utf8')):{version:'1.0',lastUpdated:new Date().toISOString(),count:0,invoices:[]}
   existing.invoices=[invoice, ...existing.invoices.filter(i=>i.id!==invoice.id)]
   existing.lastUpdated=new Date().toISOString()
   existing.count=existing.invoices.length
   fs.writeFileSync(dataFile,JSON.stringify(existing,null,2))
 }catch(e){/* persistence write failed — invoice still in memory */}
 return NextResponse.json({invoice},{status:201})
}
export async function PATCH(req){
 const b=await req.json();const i=store.invoices.findIndex(x=>x.id===b.id)
 if(i<0)return NextResponse.json({error:'Invoice not found'},{status:404})
 store.invoices[i]={...store.invoices[i],...b,id:store.invoices[i].id,humanReviewRequired:true}
 return NextResponse.json({invoice:store.invoices[i]})
}
