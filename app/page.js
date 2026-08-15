'use client'

import { useState } from 'react'
import { FileText, ReceiptText, Search, BrainCircuit, ArrowUpRight, MapPin, Plus, Sparkles } from 'lucide-react'

const products = ['900 Series','Pocket Sliding','Frameless Swing','Shower Enclosures','Jalousie / Jalouplus','Fixed Glass','Awning / Casement','Bi-fold','Slide-up','Mullion','Glass Railings','Canopies','Storefront','ACP','Roll-up','Screen Doors','Tabletop / Shelves','Aquarium']

export default function Home() {
  const [tab, setTab] = useState('Overview')
  const tabs = ['Overview','Leads','Quotes','Invoices','Commercial Memory']
  return <main>
    <aside className="sidebar">
      <div className="brand"><div className="mark">A</div><div><strong>AZARRAGA</strong><span>COMMERCIAL AGENT</span></div></div>
      <nav>{tabs.map(t => <button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</nav>
      <div className="agent"><BrainCircuit size={18}/><div><b>Commercial Memory</b><span>Operational</span></div></div>
    </aside>
    <section className="workspace">
      <header><div><p>AZARRAGA GLASS & ALUMINUM</p><h1>{tab}</h1></div><button className="primary"><Plus size={16}/> New Quote</button></header>
      {tab==='Overview' && <>
        <div className="hero"><div><span className="eyebrow"><Sparkles size={14}/> COMMERCIAL OPERATIONS</span><h2>From lead to paid invoice.</h2><p>One operating workspace for Azarraga's quoting, invoicing and project pipeline across Palawan.</p></div><div className="territory"><MapPin/><b>Palawan</b><span>Puerto Princesa · El Nido · San Vicente</span></div></div>
        <div className="metrics"><Metric label="Open leads" value="0" note="Lead engine ready"/><Metric label="Quotes awaiting action" value="0" note="No drafts yet"/><Metric label="Outstanding invoices" value="₱0" note="No invoices yet"/><Metric label="Memory products" value={products.length} note="Initial catalog"/></div>
        <h3>Work queue</h3><div className="cards"><Action icon={<Search/>} title="Find opportunities" text="Build a qualified pipeline of resorts, contractors, architects and property developments."/><Action icon={<FileText/>} title="Create a quote" text="Turn measurements, system specifications and commercial memory into a controlled quote draft."/><Action icon={<ReceiptText/>} title="Issue an invoice" text="Convert approved commercial work into trackable billing without retyping the project."/></div>
        <div className="memory"><div><span className="eyebrow">INITIAL COMMERCIAL MEMORY</span><h3>Azarraga product systems</h3><p>Structured products are the foundation for quoting. Historical prices will remain evidence until validated as current.</p></div><div className="tags">{products.map(p=><span key={p}>{p}</span>)}</div></div>
      </>}
      {tab!=='Overview' && <div className="empty"><span>{tab.toUpperCase()}</span><h2>{tab} workspace</h2><p>This module is now part of the standalone application shell. Operational data and agent actions are the next implementation layer.</p><button className="primary">Start {tab}<ArrowUpRight size={16}/></button></div>}
    </section>
  </main>
}
function Metric({label,value,note}){return <div className="metric"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>}
function Action({icon,title,text}){return <div className="action"><div className="icon">{icon}</div><h3>{title}</h3><p>{text}</p><button>Open workspace <ArrowUpRight size={14}/></button></div>}
