import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import doctorModel from './models/doctorModel.js'

const doctors = [
  {
    name: 'Dr. Richard James', email: 'richard@prescripto.com', password: 'doctor123',
    speciality: 'General physician', degree: 'MBBS, MD', experience: '4 Years',
    about: 'Dr. James has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    available: true, fees: 500,
    address: { line1: '17th Cross, Richmond Circle', line2: 'Ring Road, Bangalore' },
    date: Date.now(), image: '',
  },
  {
    name: 'Dr. Emily Larson', email: 'emily@prescripto.com', password: 'doctor123',
    speciality: 'Gynecologist', degree: 'MBBS, MS', experience: '3 Years',
    about: 'Specialized in women health with expertise in both preventive care and treatment. Dr. Larson fosters a supportive environment for open communication.',
    available: true, fees: 600,
    address: { line1: '27th Cross, Koramangala', line2: '5th Block, Bangalore' },
    date: Date.now(), image: '',
  },
  {
    name: 'Dr. Sarah Patel', email: 'sarah@prescripto.com', password: 'doctor123',
    speciality: 'Dermatologist', degree: 'MBBS, DVD', experience: '2 Years',
    about: 'Young and dynamic dermatologist with expertise in skin conditions, cosmetic treatments and hair loss treatment.',
    available: true, fees: 400,
    address: { line1: '47th Cross, Jayanagar', line2: '4th Block, Bangalore' },
    date: Date.now(), image: '',
  },
  {
    name: 'Dr. Christopher Lee', email: 'christopher@prescripto.com', password: 'doctor123',
    speciality: 'Pediatricians', degree: 'MBBS, DCH', experience: '2 Years',
    about: 'Dedicated pediatrician focused on the health and well-being of children. Dr. Lee provides comprehensive care from infancy through adolescence.',
    available: true, fees: 450,
    address: { line1: '12th Main, HSR Layout', line2: 'Sector 3, Bangalore' },
    date: Date.now(), image: '',
  },
  {
    name: 'Dr. Jennifer Garcia', email: 'jennifer@prescripto.com', password: 'doctor123',
    speciality: 'Neurologist', degree: 'MBBS, DM', experience: '5 Years',
    about: 'Expert neurologist treating complex brain and nervous system disorders. Dr. Garcia brings cutting-edge diagnostic skills and deep patient empathy.',
    available: true, fees: 700,
    address: { line1: '8th Block, Rajajinagar', line2: 'Bangalore - 560010' },
    date: Date.now(), image: '',
  },
  {
    name: 'Dr. Andrew Williams', email: 'andrew@prescripto.com', password: 'doctor123',
    speciality: 'Gastroenterologist', degree: 'MBBS, DNB', experience: '4 Years',
    about: 'Specialist in digestive system disorders, liver diseases, and gastrointestinal health. Dr. Williams is known for his thorough approach.',
    available: true, fees: 550,
    address: { line1: '21st Main, BTM Layout', line2: 'Bangalore - 560076' },
    date: Date.now(), image: '',
  },
  {
    name: 'Dr. Priya Sharma', email: 'priya@prescripto.com', password: 'doctor123',
    speciality: 'General physician', degree: 'MBBS', experience: '1 Year',
    about: 'Enthusiastic general physician dedicated to holistic patient care. Dr. Priya believes in treating the whole person, not just the symptoms.',
    available: true, fees: 300,
    address: { line1: '15th Cross, Malleswaram', line2: 'Bangalore - 560003' },
    date: Date.now(), image: '',
  },
  {
    name: 'Dr. Rahul Mehta', email: 'rahul@prescripto.com', password: 'doctor123',
    speciality: 'Orthopedic', degree: 'MBBS, MS Ortho', experience: '6 Years',
    about: 'Senior orthopedic surgeon specializing in joint replacement, sports injuries, and spine conditions. Dr. Mehta has performed 500+ successful surgeries.',
    available: true, fees: 800,
    address: { line1: '33rd Cross, Vijayanagar', line2: 'Bangalore - 560040' },
    date: Date.now(), image: '',
  },
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB ✅')
    await doctorModel.deleteMany({})
    console.log('Cleared existing doctors')
    for (const doc of doctors) {
      doc.password = await bcrypt.hash(doc.password, 10)
      const saved = await doctorModel.create(doc)
      console.log(`✅ ${saved.name} (${saved.speciality})`)
    }
    console.log('\n🎉 Seed Complete!')
    console.log('━'.repeat(50))
    console.log('Admin:  admin@prescripto.com / Admin@123')
    console.log('Doctors (all password: doctor123):')
    doctors.forEach(d => console.log(`  ${d.email}`))
    console.log('━'.repeat(50))
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    process.exit(1)
  }
}
seed()
