import express from 'express'
import authAdmin from '../middlewares/authAdmin.js'
import upload from '../middlewares/multer.js'
import {
  loginAdmin, addDoctor, allDoctors,
  appointmentsAdmin, appointmentCancel, adminDashboard, changeAvailability, getAllPatients
} from '../controllers/adminController.js'

const router = express.Router()
router.post('/login',               loginAdmin)
router.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
router.get('/all-doctors',  authAdmin, allDoctors)
router.get('/appointments', authAdmin, appointmentsAdmin)
router.post('/cancel-appointment', authAdmin, appointmentCancel)
router.post('/change-availability', authAdmin, changeAvailability)
router.get('/dashboard',    authAdmin, adminDashboard)
router.get('/patients',     authAdmin, getAllPatients)
export default router
