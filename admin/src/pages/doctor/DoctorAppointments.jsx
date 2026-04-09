import { useEffect, useState, useRef } from 'react'
import { useDoctorContext } from '../../context/DoctorContext'
import { DoctorAvatar } from '../../utils/avatarHelper'

const FILTERS = ['All', 'Today', 'Pending', 'Completed', 'Cancelled']

function isToday(slotDate) {
  const today = new Date()
  const [d, m, y] = slotDate.split('_').map(Number)
  return d === today.getDate() && m === today.getMonth() + 1 && y === today.getFullYear()
}

function StatusBadge({ apt }) {
  if (apt.cancelled)   return <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">Cancelled</span>
  if (apt.isCompleted) return <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">Completed</span>
  return                      <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full font-medium">Pending</span>
}

function formatSlotDate(slotDate) {
  const [d, m, y] = slotDate.split('_').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

const FREQ_OPTIONS = ['Once daily', 'Twice daily', 'Thrice daily', 'Every 8 hours', 'Every 12 hours', 'As needed']
const DUR_OPTIONS  = ['3 days', '5 days', '7 days', '10 days', '14 days', '30 days', 'Ongoing']

function PrescriptionModal({ apt, doctorName, onClose }) {
  const [rows, setRows] = useState([{ medicine: '', dosage: '', frequency: 'Once daily', duration: '7 days', notes: '' }])
  const [diagnosis, setDiagnosis] = useState('')
  const [advice, setAdvice]       = useState('')
  const [followUp, setFollowUp]   = useState('')
  const printRef = useRef()

  const addRow = () => setRows(r => [...r, { medicine: '', dosage: '', frequency: 'Once daily', duration: '7 days', notes: '' }])
  const delRow = (i) => setRows(r => r.filter((_, idx) => idx !== i))
  const updateRow = (i, field, val) => setRows(r => r.map((row, idx) => idx === i ? { ...row, [field]: val } : row))

  const handlePrint = () => {
    const content = printRef.current.innerHTML
    const win = window.open('', '_blank')
    win.document.write(`
      <html><head><title>Prescription</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
        h1 { color: #5f6FFF; margin: 0; } h3 { margin: 0; color: #555; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th { background: #f1f5f9; padding: 8px; text-align: left; font-size: 13px; }
        td { padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #5f6FFF; padding-bottom: 12px; margin-bottom: 16px; }
        .footer { margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 12px; color: #888; }
        .sig { margin-top: 40px; border-top: 1px solid #333; width: 200px; text-align: center; font-size: 12px; }
      </style></head><body>${content}</body></html>
    `)
    win.document.close()
    win.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-800">Write Prescription</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Print-ready content */}
          <div ref={printRef} style={{ display: 'none' }}>
            <div className="header">
              <div><h1>Prescripto</h1><h3>Dr. {doctorName}</h3></div>
              <div style={{ textAlign: 'right', fontSize: 13 }}>
                <p>Date: {new Date().toLocaleDateString('en-IN')}</p>
                <p>Patient: {apt.userData?.name}</p>
              </div>
            </div>
            <p><strong>Diagnosis:</strong> {diagnosis}</p>
            <table>
              <thead><tr><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Notes</th></tr></thead>
              <tbody>{rows.map((r, i) => <tr key={i}><td>{r.medicine}</td><td>{r.dosage}</td><td>{r.frequency}</td><td>{r.duration}</td><td>{r.notes}</td></tr>)}</tbody>
            </table>
            {advice && <p><strong>Advice:</strong> {advice}</p>}
            {followUp && <p><strong>Follow-up:</strong> {followUp}</p>}
            <div className="sig">Dr. {doctorName}<br />Signature</div>
            <div className="footer">Valid for 30 days · Prescripto Healthcare Platform</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Patient</label>
              <input readOnly value={apt.userData?.name ?? ''} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Doctor</label>
              <input readOnly value={doctorName} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Diagnosis</label>
            <textarea value={diagnosis} onChange={e => setDiagnosis(e.target.value)} rows={2}
              placeholder="Enter diagnosis..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" />
          </div>

          {/* Medications */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-500">Medications</label>
              <button onClick={addRow} className="text-xs text-primary hover:underline font-medium">+ Add Medicine</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    {['Medicine', 'Dosage', 'Frequency', 'Duration', 'Notes', ''].map(h => (
                      <th key={h} className="text-left px-2 py-2 font-medium text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-1 py-1"><input value={row.medicine} onChange={e => updateRow(i, 'medicine', e.target.value)} placeholder="Medicine name" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-primary" /></td>
                      <td className="px-1 py-1"><input value={row.dosage} onChange={e => updateRow(i, 'dosage', e.target.value)} placeholder="e.g. 500mg" className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-primary" /></td>
                      <td className="px-1 py-1">
                        <select value={row.frequency} onChange={e => updateRow(i, 'frequency', e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-primary bg-white">
                          {FREQ_OPTIONS.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      <td className="px-1 py-1">
                        <select value={row.duration} onChange={e => updateRow(i, 'duration', e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-primary bg-white">
                          {DUR_OPTIONS.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </td>
                      <td className="px-1 py-1"><input value={row.notes} onChange={e => updateRow(i, 'notes', e.target.value)} placeholder="Notes" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-primary" /></td>
                      <td className="px-1 py-1"><button onClick={() => delRow(i)} className="text-red-400 hover:text-red-600 px-1">✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Lifestyle & Diet Advice</label>
            <textarea value={advice} onChange={e => setAdvice(e.target.value)} rows={2}
              placeholder="Lifestyle & diet advice..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Follow-up Date</label>
            <input type="date" value={followUp} onChange={e => setFollowUp(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handlePrint}
              className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
              🖨️ Print Prescription
            </button>
            <button onClick={onClose}
              className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-full text-sm hover:border-gray-400 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DoctorAppointments() {
  const { appointments, getAppointments, completeAppointment, cancelAppointment, profileData, getProfile } = useDoctorContext()
  const [filter, setFilter]       = useState('All')
  const [search, setSearch]       = useState('')
  const [expanded, setExpanded]   = useState(null)
  const [rxApt, setRxApt]         = useState(null)
  const [notes, setNotes]         = useState({})

  useEffect(() => { getAppointments(); getProfile() }, [])

  const filtered = appointments.filter(apt => {
    const matchFilter =
      filter === 'All'       ? true :
      filter === 'Today'     ? isToday(apt.slotDate) :
      filter === 'Cancelled' ? apt.cancelled :
      filter === 'Completed' ? apt.isCompleted :
      filter === 'Pending'   ? !apt.cancelled && !apt.isCompleted : true
    const matchSearch = !search || (apt.userData?.name ?? '').toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const total     = appointments.length
  const completed = appointments.filter(a => a.isCompleted).length
  const pending   = appointments.filter(a => !a.isCompleted && !a.cancelled).length

  const saveNote = (id, val) => {
    const updated = { ...notes, [id]: val }
    setNotes(updated)
    localStorage.setItem('prescripto-notes', JSON.stringify(updated))
  }

  useEffect(() => {
    try { setNotes(JSON.parse(localStorage.getItem('prescripto-notes') || '{}')) } catch {}
  }, [])

  return (
    <div className="page-fade">
      {rxApt && <PrescriptionModal apt={rxApt} doctorName={profileData?.name ?? 'Doctor'} onClose={() => setRxApt(null)} />}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
      </div>

      {/* Stats pills */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <span className="text-sm bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full font-medium">Total: {total}</span>
        <span className="text-sm bg-green-100 text-green-700 px-4 py-1.5 rounded-full font-medium">Completed: {completed}</span>
        <span className="text-sm bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full font-medium">Pending: {pending}</span>
      </div>

      {/* Search */}
      <div className="relative mb-4 w-full md:w-80">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search patient name..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all
              ${filter === f ? 'bg-primary text-white' : 'border border-gray-200 text-gray-600 hover:border-primary/40'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p>No appointments found</p>
          </div>
        ) : filtered.map(apt => {
          const isExpanded = expanded === apt._id
          return (
            <div key={apt._id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-sm transition-all">
              {/* Main row */}
              <div className="flex items-center gap-4 p-5 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : apt._id)}>
                <DoctorAvatar name={apt.userData?.name ?? 'P'} size={48} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{apt.userData?.name}</p>
                  <p className="text-sm text-gray-500">{formatSlotDate(apt.slotDate)} · {apt.slotTime}</p>
                  <p className="text-sm text-gray-600 mt-0.5">Fee: <span className="font-medium">₹{apt.amount}</span></p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge apt={apt} />
                  {!apt.cancelled && !apt.isCompleted && (
                    <div className="flex gap-2">
                      <button onClick={e => { e.stopPropagation(); completeAppointment(apt._id) }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-xl text-xs font-medium hover:bg-green-200 transition-colors">
                        ✓ Complete
                      </button>
                      <button onClick={e => { e.stopPropagation(); if (window.confirm('Cancel?')) cancelAppointment(apt._id) }}
                        className="flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-500 rounded-xl text-xs font-medium hover:bg-red-50 transition-colors">
                        ✕ Cancel
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-gray-400 text-sm ml-1">{isExpanded ? '▲' : '▼'}</span>
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{apt.userData?.phone || '—'}</span></div>
                    <div><span className="text-gray-500">Gender:</span> <span className="font-medium">{apt.userData?.gender || '—'}</span></div>
                    <div><span className="text-gray-500">DOB:</span> <span className="font-medium">{apt.userData?.dob || '—'}</span></div>
                    <div><span className="text-gray-500">Address:</span> <span className="font-medium">{apt.userData?.address?.line1 || '—'}</span></div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">Clinical Notes</label>
                    <textarea value={notes[apt._id] ?? ''} onChange={e => saveNote(apt._id, e.target.value)}
                      rows={2} placeholder="Add clinical notes..."
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none bg-white" />
                  </div>
                  <button onClick={() => setRxApt(apt)}
                    className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                    📝 Write Prescription
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
