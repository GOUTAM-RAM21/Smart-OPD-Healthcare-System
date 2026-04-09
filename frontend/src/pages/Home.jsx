import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { getInitials, getAvatarColor } from '../utils/avatarHelper'
import VideoModal from '../components/VideoModal'
import QuickVideos from '../components/QuickVideos'

const SPECIALITIES = [
  { icon: '🩺', name: 'General',     count: 4 },
  { icon: '👩‍⚕️', name: 'Gynecology',  count: 2 },
  { icon: '🧴', name: 'Dermatology', count: 1 },
  { icon: '👶', name: 'Pediatrics',  count: 1 },
  { icon: '🧠', name: 'Neurology',   count: 1 },
  { icon: '🫁', name: 'Gastro',      count: 1 },
  { icon: '🦴', name: 'Orthopedic',  count: 1 },
  { icon: '❤️', name: 'Cardiology',  count: 0 },
]

const TIPS = [
  { icon: '💧', title: 'Stay Hydrated', desc: 'Drink at least 8 glasses of water daily. Proper hydration improves energy, skin health, and cognitive function.', bg: '#EEF2FF', iconBg: '#4F46E5' },
  { icon: '🏃', title: 'Move Daily',    desc: '30 minutes of moderate exercise daily reduces risk of chronic disease by up to 35%. Start small, stay consistent.', bg: '#ECFDF5', iconBg: '#10B981' },
  { icon: '😴', title: 'Sleep Well',    desc: '7-9 hours of quality sleep is essential for immune function, memory consolidation, and hormonal balance.', bg: '#F5F3FF', iconBg: '#7C3AED' },
]

const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Mumbai', stars: 5, text: 'VitaCare AI made booking a specialist so easy. The AI health assistant helped me understand my symptoms before the appointment!' },
  { name: 'Rahul Verma',  city: 'Delhi',  stars: 5, text: 'The doctor was excellent and the online consultation feature saved me hours of travel. Highly recommend VitaCare AI.' },
  { name: 'Anita Patel',  city: 'Pune',   stars: 5, text: 'The report analysis feature is incredible. It explained my blood test results in simple language and suggested the right specialist.' },
]

function StatCounter({ end, suffix = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(end / 40)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(start)
    }, 30)
    return () => clearInterval(timer)
  }, [end])
  return <span>{count}{suffix}</span>
}

export default function Home() {
  const navigate = useNavigate()
  const { doctors, token, userData } = useAppContext()
  const [tipIdx, setTipIdx]         = useState(0)
  const [showDemo, setShowDemo]     = useState(false)

  useEffect(() => {
    const t = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 5000)
    return () => clearInterval(t)
  }, [])

  const featuredDocs = doctors.slice(0, 8)

  return (
    <div className="page-enter">
      {/* ── SECTION 1: HERO ── */}
      <section className="relative overflow-hidden rounded-3xl mb-8" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #06B6D4 100%)', minHeight: 560 }}>
        {/* Decorative blobs */}
        <div className="absolute top-[-60px] right-[-60px] w-80 h-80 rounded-full opacity-10" style={{ background: 'white' }} />
        <div className="absolute bottom-[-40px] left-[-40px] w-60 h-60 rounded-full opacity-10" style={{ background: 'white' }} />

        <div className="relative flex flex-col lg:flex-row items-center gap-8 px-8 py-14 lg:py-16">
          {/* LEFT */}
          <div className="flex-1 text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-sm font-medium"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
              🏆 India's Most Trusted AI Health Platform
            </div>

            <h1 className="font-bold leading-tight mb-4" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
              Your Health, Our<br />
              <span style={{ color: '#FCD34D' }}>Intelligence</span>
            </h1>

            <p className="mb-7 leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, maxWidth: 480 }}>
              AI-powered healthcare connecting 500+ verified doctors with smart diagnostics and real-time OPD management.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <button onClick={() => navigate('/doctors')}
                className="font-semibold px-7 py-3 rounded-full transition-all hover:shadow-lg hover:scale-[1.02]"
                style={{ background: 'white', color: '#4F46E5' }}>
                Book Appointment →
              </button>
              <button onClick={() => setShowDemo(true)}
                className="font-medium px-7 py-3 rounded-full transition-all"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                ▶ Watch Demo
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {['✓ 10K+ Patients', '✓ 500+ Doctors', '✓ AI Powered'].map(p => (
                <span key={p} className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)' }}>
                  {p}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>247 patients treated today</span>
            </div>
          </div>

          {/* RIGHT — Dashboard preview */}
          <div className="lg:w-[380px] w-full flex-shrink-0">
            <div className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(12px)' }}>
              <p className="text-white/70 text-xs font-medium mb-1">AI Health Score</p>
              <div className="flex items-end gap-2 mb-4">
                <span className="mono font-bold text-white" style={{ fontSize: 48 }}>78</span>
                <span className="text-white/60 text-sm mb-2">/100</span>
                <span className="ml-auto text-xs px-2 py-1 rounded-full font-medium" style={{ background: 'rgba(16,185,129,0.25)', color: '#6EE7B7' }}>Good</span>
              </div>
              <div className="progress-bar mb-5" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <div className="progress-fill" style={{ width: '78%', background: 'linear-gradient(90deg, #34D399, #10B981)' }} />
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { icon: '❤️', label: 'HR', val: '72 bpm' },
                  { icon: '🩸', label: 'BP', val: '120/80' },
                  { icon: '🌡️', label: 'Temp', val: '36.6°C' },
                ].map(v => (
                  <div key={v.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    <div className="text-lg mb-1">{v.icon}</div>
                    <div className="text-white font-semibold text-xs">{v.val}</div>
                    <div className="text-white/50 text-[10px]">{v.label}</div>
                  </div>
                ))}
              </div>

              <button onClick={() => navigate('/doctors')}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
                Book Next Appointment →
              </button>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40L60 33C120 27 240 13 360 10C480 7 600 13 720 17C840 20 960 20 1080 17C1200 13 1320 7 1380 3L1440 0V40H0Z" fill="#F8FAFC"/>
          </svg>
        </div>
      </section>

      {/* ── SECTION 2: STATS ── */}
      <section className="bg-white rounded-3xl py-10 px-8 mb-8 border border-slate-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {[
            { end: 500, suffix: '+', label: 'Verified Doctors' },
            { end: 10000, suffix: '+', label: 'Happy Patients' },
            { end: 50, suffix: '+', label: 'Specialities' },
            { end: 49, suffix: '★', label: 'Average Rating' },
          ].map((s, i) => (
            <div key={i} className="text-center py-4 md:py-0">
              <div className="stat-number gradient-text">
                <StatCounter end={s.end} suffix={s.suffix} />
              </div>
              <p className="text-slate-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: HEALTH CARD (logged in) ── */}
      {token && userData && (
        <section className="rounded-3xl p-7 mb-8 border anim-fade-up"
          style={{ background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)', borderColor: '#C7D2FE' }}>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-800 mb-1">Hello, {userData.name}! 👋</h2>
              <p className="text-slate-500 text-sm mb-4">Your health overview for today</p>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-slate-600">Health Score</span>
                <span className="text-sm font-bold text-indigo-600">78/100</span>
                <span className="badge badge-success text-xs">Good</span>
              </div>
              <div className="progress-bar mb-4" style={{ maxWidth: 300 }}>
                <div className="progress-fill" style={{ width: '78%' }} />
              </div>
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                {[
                  { icon: '👨‍⚕️', label: 'Book Doctor',  action: () => navigate('/doctors') },
                  { icon: '📋', label: 'My Records',   action: () => navigate('/my-profile#records') },
                  { icon: '💊', label: 'Medicine',     action: () => navigate('/my-profile') },
                  { icon: '🚨', label: 'SOS',          action: () => window.open('tel:112') },
                ].map(a => (
                  <button key={a.label} onClick={a.action}
                    className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-200">
                    <span>{a.icon}</span>{a.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:w-64 w-full">
              <div className="bg-white rounded-2xl p-5 border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Next Appointment</p>
                <div className="text-center py-4 text-slate-400">
                  <div className="text-3xl mb-2">📅</div>
                  <p className="text-sm">No upcoming appointments</p>
                  <button onClick={() => navigate('/doctors')}
                    className="mt-3 btn-primary text-xs py-2 px-4">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 4: HOW IT WORKS ── */}
      <section className="rounded-3xl py-14 px-8 mb-8" style={{ background: '#F1F5F9' }}>
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-800">3 Steps to Better Health</h2>
          <p className="text-slate-500 mt-2">Simple, fast, and intelligent healthcare booking</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {[
            { step: '01', icon: '🔍', title: 'Search', desc: 'Find from 500+ verified doctors by specialty, location, or availability' },
            { step: '02', icon: '📅', title: 'Book',   desc: 'Choose your preferred date, time slot, and consultation type (online/offline)' },
            { step: '03', icon: '💊', title: 'Consult', desc: 'Get expert diagnosis, digital prescription, and follow-up care' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 text-center border border-slate-200 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full text-white"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                Step {s.step}
              </div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 mt-2"
                style={{ background: '#EEF2FF' }}>
                {s.icon}
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 5: SPECIALITIES ── */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Find Specialists</h2>
            <p className="text-slate-500 text-sm mt-1">Browse by medical specialty</p>
          </div>
          <button onClick={() => navigate('/doctors')} className="text-sm text-indigo-600 font-medium hover:underline">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {SPECIALITIES.map(s => (
            <button key={s.name}
              onClick={() => s.count > 0 && navigate(`/doctors/${s.name}`)}
              className={`rounded-2xl border p-3 text-center transition-all ${s.count > 0 ? 'hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer' : 'opacity-60 cursor-default'}`}
              style={{ background: 'white', borderColor: '#E2E8F0' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mx-auto mb-2"
                style={{ background: '#EEF2FF' }}>
                {s.icon}
              </div>
              <p className="text-xs font-medium text-slate-700 leading-tight">{s.name}</p>
              <p className="text-[10px] mt-0.5" style={{ color: s.count > 0 ? '#4F46E5' : '#94A3B8' }}>
                {s.count > 0 ? `${s.count} docs` : 'Soon'}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* ── SECTION 6: FEATURED DOCTORS ── */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Top Rated Doctors</h2>
            <p className="text-slate-500 text-sm mt-1">Verified specialists ready to help</p>
          </div>
          <button onClick={() => navigate('/doctors')} className="text-sm text-indigo-600 font-medium hover:underline">
            View All →
          </button>
        </div>
        {featuredDocs.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="skeleton h-28" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                  <div className="skeleton h-8 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredDocs.map(doc => (
              <div key={doc._id} className="card overflow-hidden">
                <div className="h-28 flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)' }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
                    style={{ background: getAvatarColor(doc.name) }}>
                    {getInitials(doc.name)}
                  </div>
                  <div className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${doc.available ? 'badge-success' : 'badge-gray'}`}>
                    {doc.available ? '● Available' : '○ Offline'}
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-slate-800 text-sm truncate">{doc.name}</p>
                  <p className="text-indigo-600 text-xs mt-0.5">{doc.speciality}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                    <span className="text-amber-500">★4.8</span>
                    <span>·</span>
                    <span>{doc.experience}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-slate-800">₹{doc.fees}</span>
                    <span className="text-xs text-slate-400">/ consult</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => navigate(`/appointment/${doc._id}`)}
                      className="flex-1 text-xs py-2 rounded-full border border-indigo-300 text-indigo-600 hover:bg-indigo-50 transition-colors font-medium">
                      Profile
                    </button>
                    <button onClick={() => navigate(`/appointment/${doc._id}`)}
                      className="flex-1 text-xs py-2 rounded-full text-white font-medium transition-all hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── SECTION 7: AI HEALTH TIPS ── */}
      <section className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Your Daily Health Intelligence</h2>
          <p className="text-slate-500 text-sm mt-1">AI-curated wellness tips updated daily</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl" style={{ background: TIPS[tipIdx].bg, border: '1px solid #E2E8F0', minHeight: 160 }}>
          <div className="p-8 flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: TIPS[tipIdx].iconBg }}>
              <span>{TIPS[tipIdx].icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-slate-800 text-lg">{TIPS[tipIdx].title}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(79,70,229,0.1)', color: '#4F46E5' }}>AI Generated</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{TIPS[tipIdx].desc}</p>
            </div>
          </div>
          <div className="flex justify-center gap-2 pb-4">
            {TIPS.map((_, i) => (
              <button key={i} onClick={() => setTipIdx(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: i === tipIdx ? '#4F46E5' : '#CBD5E1' }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: REPORT UPLOAD PROMO ── */}
      <section className="rounded-3xl p-10 mb-8 text-white"
        style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3">Upload Your Medical Report</h2>
            <p className="text-white/80 mb-5">AI will explain it in simple language</p>
            <ul className="space-y-2">
              {['Instant analysis in seconds', 'Abnormal values highlighted', 'Simple language explanation', 'Doctor recommendation'].map(b => (
                <li key={b} className="flex items-center gap-2 text-sm text-white/90">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-72 w-full">
            <div className="rounded-2xl p-6 text-center cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: 'rgba(255,255,255,0.12)', border: '2px dashed rgba(255,255,255,0.4)' }}
              onClick={() => navigate('/my-profile#records')}>
              <div className="text-4xl mb-3">📄</div>
              <p className="text-white font-medium mb-1">Drop your report here</p>
              <p className="text-white/60 text-xs mb-4">PDF, JPG, PNG supported</p>
              <button className="bg-white text-indigo-600 font-semibold px-6 py-2.5 rounded-full text-sm hover:shadow-lg transition-all">
                Upload & Analyze
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 9: EMERGENCY ── */}
      <section className="rounded-3xl p-8 mb-8" style={{ background: '#0F172A' }}>
        <h2 className="text-xl font-bold text-white text-center mb-6">Emergency Services — 24/7</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🚨', title: 'Emergency', sub: 'Call 112', href: 'tel:112', color: '#EF4444' },
            { icon: '🚑', title: 'Ambulance', sub: 'Call 108', href: 'tel:108', color: '#F59E0B' },
            { icon: '🏥', title: 'Nearest Hospital', sub: 'Find on Maps', href: 'https://maps.google.com/?q=hospital+near+me', color: '#10B981' },
          ].map(e => (
            <a key={e.title} href={e.href} target="_blank" rel="noreferrer"
              className="flex items-center gap-4 rounded-2xl p-5 transition-all hover:scale-[1.02]"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${e.color}22` }}>
                {e.icon}
              </div>
              <div>
                <p className="text-white font-semibold">{e.title}</p>
                <p className="text-sm font-bold" style={{ color: e.color }}>{e.sub}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── SECTION 10: QUICK VIDEOS ── */}
      <QuickVideos />

      {/* ── SECTION 11: TESTIMONIALS ── */}
      <section className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">What Patients Say</h2>
          <p className="text-slate-500 text-sm mt-1">Trusted by thousands across India</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="card p-6">
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.stars)].map((_, j) => <span key={j} className="text-amber-400">★</span>)}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: getAvatarColor(t.name) }}>
                  {getInitials(t.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {showDemo && <VideoModal onClose={() => setShowDemo(false)} />}
    </div>
  )
}
