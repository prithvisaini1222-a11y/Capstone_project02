import React, { useState, useEffect, useRef } from 'react'
import { useAppSelector, useAppDispatch, usePostureStatus } from '../hooks'
import { setAngle, incrementSlouch } from '../store/store'
import PostureFigure from '../components/posture/PostureFigure'
import { Icon } from '../components/ui/Loader'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default function Posture() {
  const dispatch  = useAppDispatch()
  const stored    = useAppSelector(s => s.posture.angle)
  const history   = useAppSelector(s => s.posture.history)
  const stats     = useAppSelector(s => s.posture.todayStats)

  const [angle, setLocalAngle]  = useState(stored)
  const [simulating, setSim]    = useState(false)
  const intervalRef = useRef(null)
  const chartRef    = useRef(null)
  const chartInst   = useRef(null)
  const status      = usePostureStatus(angle)

  const handleAngle = (v) => {
    setLocalAngle(v)
    dispatch(setAngle(v))
    if (v < 65) dispatch(incrementSlouch())
  }

  const toggleSim = () => {
    if (simulating) {
      clearInterval(intervalRef.current)
      setSim(false)
    } else {
      setSim(true)
      intervalRef.current = setInterval(() => {
        const v = Math.round(48 + Math.random() * 48)
        setLocalAngle(v)
        dispatch(setAngle(v))
        if (v < 65) dispatch(incrementSlouch())
      }, 1400)
    }
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  // History chart
  useEffect(() => {
    chartInst.current?.destroy()
    const ctx = chartRef.current?.getContext('2d')
    if (!ctx) return
    chartInst.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: history.map((_, i) => `R${i + 1}`),
        datasets: [
          {
            label: 'Angle', data: history,
            borderColor: '#22C55E', backgroundColor: 'rgba(34,197,94,.06)',
            borderWidth: 2.5, fill: true, tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: history.map(v => v >= 80 ? '#22C55E' : v >= 65 ? '#F97316' : '#EF4444'),
          },
          {
            label: 'Good threshold', data: Array(history.length).fill(80),
            borderColor: 'rgba(34,197,94,.35)', borderWidth: 1.5, borderDash: [5, 5],
            fill: false, pointRadius: 0,
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10, family: 'Outfit' }, color: '#6B7280' } },
          y: { grid: { color: 'rgba(0,0,0,.04)' }, ticks: { font: { size: 11, family: 'Outfit' }, color: '#6B7280' }, min: 40, max: 100 }
        }
      }
    })
    return () => chartInst.current?.destroy()
  }, [history])

  const tips = [
    'Sit with your back fully against the chair backrest',
    'Keep your screen at eye level — not tilted up or down',
    'Place feet flat on the floor, knees at 90°',
    'Relax shoulders — do not hunch or tense them up',
    'Take a 5-minute stretch break every 30 minutes',
  ]

  return (
    <div className="animate-slideUp">
      <div style={{ marginBottom: 26 }}>
        <h1>Posture Tracking</h1>
        <p style={{ marginTop: 4 }}>Real-time spinal alignment visualization & monitoring</p>
      </div>

      <div className="grid-2 page-section">
        {/* Figure card */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="card-title" style={{ textAlign: 'left' }}>Spine Visualization</div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
            <PostureFigure angle={angle} size={185} />
          </div>
          <div>
            <div style={{ fontSize: 64, fontWeight: 800, color: status.color, letterSpacing: -2, lineHeight: 1 }}>
              {angle}°
            </div>
            <span className={`posture-status ${status.cls}`} style={{ marginTop: 10, display: 'inline-flex', fontSize: 15 }}>
              {status.label}
            </span>
            <p style={{ fontSize: 13, marginTop: 10, color: 'var(--text-muted)' }}>{status.desc}</p>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Slider */}
          <div className="card">
            <div className="card-title">Manual Simulator</div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Adjust posture angle</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: status.color }}>{angle}°</span>
              </div>
              <input
                type="range" min="45" max="95" step="1" value={angle}
                style={{ width: '100%', accentColor: 'var(--green)', height: 6, cursor: 'pointer' }}
                onChange={e => handleAngle(+e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                <span style={{ color: '#EF4444' }}>45° Bad</span>
                <span style={{ color: '#F97316' }}>65° Fair</span>
                <span style={{ color: '#22C55E' }}>80°+ Good</span>
              </div>
            </div>
            <button
              className={`btn ${simulating ? 'btn-danger' : 'btn-primary'}`}
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={toggleSim}
            >
              {simulating ? '⏹ Stop Live Simulation' : '▶ Start Live Simulation'}
            </button>
            {simulating && (
              <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span className="animate-pulse" style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--green)', borderRadius: '50%' }} />
                Live monitoring active — updating every 1.4s
              </div>
            )}
          </div>

          {/* Today's stats */}
          <div className="card">
            <div className="card-title">Today's Metrics</div>
            {[
              { label: 'Best angle',        val: `${stats.bestAngle}°`,   color: '#22C55E' },
              { label: 'Worst angle',       val: `${stats.worstAngle}°`,  color: '#EF4444' },
              { label: 'Avg angle',         val: `${angle}°`,             color: '#F97316' },
              { label: 'Good posture time', val: `${stats.goodHours} hrs`, color: '#22C55E' },
              { label: 'Slouch count',      val: `${stats.slouchCount}x`, color: '#EF4444' },
              { label: 'Breaks taken',      val: `${stats.breaksCount}x`, color: '#3B82F6' },
            ].map((m, i, arr) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{m.label}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: m.color }}>{m.val}</span>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="card">
            <div className="card-title">Posture Correction Tips</div>
            {tips.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: i < tips.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start' }}>
                <Icon name="check" size={14} color="var(--green)" style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--text)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History chart */}
      <div className="card page-section">
        <div className="card-title">Posture History — Last {history.length} Readings</div>
        <div style={{ height: 200, position: 'relative' }}>
          <canvas ref={chartRef} />
        </div>
      </div>
    </div>
  )
}
