import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const AppContext = createContext()

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const currencySymbol = '₹'

  const [doctors, setDoctors]     = useState([])
  const [token, setToken]         = useState(localStorage.getItem('token') || '')
  const [userData, setUserData]   = useState(null)

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`)
      if (data.success) setDoctors(data.doctors)
      else toast.error(data.message)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { token }
      })
      if (data.success) setUserData(data.userData)
      else toast.error(data.message)
    } catch (err) {
      toast.error(err.message)
    }
  }

  useEffect(() => { getDoctorsData() }, [])
  useEffect(() => {
    if (token) loadUserProfileData()
    else setUserData(null)
  }, [token])

  return (
    <AppContext.Provider value={{
      doctors, getDoctorsData,
      token, setToken,
      userData, setUserData,
      loadUserProfileData,
      backendUrl, currencySymbol,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
export default AppContext
