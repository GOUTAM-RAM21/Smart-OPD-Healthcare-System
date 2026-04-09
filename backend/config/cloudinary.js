import { v2 as cloudinary } from 'cloudinary'

const connectCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
  if (process.env.CLOUDINARY_CLOUD_NAME !== 'placeholder') {
    console.log('✅ Cloudinary connected')
  } else {
    console.log('⚠️  Cloudinary: placeholder (image upload disabled)')
  }
}
export default connectCloudinary
