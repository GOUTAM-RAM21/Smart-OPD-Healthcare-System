import express from 'express'
import authUser from '../middlewares/authUser.js'
import {
  registerUser, loginUser, getProfile,
  updateProfile, bookAppointment,
  listAppointment, cancelAppointment
} from '../controllers/userController.js'

const router = express.Router()
router.post('/register',             registerUser)
router.post('/login',                loginUser)
router.get('/get-profile',  authUser, getProfile)
router.post('/update-profile', authUser, updateProfile)
router.post('/book-appointment', authUser, bookAppointment)
router.get('/appointments',  authUser, listAppointment)
router.post('/cancel-appointment', authUser, cancelAppointment)
export default router
