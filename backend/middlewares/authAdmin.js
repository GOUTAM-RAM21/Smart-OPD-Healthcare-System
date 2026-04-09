import jwt from 'jsonwebtoken'

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers
    if (!atoken) return res.json({ success: false, message: 'Not authorized' })
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET)
    if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD)
      return res.json({ success: false, message: 'Not authorized' })
    next()
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}
export default authAdmin
