import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAdminContext } from '../context/AdminContext'
import { useDoctorContext } from '../context/DoctorContext'

export default function Login() {
  const { backendUrl, setAToken } = useAdminContext()
  const { setDToken }              = useDoctorContext()
  const [role,     setRole]     = useState('admin')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const endpoint = role === 'admin' ? '/api/admin/login' : '/api/doctor/login'
      const { data } = await axios.post(`${backendUrl}${endpoint}`, { email, password })
      if (data.success) {
        if (role === 'admin') {
          localStorage.setItem('aToken', data.token)
          setAToken(data.token)
          toast.success('Welcome, Admin!')
        } else {
          localStorage.setItem('dToken', data.token)
          setDToken(data.token)
          toast.success('Welcome, Doctor!')
        }
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">P</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {role === 'admin' ? 'Admin Login' : 'Doctor Login'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to your panel</p>
          </div>

          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {['admin', 'doctor'].map(r => (
              <button key={r} onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize
                  ${role === r ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder={role === 'admin' ? 'admin@prescripto.com' : 'doctor@prescripto.com'}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/30 disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
                : 'Login'
              }
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-1">
            <p className="font-medium text-gray-600">Demo credentials:</p>
            <p>Admin: admin@prescripto.com / Admin@123</p>
            <p>Doctor: richard@prescripto.com / doctor123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
