import React, { useState, useMemo, useCallback } from 'react'
import { useAppSelector, useAppDispatch, useDebounce } from '../hooks'
import { addApt, editApt, delApt, addAlert } from '../store/store'
import { Icon, Modal as ModalBase, EmptyState, Tag } from '../components/ui/Loader'
import { Modal } from '../components/ui/Loader'
import DoctorAutocomplete, { SPECIALTIES } from '../components/ui/DoctorAutocomplete'

const EMPTY_FORM = { doctor: '', specialty: '', date: '', time: '', status: 'confirmed', fee: '', hospital: '' }

export default function Appointments() {
  const dispatch = useAppDispatch()
  const apts     = useAppSelector(s => s.appointments.list)

  const [rawSearch, setRawSearch] = useState('')
  const [search, setSearch]       = useState('')
  const [filterStatus, setFilter] = useState('all')
  const [sort, setSort]           = useState('date')
  const [modal, setModal]         = useState(null) // null | 'add' | apt-object
  const [form, setForm]           = useState(EMPTY_FORM)
  const [formErr, setFormErr]     = useState({})

  // Debounce search so we don't refilter on every keypress
  const doSetSearch = useDebounce((v) => setSearch(v), 280)
  const handleSearchChange = (e) => {
    setRawSearch(e.target.value)
    doSetSearch(e.target.value)
  }

  // Filtered + sorted list
  const filtered = useMemo(() => {
    let list = [...apts]
    if (search)        list = list.filter(a =>
      a.doctor.toLowerCase().includes(search.toLowerCase()) ||
      a.specialty.toLowerCase().includes(search.toLowerCase()) ||
      (a.hospital || '').toLowerCase().includes(search.toLowerCase())
    )
    if (filterStatus !== 'all') list = list.filter(a => a.status === filterStatus)
    if (sort === 'date') list.sort((a, b) => new Date(a.date) - new Date(b.date))
    if (sort === 'name') list.sort((a, b) => a.doctor.localeCompare(b.doctor))
    if (sort === 'spec') list.sort((a, b) => a.specialty.localeCompare(b.specialty))
    return list
  }, [apts, search, filterStatus, sort])

  // Open add/edit modal
  const openAdd  = () => { setForm(EMPTY_FORM); setFormErr({}); setModal('add') }
  const openEdit = (a) => { setForm({ ...a }); setFormErr({}); setModal(a) }

  // Validate
  const validate = () => {
    const errs = {}
    if (!form.doctor.trim())    errs.doctor = 'Doctor name is required'
    if (!form.specialty)        errs.specialty = 'Select a specialty'
    if (!form.date)             errs.date = 'Date is required'
    if (!form.time)             errs.time = 'Time is required'
    if (new Date(form.date) < new Date(new Date().toDateString())) errs.date = 'Date cannot be in the past'
    setFormErr(errs)
    return Object.keys(errs).length === 0
  }

  // Save
  const save = () => {
    if (!validate()) return
    if (modal === 'add') {
      const newApt = { ...form, id: Date.now() }
      dispatch(addApt(newApt))
      dispatch(addAlert({ id: Date.now(), type: 'good', msg: `✅ Appointment with ${form.doctor} added for ${new Date(form.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` }))
    } else {
      dispatch(editApt({ ...form, id: modal.id }))
      dispatch(addAlert({ id: Date.now(), type: 'info', msg: `📅 Appointment with ${form.doctor} updated` }))
    }
    setModal(null)
  }

  // Doctor selected from autocomplete — auto-fill specialty, hospital, fee
  const handleDoctorSelect = useCallback((doc) => {
    setForm(f => ({ ...f, doctor: doc.name, specialty: doc.specialty, hospital: doc.hospital, fee: doc.fee }))
    setFormErr(e => ({ ...e, doctor: undefined, specialty: undefined }))
  }, [])

  const summaryStats = [
    { label: 'Total',     val: apts.length,                                    color: '#22C55E', bg: '#DCFCE7' },
    { label: 'Confirmed', val: apts.filter(a => a.status === 'confirmed').length, color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Pending',   val: apts.filter(a => a.status === 'pending').length,   color: '#F97316', bg: '#FFF7ED' },
    { label: 'This Week', val: apts.filter(a => { const d = new Date(a.date); const n = new Date(); return d >= n && d <= new Date(n.getTime() + 7*86400000) }).length, color: '#8B5CF6', bg: '#F5F3FF' },
  ]

  return (
    <div className="animate-slideUp">
      <div style={{ marginBottom: 26 }}>
        <h1>Appointments</h1>
        <p style={{ marginTop: 4 }}>Manage your medical appointments with smart doctor search</p>
      </div>

      {/* Summary stats */}
      <div className="grid-4 page-section">
        {summaryStats.map((s, i) => (
          <div key={i} className="stat-card" style={{ padding: 16 }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s.label} Appointments</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Debounced search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <Icon name="search" size={15} />
          </span>
          <input
            className="input" style={{ paddingLeft: 36 }}
            value={rawSearch} onChange={handleSearchChange}
            placeholder="Search doctor, specialty, hospital…"
          />
        </div>

        <select className="input" style={{ width: 'auto' }} value={filterStatus} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
        </select>

        <select className="input" style={{ width: 'auto' }} value={sort} onChange={e => setSort(e.target.value)}>
          <option value="date">Sort: Date</option>
          <option value="name">Sort: Doctor</option>
          <option value="spec">Sort: Specialty</option>
        </select>

        <button className="btn btn-primary" onClick={openAdd}>
          <Icon name="plus" size={15} color="#fff" /> Add Appointment
        </button>
      </div>

      {/* List */}
      <div className="card">
        {filtered.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No appointments found"
            desc={search ? `No results for "${search}"` : 'Add your first appointment to get started'}
            action={<button className="btn btn-primary" onClick={openAdd}><Icon name="plus" size={14} color="#fff" /> Add Appointment</button>}
          />
        ) : (
          filtered.map((a, i) => (
            <div key={a.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 0',
              borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
              animation: `slideUp ${0.05 + i * 0.04}s ease both`,
            }}>
              {/* Avatar */}
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: `linear-gradient(135deg, hsl(${(i * 53) % 360},55%,58%), hsl(${(i * 53 + 40) % 360},65%,48%))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: 15,
              }}>
                {a.doctor.split(' ').slice(1).map(n => n[0]).join('').slice(0, 2) || 'Dr'}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{a.doctor}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
                  {a.specialty}
                  {a.hospital && <> · <span style={{ color: 'var(--text-muted)' }}>{a.hospital}</span></>}
                </div>
                {a.fee && <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600, marginTop: 2 }}>Fee: {a.fee}</div>}
              </div>

              <div style={{ textAlign: 'center', padding: '0 12px', flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>
                  {new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{a.time}</div>
              </div>

              <span className={`tag ${a.status === 'confirmed' ? 'tag-green' : 'tag-orange'}`}>
                {a.status}
              </span>

              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(a)} title="Edit">
                  <Icon name="edit" size={13} />
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => {
                  dispatch(delApt(a.id))
                  dispatch(addAlert({ id: Date.now(), type: 'warn', msg: `🗑 Appointment with ${a.doctor} removed` }))
                }} title="Delete">
                  <Icon name="trash" size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      {modal !== null && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal" style={{ width: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2>{modal === 'add' ? '➕ Add Appointment' : '✏️ Edit Appointment'}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text-muted)', lineHeight: 1 }}>×</button>
            </div>

            {/* ── Google-style Doctor Autocomplete ── */}
            <div className="form-group">
              <label className="label">
                🔍 Search Doctor
                <span style={{ fontSize: 11, color: 'var(--green)', marginLeft: 6, fontWeight: 400 }}>— type name or specialty</span>
              </label>
              <DoctorAutocomplete
                value={form.doctor}
                onChange={(v) => setForm(f => ({ ...f, doctor: v }))}
                onSelect={handleDoctorSelect}
                placeholder="Type doctor name or specialty…"
              />
              {formErr.doctor && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>⚠ {formErr.doctor}</div>}
            </div>

            {/* Auto-filled info card */}
            {form.hospital && (
              <div style={{ background: 'var(--green-pale)', border: '1px solid var(--green-100)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text)' }}>{form.doctor}</div>
                    <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{form.specialty} · {form.hospital}</div>
                  </div>
                  {form.fee && <div style={{ fontWeight: 800, color: 'var(--green)', fontSize: 15 }}>{form.fee}</div>}
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="label">Specialty</label>
              <select
                className="input"
                value={form.specialty}
                onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))}
              >
                <option value="">Select specialty</option>
                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {formErr.specialty && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>⚠ {formErr.specialty}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="label">Date *</label>
                <input className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} min={new Date().toISOString().split('T')[0]} />
                {formErr.date && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>⚠ {formErr.date}</div>}
              </div>
              <div className="form-group">
                <label className="label">Time *</label>
                <input className="input" type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                {formErr.time && <div style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>⚠ {formErr.time}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>
                {modal === 'add' ? '✓ Add Appointment' : '✓ Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
