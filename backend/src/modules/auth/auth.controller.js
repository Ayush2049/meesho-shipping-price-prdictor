import {
  registerUser,
  verifyPhoneOTP,
  loginUser
} from './auth.service.js'

export const signup = async (req, res, next) => {
  try {
    const result = await registerUser(req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const verifyOTP = async (req, res, next) => {
  try {
    const result = await verifyPhoneOTP(req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
}
