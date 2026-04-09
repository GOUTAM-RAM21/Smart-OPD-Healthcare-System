import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAdminContext } from '../context/AdminContext'
import { useDoctorContext } from '../context/DoctorContext'
import { DoctorAvatar } from '../utils/avatarHelper'

const ADMIN_SECTIONS = [
  {
    label: 'OVERVIEW',
    links: [
      { label: 'Dashboard',   path: '/admin-dashboard',  icon: '📊' },
      { label: 'Analytics',   path: '/analytics',        icon: '📈' },
    ],
  },
  {
    label: 'MANAGEMENT',
    links: [
      { label: 'Appointments', path: '/all-appointments', icon: '📋' },
      { label: 'Doctors List', path: '/doctors-list',     icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 1 0 .2.3" />
          <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" />
          <circle cx="20" cy="10" r="2" />
        </svg>
      ) },
      { label: 'Patients',     path: '/patients-list',    icon: '👥' },
      { label: 'Add Doctor',   path: '/add-doctor',       icon: '➕' },
    ],
  },
]

const DOCTOR_SECTIONS = [
  {
    label: 'DOCTOR',
    links: [
      { label: 'Dashboard',    path: '/doctor-dashboard',    icon: '📊' },
      { label: 'Appointments', path: '/doctor-appointments', icon: '📋' },
      { label: 'Profile',      path: '/doctor-profile',      icon: '👤' },
    ],
  },
]

export default function Sidebar() {
  const { aToken, setAToken } = useAdminContext()
  const { dToken, setDToken, profileData } = useDoctorContext()
  const [collapsed, setCollapsed] = useState(false)

  const sections = aToken ? ADMIN_SECTIONS : DOCTOR_SECTIONS
  const panelLabel = aToken ? 'Admin Panel' : 'Doctor Panel'
  const userName   = aToken ? 'Admin' : (profileData?.name ?? 'Doctor')

  const logout = () => {
    if (aToken) { setAToken(''); localStorage.removeItem('aToken') }
    else { setDToken(''); localStorage.removeItem('dToken') }
  }

  return (
    <aside className={`bg-white border-r border-gray-200 flex flex-col flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #5f6FFF, #7c3aed)' }}>
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div>
              <p className="text-base font-bold text-gray-800 leading-tight">Prescripto</p>
              <p className="text-xs text-gray-400">{panelLabel}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto"
            style={{ background: 'linear-gradient(135deg, #5f6FFF, #7c3aed)' }}>
            <span className="text-white font-bold text-sm">P</span>
          </div>
        )}
        <button onClick={() => setCollapsed(v => !v)}
          className={`text-gray-400 hover:text-primary transition-colors p-1 rounded-lg hover:bg-gray-100 flex-shrink-0 ${collapsed ? 'mx-auto mt-2' : ''}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-4">
        {sections.map(section => (
          <div key={section.label}>
            {!collapsed && (
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">{section.label}</p>
            )}
            <div className="space-y-0.5">
              {section.links.map(link => (
                <NavLink key={link.path} to={link.path} title={collapsed ? link.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                     ${isActive
                       ? 'bg-primary/10 text-primary border-l-[3px] border-primary'
                       : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}`
                  }>
                  <span className="text-base flex-shrink-0">{link.icon}</span>
                  {!collapsed && <span>{link.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom user */}
      <div className="border-t border-gray-100 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <DoctorAvatar name={userName} size={36} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
              <p className="text-xs text-gray-400">{panelLabel}</p>
            </div>
            <button onClick={logout} title="Logout"
              className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        ) : (
          <button onClick={logout} title="Logout"
            className="w-full flex justify-center text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        )}
      </div>
    </aside>
  )
}
