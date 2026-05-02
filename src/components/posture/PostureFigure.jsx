import React from 'react'

export default function PostureFigure({ angle = 82, size = 200 }) {
  const color   = angle >= 80 ? '#22C55E' : angle >= 65 ? '#F97316' : '#EF4444'
  const bend    = (90 - angle) * 0.9
  const spineX2 = 100 + bend * 1.2
  const shouldX = 100 + bend * 0.55

  // Bezier control point for spine curve
  const cx = 100 + bend * 0.65
  const cy = 130

  return (
    <svg
      width={size}
      height={size * 1.55}
      viewBox="0 0 200 310"
      style={{ overflow: 'visible', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,.06))' }}
    >
      <defs>
        <radialGradient id={`bg-${angle}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <filter id="softglow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Ambient glow background */}
      <ellipse cx="100" cy="170" rx="72" ry="95" fill={`url(#bg-${angle})`} />

      {/* Vertical reference line */}
      <line x1="100" y1="60" x2="100" y2="265"
        stroke="var(--border)" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.6" />

      {/* ── Head ── */}
      <circle cx="100" cy="46" r="24"
        fill="var(--card)" stroke={color} strokeWidth="2.5" />
      {/* Face */}
      <circle cx="93"  cy="44" r="2.5" fill={color} opacity="0.5" />
      <circle cx="107" cy="44" r="2.5" fill={color} opacity="0.5" />
      <path d="M93 52 Q100 57 107 52" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="100" cy="46" r="24" fill="none" stroke={color} strokeWidth="2.5" />

      {/* ── Neck ── */}
      <rect x="96" y="68" width="8" height="14" rx="4"
        fill="var(--card)" stroke={color} strokeWidth="2" />

      {/* ── Spine (main visual — curves with angle) ── */}
      <path
        d={`M 100 82 Q ${cx} ${cy} ${spineX2} 178`}
        stroke={color} strokeWidth="4.5" fill="none"
        strokeLinecap="round" filter="url(#softglow)" opacity="0.95"
      />
      {/* Vertebrae dots on spine */}
      {[0, 0.22, 0.44, 0.66, 0.88, 1].map((t, i) => {
        const x = 100 * (1 - t) * (1 - t) + cx * 2 * t * (1 - t) + spineX2 * t * t
        const y = 82  * (1 - t) * (1 - t) + cy  * 2 * t * (1 - t) + 178    * t * t
        return (
          <circle key={i} cx={x} cy={y} r="5"
            fill="var(--card)" stroke={color} strokeWidth="2.2" />
        )
      })}

      {/* ── Shoulders ── */}
      <line x1={shouldX - 36} y1="94" x2={shouldX + 36} y2="94"
        stroke={color} strokeWidth="4" strokeLinecap="round" />
      <circle cx={shouldX - 36} cy="94" r="6"
        fill="var(--card)" stroke={color} strokeWidth="2.2" />
      <circle cx={shouldX + 36} cy="94" r="6"
        fill="var(--card)" stroke={color} strokeWidth="2.2" />

      {/* ── Arms ── */}
      <path d={`M ${shouldX-36} 94 Q ${shouldX-54} 126 ${shouldX-48} 156`}
        stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.75" />
      <path d={`M ${shouldX+36} 94 Q ${shouldX+54} 126 ${shouldX+48} 156`}
        stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.75" />
      {/* Hands */}
      <circle cx={shouldX - 48} cy="160" r="6" fill="var(--card)" stroke={color} strokeWidth="2" opacity="0.7" />
      <circle cx={shouldX + 48} cy="160" r="6" fill="var(--card)" stroke={color} strokeWidth="2" opacity="0.7" />

      {/* ── Torso fill ── */}
      <path d={`M ${shouldX-28} 100 L ${spineX2-22} 178 L ${spineX2+22} 178 L ${shouldX+28} 100 Z`}
        fill={color} opacity="0.07" />

      {/* ── Hips ── */}
      <line x1={spineX2 - 28} y1="178" x2={spineX2 + 28} y2="178"
        stroke={color} strokeWidth="4" strokeLinecap="round" />

      {/* ── Legs ── */}
      <line x1={spineX2 - 16} y1="178" x2={spineX2 - 20} y2="244"
        stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
      <line x1={spineX2 + 16} y1="178" x2={spineX2 + 20} y2="244"
        stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
      {/* Knees */}
      <circle cx={spineX2 - 20} cy="218" r="5" fill="var(--card)" stroke={color} strokeWidth="2" opacity="0.7" />
      <circle cx={spineX2 + 20} cy="218" r="5" fill="var(--card)" stroke={color} strokeWidth="2" opacity="0.7" />
      {/* Feet */}
      <path d={`M ${spineX2-22} 244 L ${spineX2-38} 254`} stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity="0.65" />
      <path d={`M ${spineX2+22} 244 L ${spineX2+38} 254`} stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity="0.65" />

      {/* ── Angle arc indicator ── */}
      <path
        d={`M 100 100 L 100 75 A 28 28 0 0 1 ${100 + 28 * Math.sin((90 - angle) * Math.PI / 180)} ${100 - 28 * Math.cos((90 - angle) * Math.PI / 180)}`}
        fill={color} opacity="0.12" stroke={color} strokeWidth="0.5"
      />
      {/* Angle label */}
      <rect x="148" y="100" width="40" height="22" rx="6" fill={color} opacity="0.9" />
      <text x="168" y="115" fontSize="12" fontWeight="800" fill="#fff"
        textAnchor="middle" fontFamily="Outfit, sans-serif">{angle}°</text>

      {/* ── Status dot (top-right) ── */}
      <circle cx="120" cy="22" r="7" fill={color} opacity="0.9">
        <animate attributeName="r" values="7;9;7" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
