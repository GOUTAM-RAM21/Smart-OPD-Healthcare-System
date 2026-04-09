import { useAdminContext } from '../context/AdminContext'
import { useDoctorContext } from '../context/DoctorContext'

export default function Navbar() {
  const { aToken, setAToken } = useAdminContext()
  const { dToken, setDToken }  = useDoctorContext()

  const logout = () => {
    if (aToken) { localStorage.removeItem('aToken'); setAToken('') }
    if (dToken) { localStorage.removeItem('dToken'); setDToken('') }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">
          {aToken ? '🛡️ Admin' : '👨⚕️ Doctor'} Panel
        </span>
      </div>
      <button onClick={logout}
        className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
        Logout
      </button>
    </header>
  )
}
