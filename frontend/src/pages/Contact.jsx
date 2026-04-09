import { useState } from 'react'
import { toast } from 'react-toastify'

const CONTACT_INFO = [
  { icon: '📍', label: 'Address', value: '123 Healthcare Avenue, Bangalore, India' },
  { icon: '📞', label: 'Phone',   value: '+91-1800-PRESCRIPTO' },
  { icon: '✉️', label: 'Email',   value: 'support@prescripto.com' },
  { icon: '🕐', label: 'Hours',   value: 'Monday–Saturday: 9AM–6PM' },
]

const SUBJECTS = ['General Query', 'Technical Support', 'Doctor Registration', 'Feedback']

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Query', message: '' })
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success("We'll get back to you within 24 hours!")
    setForm({ name: '', email: '', subject: 'General Query', message: '' })
  }

  return (
    <div className="py-12 page-enter">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
        Contact <span className="text-primary">Us</span>
      </h2>
      <p className="text-gray-500 text-center text-sm mb-10">We're here to help. Reach out anytime.</p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: contact info */}
        <div className="md:w-80 flex-shrink-0 space-y-3">
          {CONTACT_INFO.map(c => (
            <div key={c.label} className="border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:border-primary/30 transition-colors">
              <span className="text-2xl flex-shrink-0">{c.icon}</span>
              <div>
                <p className="text-xs text-gray-500 font-medium">{c.label}</p>
                <p className="text-sm text-gray-700">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Name</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Subject</label>
              <select value={form.subject} onChange={e => set('subject', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary bg-white transition-colors">
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Message</label>
              <textarea value={form.message} onChange={e => set('message', e.target.value)}
                placeholder="How can we help you?" rows={5} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none transition-colors" />
            </div>
            <button type="submit"
              className="w-full bg-primary text-white py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
