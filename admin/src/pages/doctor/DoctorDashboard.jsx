import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDoctorContext } from '../../context/DoctorContext'
import { DoctorAvatar } from '../../utils/avatarHelper'

function getShift() {
  const h = new Date().getHours()
  if (h >= 6 && h < 14)  return { label: 'Morning Shift', cls: 'bg-blue-100 text-blue-700' }
  if (h >= 14 && h < 22) return { label: 'Evening Shift', cls: 'bg-amber-100 text-amber-700' }
  return                         { label: 'Night Shift',   cls: 'bg-indigo-100 text-indigo-700' }
}

function useClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return time
}

function formatTime(d) {
  let h = d.getHours(), m = d.getMinutes(), ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`
}

function formatDate(d) {
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function isToday(slotDate) {
  const today = new Date()
  const [d, m, y] = slotDate.split('_').map(Number)
  return d === today.getDate() && m === today.getMonth() + 1 && y === today.getFullYear()
}

function StatCard({ label, value, sub, color, dot, onClick }) {
  return (
    <div onClick={onClick}
      className={`bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all ${onClick ? 'cursor-pointer' : ''}`}>
      <div className="flex items-center justify-between mb-1">
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        {dot && <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />}
      </div>
      <p className="text-xs text-gray-500">{sub}</p>
      <p className="text-sm font-medium text-gray-700 mt-1">{label}</p>
    </div>
  )
}

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function DoctorDashboard() {
  const navigate = useNavigate()
  const { dashData, getDashData, appointments, getAppointments, profileData, getProfile } = useDoctorContext()
  const now   = useClock()
  const shift = getShift()

  useEffect(() => { getDashData(); getAppointments(); getProfile() }, [])

  const todayApts = (appointments || []).filter(a => isToday(a.slotDate))
  const todayDone = todayApts.filter(a => a.isCompleted).length
  const pending   = (appointments || []).filter(a => !a.isCompleted && !a.cancelled).length
  const earnings  = dashData?.earnings ?? 0

  // weekly counts (last 7 days Mon-Sun of current week)
  const weekCounts = WEEK_DAYS.map((_, i) => {
    const d = new Date()
    const day = d.getDay() || 7
    const diff = i + 1 - day
    const target = new Date(d)
    target.setDate(d.getDate() + diff)
    return (appointments || []).filter(a => {
      const [dd, mm, yy] = a.slotDate.split('_').map(Number)
      return dd === target.getDate() && mm === target.getMonth() + 1 && yy === target.getFullYear()
    }).length
  })
  const maxCount = Math.max(...weekCounts, 1)

  const todayIdx = (new Date().getDay() + 6) % 7 // Mon=0

  return (
    <div className="page-fade">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <DoctorAvatar name={profileData?.name ?? 'Doctor'} size={52} />
          <div>
            <h1 className="text-xl font-bold text-gray-800">{profileData?.name ?? 'Doctor'}</h1>
            <p className="text-sm text-gray-500">{profileData?.speciality ?? ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${shift.cls}`}>{shift.label}</span>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-800 font-mono">{formatTime(now)}</p>
            <p className="text-xs text-gray-500">{formatDate(now)}</p>
          </div>
        </div>
      </div>

      {/* Alert banner */}
      {todayApts.length > 0 && todayDone === 0 && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm text-red-700 font-medium">You have {todayApts.length} appointment{todayApts.length > 1 ? 's' : ''} today</span>
          </div>
          <button onClick={() => navigate('/doctor-appointments')}
            className="text-sm text-red-600 font-semibold hover:underline">View Now →</button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Today's Patients" value={todayApts.length} sub="patients waiting"
          color="text-primary" dot={todayApts.length > 0} onClick={() => navigate('/doctor-appointments')} />
        <StatCard label="Total Earnings" value={`₹${earnings}`} sub="all time earnings"
          color="text-green-600" />
        <StatCard label="Pending Reports" value={pending} sub="awaiting review"
          color={pending > 0 ? 'text-amber-600' : 'text-gray-700'} />
        <StatCard label="Completed Today" value={todayDone} sub="consultations done"
          color="text-green-600" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: '📝', label: 'New Prescription' },
          { icon: '📋', label: 'View Queue' },
          { icon: '👤', label: 'Patient Records' },
          { icon: '💊', label: 'Prescriptions' },
        ].map(a => (
          <button key={a.label} onClick={() => navigate('/doctor-appointments')}
            className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl px-4 py-3 text-sm font-medium transition-all">
            <span>{a.icon}</span>{a.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's schedule */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Today's Patient Queue</h2>
          </div>
          {todayApts.length === 0 ? (
            <div className="text-center py-14 text-gray-400">
              <div className="text-4xl mb-3">📅</div>
              <p className="text-sm">No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {todayApts.map(apt => (
                <div key={apt._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <span className="text-primary font-mono font-bold text-sm w-20 flex-shrink-0">{apt.slotTime}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">{apt.userData?.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">OPD</span>
                      <span className="text-xs text-gray-500">₹{apt.amount}</span>
                    </div>
                  </div>
                  {apt.cancelled ? (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full line-through">Cancelled</span>
                  ) : apt.isCompleted ? (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full flex items-center gap-1">✓ Done</span>
                  ) : (
                    <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full">Pending</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weekly chart */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-semibold text-gray-800 mb-4">This Week's Activity</h2>
          <div className="space-y-2">
            {WEEK_DAYS.map((day, i) => (
              <div key={day} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-8">{day}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${i === todayIdx ? 'bg-primary' : 'bg-primary/30'}`}
                    style={{ width: `${(weekCounts[i] / maxCount) * 100}%`, minWidth: weekCounts[i] > 0 ? '8px' : '0' }} />
                </div>
                <span className="text-xs font-medium text-gray-600 w-4 text-right">{weekCounts[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
