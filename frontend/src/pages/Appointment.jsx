import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useAppContext } from '../context/AppContext'
import { getInitials, getAvatarColor } from '../utils/avatarHelper'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function genSlots() {
  const morning = ['9:00am','9:30am','10:00am','10:30am','11:00am','11:30am']
  const afternoon = ['12:00pm','12:30pm','1:00pm','1:30pm','2:00pm','2:30pm','3:00pm','3:30pm','4:00pm','4:30pm','5:00pm']
  return { morning, afternoon }
}

export default function Appointment() {
  const { docId } = useParams()
  const navigate  = useNavigate()
  const { doctors, token, backendUrl, getDoctorsData } = useAppContext()

  const [doc, setDoc]           = useState(null)
  const [dates, setDates]       = useState([])
  const [selDate, setSelDate]   = useState(null)
  const [selSlot, setSelSlot]   = useState(null)
  const [type, setType]         = useState('in-clinic')
  const [loading, setLoading]   = useState(false)
  const [expanded, setExpanded] = useState(false)
  const slots = genSlots()

  useEffect(() => {
    const found = doctors.find(d => d._id === docId)
    setDoc(found || null)
  }, [doctors, docId])

  useEffect(() => {
    const today = new Date()
    const arr = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      arr.push(d)
    }
    setDates(arr)
    setSelDate(arr[0])
  }, [])

  const isBooked = (slot) => {
    if (!doc || !selDate) return false
    const key = `${selDate.getDate()}_${selDate.getMonth() + 1}_${selDate.getFullYear()}`
    return (doc.slots_booked?.[key] || []).includes(slot)
  }

  const handleBook = async () => {
    if (!token) { toast.info('Please login to book'); return navigate('/login') }
    if (!selSlot) return toast.warning('Please select a time slot')
    setLoading(true)
    try {
      const slotDate = `${selDate.getDate()}_${selDate.getMonth() + 1}_${selDate.getFullYear()}`
      const { data } = await axios.post(`${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime: selSlot },
        { headers: { token } }
      )
      if (data.success) {
        toast.success('Appointment booked successfully!')
        getDoctorsData()
        navigate('/my-appointments')
      } else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  if (!doc) return (
    <div className="py-8">
      <div className="card p-8 animate-pulse">
        <div className="flex gap-6">
          <div className="skeleton w-24 h-24 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="skeleton h-6 w-1/3" />
            <div className="skeleton h-4 w-1/4" />
            <div className="skeleton h-4 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="py-8 page-enter">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <button onClick={() => navigate('/')} className="hover:text-indigo-600">Home</button>
        <span>›</span>
        <button onClick={() => navigate('/doctors')} className="hover:text-indigo-600">Doctors</button>
        <span>›</span>
        <span className="text-slate-800 font-medium">{doc.name}</span>
      </div>

      {/* Doctor card */}
      <div className="card p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold"
              style={{ background: getAvatarColor(doc.name) }}>
              {getInitials(doc.name)}
            </div>
            <div className={`badge text-xs ${doc.available ? 'badge-success' : 'badge-gray'}`}>
              {doc.available ? '● Available' : '○ Offline'}
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
            </div>
            <p className="text-xs text-slate-400">4.8 · 120 reviews</p>
          </div>

          <div className="flex-1">
            <div className="flex items-start gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-800">{doc.name}</h1>
              <span className="badge badge-info text-xs">✓ Verified</span>
            </div>
            <p className="text-indigo-600 font-medium mt-1">{doc.speciality}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              {[
                { icon: '🎓', text: doc.degree },
                { icon: '📅', text: doc.experience },
                { icon: '💬', text: 'English, Hindi' },
                { icon: '📍', text: 'Bangalore' },
              ].map(p => (
                <span key={p.text} className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
                  {p.icon} {p.text}
                </span>
              ))}
            </div>

            <div className="mt-4">
              <button onClick={() => setExpanded(v => !v)}
                className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                <span className={`line-clamp-${expanded ? 'none' : '2'}`}>{doc.about}</span>
                <span className="text-indigo-600 font-medium ml-1">{expanded ? 'Show less' : 'Read more'}</span>
              </button>
            </div>

            <div className="inline-flex flex-col mt-4 rounded-xl p-4" style={{ background: '#EEF2FF' }}>
              <p className="text-xs text-slate-500 font-medium">Consultation Fee</p>
              <p className="text-2xl font-bold text-indigo-600 mono">₹{doc.fees}</p>
              <p className="text-xs text-green-600 font-medium mt-0.5">● Next slot: Today 3:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking card */}
      <div className="card p-6 mb-6">
        <h2 className="font-bold text-slate-800 text-lg mb-5">Select Appointment Slot</h2>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {['Date', 'Time', 'Confirm'].map((step, i) => {
            const done = (i === 0 && selDate) || (i === 1 && selSlot)
            const active = (i === 0 && !selDate) || (i === 1 && selDate && !selSlot) || (i === 2 && selSlot)
            return (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? 'text-white' : active ? 'text-white' : 'bg-slate-100 text-slate-400'}`}
                  style={{ background: done ? '#10B981' : active ? '#4F46E5' : undefined }}>
                  {done ? '✓' : i + 1}
                </div>
                <span className={`text-sm font-medium ${active ? 'text-indigo-600' : done ? 'text-green-600' : 'text-slate-400'}`}>{step}</span>
                {i < 2 && <div className="w-8 h-0.5 bg-slate-200" />}
              </div>
            )
          })}
        </div>

        {/* Date selector */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-slate-700 mb-3">Select Date</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {dates.map((d, i) => {
              const isSelected = selDate && d.toDateString() === selDate.toDateString()
              return (
                <button key={i} onClick={() => { setSelDate(d); setSelSlot(null) }}
                  className="flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-xl border transition-all"
                  style={{
                    background: isSelected ? '#4F46E5' : 'white',
                    borderColor: isSelected ? '#4F46E5' : '#E2E8F0',
                    color: isSelected ? 'white' : '#475569',
                  }}>
                  <span className="text-xs font-medium">{DAYS[d.getDay()]}</span>
                  <span className="text-lg font-bold">{d.getDate()}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Time slots */}
        {selDate && (
          <div className="mb-5">
            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-700 mb-2">☀️ Morning</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {slots.morning.map(slot => {
                  const booked = isBooked(slot)
                  const selected = selSlot === slot
                  return (
                    <button key={slot} disabled={booked} onClick={() => setSelSlot(slot)}
                      className="py-2 rounded-xl text-xs font-medium transition-all border"
                      style={{
                        background: selected ? '#4F46E5' : booked ? '#F1F5F9' : 'white',
                        color: selected ? 'white' : booked ? '#CBD5E1' : '#475569',
                        borderColor: selected ? '#4F46E5' : booked ? '#E2E8F0' : '#E2E8F0',
                        textDecoration: booked ? 'line-through' : 'none',
                        cursor: booked ? 'not-allowed' : 'pointer',
                        boxShadow: selected ? '0 4px 12px rgba(79,70,229,0.3)' : 'none',
                      }}>
                      {slot}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">🌤️ Afternoon</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {slots.afternoon.map(slot => {
                  const booked = isBooked(slot)
                  const selected = selSlot === slot
                  return (
                    <button key={slot} disabled={booked} onClick={() => setSelSlot(slot)}
                      className="py-2 rounded-xl text-xs font-medium transition-all border"
                      style={{
                        background: selected ? '#4F46E5' : booked ? '#F1F5F9' : 'white',
                        color: selected ? 'white' : booked ? '#CBD5E1' : '#475569',
                        borderColor: selected ? '#4F46E5' : booked ? '#E2E8F0' : '#E2E8F0',
                        textDecoration: booked ? 'line-through' : 'none',
                        cursor: booked ? 'not-allowed' : 'pointer',
                        boxShadow: selected ? '0 4px 12px rgba(79,70,229,0.3)' : 'none',
                      }}>
                      {slot}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        {selSlot && (
          <div className="rounded-xl p-4 mb-5 anim-fade-in" style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
            <p className="text-sm font-semibold text-slate-700 mb-3">Appointment Summary</p>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div><span className="text-slate-500">Doctor:</span> <span className="font-medium">{doc.name}</span></div>
              <div><span className="text-slate-500">Date:</span> <span className="font-medium">{selDate?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></div>
              <div><span className="text-slate-500">Time:</span> <span className="font-medium text-indigo-600">{selSlot}</span></div>
              <div><span className="text-slate-500">Fee:</span> <span className="font-bold text-indigo-600">₹{doc.fees}</span></div>
            </div>
            <div className="flex gap-2">
              {['🏥 In-Clinic', '💻 Online'].map(t => {
                const val = t.includes('Clinic') ? 'in-clinic' : 'online'
                return (
                  <button key={t} onClick={() => setType(val)}
                    className="flex-1 py-2 rounded-full text-sm font-medium transition-all"
                    style={{
                      background: type === val ? '#4F46E5' : 'white',
                      color: type === val ? 'white' : '#475569',
                      border: `1.5px solid ${type === val ? '#4F46E5' : '#E2E8F0'}`,
                    }}>
                    {t}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <button onClick={handleBook} disabled={!selSlot || loading}
          className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-all"
          style={{
            background: selSlot ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : '#E2E8F0',
            color: selSlot ? 'white' : '#94A3B8',
            cursor: selSlot ? 'pointer' : 'not-allowed',
            boxShadow: selSlot ? '0 8px 25px rgba(79,70,229,0.3)' : 'none',
          }}>
          {loading
            ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full anim-spin" />Booking...</span>
            : selSlot ? `Confirm Appointment for ₹${doc.fees} →` : 'Select a time slot to continue'
          }
        </button>
      </div>

      {/* Related doctors */}
      {doctors.filter(d => d._id !== docId && d.speciality === doc.speciality).length > 0 && (
        <div>
          <h3 className="font-bold text-slate-800 mb-4">Similar Doctors</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {doctors.filter(d => d._id !== docId && d.speciality === doc.speciality).slice(0, 4).map(d => (
              <div key={d._id} className="card p-4 flex-shrink-0 w-48 cursor-pointer hover:border-indigo-300 transition-all"
                onClick={() => navigate(`/appointment/${d._id}`)}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2"
                  style={{ background: getAvatarColor(d.name) }}>
                  {getInitials(d.name)}
                </div>
                <p className="text-sm font-semibold text-slate-800 text-center truncate">{d.name}</p>
                <p className="text-xs text-indigo-600 text-center">{d.speciality}</p>
                <p className="text-xs text-center font-bold text-slate-700 mt-1">₹{d.fees}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
