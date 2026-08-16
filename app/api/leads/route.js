import {NextResponse} from 'next/server'
import {store,id} from '../../../lib/commercial-store'

export async function GET(){return NextResponse.json({leads:store.leads||[]})}
export async function POST(req){
 const body=await req.json()
 if(!store.leads)store.leads=[]
 const lead={id:id('LEAD'),name:body.name||'New opportunity',place:body.place||'Palawan',type:body.type||'Unqualified',stage:body.stage||'DISCOVERED',score:Number(body.score||0),next:body.next||'Research project',contact:body.contact||'',sourceUrl:body.sourceUrl||'',sourceDate:body.sourceDate||'',evidence:body.evidence||'',createdAt:new Date().toISOString(),humanReviewRequired:true}
 store.leads.unshift(lead)
 return NextResponse.json({lead},{status:201})
}
export async function PATCH(req){
 const body=await req.json();if(!store.leads)store.leads=[]
 const i=store.leads.findIndex(x=>x.id===body.id)
 if(i<0)return NextResponse.json({error:'Lead not found'},{status:404})
 store.leads[i]={...store.leads[i],...body,id:store.leads[i].id}
 return NextResponse.json({lead:store.leads[i]})
}
