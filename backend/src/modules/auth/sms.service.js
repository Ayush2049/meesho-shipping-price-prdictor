import twilio from 'twilio'

/**
 * =====================================
 * TWILIO CLIENT
 * =====================================
 */
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

/**
 * =====================================
 * SEND OTP (TWILIO VERIFY)
 * =====================================
 */
export const sendOTP_SMS = async (phone) => {
  try {
    console.log('[TWILIO] Sending OTP to:', phone)

    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: `+91${phone}`,
        channel: 'sms'
      })

    console.log('[TWILIO] OTP SENT:', verification.status)
    return true
  } catch (err) {
    console.error('[TWILIO ERROR - SEND OTP]', err.message)
    throw new Error('Failed to send OTP')
  }
}

/**
 * =====================================
 * VERIFY OTP (TWILIO VERIFY)
 * =====================================
 */
export const verifyOTP_SMS = async (phone, otp) => {
  try {
    console.log('[TWILIO] Verifying OTP for:', phone)

    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: `+91${phone}`,
        code: otp
      })

    console.log('[TWILIO] OTP STATUS:', check.status)

    return check.status === 'approved'
  } catch (err) {
    console.error('[TWILIO ERROR - VERIFY OTP]', err.message)
    return false
  }
}
