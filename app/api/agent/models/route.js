const OPENROUTER_MODELS='https://openrouter.ai/api/v1/models'

const zero=v=>Number(v??1)===0

export async function GET(){
 try{
  const res=await fetch(OPENROUTER_MODELS,{headers:{Accept:'application/json'},next:{revalidate:900}})
  if(!res.ok)throw new Error(`OpenRouter models returned ${res.status}`)
  const json=await res.json()
  const models=(json.data||[]).filter(m=>zero(m?.pricing?.prompt)&&zero(m?.pricing?.completion)).map(m=>({id:m.id,name:m.name||m.id,contextLength:m.context_length||null,pricing:m.pricing})).sort((a,b)=>(b.contextLength||0)-(a.contextLength||0))
  return Response.json({provider:'openrouter',freeOnly:true,models})
 }catch(error){
  return Response.json({provider:'openrouter',freeOnly:true,models:[],error:'Unable to load OpenRouter free models right now.'},{status:502})
 }
}
