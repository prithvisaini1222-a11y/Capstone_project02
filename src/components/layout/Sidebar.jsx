import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { logout } from '../../store/store'

const navItems = [
  { to: '/dashboard',    label: 'Dashboard',        icon: 'dashboard' },
  { to: '/posture',      label: 'Posture Tracking',  icon: 'posture'   },
  { to: '/appointments', label: 'Appointments',      icon: 'calendar'  },
  { to: '/analytics',    label: 'Analytics',         icon: 'chart'     },
  { to: '/insights',     label: 'AI Insights',       icon: 'brain'     },
  { to: '/profile',      label: 'Profile',           icon: 'user'      },
]

const NavIcon = ({ name }) => {
  const icons = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    posture:   <><path d="M12 2a3 3 0 0 1 3 3v1a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M12 10v12M8 14l4-4 4 4"/></>,
    calendar:  <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
    chart:     <><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 4-6"/></>,
    brain:     <><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/></>,
    user:      <><circle cx="12" cy="7" r="4"/><path d="M5 20a7 7 0 0 1 14 0"/></>,
    logout:    <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  }
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  )
}

export default function Sidebar() {
  const dispatch   = useAppDispatch()
  const { user }   = useAppSelector(s => s.auth)
  const aptCount   = useAppSelector(s => s.appointments.list.length)
  const navigate   = useNavigate()

  const initials = user?.name?.split(' ').map(n => n[0]).join('') || 'U'

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      background: 'var(--card)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', height: '100vh', zIndex: 100,
      boxShadow: '2px 0 12px rgba(0,0,0,.04)',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#22C55E,#16A34A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2a3 3 0 0 1 3 3v1a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
            <path d="M12 10v12M8 14l4-4 4 4"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.3px' }}>PostureCare</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>Healthcare Dashboard</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 8,
              cursor: 'pointer', transition: 'all .15s',
              fontSize: 14, fontWeight: isActive ? 600 : 500,
              color: isActive ? '#22C55E' : 'var(--text-muted)',
              background: isActive ? 'linear-gradient(135deg,rgba(34,197,94,.1),rgba(22,163,74,.05))' : 'transparent',
              textDecoration: 'none', marginBottom: 2,
            })}>
            <NavIcon name={item.icon} />
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.to === '/appointments' && (
              <span style={{ background: '#22C55E', color: '#fff', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 12 }}>
                {aptCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ padding: '14px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 10, background: 'var(--green-pale)' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#22C55E,#86EFAC)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#fff', flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.role}</div>
          </div>
          <button onClick={() => dispatch(logout())} title="Sign out"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
            <NavIcon name="logout" />
          </button>
        </div>
      </div>
    </aside>
  )
}
