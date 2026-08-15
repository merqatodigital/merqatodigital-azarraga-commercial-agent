import {NextResponse} from 'next/server'

const seed=[
 {id:'L-001',name:'Resort development',place:'El Nido',type:'Hospitality',stage:'DISCOVERED',score:92,next:'Identify architect / contractor'},
 {id:'L-002',name:'Villa construction',place:'San Vicente',type:'Residential',stage:'QUALIFIED',score:84,next:'Request plans'},
 {id:'L-003',name:'Commercial renovation',place:'Puerto Princesa',type:'Commercial',stage:'PLANS_REQUESTED',score:79,next:'Follow up on plans'}
]
let leads=[...seed]
export async function GET(){return NextResponse.json({leads})}
export async function POST(req){const body=await req.json();const lead={id:`L-${String(leads.length+1).padStart(3,'0')}`,name:body.name||'New opportunity',place:body.place||'Palawan',type:body.type||'Unqualified',stage:body.stage||'DISCOVERED',score:Number(body.score||0),next:body.next||'Research project'};leads=[lead,...leads];return NextResponse.json({lead},{status:201})}
export async function PATCH(req){const body=await req.json();const i=leads.findIndex(x=>x.id===body.id);if(i<0)return NextResponse.json({error:'Lead not found'},{status:404});leads[i]={...leads[i],...body};return NextResponse.json({lead:leads[i]})}
