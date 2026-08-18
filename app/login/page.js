'use client'
import {useState} from 'react'
import {Lock, ArrowRight, AlertCircle} from 'lucide-react'

export default function Login(){
  const [passkey,setPasskey]=useState('')
  const [error,setError]=useState('')
  const [loading,setLoading]=useState(false)
  const submit=(e)=>{
    e.preventDefault()
    setError('');setLoading(true)
    fetch('/api/auth/verify',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({passkey})
    }).then(r=>r.json()).then(d=>{
      setLoading(false)
      if(d.authenticated){window.location.href='/'}
      else setError(d.error||'Invalid passkey')
    }).catch(()=>{setLoading(false);setError('Connection error')})
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand"><Lock size={28}/><div><b>Azarraga Glass</b><span>Commercial workspace</span></div></div>
        <h1 className="login-title">Sign in</h1>
        <p className="login-sub">Enter the passkey to access the commercial workspace.</p>
        <form className="login-form" onSubmit={submit}>
          <input
            className="passkey-input"
            type="password"
            placeholder="Passkey"
            value={passkey}
            onChange={e=>setPasskey(e.target.value)}
            autoFocus
            autoComplete="current-password"
            maxLength={20}
          />
          {error&&<div className="login-error"><AlertCircle size={14}/>{error}</div>}
          <button className="login-btn" type="submit" disabled={loading||!passkey}>
            {loading?'Signing in...':<span>Sign in</span>}<ArrowRight size={16}/>
          </button>
        </form>
      </div>
    </div>
  )
}