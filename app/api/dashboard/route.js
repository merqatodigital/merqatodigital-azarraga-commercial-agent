import memory from '../../../data/commercial-memory-2026.json'

export async function GET(){
 const records=Array.isArray(memory)?memory:(memory.records||memory.documents||[])
 const totalHistorical=records.reduce((sum,r)=>sum+Number(r.total||r.total_php||r.amount||0),0)
 return Response.json({owner:'Quennie',brand:{primary:'#0F4C81'},territory:['Puerto Princesa','El Nido','San Vicente'],counts:{historicalRecords:records.length,openLeads:3,quotesToReview:2,activeJobs:0},historicalValue:totalHistorical,attention:[{id:'quote-royal',type:'quote',title:'Royal Suites',detail:'5 shower partitions · Port Barton',amount:86600,action:'Review quote'},{id:'plans-el-nido',type:'plans',title:'El Nido project',detail:'Plans ready for takeoff',action:'Start takeoff'}]})
}