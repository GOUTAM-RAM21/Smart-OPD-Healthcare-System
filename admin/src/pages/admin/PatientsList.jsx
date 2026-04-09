import { useEffect, useState } from 'react'
import { useAdminContext } from '../../context/AdminContext'
import { DoctorAvatar } from '../../utils/avatarHelper'

export default function PatientsList() {
  const { patients, getAllPatients, appointments, getAllAppointments } = useAdminContext()
  const [search, setSearch]   = useState('')
  const [viewPat, setViewPat] = useState(null)

  useEffect(() => { getAllPatients(); getAllAppointments() }, [])

  const filtered = patients.filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase())
  )

  const patientApts = viewPat
    ? (appointments || []).filter(a => a.userId === viewPat._id || a.userData?.name === viewPat.name)
    : []

  return (
    <div className="page-fade">
      {viewPat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Patient History</h2>
              <button onClick={() => setViewPat(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <DoctorAvatar name={viewPat.name || 'P'} size={52} />
              <div>
                <p className="font-semibold text-gray-800">{viewPat.name}</p>
                <p className="text-sm text-gray-500">{viewPat.email}</p>
                <p className="text-xs text-gray-400">{viewPat.phone || 'No phone'}</p>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Appointment History ({viewPat.appointmentCount})</h3>
            {patientApts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No appointments found</p>
            ) : (
              <div className="space-y-2">
                {patientApts.map(a => (
                  <div key={a._id} className="flex items-center justify-between border border-gray-100 rounded-xl p-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-800">{a.docData?.name}</p>
                      <p className="text-xs text-gray-500">{a.slotDate.replace(/_/g,'/')} · {a.slotTime}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${a.isCompleted ? 'bg-green-100 text-green-600' : a.cancelled ? 'bg-red-100 text-red-500' : 'bg-amber-100 text-amber-600'}`}>
                      {a.isCompleted ? 'Completed' : a.cancelled ? 'Cancelled' : 'Booked'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
        <span className="text-sm text-gray-500">{filtered.length} patients</span>
      </div>

      <div className="relative mb-5 w-full md:w-80">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-all" />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No patients found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['#','Patient','Email','Phone','Appointments','Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p, i) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <DoctorAvatar name={p.name || 'P'} size={32} />
                        <span className="font-medium text-gray-800">{p.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.email}</td>
                    <td className="px-4 py-3 text-gray-600">{p.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">{p.appointmentCount}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setViewPat(p)}
                        className="text-xs text-primary border border-primary/30 px-3 py-1 rounded-lg hover:bg-primary/5 transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
