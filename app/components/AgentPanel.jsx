'use client'
import {useState} from 'react'
import {Bot,Send,Sparkles,FileSearch,Calculator,Users,ReceiptText,X} from 'lucide-react'

const starters=[
 {icon:FileSearch,label:'Review plans',prompt:'Review the uploaded plans and create a takeoff with anything missing flagged for review.'},
 {icon:Calculator,label:'Draft quote',prompt:'Prepare a draft quotation using current approved prices only. Show historical evidence separately.'},
 {icon:Users,label:'Find leads',prompt:'Find and qualify Palawan glass and aluminum opportunities. Focus on Puerto Princesa, El Nido and San Vicente.'},
 {icon:ReceiptText,label:'Billing',prompt:'Show approved jobs that are ready for draft billing and any unpaid balances.'}
]
export default function AgentPanel({open,onClose}){
 const [messages,setMessages]=useState([{role:'agent',text:'I’m ready. Give me plans, measurements, a customer request, or ask me about leads, quotes or billing.'}])
 const [input,setInput]=useState('')
 const send=(text=input)=>{if(!text.trim())return;setMessages(m=>[...m,{role:'user',text},{role:'agent',text:'Request captured. I will use Azarraga commercial memory, show source evidence, flag missing information, and keep final pricing and documents under human approval.'}]);setInput('')}
 if(!open)return null
 return <aside className="agent-panel"><div className="agent-head"><div className="agent-avatar"><Bot size={19}/></div><div><strong>Azarraga Agent</strong><span><i/> Commercial memory connected</span></div><button onClick={onClose}><X size={18}/></button></div><div className="agent-context"><Sparkles size={15}/><span>Find business · Quote jobs · Manage billing</span></div><div className="agent-starters">{starters.map(({icon:Icon,label,prompt})=><button key={label} onClick={()=>send(prompt)}><Icon size={15}/><span>{label}</span></button>)}</div><div className="agent-messages">{messages.map((m,i)=><div key={i} className={`agent-message ${m.role}`}>{m.text}</div>)}</div><div className="agent-compose"><textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}} placeholder="Ask the Azarraga Agent…"/><button onClick={()=>send()}><Send size={17}/></button></div><small className="agent-note">The agent can prepare and research. Commercial approval stays with Azarraga.</small></aside>
}