import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useAppContext } from '../context/AppContext'
import { getInitials, getAvatarColor } from '../utils/avatarHelper'

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled']

function fmtDate(slotDate) {
  const [d, m, y] = slotDate.split('_').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

export default function MyAppointments() {
  const navigate = useNavigate()
  const { backendUrl, token } = useAppContext()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]           = useState('All')
  const [view, setView]         = useState('cards')
  const [expanded, setExpanded] = useState(null)

  const fetchApts = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } })
      if (data.success) setAppointments(data.appointments.reverse())
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { if (token) fetchApts() }, [token])

  const cancelApt = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId: id }, { headers: { token } })
      if (data.success) { toast.success('Appointment cancelled'); fetchApts() }
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
  }

  const filtered = appointments.filter(a => {
    if (tab === 'Upcoming')  return !a.isCompleted && !a.cancelled
    if (tab === 'Completed') return a.isCompleted
    if (tab === 'Cancelled') return a.cancelled
    return true
  })

  const upcoming  = appointments.filter(a => !a.isCompleted && !a.cancelled).length
  const completed = appointments.filter(a => a.isCompleted).length
  const cancelled = appointments.filter(a => a.cancelled).length

  if (!token) return (
    <div className="py-20 text-center text-slate-400">
      Please <a href="/login" className="text-indigo-600 underline">login</a> to view appointments.
    </div>
  )

  return (
    <div className="py-8 page-enter">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Health Journey</h1>
          <p className="text-slate-500 text-sm mt-1">{appointments.length} total appointments</p>
        </div>
        <div className="flex gap-2">
          {['cards', 'timeline'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background: view === v ? '#4F46E5' : '#F1F5F9', color: view === v ? 'white' : '#475569' }}>
              {v === 'cards' ? '📋 Cards' : '📅 Timeline'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Upcoming',  count: upcoming,  color: '#4F46E5', bg: '#EEF2FF' },
          { label: 'Completed', count: completed, color: '#10B981', bg: '#ECFDF5' },
          { label: 'Cancelled', count: cancelled, color: '#EF4444', bg: '#FEF2F2' },
        ].map(s => (
          <div key={s.label} className="card-flat p-4 text-center" style={{ background: s.bg, borderColor: s.color + '33' }}>
            <p className="text-2xl font-bold mono" style={{ color: s.color }}>{s.count}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-5">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-medium transition-colors relative ${tab === t ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
            {t}
            {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t" />}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="font-medium">No {tab.toLowerCase()} appointments</p>
          <button onClick={() => navigate('/doctors')} className="mt-4 btn-primary text-sm py-2 px-5">
            Book Appointment
          </button>
        </div>
      ) : view === 'cards' ? (
        <div className="space-y-3">
          {filtered.map(apt => {
            const isExpanded = expanded === apt._id
            const statusColor = apt.isCompleted ? '#10B981' : apt.cancelled ? '#EF4444' : '#4F46E5'
            return (
              <div key={apt._id} className="card overflow-hidden">
                <div className="flex" style={{ borderLeft: `4px solid ${statusColor}` }}>
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                          style={{ background: getAvatarColor(apt.docData?.name || 'D') }}>
                          {getInitials(apt.docData?.name || 'D')}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{apt.docData?.name}</p>
                          <p className="text-xs text-indigo-600">{apt.docData?.speciality}</p>
                        </div>
                      </div>
                      <span className={`badge text-xs flex-shrink-0 ${apt.isCompleted ? 'badge-success' : apt.cancelled ? 'badge-danger' : 'badge-info'}`}>
                        {apt.isCompleted ? 'Completed' : apt.cancelled ? 'Cancelled' : 'Upcoming'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
                      <span>📅 {fmtDate(apt.slotDate)}</span>
                      <span>🕐 {apt.slotTime}</span>
                      <span>💰 ₹{apt.amount}</span>
                    </div>

                    <div className="flex gap-2 mt-3 flex-wrap">
                      {!apt.isCompleted && !apt.cancelled && (
                        <>
                          <button onClick={() => toast.info('Reschedule coming soon!')}
                            className="text-xs px-3 py-1.5 rounded-full border border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors">
                            Reschedule
                          </button>
                          <button onClick={() => cancelApt(apt._id)}
                            className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                            Cancel
                          </button>
                        </>
                      )}
                      {apt.isCompleted && (
                        <>
                          <button onClick={() => window.print()}
                            className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                            Download Receipt
                          </button>
                          <button onClick={() => navigate(`/appointment/${apt.docId}`)}
                            className="text-xs px-3 py-1.5 rounded-full text-white font-medium"
                            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                            Book Follow-up
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setExpanded(isExpanded ? null : apt._id)}
                    className="px-4 text-slate-400 hover:text-slate-600 border-l border-slate-100 flex-shrink-0">
                    {isExpanded ? '▲' : '▼'}
                  </button>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-100 px-5 py-4 bg-slate-50 text-sm anim-fade-in">
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                      <div><span className="text-slate-400">Doctor:</span> {apt.docData?.name}</div>
                      <div><span className="text-slate-400">Specialty:</span> {apt.docData?.speciality}</div>
                      <div><span className="text-slate-400">Date:</span> {fmtDate(apt.slotDate)}</div>
                      <div><span className="text-slate-400">Time:</span> {apt.slotTime}</div>
                      <div><span className="text-slate-400">Fee:</span> ₹{apt.amount}</div>
                      <div><span className="text-slate-400">Payment:</span> {apt.payment ? 'Paid' : 'Pending'}</div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        /* Timeline view */
        <div className="relative pl-8">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-200" />
          {filtered.map(apt => {
            const statusColor = apt.isCompleted ? '#10B981' : apt.cancelled ? '#EF4444' : '#4F46E5'
            return (
              <div key={apt._id} className="relative mb-6">
                <div className="absolute -left-5 w-4 h-4 rounded-full border-2 border-white"
                  style={{ background: statusColor, top: 20 }} />
                <div className="text-xs text-slate-400 mb-1">{fmtDate(apt.slotDate)}</div>
                <div className="card p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ background: getAvatarColor(apt.docData?.name || 'D') }}>
                      {getInitials(apt.docData?.name || 'D')}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 text-sm">{apt.docData?.name}</p>
                      <p className="text-xs text-slate-500">{apt.slotTime} · ₹{apt.amount}</p>
                    </div>
                    <span className={`badge text-xs ${apt.isCompleted ? 'badge-success' : apt.cancelled ? 'badge-danger' : 'badge-info'}`}>
                      {apt.isCompleted ? 'Done' : apt.cancelled ? 'Cancelled' : 'Upcoming'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
