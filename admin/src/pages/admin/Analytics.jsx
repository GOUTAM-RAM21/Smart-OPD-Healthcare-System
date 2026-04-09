import { useEffect } from 'react'
import { useAdminContext } from '../../context/AdminContext'
import { DoctorAvatar } from '../../utils/avatarHelper'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun']
const MOCK_REVENUE = [42000, 58000, 51000, 67000, 73000, 89000]
const MAX_REV = Math.max(...MOCK_REVENUE)

export default function Analytics() {
  const { appointments, getAllAppointments, doctors, getAllDoctors } = useAdminContext()

  useEffect(() => { getAllAppointments(); getAllDoctors() }, [])

  const completed = (appointments || []).filter(a => a.isCompleted).length
  const total     = (appointments || []).length || 1
  const completionRate = Math.round((completed / total) * 100)

  const doctorStats = (doctors || []).map(d => ({
    name: d.name,
    specialty: d.speciality,
    patients: (appointments || []).filter(a => a.docId === d._id).length,
    revenue: (appointments || []).filter(a => a.docId === d._id && a.isCompleted).reduce((s, a) => s + (a.amount || 0), 0),
  })).sort((a, b) => b.patients - a.patients).slice(0, 5)

  const recentActivity = (appointments || []).slice(0, 8).map(a => ({
    text: a.isCompleted
      ? `Dr. ${a.docData?.name?.split(' ')[1] || a.docData?.name} completed appointment with ${a.userData?.name}`
      : a.cancelled
        ? `Appointment cancelled by ${a.userData?.name}`
        : `New appointment booked: ${a.userData?.name} with Dr. ${a.docData?.name?.split(' ')[1] || a.docData?.name}`,
    color: a.isCompleted ? 'bg-green-500' : a.cancelled ? 'bg-red-500' : 'bg-primary',
    time: 'Recently',
  }))

  return (
    <div className="page-fade">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Platform Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview of platform performance</p>
        </div>
        <button onClick={() => window.print()}
          className="border border-gray-200 text-gray-600 px-5 py-2 rounded-xl text-sm font-medium hover:border-primary hover:text-primary transition-colors">
          📤 Export
        </button>
      </div>

      {/* Performance metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Avg Consultation',  value: '28 min',  trend: '↑', color: 'text-blue-600' },
          { label: 'Patient Satisfaction', value: '4.8/5', trend: '↑', color: 'text-green-600' },
          { label: 'Completion Rate',   value: `${completionRate}%`, trend: '↑', color: 'text-primary' },
          { label: 'Revenue Growth',    value: '+23%',    trend: '↑', color: 'text-purple-600' },
        ].map(m => (
          <div key={m.label} className="stat-card">
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-xs text-green-600 font-medium mt-0.5">{m.trend} This month</p>
            <p className="text-sm text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Monthly revenue */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Monthly Revenue (₹)</h3>
          <div className="flex items-end gap-3 h-32">
            {MONTHS.map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-500">{(MOCK_REVENUE[i]/1000).toFixed(0)}k</span>
                <div className="w-full rounded-t-lg" style={{ height: `${(MOCK_REVENUE[i] / MAX_REV) * 80}px`, background: i === 5 ? '#5f6FFF' : '#c7d2fe' }} />
                <span className="text-[10px] text-gray-400">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor performance */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Doctor Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-xs text-gray-500 font-medium">Doctor</th>
                  <th className="text-right py-2 text-xs text-gray-500 font-medium">Patients</th>
                  <th className="text-right py-2 text-xs text-gray-500 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {doctorStats.map((d, i) => (
                  <tr key={i}>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <DoctorAvatar name={d.name} size={28} />
                        <div>
                          <p className="font-medium text-gray-800 text-xs">{d.name}</p>
                          <p className="text-[10px] text-gray-400">{d.specialty}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 text-right font-semibold text-gray-700">{d.patients}</td>
                    <td className="py-2 text-right font-semibold text-primary">₹{d.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No recent activity</p>
          ) : recentActivity.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.color}`} />
              <div className="flex-1">
                <p className="text-sm text-gray-700">{a.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
