import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppContext } from '../context/AppContext'
import { getInitials, getAvatarColor } from '../utils/avatarHelper'

const NOTIFS = [
  { text: 'Appointment confirmed for tomorrow', time: '2 min ago' },
  { text: 'Dr. Richard accepted your booking', time: '1 hr ago' },
  { text: 'Health tip: Stay hydrated today!', time: '3 hr ago' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const { token, setToken, userData } = useAppContext()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [showUser, setShowUser]   = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const logout = () => { setToken(''); localStorage.removeItem('token'); navigate('/login') }

  const navLinks = [
    { label: 'Home',         path: '/' },
    { label: 'Find Doctors', path: '/doctors' },
    { label: 'About',        path: '/about' },
    { label: 'Contact',      path: '/contact' },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}
        style={{ height: 70, background: scrolled ? 'rgba(255,255,255,0.97)' : 'white', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom: '1px solid #E2E8F0' }}>
        <div className="mx-4 sm:mx-[8%] h-full flex items-center justify-between">
          {/* Logo */}
          <div onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
              <span className="text-white font-bold text-base">V</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold" style={{ color: '#0F172A' }}>VitaCare</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md text-white"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', fontSize: 10 }}>AI</span>
            </div>
          </div>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-7">
            {navLinks.map(link => (
              <NavLink key={link.path} to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors relative pb-1
                   ${isActive ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600 after:rounded' : 'text-slate-600 hover:text-indigo-600'}`
                }>
                {link.label}
              </NavLink>
            ))}
          </ul>

          {/* Right */}
          <div className="flex items-center gap-3">
            {token && userData ? (
              <>
                {/* Notification bell */}
                <div className="relative">
                  <button onClick={() => { setShowNotif(v => !v); setShowUser(false) }}
                    className="relative w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                    <span className="text-base">🔔</span>
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">3</span>
                  </button>
                  {showNotif && (
                    <div className="absolute right-0 top-11 bg-white shadow-xl rounded-2xl py-2 w-72 z-50 border border-slate-100 anim-fade-in">
                      <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100">Notifications</p>
                      {NOTIFS.map((n, i) => (
                        <div key={i} className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0">
                          <p className="text-sm text-slate-700">{n.text}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* User dropdown */}
                <div className="relative">
                  <button onClick={() => { setShowUser(v => !v); setShowNotif(false) }}
                    className="flex items-center gap-2 cursor-pointer">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ background: getAvatarColor(userData.name) }}>
                      {getInitials(userData.name)}
                    </div>
                    <svg className="w-3 h-3 text-slate-500 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showUser && (
                    <div className="absolute right-0 top-11 bg-white shadow-xl rounded-2xl py-2 w-56 z-50 border border-slate-100 anim-fade-in">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800 truncate">{userData.name}</p>
                        <p className="text-xs text-slate-500 truncate">{userData.email}</p>
                      </div>
                      {[
                        { label: 'My Dashboard',    path: '/my-profile' },
                        { label: 'Appointments',    path: '/my-appointments' },
                        { label: 'Health Records',  path: '/my-profile#records' },
                      ].map(item => (
                        <button key={item.label} onClick={() => { navigate(item.path); setShowUser(false) }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                          {item.label}
                        </button>
                      ))}
                      <button onClick={() => toast.info('Settings coming soon!')}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                        Settings
                      </button>
                      <div className="border-t border-slate-100 mt-1">
                        <button onClick={() => { logout(); setShowUser(false) }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/login')}
                  className="hidden md:block text-sm text-slate-600 hover:text-indigo-600 transition-colors font-medium">
                  Login
                </button>
                <button onClick={() => navigate('/login')}
                  className="btn-primary text-sm py-2 px-5">
                  Get Started
                </button>
              </div>
            )}

            {/* Hamburger */}
            <button className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors" onClick={() => setMenuOpen(true)}>
              <div className="space-y-1.5">
                <span className="block w-5 h-0.5 bg-slate-600" />
                <span className="block w-5 h-0.5 bg-slate-600" />
                <span className="block w-5 h-0.5 bg-slate-600" />
              </div>
            </button>
          </div>
        </div>
      </nav>

      <div style={{ height: 70 }} />

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-[60] md:hidden anim-fade-in">
          <div className="flex justify-between items-center p-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-lg font-bold text-slate-800">VitaCare AI</span>
            </div>
            <button onClick={() => setMenuOpen(false)} className="p-2 rounded-xl hover:bg-slate-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ul className="flex flex-col gap-1 px-5 mt-4">
            {navLinks.map(link => (
              <li key={link.path}>
                <NavLink to={link.path} onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-3.5 px-4 rounded-xl text-base font-medium
                     ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`
                  }>
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="mt-6">
              {token
                ? <button onClick={() => { logout(); setMenuOpen(false) }}
                    className="w-full py-3 px-4 text-sm font-medium text-red-500 bg-red-50 rounded-xl">
                    Logout
                  </button>
                : <button onClick={() => { navigate('/login'); setMenuOpen(false) }}
                    className="w-full py-3 text-white rounded-xl text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                    Get Started
                  </button>
              }
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
