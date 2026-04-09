import { useEffect, useState } from 'react'
import { useAdminContext } from '../../context/AdminContext'
import { DoctorAvatar } from '../../utils/avatarHelper'

const STATUS_FILTERS = ['All','Booked','Completed','Cancelled']
const PAGE_SIZE = 10

function StatusBadge({ apt }) {
  if (apt.cancelled)   return <span className="badge bg-red-100 text-red-600">Cancelled</span>
  if (apt.isCompleted) return <span className="badge bg-green-100 text-green-600">Completed</span>
  if (apt.payment)     return <span className="badge bg-blue-100 text-blue-600">Paid</span>
  return                      <span className="badge bg-amber-100 text-amber-600">Booked</span>
}

export default function AllAppointments() {
  const { appointments, getAllAppointments, cancelAppointment } = useAdminContext()
  const [search, setSearch]   = useState('')
  const [status, setStatus]   = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [page, setPage]       = useState(1)

  useEffect(() => { getAllAppointments() }, [])

  const filtered = appointments.filter(apt => {
    const matchStatus =
      status === 'All'       ? true :
      status === 'Cancelled' ? apt.cancelled :
      status === 'Completed' ? apt.isCompleted :
      status === 'Booked'    ? !apt.cancelled && !apt.isCompleted : true
    const q = search.toLowerCase()
    const matchSearch = !q ||
      (apt.userData?.name || '').toLowerCase().includes(q) ||
      (apt.docData?.name  || '').toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="page-fade">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800">All Appointments</h1>
        <span className="text-sm text-gray-500">{filtered.length} total</span>
      </div>

      {/* Search + filter */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search patient or doctor name..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => { setStatus(f); setPage(1) }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${status === f ? 'bg-primary text-white' : 'border border-gray-200 text-gray-600 hover:border-primary/40'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {paginated.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No appointments found</p>
        ) : (
          <>
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
                  {paginated.map((apt, i) => (
                    <>
                      <tr key={apt._id} className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setExpanded(expanded === apt._id ? null : apt._id)}>
                        <td className="px-4 py-3 text-gray-500">{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <DoctorAvatar name={apt.userData?.name ?? 'P'} size={32} />
                            <span className="font-medium text-gray-800">{apt.userData?.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{apt.docData?.name}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{apt.slotDate.replace(/_/g,'/')} {apt.slotTime}</td>
                        <td className="px-4 py-3 font-semibold text-gray-800">₹{apt.amount}</td>
                        <td className="px-4 py-3"><StatusBadge apt={apt} /></td>
                        <td className="px-4 py-3">
                          {!apt.cancelled && !apt.isCompleted && (
                            <button onClick={e => { e.stopPropagation(); if (window.confirm('Cancel?')) cancelAppointment(apt._id) }}
                              className="text-xs text-red-500 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors">
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                      {expanded === apt._id && (
                        <tr key={`${apt._id}-exp`} className="bg-gray-50">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{apt.userData?.phone || '—'}</span></div>
                              <div><span className="text-gray-500">Gender:</span> <span className="font-medium">{apt.userData?.gender || '—'}</span></div>
                              <div><span className="text-gray-500">Address:</span> <span className="font-medium">{apt.userData?.address?.line1 || '—'}</span></div>
                              <div><span className="text-gray-500">Payment:</span> <span className="font-medium">{apt.payment ? 'Paid' : 'Pending'}</span></div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">Showing {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}</p>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:border-primary/40 transition-colors">
                    ← Prev
                  </button>
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:border-primary/40 transition-colors">
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
