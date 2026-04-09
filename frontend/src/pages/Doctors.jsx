import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { getInitials, getAvatarColor } from '../utils/avatarHelper'

const SPECIALITIES = ['All', 'General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist']

export default function Doctors() {
  const navigate = useNavigate()
  const { speciality } = useParams()
  const { doctors } = useAppContext()

  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState(speciality || 'All')
  const [sort, setSort]       = useState('relevance')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (speciality) setFilter(speciality)
  }, [speciality])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const filtered = doctors
    .filter(d => {
      const matchSpec = filter === 'All' || d.speciality?.toLowerCase() === filter.toLowerCase()
      const matchSearch = !search || d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.speciality?.toLowerCase().includes(search.toLowerCase())
      return matchSpec && matchSearch
    })
    .sort((a, b) => {
      if (sort === 'fee-asc') return (a.fees || 0) - (b.fees || 0)
      if (sort === 'fee-desc') return (b.fees || 0) - (a.fees || 0)
      return 0
    })

  return (
    <div className="py-8 page-enter">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Find Your Doctor</h1>
        <p className="text-slate-500 text-sm mt-1">Browse 500+ verified specialists</p>
      </div>

      {/* Filter bar */}
      <div className="card-flat p-5 mb-6">
        {/* Search */}
        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, specialty..."
            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
        </div>

        {/* Specialty pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {SPECIALITIES.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: filter === s ? '#4F46E5' : '#F1F5F9',
                color: filter === s ? 'white' : '#475569',
              }}>
              {s}
            </button>
          ))}
        </div>

        {/* Sort + count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-800">{filtered.length}</span> doctors
          </p>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 bg-white">
            <option value="relevance">Relevance</option>
            <option value="fee-asc">Fee: Low → High</option>
            <option value="fee-desc">Fee: High → Low</option>
          </select>
        </div>
      </div>

      {/* Doctor cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton h-2 w-full" />
              <div className="p-5 flex gap-4">
                <div className="skeleton w-16 h-16 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                  <div className="skeleton h-3 w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg font-medium">No doctors found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
          <button onClick={() => { setSearch(''); setFilter('All') }}
            className="mt-4 btn-primary text-sm py-2 px-5">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(doc => (
            <div key={doc._id} className="card overflow-hidden">
              {/* Top color bar */}
              <div className="h-1 w-full" style={{ background: doc.available ? '#10B981' : '#CBD5E1' }} />
              <div className="p-5 flex items-start gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                  style={{ background: getAvatarColor(doc.name) }}>
                  {getInitials(doc.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-base truncate">{doc.name}</p>
                  <p className="text-indigo-600 text-sm">{doc.speciality}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">🎓 {doc.degree}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">📅 {doc.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                    <span className="text-amber-500">★4.8</span>
                    <span>120+ reviews</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={`w-2 h-2 rounded-full ${doc.available ? 'bg-green-500' : 'bg-slate-400'}`} />
                    <span className="text-xs text-slate-500">{doc.available ? 'Available today' : 'Next available tomorrow'}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                    <span className="font-bold text-indigo-600">₹{doc.fees}</span>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/appointment/${doc._id}`)}
                        className="text-xs px-3 py-1.5 rounded-full border border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors font-medium">
                        View
                      </button>
                      <button onClick={() => navigate(`/appointment/${doc._id}`)}
                        className="text-xs px-3 py-1.5 rounded-full text-white font-medium"
                        style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
