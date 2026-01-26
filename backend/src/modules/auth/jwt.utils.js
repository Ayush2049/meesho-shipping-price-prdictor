import jwt from 'jsonwebtoken'

export const generateToken = (user) => {
  if (!user || !user._id) {
    throw new Error('Invalid user payload for JWT')
  }

  return jwt.sign(
    {
      userId: user._id.toString(),
      phone: user.phone
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  )
}
