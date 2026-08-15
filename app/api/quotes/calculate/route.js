const n=v=>Number(v||0)
export async function POST(req){
 const body=await req.json(); const items=Array.isArray(body.items)?body.items:[]
 const lines=items.map(x=>({...x,subtotal:Math.round(n(x.qty)*n(x.unit)*100)/100}))
 const subtotal=lines.reduce((s,x)=>s+x.subtotal,0)
 const logistics=n(body.logistics); const installation=n(body.installation); const vat=n(body.vat); const discount=n(body.discount)
 const total=Math.round((subtotal+logistics+installation+vat-discount)*100)/100
 if(total<0)return Response.json({error:'Quote total cannot be negative'},{status:400})
 return Response.json({lines,subtotal,logistics,installation,vat,discount,total,currency:'PHP',calculation:'deterministic'})
}