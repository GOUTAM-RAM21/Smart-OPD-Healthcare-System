import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

export const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ available: true }).select('-password -email')
    res.json({ success: true, doctors })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body
    const doctor = await doctorModel.findOne({ email })
    if (!doctor) return res.json({ success: false, message: 'Invalid credentials' })
    const match = await bcrypt.compare(password, doctor.password)
    if (!match) return res.json({ success: false, message: 'Invalid credentials' })
    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
    res.json({ success: true, token })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const appointmentsDoctor = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ docId: req.docId })
    res.json({ success: true, appointments })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const apt = await appointmentModel.findById(appointmentId)
    if (apt.docId !== req.docId) return res.json({ success: false, message: 'Not authorized' })
    await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
    res.json({ success: true, message: 'Appointment completed' })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const apt = await appointmentModel.findById(appointmentId)
    if (apt.docId !== req.docId) return res.json({ success: false, message: 'Not authorized' })
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    const doctor = await doctorModel.findById(req.docId)
    const slots = { ...doctor.slots_booked }
    if (slots[apt.slotDate]) {
      slots[apt.slotDate] = slots[apt.slotDate].filter(t => t !== apt.slotTime)
    }
    await doctorModel.findByIdAndUpdate(req.docId, { slots_booked: slots })
    res.json({ success: true, message: 'Appointment cancelled' })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const doctorDashboard = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ docId: req.docId })
    const earnings = appointments
      .filter(a => a.isCompleted && a.payment)
      .reduce((sum, a) => sum + a.amount, 0)
    const patients = [...new Set(appointments.map(a => a.userId))].length
    res.json({
      success: true,
      dashData: {
        earnings,
        appointments: appointments.length,
        patients,
        latest: appointments.slice(-5).reverse(),
      }
    })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const doctorProfile = async (req, res) => {
  try {
    const profile = await doctorModel.findById(req.docId).select('-password')
    res.json({ success: true, profileData: profile })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const updateDoctorProfile = async (req, res) => {
  try {
    const { fees, address, available } = req.body
    await doctorModel.findByIdAndUpdate(req.docId, {
      fees: Number(fees),
      address: typeof address === 'string' ? JSON.parse(address) : address,
      available: available === 'true' || available === true,
    })
    res.json({ success: true, message: 'Profile updated' })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}
