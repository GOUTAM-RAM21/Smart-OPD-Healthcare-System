import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAdminContext } from '../../context/AdminContext'
import { DoctorAvatar } from '../../utils/avatarHelper'

const SPECIALITIES = ['General physician','Gynecologist','Dermatologist','Pediatricians','Neurologist','Gastroenterologist','Orthopedic','Cardiologist']
const EXPERIENCES   = ['1 Year','2 Years','3 Years','4 Years','5 Years','6+ Years']
const LANGUAGES     = ['English','Hindi','Kannada','Tamil','Telugu','Bengali']
const EMPTY = { name:'', email:'', password:'', speciality:'General physician', degree:'', experience:'1 Year', fees:'', about:'', address1:'', address2:'', languages:[] }

export default function AddDoctor() {
  const { backendUrl, aToken } = useAdminContext()
  const [step, setStep]     = useState(1)
  const [form, setForm]     = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [done, setDone]     = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleLang = (lang) => setForm(f => ({
    ...f, languages: f.languages.includes(lang) ? f.languages.filter(l => l !== lang) : [...f.languages, lang]
  }))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries({
        name: form.name, email: form.email, password: form.password,
        speciality: form.speciality, degree: form.degree,
        experience: form.experience, fees: form.fees, about: form.about,
        address: JSON.stringify({ line1: form.address1, line2: form.address2 }),
      }).forEach(([k, v]) => formData.append(k, v))

      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: { atoken: aToken, 'Content-Type': 'multipart/form-data' }
      })
      if (data.success) { toast.success('Doctor added!'); setDone(true) }
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  if (done) return (
    <div className="page-fade flex flex-col items-center justify-center py-20">
      <div className="text-5xl mb-4">✅</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Doctor Added Successfully!</h2>
      <p className="text-gray-500 text-sm mb-1">Email: <span className="font-medium text-gray-700">{form.email}</span></p>
      <p className="text-gray-500 text-sm mb-6">They can login with their email and password.</p>
      <button onClick={() => { setForm(EMPTY); setStep(1); setDone(false) }}
        className="bg-primary text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
        Add Another Doctor
      </button>
    </div>
  )

  return (
    <div className="page-fade">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Doctor</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {['Basic Info', 'Professional Details'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
              ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-medium ${step === i + 1 ? 'text-primary' : 'text-gray-500'}`}>{s}</span>
            {i < 1 && <div className="w-12 h-0.5 bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        {step === 1 && (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <DoctorAvatar name={form.name || 'Doctor'} size={100} />
              <p className="text-xs text-gray-400 text-center">Avatar auto-generated<br/>from name</p>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Doctor Name *" value={form.name} onChange={v => set('name', v)} placeholder="Dr. Full Name" required />
              <Field label="Email *" type="email" value={form.email} onChange={v => set('email', v)} placeholder="doctor@email.com" required />
              <Field label="Password *" type="password" value={form.password} onChange={v => set('password', v)} placeholder="Min 8 characters" required />
              <Field label="Phone" value={form.phone || ''} onChange={v => set('phone', v)} placeholder="+91 98765 43210" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Speciality *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SPECIALITIES.map(s => (
                  <button key={s} type="button" onClick={() => set('speciality', s)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all text-left ${form.speciality === s ? 'bg-primary text-white' : 'border border-gray-200 text-gray-600 hover:border-primary/40'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Degree *" value={form.degree} onChange={v => set('degree', v)} placeholder="MBBS, MD" required />
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Experience *</label>
                <select value={form.experience} onChange={e => set('experience', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white">
                  {EXPERIENCES.map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
              <Field label="Fees (₹) *" type="number" value={form.fees} onChange={v => set('fees', v)} placeholder="500" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Address Line 1" value={form.address1} onChange={v => set('address1', v)} placeholder="Street, Area" />
              <Field label="Address Line 2" value={form.address2} onChange={v => set('address2', v)} placeholder="City, State" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Languages Spoken</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(lang => (
                  <button key={lang} type="button" onClick={() => toggleLang(lang)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${form.languages.includes(lang) ? 'bg-primary text-white' : 'border border-gray-200 text-gray-600 hover:border-primary/40'}`}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">About Doctor *</label>
              <textarea value={form.about} onChange={e => set('about', e.target.value)}
                placeholder="Brief description about expertise..." rows={4} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none" />
              <p className="text-xs text-gray-400 mt-1">{form.about.length}/500 characters</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button onClick={() => setStep(1)}
              className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-full text-sm hover:border-gray-400 transition-colors">
              ← Back
            </button>
          )}
          <div className="ml-auto">
            {step === 1 ? (
              <button onClick={() => {
                if (!form.name || !form.email || !form.password) return toast.warning('Please fill required fields')
                setStep(2)
              }}
                className="bg-primary text-white px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="bg-primary text-white px-10 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 flex items-center gap-2">
                {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Adding...</> : 'Add Doctor ✓'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder, required }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
    </div>
  )
}
