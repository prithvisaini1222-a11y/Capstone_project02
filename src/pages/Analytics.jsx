import React, { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { Icon } from '../components/ui/Loader'

Chart.register(...registerables)

function ChartCard({ id, title, height = 200, children }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div style={{ height, position: 'relative' }}>
        <canvas id={id} />
      </div>
      {children}
    </div>
  )
}

function useChart(id, config, deps = []) {
  const ref = useRef(null)
  useEffect(() => {
    ref.current?.destroy()
    const ctx = document.getElementById(id)?.getContext('2d')
    if (!ctx) return
    ref.current = new Chart(ctx, config)
    return () => ref.current?.destroy()
  }, deps)
}

export default function Analytics() {
  const weeklyData  = [72, 78, 65, 82, 88, 74, 82]
  const badDuration = [45, 30, 60, 20, 15, 50, 25]
  const hourly      = [70,65,78,82,80,72,68,75,85,88,82,76,70,65,72,78,80,74,68,62,70,76,80,78]
  const days        = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  useChart('weeklyScoreChart', {
    type: 'bar',
    data: {
      labels: days,
      datasets: [{
        label: 'Posture Score',
        data: weeklyData,
        backgroundColor: weeklyData.map(v => v >= 80 ? 'rgba(34,197,94,.8)' : v >= 65 ? 'rgba(249,115,22,.8)' : 'rgba(239,68,68,.8)'),
        borderRadius: 7, borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false }, ticks: { font: { size: 11, family: 'Outfit' }, color: '#6B7280' } }, y: { grid: { color: 'rgba(0,0,0,.04)' }, ticks: { font: { size: 11, family: 'Outfit' }, color: '#6B7280' }, min: 0, max: 100 } }
    }
  })

  useChart('badDurationChart', {
    type: 'bar',
    data: {
      labels: days,
      datasets: [{
        label: 'Minutes',
        data: badDuration,
        backgroundColor: 'rgba(239,68,68,.75)',
        borderRadius: 7, borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false }, ticks: { font: { size: 11, family: 'Outfit' }, color: '#6B7280' } }, y: { grid: { color: 'rgba(0,0,0,.04)' }, ticks: { font: { size: 11, family: 'Outfit' }, color: '#6B7280' } } }
    }
  })

  useChart('hourlyChart', {
    type: 'line',
    data: {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [
        { label: 'Angle', data: hourly, borderColor: '#22C55E', backgroundColor: 'rgba(34,197,94,.06)', borderWidth: 2.5, fill: true, tension: 0.4, pointRadius: 2.5, pointBackgroundColor: hourly.map(v => v >= 80 ? '#22C55E' : v >= 65 ? '#F97316' : '#EF4444') },
        { label: 'Good', data: Array(24).fill(80), borderColor: 'rgba(34,197,94,.3)', borderWidth: 1.5, borderDash: [5, 5], fill: false, pointRadius: 0 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false }, ticks: { font: { size: 9, family: 'Outfit' }, color: '#6B7280', maxTicksLimit: 12 } }, y: { grid: { color: 'rgba(0,0,0,.04)' }, ticks: { font: { size: 11, family: 'Outfit' }, color: '#6B7280' }, min: 50, max: 100 } }
    }
  })

  useChart('donutChart', {
    type: 'doughnut',
    data: {
      labels: ['Good Posture', 'Fair Posture', 'Bad Posture'],
      datasets: [{ data: [55, 30, 15], backgroundColor: ['#22C55E', '#F97316', '#EF4444'], borderWidth: 0, hoverOffset: 10 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '68%',
      plugins: { legend: { position: 'bottom', labels: { padding: 16, font: { size: 12, family: 'Outfit' }, color: '#6B7280', usePointStyle: true } } }
    }
  })

  const kpis = [
    { label: 'Weekly Avg Score', val: '77%',    trend: '+8%',  icon: 'chart',    color: '#22C55E', bg: '#DCFCE7' },
    { label: 'Bad Posture Time', val: '3.5 hrs', trend: '-12%', icon: 'activity', color: '#EF4444', bg: '#FEE2E2' },
    { label: 'Best Day',         val: 'Friday',  trend: '92°',  icon: 'zap',      color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Consistency',      val: '84%',     trend: '+5%',  icon: 'shield',   color: '#F97316', bg: '#FFF7ED' },
  ]

  const monthlyScores = [
    { month: 'Jan 2026', score: 62 },
    { month: 'Feb 2026', score: 68 },
    { month: 'Mar 2026', score: 74 },
    { month: 'Apr 2026', score: 82 },
  ]

  return (
    <div className="animate-slideUp">
      <div style={{ marginBottom: 26 }}>
        <h1>Analytics</h1>
        <p style={{ marginTop: 4 }}>Detailed posture metrics, trends, and progress tracking</p>
      </div>

      {/* KPI row */}
      <div className="grid-4 page-section">
        {kpis.map((k, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: k.bg }}>
              <Icon name={k.icon} size={20} color={k.color} />
            </div>
            <div className="stat-value" style={{ color: k.color }}>{k.val}</div>
            <div className="stat-label">{k.label}</div>
            <div className="stat-change" style={{ color: '#22C55E' }}>↑ {k.trend}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid-2 page-section">
        <ChartCard id="weeklyScoreChart" title="Daily Posture Score (This Week)" />
        <ChartCard id="badDurationChart" title="Bad Posture Duration — mins/day" />
      </div>

      {/* Hourly chart */}
      <div className="page-section">
        <ChartCard id="hourlyChart" title="Hourly Posture Pattern — Today" height={190} />
      </div>

      {/* Bottom row */}
      <div className="grid-2 page-section">
        <ChartCard id="donutChart" title="Posture Quality Distribution — This Week" height={220} />

        <div className="card">
          <div className="card-title">Monthly Progress (2026)</div>
          {monthlyScores.map((m, i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{m.month}</span>
                <span style={{ fontWeight: 800, color: '#22C55E' }}>{m.score}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${m.score}%`, background: 'linear-gradient(90deg,#86EFAC,#22C55E)' }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--green-pale)', borderRadius: 10, border: '1px solid var(--green-100)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>🎯 +20% improvement over 4 months!</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>Keep up the good work, Rahul</div>
          </div>
        </div>
      </div>
    </div>
  )
}
