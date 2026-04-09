import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

const app = express()
const PORT = process.env.PORT || 4000

connectDB()
connectCloudinary()

app.use(express.json())
app.use(cors())

app.use('/api/admin',  adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user',   userRouter)

app.get('/', (req, res) => res.json({
  success: true,
  message: 'Prescripto API Running ✅',
  version: '1.0.0',
  endpoints: { admin: '/api/admin', doctor: '/api/doctor', user: '/api/user' }
}))

app.listen(PORT, () => {
  console.log(`\n🚀 Prescripto Server: http://localhost:${PORT}`)
  console.log(`📦 Database: MongoDB (prescripto)`)
  console.log(`\nAdmin: ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_PASSWORD}`)
})
