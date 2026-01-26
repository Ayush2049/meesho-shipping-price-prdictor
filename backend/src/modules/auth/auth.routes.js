import { Router } from 'express'
import { signup, verifyOTP, login } from './auth.controller.js'
import { validate } from '../../middlewares/validate.middleware.js'
import {
  signupSchema,
  verifyOTPSchema,
  loginSchema
} from './auth.validation.js'
import { otpRateLimit } from '../../middlewares/otpRateLimit.middleware.js'

const router = Router()

// 🟢 SIGNUP (rate-limited + validated)
router.post(
  '/signup',
  otpRateLimit,
  validate(signupSchema),
  signup
)

// 🟢 VERIFY OTP
router.post(
  '/verify-otp',
  validate(verifyOTPSchema),
  verifyOTP
)

// 🟢 LOGIN
router.post(
  '/login',
  validate(loginSchema),
  login
)

export default router
