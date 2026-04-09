import { useState } from 'react'
import { toast } from 'react-toastify'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleSubscribe = () => {
    if (!email.trim() || !email.includes('@')) return toast.error('Please enter a valid email')
    toast.success('Subscribed to VitaCare AI health tips!')
    setEmail('')
  }

  return (
    <footer className="mt-20 border-t border-slate-100">
      {/* Newsletter */}
      <div className="rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)', border: '1px solid #C7D2FE' }}>
        <div>
          <h4 className="font-semibold text-slate-800 text-base">Stay Updated With Health Intelligence</h4>
          <p className="text-slate-500 text-sm mt-0.5">Get AI-powered health tips and appointment reminders</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
            placeholder="Enter your email"
            className="border border-slate-200 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300 flex-1 md:w-56" />
          <button onClick={handleSubscribe}
            className="btn-primary text-sm py-2 px-5 whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </div>

      <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-slate-800">VitaCare</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md text-white"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', fontSize: 10 }}>AI</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Intelligent healthcare connecting patients with verified doctors. AI-powered diagnostics and real-time OPD management.
          </p>
          <p className="text-xs text-slate-400 mt-3 italic">Intelligent Healthcare, Delivered</p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-800 mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            {['Home', 'About Us', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map(l => (
              <li key={l}><a href="#" className="hover:text-indigo-600 transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-slate-800 mb-4">Get in Touch</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li>📞 +91 98765 43210</li>
            <li>✉️ support@vitacare.ai</li>
            <li>🏥 Available 24/7 for emergencies</li>
          </ul>
          <div className="flex gap-3 mt-4">
            {['🐦', '📘', '📸', '💼'].map((icon, i) => (
              <button key={i} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-indigo-100 transition-colors text-sm">
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © 2026 VitaCare AI. All rights reserved. · Intelligent Healthcare, Delivered
      </div>
    </footer>
  )
}
