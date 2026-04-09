import { createContext, useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorContext = createContext()

export const DoctorContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [dToken, setDToken] = useState(localStorage.getItem('dToken') ?? '')
  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(null)
  const [profileData, setProfileData] = useState(null)

  const headers = { dtoken: dToken }

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, { headers })
      if (data.success) setAppointments(data.appointments.reverse())
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
  }

  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, { headers })
      if (data.success) setDashData(data.dashData)
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
  }

  const completeAppointment = async (id) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/complete-appointment`, { appointmentId: id }, { headers })
      if (data.success) { toast.success('Marked as completed'); getAppointments() }
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
  }

  const cancelAppointment = async (id) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/cancel-appointment`, { appointmentId: id }, { headers })
      if (data.success) { toast.success('Appointment cancelled'); getAppointments() }
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
  }

  const getProfile = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, { headers })
      if (data.success) setProfileData(data.profileData)
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
  }

  const updateProfile = async (formData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, formData, { headers })
      if (data.success) { toast.success('Profile updated'); getProfile() }
      else toast.error(data.message)
    } catch (err) { toast.error(err.message) }
  }

  return (
    <DoctorContext.Provider value={{
      backendUrl, dToken, setDToken,
      appointments, getAppointments,
      dashData, getDashData,
      completeAppointment, cancelAppointment,
      profileData, getProfile, updateProfile,
    }}>
      {children}
    </DoctorContext.Provider>
  )
}

export const useDoctorContext = () => useContext(DoctorContext)
export default DoctorContext
