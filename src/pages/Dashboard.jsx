import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, usePostureStatus } from '../hooks'
import { Chart, registerables } from 'chart.js'
import PostureFigure from '../components/posture/PostureFigure'
import { Icon } from '../components/ui/Loader'

Chart.register(...registerables)

export default function Dashboard() {
  const navigate  = useNavigate()
  const { user }  = useAppSelector(s => s.auth)
  const angle     = useAppSelector(s => s.posture.angle)
  const stats     = useAppSelector(s => s.posture.todayStats)
  const apts      = useAppSelector(s => s.appointments.list)
  const alerts    = useAppSelector(s => s.alerts.list)
  const status    = usePostureStatus(angle)
  const chartRef  = useRef(null)
  const chartInst = useRef(null)

  const hour      = new Date().getHours()
  const greeting  = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
  const firstName = user?.name?.split(' ')[0] || 'there'

  // Upcoming appointments (next 7 days)
  const upcoming = apts
    .filter(a => new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3)

  // Weekly chart
  useEffect(() => {
    if (chartInst.current) chartInst.current.destroy()
    const ctx = chartRef.current?.getContext('2d')
    if (!ctx) return
    chartInst.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Posture Score',
          data: [72, 78, 65, 82, 88, 74, 82],
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34,197,94,0.08)',
          borderWidth: 2.5, fill: true, tension: 0.4,
          pointBackgroundColor: '#22C55E', pointRadius: 4, pointHoverRadius: 7,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11, family: 'Outfit' }, color: '#6B7280' } },
          y: { grid: { color: 'rgba(0,0,0,.04)' }, ticks: { font: { size: 11, family: 'Outfit' }, color: '#6B7280' }, min: 50, max: 100 }
        }
      }
    })
    return () => chartInst.current?.destroy()
  }, [])

  const statCards = [
    { icon: 'heart',    iconBg: '#FEE2E2', iconColor: '#EF4444', value: '72 bpm',  label: 'Heart Rate',    change: '+2 bpm',  good: false },
    { icon: 'activity', iconBg: '#DCFCE7', iconColor: '#22C55E', value: `${angle}°`, label: 'Posture Angle', change: '+5°',    good: true  },
    { icon: 'shield',   iconBg: '#EFF6FF', iconColor: '#3B82F6', value: '87%',     label: 'Posture Score', change: '+8%',     good: true  },
    { icon: 'zap',      iconBg: '#FFF7ED', iconColor: '#F97316', value: `${stats.goodHours}h`, label: 'Good Sitting', change: '-0.3h', good: false },
  ]

  return (
    <div className="animate-slideUp">
      {/* Page header */}
      <div style={{ marginBottom: 26 }}>
        <h1>{greeting}, {firstName} 👋</h1>
        <p style={{ marginTop: 4 }}>Here's your health overview for today</p>
      </div>

      {/* Stat Cards */}
      <div className="grid-4 page-section">
        {statCards.map((s, i) => (
          <div key={i} className="stat-card" style={{ animation: `slideUp ${0.1 + i * 0.07}s ease both` }}>
            <div className="stat-icon" style={{ background: s.iconBg }}>
              <Icon name={s.icon} size={20} color={s.iconColor} />
            </div>
            <div className="stat-value" style={{ color: s.iconColor }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-change" style={{ color: s.good ? '#22C55E' : '#EF4444' }}>
              {s.good ? '↑' : '↓'} {s.change} vs yesterday
            </div>
          </div>
        ))}
      </div>

      {/* Main Row */}
      <div className="grid-2 page-section">
        {/* Live Posture */}
        <div className="card">
          <div className="card-title">Live Posture Monitor</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ flexShrink: 0 }}>
              <PostureFigure angle={angle} size={150} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 60, fontWeight: 800, color: status.color, letterSpacing: -2, lineHeight: 1 }}>
                {angle}°
              </div>
              <span className={`posture-status ${status.cls}`} style={{ marginTop: 8, display: 'inline-flex' }}>
                {status.label}
              </span>
              <p style={{ fontSize: 13, marginTop: 10, lineHeight: 1.5 }}>{status.desc}</p>

              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <div style={{ flex: 1, textAlign: 'center', background: 'var(--green-pale)', borderRadius: 10, padding: '10px 8px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Slouches</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#EF4444' }}>{stats.slouchCount}</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', background: '#FFF7ED', borderRadius: 10, padding: '10px 8px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Breaks</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#F97316' }}>{stats.breaksCount}</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', background: '#EFF6FF', borderRadius: 10, padding: '10px 8px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Good hrs</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#3B82F6' }}>{stats.goodHours}h</div>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}
                onClick={() => navigate('/posture')}>
                Full Posture Analysis →
              </button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Alerts */}
          <div className="card" style={{ flex: 1 }}>
            <div className="card-title">Health Alerts</div>
            {alerts.slice(0, 3).map((a, i) => (
              <div key={i} className={`alert alert-${a.type}`}>{a.msg}</div>
            ))}
          </div>

          {/* Upcoming */}
          <div className="card" style={{ flex: 1 }}>
            <div className="card-title">Upcoming Appointments</div>
            {upcoming.length === 0
              ? <p style={{ fontSize: 13, textAlign: 'center', padding: '16px 0' }}>No upcoming appointments</p>
              : upcoming.map(a => (
                <div className="apt-item" key={a.id}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="calendar" size={18} color="var(--green)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.doctor}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.specialty}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', background: 'var(--green-pale)', padding: '3px 9px', borderRadius: 6 }}>{a.time}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                      {new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>
              ))}
            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
              onClick={() => navigate('/appointments')}>
              Manage Appointments
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="card page-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="card-title" style={{ marginBottom: 0 }}>Weekly Posture Trend</div>
          <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 700, background: 'var(--green-pale)', padding: '3px 10px', borderRadius: 20 }}>↑ +8% this week</span>
        </div>
        <div style={{ height: 160, position: 'relative' }}>
          <canvas ref={chartRef} />
        </div>
      </div>
    </div>
  )
}
