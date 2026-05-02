import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useDebounce } from '../../hooks'
import { Icon } from './Loader'

// ─── Static Doctor Database (India focused) ─────────────────────
const DOCTOR_DB = [
  // Orthopedic
  { name: 'Dr. Priya Mehta',         specialty: 'Orthopedic',         hospital: 'AIIMS Delhi',            rating: 4.9, exp: '14 yrs', fee: '₹800' },
  { name: 'Dr. Rajesh Khanna',       specialty: 'Orthopedic',         hospital: 'Fortis Hospital',         rating: 4.7, exp: '18 yrs', fee: '₹1000' },
  { name: 'Dr. Sanjay Gupta',        specialty: 'Orthopedic',         hospital: 'Apollo Hospital',         rating: 4.8, exp: '22 yrs', fee: '₹1200' },
  { name: 'Dr. Ritu Sharma',         specialty: 'Orthopedic',         hospital: 'Max Healthcare',          rating: 4.6, exp: '11 yrs', fee: '₹700' },

  // Physiotherapist
  { name: 'Dr. Arun Sharma',         specialty: 'Physiotherapist',    hospital: 'Medanta Hospital',        rating: 4.8, exp: '10 yrs', fee: '₹600' },
  { name: 'Dr. Neha Patel',          specialty: 'Physiotherapist',    hospital: 'Narayana Health',         rating: 4.5, exp: '8 yrs',  fee: '₹500' },
  { name: 'Dr. Vikram Bose',         specialty: 'Physiotherapist',    hospital: 'Columbia Asia',           rating: 4.7, exp: '13 yrs', fee: '₹650' },
  { name: 'Dr. Sunita Rao',          specialty: 'Physiotherapist',    hospital: 'Manipal Hospital',        rating: 4.6, exp: '9 yrs',  fee: '₹550' },

  // Neurologist
  { name: 'Dr. Kavita Joshi',        specialty: 'Neurologist',        hospital: 'Kokilaben Hospital',      rating: 4.9, exp: '16 yrs', fee: '₹1500' },
  { name: 'Dr. Amit Verma',          specialty: 'Neurologist',        hospital: 'NIMHANS Bangalore',       rating: 4.8, exp: '20 yrs', fee: '₹1800' },
  { name: 'Dr. Pooja Iyer',          specialty: 'Neurologist',        hospital: 'Fortis Hospital',         rating: 4.7, exp: '12 yrs', fee: '₹1400' },

  // Cardiologist
  { name: 'Dr. Rohit Gupta',         specialty: 'Cardiologist',       hospital: 'Escorts Heart Institute', rating: 4.9, exp: '25 yrs', fee: '₹2000' },
  { name: 'Dr. Meera Nair',          specialty: 'Cardiologist',       hospital: 'Sri Jayadeva Institute',  rating: 4.8, exp: '19 yrs', fee: '₹1600' },
  { name: 'Dr. Suresh Reddy',        specialty: 'Cardiologist',       hospital: 'CARE Hospital',           rating: 4.7, exp: '17 yrs', fee: '₹1800' },

  // General Physician
  { name: 'Dr. Anita Singh',         specialty: 'General Physician',  hospital: 'Apollo Clinic',           rating: 4.6, exp: '12 yrs', fee: '₹400' },
  { name: 'Dr. Manoj Kumar',         specialty: 'General Physician',  hospital: 'Healthspring Clinic',     rating: 4.5, exp: '9 yrs',  fee: '₹350' },
  { name: 'Dr. Radha Krishnan',      specialty: 'General Physician',  hospital: 'Medi Assist Clinic',      rating: 4.4, exp: '7 yrs',  fee: '₹300' },
  { name: 'Dr. Preeti Walia',        specialty: 'General Physician',  hospital: 'Max Super Specialty',     rating: 4.7, exp: '14 yrs', fee: '₹500' },

  // Dermatologist
  { name: 'Dr. Sneha Kapoor',        specialty: 'Dermatologist',      hospital: 'Skin Alive Clinic',       rating: 4.8, exp: '11 yrs', fee: '₹900' },
  { name: 'Dr. Kiran Desai',         specialty: 'Dermatologist',      hospital: 'KLES Hospital',           rating: 4.6, exp: '8 yrs',  fee: '₹750' },

  // Spine Specialist
  { name: 'Dr. Arjun Sood',          specialty: 'Spine Specialist',   hospital: 'Indian Spinal Injuries',  rating: 4.9, exp: '21 yrs', fee: '₹1500' },
  { name: 'Dr. Seema Malhotra',      specialty: 'Spine Specialist',   hospital: 'Sir Ganga Ram Hospital',  rating: 4.8, exp: '16 yrs', fee: '₹1300' },

  // Pain Management
  { name: 'Dr. Nikhil Chopra',       specialty: 'Pain Management',    hospital: 'Jaslok Hospital',         rating: 4.7, exp: '13 yrs', fee: '₹1100' },
  { name: 'Dr. Tanya Saxena',        specialty: 'Pain Management',    hospital: 'Hinduja Hospital',        rating: 4.6, exp: '10 yrs', fee: '₹950' },

  // Rheumatologist
  { name: 'Dr. Vivek Srivastava',    specialty: 'Rheumatologist',     hospital: 'PGI Chandigarh',          rating: 4.8, exp: '18 yrs', fee: '₹1200' },

  // Sports Medicine
  { name: 'Dr. Karan Mehrotra',      specialty: 'Sports Medicine',    hospital: 'IOC Sports Centre',       rating: 4.7, exp: '9 yrs',  fee: '₹800' },
  { name: 'Dr. Divya Puri',          specialty: 'Sports Medicine',    hospital: 'Guru Nanak Hospital',     rating: 4.5, exp: '7 yrs',  fee: '₹700' },
]

const SPECIALTIES = [...new Set(DOCTOR_DB.map(d => d.specialty))]

// Star rating helper
function Stars({ rating }) {
  return (
    <span style={{ color: '#F59E0B', fontSize: 12 }}>
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
      <span style={{ color: 'var(--text-muted)', marginLeft: 4, fontSize: 11 }}>{rating}</span>
    </span>
  )
}

// ─── Doctor Autocomplete ─────────────────────────────────────────
export default function DoctorAutocomplete({ value, onChange, onSelect, placeholder = 'Search doctor by name or specialty...' }) {
  const [query, setQuery]         = useState(value || '')
  const [results, setResults]     = useState([])
  const [open, setOpen]           = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const [loading, setLoading]     = useState(false)
  const wrapRef = useRef(null)

  // Simulate API search with debounce
  const doSearch = useCallback((q) => {
    if (!q.trim()) { setResults([]); setOpen(false); return }
    setLoading(true)
    // Simulate network delay like a real API
    setTimeout(() => {
      const q_lower = q.toLowerCase()
      const matched = DOCTOR_DB.filter(d =>
        d.name.toLowerCase().includes(q_lower) ||
        d.specialty.toLowerCase().includes(q_lower) ||
        d.hospital.toLowerCase().includes(q_lower)
      ).slice(0, 8)
      setResults(matched)
      setOpen(matched.length > 0)
      setLoading(false)
    }, 180)
  }, [])

  const debouncedSearch = useDebounce(doSearch, 250)

  const handleChange = (e) => {
    const v = e.target.value
    setQuery(v)
    onChange(v)
    setHighlight(-1)
    debouncedSearch(v)
  }

  const handleSelect = (doc) => {
    setQuery(doc.name)
    onChange(doc.name)
    onSelect(doc)
    setOpen(false)
  }

  // Keyboard nav — arrow up/down + Enter
  const handleKeyDown = (e) => {
    if (!open) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => Math.min(h + 1, results.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setHighlight(h => Math.max(h - 1, 0)) }
    if (e.key === 'Enter' && highlight >= 0) { handleSelect(results[highlight]) }
    if (e.key === 'Escape') setOpen(false)
  }

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Highlight match
  const highlight_text = (text, q) => {
    if (!q) return text
    const idx = text.toLowerCase().indexOf(q.toLowerCase())
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <mark style={{ background: 'rgba(34,197,94,.2)', color: 'var(--green-dark)', borderRadius: 2, padding: '0 1px' }}>
          {text.slice(idx, idx + q.length)}
        </mark>
        {text.slice(idx + q.length)}
      </>
    )
  }

  // Specialty pills for quick filter
  const quickSpecialties = ['Orthopedic', 'Physiotherapist', 'Neurologist', 'Cardiologist', 'Spine Specialist']

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%' }}>
      {/* Input */}
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }}>
          <Icon name="search" size={16} />
        </span>
        <input
          className="input"
          style={{ paddingLeft: 40, paddingRight: loading ? 36 : 12 }}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && results.length && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
        />
        {loading && (
          <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <div style={{ width: 16, height: 16, border: '2px solid var(--border)', borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          </span>
        )}
      </div>

      {/* Quick specialty pills */}
      {!open && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
          {quickSpecialties.map(sp => (
            <button key={sp} type="button"
              onClick={() => { setQuery(sp); onChange(sp); debouncedSearch(sp) }}
              style={{
                padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                background: query === sp ? 'var(--green)' : 'var(--green-pale)',
                color: query === sp ? '#fff' : 'var(--green-dark)',
                border: `1px solid ${query === sp ? 'var(--green)' : 'var(--green-100)'}`,
                cursor: 'pointer', transition: 'all .15s',
              }}>
              {sp}
            </button>
          ))}
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          zIndex: 999,
          maxHeight: 380,
          overflowY: 'auto',
          animation: 'slideUp 0.18s ease',
        }}>
          {/* Results header */}
          <div style={{ padding: '8px 14px 6px', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 0.6, borderBottom: '1px solid var(--border)', textTransform: 'uppercase' }}>
            {results.length} doctor{results.length !== 1 ? 's' : ''} found
          </div>

          {results.map((doc, i) => (
            <div key={i}
              onMouseDown={() => handleSelect(doc)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', cursor: 'pointer',
                background: highlight === i ? 'var(--green-pale)' : 'transparent',
                borderBottom: i < results.length - 1 ? '1px solid var(--border-light)' : 'none',
                transition: 'background .1s',
              }}
              onMouseEnter={() => setHighlight(i)}
              onMouseLeave={() => setHighlight(-1)}
            >
              {/* Avatar */}
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, hsl(${(i * 47) % 360},60%,55%), hsl(${(i * 47 + 40) % 360},70%,45%))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 800, color: '#fff',
              }}>
                {doc.name.split(' ').slice(1).map(n => n[0]).join('').slice(0, 2)}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 1 }}>
                  {highlight_text(doc.name, query)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--green)', fontWeight: 600 }}>{highlight_text(doc.specialty, query)}</span>
                  <span>·</span>
                  <span>{doc.hospital}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                  <Stars rating={doc.rating} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{doc.exp} exp</span>
                </div>
              </div>

              {/* Fee */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--green)' }}>{doc.fee}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>per visit</div>
              </div>
            </div>
          ))}

          {/* Footer hint */}
          <div style={{ padding: '7px 14px', fontSize: 11, color: 'var(--text-muted)', borderTop: '1px solid var(--border)', display: 'flex', gap: 12 }}>
            <span>↑↓ navigate</span><span>↵ select</span><span>Esc close</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Export the DB for reuse
export { DOCTOR_DB, SPECIALTIES }
