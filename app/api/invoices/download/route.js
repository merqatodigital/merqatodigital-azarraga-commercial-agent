import {NextResponse} from 'next/server'
import {store} from '../../../lib/commercial-store'

function escapeCsv(value){
  const str = String(value ?? '')
  if(str.includes(',') || str.includes('"') || str.includes('\n')){
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET(){
  const headers = new Headers({
    'Content-Type': 'text/csv',
    'Content-Disposition': 'attachment; filename=azarraga-invoices.csv'
  })
  const invoices = Array.isArray(store?.invoices) ? store.invoices : []
  const lines = []
  lines.push('Invoice ID,Customer,Project,Quote,PO Number,Status,Total (PHP),Paid (PHP),Balance (PHP),Created')
  for(const inv of invoices){
    lines.push([
      escapeCsv(inv.id),
      escapeCsv(inv.customer),
      escapeCsv(inv.project),
      escapeCsv(inv.quote),
      escapeCsv(inv.poNumber),
      escapeCsv(inv.status),
      inv.totalCentavos ?? 0,
      inv.paidCentavos ?? 0,
      (inv.totalCentavos ?? 0) - (inv.paidCentavos ?? 0),
      inv.createdAt ?? ''
    ].join(','))
  }
  return new NextResponse(lines.join('\n'), {headers, status: 200})
}
