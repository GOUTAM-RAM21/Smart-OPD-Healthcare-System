import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.json({ success: false, message: 'All fields required' })
    if (!validator.isEmail(email))
      return res.json({ success: false, message: 'Invalid email' })
    if (password.length < 8)
      return res.json({ success: false, message: 'Password must be 8+ characters' })
    const exists = await userModel.findOne({ email })
    if (exists)
      return res.json({ success: false, message: 'Email already registered' })
    const hashed = await bcrypt.hash(password, 10)
    const user = new userModel({ name, email, password: hashed })
    await user.save()
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.json({ success: true, token })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) return res.json({ success: false, message: 'User not found' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.json({ success: false, message: 'Invalid password' })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.json({ success: true, token })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select('-password')
    res.json({ success: true, userData: user })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, gender, dob } = req.body
    await userModel.findByIdAndUpdate(req.userId, {
      name, phone, gender, dob,
      address: typeof address === 'string' ? JSON.parse(address) : address,
    })
    res.json({ success: true, message: 'Profile updated' })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body
    const doctor = await doctorModel.findById(docId).select('-password')
    if (!doctor.available)
      return res.json({ success: false, message: 'Doctor not available' })

    const slots = { ...doctor.slots_booked }
    if (slots[slotDate]?.includes(slotTime))
      return res.json({ success: false, message: 'Slot not available' })

    slots[slotDate] = slots[slotDate] ? [...slots[slotDate], slotTime] : [slotTime]

    const user = await userModel.findById(req.userId).select('-password')
    const docData = { ...doctor.toObject() }
    delete docData.slots_booked

    const appointment = new appointmentModel({
      userId: req.userId,
      docId,
      slotDate,
      slotTime,
      userData: user.toObject(),
      docData,
      amount: doctor.fees,
      date: Date.now(),
    })
    await appointment.save()
    await doctorModel.findByIdAndUpdate(docId, { slots_booked: slots })
    res.json({ success: true, message: 'Appointment booked successfully' })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const listAppointment = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userId: req.userId }).sort({ date: -1 })
    res.json({ success: true, appointments })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const apt = await appointmentModel.findById(appointmentId)
    if (apt.userId !== req.userId)
      return res.json({ success: false, message: 'Not authorized' })
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    const doctor = await doctorModel.findById(apt.docId)
    const slots = { ...doctor.slots_booked }
    if (slots[apt.slotDate]) {
      slots[apt.slotDate] = slots[apt.slotDate].filter(t => t !== apt.slotTime)
    }
    await doctorModel.findByIdAndUpdate(apt.docId, { slots_booked: slots })
    res.json({ success: true, message: 'Appointment cancelled' })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}
