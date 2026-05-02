import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../hooks'
import { logout, toggleDark } from '../store/store'
import { Icon } from '../components/ui/Loader'

export default function Profile() {
  const dispatch  = useAppDispatch()
  const { user }  = useAppSelector(s => s.auth)
  const { dark }  = useAppSelector(s => s.ui)
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({
    name:      user?.name || 'Rahul Verma',
    age:       '28',
    height:    '175 cm',
    weight:    '72 kg',
    bloodType: 'B+',
    condition: 'Lumbar strain',
    phone:     '+91 98765 43210',
    email:     user?.email || 'rahul@posturecare.health',
  })

  const initials = profile.name.split(' ').map(n => n[0]).join('')

  const goals = [
    { goal: 'Maintain posture score above 80°', progress: 87, color: '#22C55E' },
    { goal: '30-min daily exercise',            progress: 60, color: '#F97316' },
    { goal: 'No slouching after 6 PM',          progress: 45, color: '#EF4444' },
    { goal: '10k steps per day',                progress: 72, color: '#3B82F6' },
  ]

  const healthInfo = [
    { label: 'Blood Type', val: profile.bloodType },
    { label: 'Height',     val: profile.height },
    { label: 'Weight',     val: profile.weight },
    { label: 'Condition',  val: profile.condition },
  ]

  const personalFields = [
    { key: 'name',  label: 'Full Name',  type: 'text' },
    { key: 'age',   label: 'Age',        type: 'number' },
    { key: 'email', label: 'Email',      type: 'email' },
    { key: 'phone', label: 'Phone',      type: 'tel' },
  ]

  return (
    <div className="animate-slideUp">
      <div style={{ marginBottom: 26 }}>
        <h1>My Profile</h1>
        <p style={{ marginTop: 4 }}>Personal health information and account settings</p>
      </div>

      <div className="grid-2 page-section">
        {/* Left: avatar card */}
        <div>
          <div className="card" style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: 'linear-gradient(135deg,#22C55E,#86EFAC)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 30, fontWeight: 800, color: '#fff',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(34,197,94,.3)',
            }}>
              {initials}
            </div>
            <h2>{profile.name}</h2>
            <p style={{ marginTop: 4, fontSize: 14 }}>{user?.role} · Age {profile.age}</p>
            <span style={{ display: 'inline-flex', marginTop: 10, background: '#DCFCE7', color: '#15803D', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
              ✓ Active Patient
            </span>

            {/* Health info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
              {healthInfo.map((info, i) => (
                <div key={i} style={{ background: 'var(--bg)', borderRadius: 10, padding: 12, border: '1px solid var(--border)', textAlign: 'left' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>{info.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{info.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="card">
            <div className="card-title">Settings</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Dark Mode</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Toggle light/dark theme</div>
              </div>
              <button
                onClick={() => dispatch(toggleDark())}
                style={{
                  width: 46, height: 26, borderRadius: 13,
                  background: dark ? 'var(--green)' : 'var(--border)',
                  border: 'none', cursor: 'pointer', position: 'relative',
                  transition: 'background .2s',
                }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute', top: 3,
                  left: dark ? 23 : 3,
                  transition: 'left .2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,.2)',
                }} />
              </button>
            </div>
            <div style={{ padding: '14px 0' }}>
              <button className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => dispatch(logout())}>
                <Icon name="logout" size={15} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Right: editable info + goals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="card-title" style={{ marginBottom: 0 }}>Personal Information</div>
              <button className="btn btn-outline btn-sm" onClick={() => setEditing(e => !e)}>
                <Icon name={editing ? 'check' : 'edit'} size={13} />
                {editing ? 'Save' : 'Edit'}
              </button>
            </div>

            {personalFields.map(({ key, label, type }) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, minWidth: 90 }}>{label}</span>
                {editing
                  ? <input className="input" type={type} value={profile[key]} style={{ maxWidth: 220 }}
                      onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
                  : <span style={{ fontSize: 14, fontWeight: 500 }}>{profile[key]}</span>
                }
              </div>
            ))}

            {/* Medical info editable fields */}
            {[
              { key: 'height',    label: 'Height' },
              { key: 'weight',    label: 'Weight' },
              { key: 'condition', label: 'Condition' },
            ].map(({ key, label }) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, minWidth: 90 }}>{label}</span>
                {editing
                  ? <input className="input" value={profile[key]} style={{ maxWidth: 220 }}
                      onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
                  : <span style={{ fontSize: 14, fontWeight: 500 }}>{profile[key]}</span>
                }
              </div>
            ))}
          </div>

          {/* Health Goals */}
          <div className="card">
            <div className="card-title">Health Goals</div>
            {goals.map((g, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: 'var(--text)' }}>{g.goal}</span>
                  <span style={{ fontWeight: 800, color: g.color }}>{g.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${g.progress}%`, background: g.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Achievement badges */}
          <div className="card">
            <div className="card-title">Achievements</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {[
                { emoji: '🏆', title: '7-day streak', sub: 'Consistent posture' },
                { emoji: '⚡', title: 'Early bird',   sub: 'Best morning score' },
                { emoji: '💪', title: '20% improve',  sub: 'Monthly milestone' },
                { emoji: '🎯', title: 'Goal crusher', sub: '2 goals this week' },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--green-pale)', borderRadius: 10, border: '1px solid var(--green-100)' }}>
                  <span style={{ fontSize: 22 }}>{b.emoji}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green-dark)' }}>{b.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
