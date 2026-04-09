import { Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAdminContext } from './context/AdminContext'
import { useDoctorContext } from './context/DoctorContext'
import Login from './pages/Login'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import AdminDashboard from './pages/admin/Dashboard'
import AllAppointments from './pages/admin/AllAppointments'
import AddDoctor from './pages/admin/AddDoctor'
import DoctorsList from './pages/admin/DoctorsList'
import Analytics from './pages/admin/Analytics'
import PatientsList from './pages/admin/PatientsList'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import DoctorProfile from './pages/doctor/DoctorProfile'
import AarahiChat from './components/chatbot/AarahiChat'

export default function App() {
  const { aToken } = useAdminContext()
  const { dToken }  = useDoctorContext()

  if (!aToken && !dToken) {
    return (
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <Login />
      </>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            {aToken && (
              <>
                <Route path="/" element={<Navigate to="/admin-dashboard" />} />
                <Route path="/admin-dashboard"  element={<AdminDashboard />} />
                <Route path="/all-appointments" element={<AllAppointments />} />
                <Route path="/add-doctor"       element={<AddDoctor />} />
                <Route path="/doctors-list"     element={<DoctorsList />} />
                <Route path="/analytics"        element={<Analytics />} />
                <Route path="/patients-list"    element={<PatientsList />} />
              </>
            )}
            {dToken && (
              <>
                <Route path="/" element={<Navigate to="/doctor-dashboard" />} />
                <Route path="/doctor-dashboard"    element={<DoctorDashboard />} />
                <Route path="/doctor-appointments" element={<DoctorAppointments />} />
                <Route path="/doctor-profile"      element={<DoctorProfile />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
      <AarahiChat />
    </div>
  )
}
