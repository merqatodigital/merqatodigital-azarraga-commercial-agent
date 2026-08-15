import memory from '../../../data/commercial-memory-2026.json'
import {store} from '../../../lib/commercial-store'

const finite=v=>{const n=Number(v);return Number.isFinite(n)?n:0}
const historicalAmount=r=>finite(r.total??r.total_php??r.amount??0)

export async function GET(){
 const records=Array.isArray(memory)?memory:(memory.records||memory.documents||[])
 const historicalValue=Math.round(records.reduce((sum,r)=>sum+historicalAmount(r),0)*100)/100
 const quotesToReview=store.quotes.filter(q=>q.status==='draft_needs_review'||(q.warnings&&q.warnings.length)).length
 const activeJobs=store.jobs.filter(j=>!['completed','cancelled'].includes(j.status)).length
 const attention=[
  ...store.quotes.filter(q=>q.status==='draft_needs_review'||(q.warnings&&q.warnings.length)).map(q=>({id:q.id,type:'quote',title:q.customer||'Quote needs review',detail:q.project||'Resolve quotation warnings',amount:q.total,action:'Review quote'})),
  ...store.documents.filter(d=>d.status==='needs_review').map(d=>({id:d.id,type:'document',title:d.customer||d.documentNumber||'Document needs review',detail:d.project||d.kind||'Review extracted commercial record',action:'Review document'}))
 ].slice(0,10)
 return Response.json({brand:{primary:'#0F4C81'},territory:['Puerto Princesa','El Nido','San Vicente'],counts:{historicalRecords:records.length,documentsToReview:store.documents.filter(d=>d.status==='needs_review').length,quotesToReview,activeJobs,invoices:store.invoices.length},historicalValue,attention,source:'ICM + runtime commercial store'})
}
