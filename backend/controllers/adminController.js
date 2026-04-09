import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Invalid credentials' })
    }
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
    const exists = await doctorModel.findOne({ email })
    if (exists) return res.json({ success: false, message: 'Doctor already exists' })

    const hashed = await bcrypt.hash(password, 10)

    let imageUrl = ''
    if (req.file && process.env.CLOUDINARY_CLOUD_NAME !== 'placeholder') {
      const upload = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' })
      imageUrl = upload.secure_url
    }

    const doctor = new doctorModel({
      name, email,
      password: hashed,
      image: imageUrl,
      speciality, degree, experience, about,
      fees: Number(fees),
      address: typeof address === 'string' ? JSON.parse(address) : address,
      date: Date.now(),
    })
    await doctor.save()
    res.json({ success: true, message: 'Doctor added successfully' })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password')
    res.json({ success: true, doctors })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({})
    res.json({ success: true, appointments })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const apt = await appointmentModel.findById(appointmentId)
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

export const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body
    const doc = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId, { available: !doc.available })
    res.json({ success: true, message: 'Availability updated' })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const getAllPatients = async (req, res) => {
  try {
    const users = await userModel.find({}).select('-password')
    const patients = await Promise.all(
      users.map(async (u) => {
        const count = await appointmentModel.countDocuments({ userId: u._id.toString() })
        return { ...u.toObject(), appointmentCount: count }
      })
    )
    res.json({ success: true, patients })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

export const adminDashboard = async (req, res) => {
  try {
    const doctors      = await doctorModel.countDocuments()
    const appointments = await appointmentModel.countDocuments()
    const users        = await userModel.countDocuments()
    const latest       = await appointmentModel.find({}).sort({ date: -1 }).limit(5)
    res.json({ success: true, dashData: { doctors, appointments, patients: users, latest } })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}
