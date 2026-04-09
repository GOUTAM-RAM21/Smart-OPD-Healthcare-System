import { useEffect, useState } from 'react'
import { useAdminContext } from '../../context/AdminContext'
import { DoctorAvatar } from '../../utils/avatarHelper'

export default function DoctorsList() {
  const { doctors, getAllDoctors, changeAvailability } = useAdminContext()
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('All')
  const [viewDoc, setViewDoc] = useState(null)

  useEffect(() => { getAllDoctors() }, [])

  const filtered = doctors.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.speciality.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' ? true : filter === 'Available' ? d.available : !d.available
    return matchSearch && matchFilter
  })

  return (
    <div className="page-fade">
      {/* View modal */}
      {viewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Doctor Profile</h2>
              <button onClick={() => setViewDoc(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="flex flex-col items-center mb-4">
              <DoctorAvatar name={viewDoc.name} size={80} />
              <h3 className="font-bold text-gray-800 mt-2">{viewDoc.name}</h3>
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full mt-1">{viewDoc.speciality}</span>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ['Degree', viewDoc.degree],
                ['Experience', viewDoc.experience],
                ['Fees', `₹${viewDoc.fees}`],
                ['Email', viewDoc.email],
                ['Address', viewDoc.address?.line1 || '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-gray-800">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{viewDoc.about}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800">All Doctors</h1>
        <span className="text-sm text-gray-500">{filtered.length} doctors</span>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or specialty..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-all" />
        </div>
        <div className="flex gap-2">
          {['All','Available','Unavailable'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f ? 'bg-primary text-white' : 'border border-gray-200 text-gray-600 hover:border-primary/40'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(doc => (
          <div key={doc._id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all">
            <div className="flex flex-col items-center mb-4">
              <DoctorAvatar name={doc.name} size={72} />
              <h3 className="font-semibold text-gray-800 text-center mt-2">{doc.name}</h3>
              <p className="text-primary text-sm text-center">{doc.speciality}</p>
              <p className="text-gray-400 text-xs text-center">{doc.degree}</p>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm mb-3">
              <div className="flex justify-between text-gray-600">
                <span>Experience</span><span className="font-medium">{doc.experience}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Fees</span><span className="font-semibold text-gray-800">₹{doc.fees}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Patients</span><span className="font-medium">45</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Rating</span><span className="font-medium text-amber-500">★ 4.8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Available</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={doc.available} onChange={() => changeAvailability(doc._id)} className="sr-only peer" />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                </label>
              </div>
            </div>

            <button onClick={() => setViewDoc(doc)}
              className="w-full py-2 rounded-xl text-sm font-medium border border-primary text-primary hover:bg-primary hover:text-white transition-all">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
