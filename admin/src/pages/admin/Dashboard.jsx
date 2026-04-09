import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAdminContext } from '../../context/AdminContext'
import { DoctorAvatar } from '../../utils/avatarHelper'

const WEEK_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

function StatusBadge({ apt }) {
  if (apt.cancelled)   return <span className="badge bg-red-100 text-red-600">Cancelled</span>
  if (apt.isCompleted) return <span className="badge bg-green-100 text-green-600">Completed</span>
  if (apt.payment)     return <span className="badge bg-blue-100 text-blue-600">Paid</span>
  return                      <span className="badge bg-amber-100 text-amber-600">Booked</span>
}

function Sparkline({ color }) {
  const heights = [30, 45, 35, 60, 50, 70, 55]
  return (
    <div className="flex items-end gap-0.5 h-8">
      {heights.map((h, i) => (
        <div key={i} className={`w-1.5 rounded-sm ${color}`} style={{ height: `${h}%` }} />
      ))}
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

function formatDate() {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { dashData, getDashData, appointments, getAllAppointments, cancelAppointment } = useAdminContext()

  useEffect(() => { getDashData(); getAllAppointments() }, [])

  const today = new Date()
  const todayStr = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`
  const todayApts = (appointments || []).filter(a => a.slotDate === todayStr)
  const todayRevenue = todayApts.filter(a => a.isCompleted).reduce((s, a) => s + (a.amount || 0), 0)
  const todayPending = todayApts.filter(a => !a.isCompleted && !a.cancelled).length

  // Weekly counts
  const weekCounts = WEEK_DAYS.map((_, i) => {
    const d = new Date()
    const dayOfWeek = d.getDay() || 7
    const diff = i + 1 - dayOfWeek
    const target = new Date(d)
    target.setDate(d.getDate() + diff)
    return (appointments || []).filter(a => {
      const [dd, mm, yy] = a.slotDate.split('_').map(Number)
      return dd === target.getDate() && mm === target.getMonth() + 1 && yy === target.getFullYear()
    }).length
  })
  const maxCount = Math.max(...weekCounts, 1)

  // Donut data
  const booked    = (appointments || []).filter(a => !a.cancelled && !a.isCompleted).length
  const completed = (appointments || []).filter(a => a.isCompleted).length
  const cancelled = (appointments || []).filter(a => a.cancelled).length
  const total     = booked + completed + cancelled || 1
  const bookedPct    = Math.round((booked / total) * 100)
  const completedPct = Math.round((completed / total) * 100)

  const exportCSV = () => {
    const rows = [['Patient','Doctor','Date','Time','Fee','Status']]
    ;(appointments || []).forEach(a => {
      rows.push([a.userData?.name, a.docData?.name, a.slotDate.replace(/_/g,'/'), a.slotTime, a.amount,
        a.cancelled ? 'Cancelled' : a.isCompleted ? 'Completed' : 'Booked'])
    })
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a'); a.href = url; a.download = 'appointments.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page-fade">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{getGreeting()}, Admin! 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">{formatDate()}</p>
        </div>
        <button onClick={exportCSV}
          className="border border-gray-200 text-gray-600 px-5 py-2 rounded-xl text-sm font-medium hover:border-primary hover:text-primary transition-colors flex items-center gap-2">
          📤 Export Report
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Doctors',    value: dashData?.doctors ?? '—',      sub: '+2 this month',   color: 'text-blue-600',   sparkColor: 'bg-blue-200' },
          { label: 'Total Patients',   value: dashData?.patients ?? '—',     sub: '+12 this week',   color: 'text-green-600',  sparkColor: 'bg-green-200' },
          { label: 'Appointments Today', value: todayApts.length,            sub: `${todayPending} pending`, color: 'text-amber-600', sparkColor: 'bg-amber-200' },
          { label: 'Revenue Today',    value: `₹${todayRevenue}`,            sub: 'from completed',  color: 'text-purple-600', sparkColor: 'bg-purple-200' },
        ].map(c => (
          <div key={c.label} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
                <p className="text-xs text-green-600 font-medium mt-0.5">{c.sub}</p>
              </div>
              <Sparkline color={c.sparkColor} />
            </div>
            <p className="text-sm text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Bar chart */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Weekly Appointments</h3>
          <div className="flex items-end gap-2 h-32">
            {WEEK_DAYS.map((day, i) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">{weekCounts[i] || ''}</span>
                <div className="w-full rounded-t-lg transition-all duration-500"
                  style={{ height: `${(weekCounts[i] / maxCount) * 80}px`, minHeight: weekCounts[i] > 0 ? '4px' : '0',
                    background: i === (new Date().getDay() + 6) % 7 ? '#5f6FFF' : '#c7d2fe' }} />
                <span className="text-[10px] text-gray-400">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut chart */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Status Distribution</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 flex-shrink-0">
              <div className="w-28 h-28 rounded-full"
                style={{ background: `conic-gradient(#5f6FFF 0% ${bookedPct}%, #10b981 ${bookedPct}% ${bookedPct + completedPct}%, #ef4444 ${bookedPct + completedPct}% 100%)` }} />
              <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-gray-800">{total}</span>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Booked',    count: booked,    color: 'bg-primary' },
                { label: 'Completed', count: completed, color: 'bg-green-500' },
                { label: 'Cancelled', count: cancelled, color: 'bg-red-500' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2 text-sm">
                  <span className={`w-3 h-3 rounded-full ${s.color}`} />
                  <span className="text-gray-600">{s.label}</span>
                  <span className="font-semibold text-gray-800 ml-auto">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent appointments */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Recent Bookings</h3>
          <button onClick={() => navigate('/all-appointments')} className="text-sm text-primary hover:underline">View All →</button>
        </div>
        {!dashData?.latest?.length ? (
          <p className="text-center text-gray-400 py-12">No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['#','Patient','Doctor','Date & Time','Fee','Status','Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dashData.latest.map((apt, i) => (
                  <tr key={apt._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <DoctorAvatar name={apt.userData?.name ?? 'P'} size={32} />
                        <div>
                          <p className="font-medium text-gray-800">{apt.userData?.name}</p>
                          <p className="text-xs text-gray-400">{apt.userData?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700">{apt.docData?.name}</p>
                      <p className="text-xs text-gray-400">{apt.docData?.speciality}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{apt.slotDate.replace(/_/g,'/')} {apt.slotTime}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">₹{apt.amount}</td>
                    <td className="px-4 py-3"><StatusBadge apt={apt} /></td>
                    <td className="px-4 py-3">
                      {!apt.cancelled && !apt.isCompleted && (
                        <button onClick={() => cancelAppointment(apt._id)}
                          className="text-xs text-red-500 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors">
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: '➕', label: 'Add Doctor',        action: () => navigate('/add-doctor') },
          { icon: '👥', label: 'View Patients',     action: () => navigate('/patients-list') },
          { icon: '📤', label: 'Export CSV',        action: exportCSV },
          { icon: '🔔', label: 'Send Notification', action: () => toast.info('Notifications coming soon!') },
        ].map(a => (
          <button key={a.label} onClick={a.action}
            className="bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl p-4 text-sm font-medium transition-all flex items-center gap-2">
            <span>{a.icon}</span>{a.label}
          </button>
        ))}
      </div>
    </div>
  )
}
