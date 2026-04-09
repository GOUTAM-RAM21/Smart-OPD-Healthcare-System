import { useEffect, useState } from 'react'
import { useDoctorContext } from '../../context/DoctorContext'
import { DoctorAvatar } from '../../utils/avatarHelper'

const TABS = ['Personal Info', 'Consultation', 'Availability']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function DoctorProfile() {
  const { profileData, getProfile, updateProfile, dashData, getDashData } = useDoctorContext()
  const [tab, setTab]       = useState(0)
  const [saving, setSaving] = useState(false)
  const [form, setForm]     = useState({
    name: '', phone: '', about: '',
    fees: '', duration: '30', address1: '', address2: '', languages: '',
    available: true, workDays: [true, true, true, true, true, false, false],
    startTime: '09:00', endTime: '18:00',
  })

  useEffect(() => { getProfile(); getDashData() }, [])

  useEffect(() => {
    if (!profileData) return
    setForm(f => ({
      ...f,
      name:      profileData.name      ?? '',
      phone:     profileData.phone     ?? '',
      about:     profileData.about     ?? '',
      fees:      profileData.fees      ?? '',
      address1:  profileData.address?.line1 ?? '',
      address2:  profileData.address?.line2 ?? '',
      available: profileData.available ?? true,
    }))
  }, [profileData])

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }))

  const handleSave = async () => {
    setSaving(true)
    await updateProfile({
      fees:      form.fees,
      address:   JSON.stringify({ line1: form.address1, line2: form.address2 }),
      available: form.available,
      about:     form.about,
    })
    setSaving(false)
  }

  if (!profileData) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className="page-fade">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar */}
        <div className="lg:w-64 flex-shrink-0 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center text-center">
            <DoctorAvatar name={profileData.name} size={100} />
            <h2 className="text-lg font-bold text-gray-800 mt-3">{profileData.name}</h2>
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full mt-1">{profileData.speciality}</span>
            <p className="text-sm text-gray-500 mt-1">{profileData.degree}</p>
            <p className="text-xs text-gray-400 mt-0.5">{profileData.experience}</p>

            <div className="w-full mt-4 space-y-2">
              <div className="flex justify-between text-sm border-t border-gray-100 pt-3">
                <span className="text-gray-500">Patients</span>
                <span className="font-semibold text-gray-800">{dashData?.patients ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Rating</span>
                <span className="font-semibold text-amber-500">★ 4.8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={`font-semibold ${form.available ? 'text-green-600' : 'text-gray-400'}`}>
                  {form.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)}
                className={`flex-1 py-3.5 text-sm font-medium transition-colors
                  ${tab === i ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-gray-700'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Tab 0: Personal Info */}
            {tab === 0 && (
              <div className="space-y-4 max-w-lg">
                <Field label="Full Name" value={form.name} onChange={v => set('name', v)} />
                <Field label="Email" value={profileData.email} readOnly />
                <Field label="Phone" value={form.phone} onChange={v => set('phone', v)} placeholder="+91 98765 43210" />
                <Field label="Speciality" value={profileData.speciality} readOnly />
                <Field label="Degree" value={profileData.degree} readOnly />
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">About / Bio</label>
                  <textarea value={form.about} onChange={e => set('about', e.target.value)} rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none" />
                </div>
              </div>
            )}

            {/* Tab 1: Consultation */}
            {tab === 1 && (
              <div className="space-y-4 max-w-lg">
                <Field label="Consultation Fees (₹)" value={form.fees} onChange={v => set('fees', v)} type="number" />
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Duration per Appointment</label>
                  <select value={form.duration} onChange={e => set('duration', e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white w-full">
                    {['15', '20', '30', '45', '60'].map(d => <option key={d} value={d}>{d} minutes</option>)}
                  </select>
                </div>
                <Field label="Address Line 1" value={form.address1} onChange={v => set('address1', v)} />
                <Field label="Address Line 2" value={form.address2} onChange={v => set('address2', v)} />
                <Field label="Languages Spoken" value={form.languages} onChange={v => set('languages', v)} placeholder="English, Hindi..." />
              </div>
            )}

            {/* Tab 2: Availability */}
            {tab === 2 && (
              <div className="space-y-5 max-w-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Available for Appointments</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={form.available} onChange={e => set('available', e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                  </label>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Working Days</label>
                  <div className="flex gap-2 flex-wrap">
                    {DAYS.map((day, i) => (
                      <button key={day} onClick={() => {
                        const updated = [...form.workDays]
                        updated[i] = !updated[i]
                        set('workDays', updated)
                      }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all
                          ${form.workDays[i] ? 'bg-primary text-white' : 'border border-gray-200 text-gray-600 hover:border-primary/40'}`}>
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Start Time</label>
                    <input type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">End Time</label>
                    <input type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                  </div>
                </div>
              </div>
            )}

            <button onClick={handleSave} disabled={saving}
              className="mt-6 bg-primary text-white px-8 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2">
              {saving && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, readOnly, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-1.5">{label}</label>
      <input type={type} value={value} onChange={onChange ? e => onChange(e.target.value) : undefined}
        readOnly={readOnly} placeholder={placeholder}
        className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors ${readOnly ? 'bg-gray-50 text-gray-500' : ''}`} />
    </div>
  )
}
