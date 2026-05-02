import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { toggleDark } from '../../store/store'

const Icon = ({ name, size = 16 }) => {
  const icons = {
    moon:   <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>,
    sun:    <><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>,
    bell:   <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  )
}

export default function Topbar() {
  const dispatch  = useAppDispatch()
  const navigate  = useNavigate()
  const { dark }  = useAppSelector(s => s.ui)
  const { user }  = useAppSelector(s => s.auth)
  const alerts    = useAppSelector(s => s.alerts.list)

  const now  = new Date()
  const date = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  const initials = user?.name?.split(' ').map(n => n[0]).join('') || 'U'

  return (
    <div style={{
      height: 'var(--topbar-height)',
      background: 'var(--card)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 28px', gap: 14,
      position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: 'blur(8px)',
    }}>
      {/* Date/time */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{date}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', opacity: 0.7 }}>{time}</div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Dark mode */}
        <div className="icon-btn tooltip-wrap" onClick={() => dispatch(toggleDark())}>
          <Icon name={dark ? 'sun' : 'moon'} />
          <span className="tooltip">{dark ? 'Light mode' : 'Dark mode'}</span>
        </div>

        {/* Notifications */}
        <div className="icon-btn tooltip-wrap" style={{ position: 'relative' }} onClick={() => navigate('/appointments')}>
          <Icon name="bell" />
          {alerts.length > 0 && (
            <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#EF4444', borderRadius: '50%', border: '2px solid var(--card)' }} />
          )}
          <span className="tooltip">Notifications</span>
        </div>

        {/* Avatar */}
        <div
          onClick={() => navigate('/profile')}
          style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#22C55E,#86EFAC)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: '0 2px 8px rgba(34,197,94,.3)' }}>
          {initials}
        </div>
      </div>
    </div>
  )
}
