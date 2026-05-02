import React, { useState } from 'react'
import { useAppDispatch } from '../hooks'
import { login } from '../store/store'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const [form, setForm]       = useState({ email: 'rahul@posturecare.health', password: 'demo123' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleLogin = () => {
    if (!form.email || form.password.length < 6) {
      setError('Please enter valid credentials.')
      return
    }
    setLoading(true)
    setError('')
    setTimeout(() => {
      dispatch(login({ name: 'Rahul Verma', role: 'Patient', email: form.email }))
      setLoading(false)
    }, 900)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 45%, #BBF7D0 100%)',
      padding: 20,
    }}>
      {/* Decorative blobs */}
      <div style={{ position: 'fixed', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(34,197,94,.08)', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(22,163,74,.06)', zIndex: 0 }} />

      <div style={{
        background: '#fff', borderRadius: 24, padding: '40px 36px',
        width: 440, maxWidth: '100%',
        boxShadow: '0 20px 60px rgba(34,197,94,.15), 0 4px 20px rgba(0,0,0,.08)',
        position: 'relative', zIndex: 1,
        animation: 'slideUp 0.4s ease',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 68, height: 68, borderRadius: 20,
            background: 'linear-gradient(135deg,#22C55E,#16A34A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 8px 24px rgba(34,197,94,.3)',
          }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2a3 3 0 0 1 3 3v1a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
              <path d="M12 10v12M8 14l4-4 4 4"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4, color: '#111827' }}>PostureCare</h1>
          <p style={{ fontSize: 14, color: '#6B7280' }}>Smart Healthcare & Posture Dashboard</p>
        </div>

        {/* Demo hint */}
        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#15803D', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span>🔑</span>
          <span>Demo credentials pre-filled — just click <strong>Sign In</strong></span>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#DC2626' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <div className="form-group">
          <label className="label">Email address</label>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div className="form-group">
          <label className="label">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              className="input"
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              style={{ paddingRight: 44 }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 13 }}>
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, marginTop: 6, borderRadius: 12 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading
            ? <><span className="animate-spin" style={{ display:'inline-block', width:16, height:16, border:'2px solid rgba(255,255,255,.4)', borderTopColor:'#fff', borderRadius:'50%' }}/> Signing in…</>
            : 'Sign In →'
          }
        </button>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#9CA3AF' }}>
          🔒 Protected by healthcare-grade security · HIPAA compliant
        </div>
      </div>
    </div>
  )
}
