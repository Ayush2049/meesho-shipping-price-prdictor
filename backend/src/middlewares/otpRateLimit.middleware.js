import rateLimit from 'express-rate-limit'

export const otpRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3,                 // 3 OTPs per phone/IP
  message: {
    error: 'Too many OTP requests. Try again later.'
  }
})
