import memory from '../../../data/commercial-memory-2026.json'
import {store} from '../../../lib/commercial-store'

const endpoint='https://openrouter.ai/api/v1/chat/completions'
const allowedIntent=new Set(['leads','quotes','invoices','icm','general'])

function context(){
 const records=Array.isArray(memory)?memory:(memory.records||memory.documents||[])
 return JSON.stringify({historicalRecords:records.slice(0,40),quotes:store.quotes.slice(-20),documents:store.documents.slice(-20),invoices:store.invoices.slice(-20),jobs:store.jobs.slice(-20)})
}

export async function POST(req){
 const key=process.env.OPENROUTER_API_KEY
 if(!key)return Response.json({error:'OPENROUTER_API_KEY is not configured.'},{status:503})
 const body=await req.json()
 const message=String(body.message||'').trim()
 const model=String(body.model||'').trim()
 const intent=allowedIntent.has(body.intent)?body.intent:'general'
 if(!message)return Response.json({error:'message is required'},{status:400})
 if(!model)return Response.json({error:'Select an OpenRouter model.'},{status:400})
 const system=`You are the Azarraga Commercial Agent for Azarraga Glass & Aluminum in Palawan, Philippines. Your jobs are FIND BUSINESS (lead qualification), WIN BUSINESS (takeoff and quotation preparation), and BILL BUSINESS (draft invoice preparation). Use commercial memory as evidence, never as permission to invent a current price. Never infer VAT/tax treatment. Never issue or send a quote or invoice. The deterministic engine performs final arithmetic and a human approves commercial documents. Clearly separate FACT, DERIVED VALUE, AGENT INFERENCE, and HUMAN-APPROVED VALUE. State assumptions, missing information, confidence, and source evidence. Current intent: ${intent}.\nICM CONTEXT:\n${context()}`
 try{
  const res=await fetch(endpoint,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','HTTP-Referer':process.env.NEXT_PUBLIC_APP_URL||'https://azarraga.local','X-Title':'Azarraga Commercial Agent'},body:JSON.stringify({model,messages:[{role:'system',content:system},{role:'user',content:message}],temperature:0.2})})
  const json=await res.json()
  if(!res.ok)return Response.json({error:json?.error?.message||`OpenRouter returned ${res.status}`},{status:res.status})
  return Response.json({provider:'openrouter',model,reply:json?.choices?.[0]?.message?.content||'',usage:json.usage||null,humanReviewRequired:true})
 }catch(error){return Response.json({error:'Agent request failed.'},{status:502})}
}
