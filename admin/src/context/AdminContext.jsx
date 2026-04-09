import { createContext, useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const AdminContext = createContext()

export const AdminContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') ?? '')
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(null)
  const [patients, setPatients] = useState([])

  const headers = { atoken: aToken }

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, { headers })
      if (data.success) setDoctors(data.doctors)
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
  }

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, { headers })
      if (data.success) setAppointments(data.appointments.reverse())
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
  }

  const cancelAppointment = async (id) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/cancel-appointment`, { appointmentId: id }, { headers })
      if (data.success) { toast.success('Appointment cancelled'); getAllAppointments() }
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
  }

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/change-availability`, { docId }, { headers })
      if (data.success) { toast.success(data.message); getAllDoctors() }
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
  }

  const getAllPatients = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/patients`, { headers })
      if (data.success) setPatients(data.patients)
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
  }

  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, { headers })
      if (data.success) setDashData(data.dashData)
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
  }

  return (
    <AdminContext.Provider value={{
      backendUrl, aToken, setAToken,
      doctors, getAllDoctors,
      appointments, getAllAppointments,
      cancelAppointment, changeAvailability,
      dashData, getDashData,
      patients, getAllPatients,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdminContext = () => useContext(AdminContext)
export default AdminContext
