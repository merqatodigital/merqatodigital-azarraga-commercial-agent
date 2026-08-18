import {NextResponse} from 'next/server'
import {store} from '../../../../lib/commercial-store'

function escapeCsv(v){
  const s=String(v==null?'':v)
  if(s.includes(',')||s.includes('"')||s.includes('\n')) return `"${s.replace(/"/g,'""')}"`
  return s
}

export async function GET(){
  const rows=store.invoices.map(inv=>[
    inv.id,
    inv.customer||'',
    inv.project||'',
    inv.quote||'',
    inv.poNumber||'',
    inv.status||'DRAFT',
    (inv.totalCentavos||0)/100,
    (inv.paidCentavos||0)/100,
    (inv.totalCentavos||0)-(inv.paidCentavos||0),
    inv.createdAt||''
  ])
  const header=['Invoice ID','Customer','Project','Quote','PO Number','Status','Total (PHP)','Paid (PHP)','Balance (PHP)','Created']
  const csv=[header.map(escapeCsv).join(','),...rows.map(r=>r.map(escapeCsv).join(','))].join('\n')
  return new NextResponse(csv,{
    headers:{
      'Content-Type':'text/csv;charset=utf-8',
      'Content-Disposition':`attachment; filename=azarraga-invoices-${new Date().toISOString().slice(0,10)}.csv`,
      'Content-Length':Buffer.byteLength(csv).toString()
    }
  })
}
