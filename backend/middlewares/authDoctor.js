import jwt from 'jsonwebtoken'

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers
    if (!dtoken) return res.json({ success: false, message: 'Not authorized' })
    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET)
    req.docId = decoded.id
    next()
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}
export default authDoctor
