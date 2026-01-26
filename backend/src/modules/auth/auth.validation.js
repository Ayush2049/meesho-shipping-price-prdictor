import { z } from 'zod'

/* ---------------- SIGNUP VALIDATION ---------------- */
export const signupSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[a-zA-Z ]+$/, 'Name can contain only letters'),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Za-z]/, 'Password must contain a letter')
    .regex(/[0-9]/, 'Password must contain a number')
})

/* ---------------- OTP VERIFY ---------------- */
export const verifyOTPSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Invalid phone number'),

  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
})

/* ---------------- LOGIN ---------------- */
export const loginSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Invalid phone number'),

  password: z
    .string()
    .min(1, 'Password is required')
})
