import bcrypt from 'bcryptjs'
import { User } from './user.model.js'
import { generateToken } from './jwt.utils.js'
import { sendOTP_SMS, verifyOTP_SMS } from './sms.service.js'

/**
 * ======================================================
 * AUTH SERVICE
 * ======================================================
 * OTP Provider: TWILIO VERIFY
 *
 * IMPORTANT RULES:
 * - No manual OTP generation
 * - No OTP storage in DB or memory
 * - Twilio handles OTP lifecycle
 */

/**
 * ======================================================
 * REGISTER USER
 * ======================================================
 *
 * FLOW:
 * 1. Check if user already exists
 * 2. Send OTP using Twilio Verify
 * 3. ONLY if OTP is sent successfully:
 *    → create user in DB
 *
 * NOTE:
 * - User is created as unverified
 * - Verification happens in verifyPhoneOTP
 */
export const registerUser = async ({
  name,

  phone,
  password
}) => {
  console.log('[AUTH] Register request received')

  /**
   * STEP 1: Check existing user
   */
  const exists = await User.findOne({
    $or: [{ phone }]
  })

  if (exists) {
    console.error('[AUTH] User already exists')
    throw new Error('User already exists')
  }

  /**
   * STEP 2: Send OTP using Twilio
   */
  try {
    console.log('[AUTH] Sending OTP via Twilio')
    await sendOTP_SMS(phone)
    console.log('[AUTH] OTP sent successfully')
  } catch (err) {
    console.error('[AUTH] OTP SMS FAILED:', err.message)
    throw new Error('Failed to send OTP. Please try again.')
  }

  /**
   * STEP 3: Create user AFTER OTP success
   */
  try {
    await User.create({
      name,

      phone,
      password,
      isPhoneVerified: false
    })

    console.log('[AUTH] User created (unverified)')
  } catch (err) {
    console.error('[AUTH] User creation failed:', err.message)
    throw new Error('User registration failed')
  }

  return {
    message: 'OTP sent to phone'
  }
}

/**
 * ======================================================
 * VERIFY PHONE OTP
 * ======================================================
 *
 * FLOW:
 * 1. Verify OTP using Twilio Verify
 * 2. If approved → mark user verified
 * 3. Generate JWT token
 */
export const verifyPhoneOTP = async ({ phone, otp }) => {
  console.log('[AUTH] Verifying OTP for:', phone)

  /**
   * STEP 1: Verify OTP with Twilio
   */
  const isValid = await verifyOTP_SMS(phone, otp)

  if (!isValid) {
    console.error('[AUTH] Invalid or expired OTP')
    throw new Error('Invalid or expired OTP')
  }

  /**
   * STEP 2: Mark user as verified
   */
  const user = await User.findOneAndUpdate(
    { phone },
    { isPhoneVerified: true },
    { new: true }
  )

  if (!user) {
    console.error('[AUTH] User not found during OTP verification')
    throw new Error('User not found')
  }

  /**
   * STEP 3: Generate JWT
   */
  const token = generateToken(user)

  console.log('[AUTH] Phone verified successfully')

  return { token }
}

/**
 * ======================================================
 * LOGIN USER
 * ======================================================
 *
 * RULES:
 * - User must exist
 * - Phone must be verified
 * - Password must match
 */
/**
 * ======================================================
 * LOGIN USER
 * ======================================================
 *
 * RULES:
 * - User must exist
 * - Phone must be verified
 * - Password must match
 */
export const loginUser = async ({ phone, password }) => {
  console.log('[AUTH] Login attempt for phone:', phone)

  /**
   * STEP 1: Find user by phone
   */
  const user = await User.findOne({ phone }).select('+password')

  if (!user) {
    console.error('[AUTH] Invalid phone')
    throw new Error('Invalid credentials')
  }

  /**
   * STEP 2: Check phone verification
   */
  if (!user.isPhoneVerified) {
    console.error('[AUTH] Phone not verified')
    throw new Error('Phone not verified')
  }

  /**
   * STEP 3: Validate password
   */
  if (!user.password) {
    console.error('[AUTH] Password not set')
    throw new Error('Password not set')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    console.error('[AUTH] Password mismatch')
    throw new Error('Invalid credentials')
  }

  /**
   * STEP 4: Generate token
   */
  const token = generateToken(user)

  console.log('[AUTH] Login successful')

  return { token }
}
