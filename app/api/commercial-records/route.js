import memory from '../../../data/commercial-memory-2026.json'
import {store} from '../../../lib/commercial-store'
export async function GET(req){const u=new URL(req.url);const q=(u.searchParams.get('q')||'').toLowerCase();const historical=Array.isArray(memory)?memory:(memory.records||memory.documents||[]);const current=[...store.documents,...store.quotes,...store.jobs,...store.invoices];const all=[...current,...historical];const results=q?all.filter(x=>JSON.stringify(x).toLowerCase().includes(q)):all;return Response.json({count:results.length,results})}
