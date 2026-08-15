import {store} from '../../../lib/commercial-store'
import {buildQuote} from '../../../lib/quote-engine'
export async function GET(){return Response.json({quotes:store.quotes})}
export async function POST(req){const quote=buildQuote(await req.json());store.quotes.unshift(quote);return Response.json({quote},{status:201})}
export async function PATCH(req){const body=await req.json();const q=store.quotes.find(x=>x.id===body.id);if(!q)return Response.json({error:'Quote not found'},{status:404});if(body.action==='approve'){if(q.warnings?.length)return Response.json({error:'Resolve quote warnings before approval',warnings:q.warnings},{status:409});q.status='approved';q.approvedAt=new Date().toISOString();return Response.json({quote:q})}return Response.json({error:'Unsupported action'},{status:400})}
