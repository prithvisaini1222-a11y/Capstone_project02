import React from 'react'

// ─── Loader ───────────────────────────────────
export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="loader-center">
      <div style={{ textAlign: 'center' }}>
        <div className="loader-ring" style={{ margin: '0 auto 14px' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{text}</p>
      </div>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────
export function StatCard({ icon, iconBg, iconColor, value, label, change, changeGood, onClick }) {
  return (
    <div className="stat-card" style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <div className="stat-icon" style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="stat-value" style={{ color: iconColor }}>{value}</div>
      <div className="stat-label">{label}</div>
      {change && (
        <div className="stat-change" style={{ color: changeGood ? '#22C55E' : '#EF4444' }}>
          {changeGood ? '↑' : '↓'} {change}
        </div>
      )}
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────
export function ProgressBar({ value, max = 100, color = '#22C55E', showLabel = true }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      {showLabel && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>{pct}%</div>}
    </div>
  )
}

// ─── Modal ────────────────────────────────────
export function Modal({ title, children, onClose, footer }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 20, lineHeight: 1 }}>×</button>
        </div>
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}

// ─── Alert ────────────────────────────────────
export function AlertItem({ type, msg, onDismiss }) {
  return (
    <div className={`alert alert-${type}`} style={{ justifyContent: 'space-between' }}>
      <span>{msg}</span>
      {onDismiss && (
        <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.6, fontSize: 16, marginLeft: 8 }}>×</button>
      )}
    </div>
  )
}

// ─── Empty State ──────────────────────────────
export function EmptyState({ icon, title, desc, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 44, marginBottom: 14, opacity: 0.4 }}>{icon}</div>
      <h3 style={{ color: 'var(--text)', marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: 13, marginBottom: 20 }}>{desc}</p>
      {action}
    </div>
  )
}

// ─── Tag ──────────────────────────────────────
export function Tag({ label, type = 'green' }) {
  return <span className={`tag tag-${type}`}>{label}</span>
}

// ─── Icon (shared SVG) ────────────────────────
export function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 2 }) {
  const icons = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    posture:   <><path d="M12 2a3 3 0 0 1 3 3v1a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M12 10v12M8 14l4-4 4 4"/></>,
    calendar:  <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
    chart:     <><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-6"/></>,
    user:      <><circle cx="12" cy="7" r="4"/><path d="M5 20a7 7 0 0 1 14 0"/></>,
    bell:      <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    heart:     <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
    activity:  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>,
    shield:    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    zap:       <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    trend:     <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
    brain:     <><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/></>,
    plus:      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    edit:      <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash:     <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
    search:    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    check:     <polyline points="20 6 9 17 4 12"/>,
    logout:    <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    filter:    <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    moon:      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>,
    sun:       <><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {icons[name] || null}
    </svg>
  )
}
