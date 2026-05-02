import React from 'react'
import { Icon } from '../components/ui/Loader'

const INSIGHTS = [
  { icon: 'activity', sev: 'warn',  title: 'Slouch Pattern Detected',       desc: 'You slouched 12 times today, mostly between 2–4 PM. Consider a standing desk or a posture alarm reminder app.' },
  { icon: 'trend',    sev: 'good',  title: 'Weekly Improvement 🎉',          desc: 'Your posture score improved by 8% compared to last week. Morning sessions show the best spinal alignment.' },
  { icon: 'zap',      sev: 'warn',  title: 'Evening Posture Weakness',       desc: 'Your posture consistently drops after 6 PM. This likely indicates fatigue. Try a short walk or stretch post-dinner.' },
  { icon: 'shield',   sev: 'info',  title: 'Chair Height Adjustment Needed', desc: 'Extended forward lean pattern suggests your chair may be 2–3 cm too low. Adjust seat height for better alignment.' },
  { icon: 'heart',    sev: 'good',  title: 'Excellent Tuesday!',             desc: 'Tuesday had your best posture score at 88°. You maintained excellent alignment for 6.5 consecutive hours.' },
  { icon: 'brain',    sev: 'warn',  title: 'Break Overdue',                  desc: "You've been seated for 2 hours 15 minutes without a break. Stand up and do a 5-minute stretch right now!" },
]

const SEV_STYLES = {
  good: { bg: '#F0FDF4', border: '#22C55E', iconBg: '#22C55E', text: '#15803D', tag: '#DCFCE7', tagText: '#15803D' },
  warn: { bg: '#FFFBEB', border: '#F59E0B', iconBg: '#F97316', text: '#92400E', tag: '#FEF3C7', tagText: '#B45309' },
  info: { bg: '#EFF6FF', border: '#3B82F6', iconBg: '#3B82F6', text: '#1E40AF', tag: '#DBEAFE', tagText: '#1D4ED8' },
}

export default function Insights() {
  const kpis = [
    { label: 'Insights Today', val: '6',      color: '#22C55E' },
    { label: 'Actions Needed', val: '3',      color: '#F97316' },
    { label: 'Goals Met',      val: '2/5',    color: '#3B82F6' },
    { label: '🔥 Streak',      val: '7 days', color: '#22C55E' },
  ]

  const weekScores = [72, 78, 65, 82, 88, 74, 82]
  const days       = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <div className="animate-slideUp">
      <div style={{ marginBottom: 26 }}>
        <h1>AI Insights</h1>
        <p style={{ marginTop: 4 }}>Smart health recommendations powered by pattern analysis</p>
      </div>

      {/* KPIs */}
      <div className="grid-4 page-section">
        {kpis.map((k, i) => (
          <div key={i} className="stat-card" style={{ padding: 16 }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: k.color }}>{k.val}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Insight cards */}
      <div className="page-section">
        {INSIGHTS.map((ins, i) => {
          const c = SEV_STYLES[ins.sev]
          return (
            <div key={i} className="insight-card" style={{ background: c.bg, borderColor: c.border }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 4px 12px ${c.iconBg}55` }}>
                <Icon name={ins.icon} size={18} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: c.text, marginBottom: 5 }}>{ins.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.65 }}>{ins.desc}</div>
              </div>
              <span style={{ background: c.tag, color: c.tagText, padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, flexShrink: 0, alignSelf: 'flex-start' }}>
                {ins.sev.toUpperCase()}
              </span>
            </div>
          )
        })}
      </div>

      {/* Weekly health score bars */}
      <div className="card page-section">
        <div className="card-title">Daily Health Score — This Week</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 10, marginTop: 8 }}>
          {days.map((d, i) => {
            const score = weekScores[i]
            const color = score >= 80 ? '#22C55E' : score >= 65 ? '#F97316' : '#EF4444'
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ height: 90, background: 'var(--border)', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div style={{ background: color, borderRadius: '8px 8px 0 0', height: `${score}%`, transition: 'height .6s ease' }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{d}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color }}>{score}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
