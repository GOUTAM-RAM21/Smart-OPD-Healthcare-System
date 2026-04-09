import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers
    if (!token) return res.json({ success: false, message: 'Not authorized' })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}
export default authUser
