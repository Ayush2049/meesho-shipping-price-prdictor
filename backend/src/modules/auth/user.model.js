import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      index: true   // 🔑 important
    },

    password: {
      type: String,
      required: false
    },

    isPhoneVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

/**
 * ✅ PASSWORD HASH HOOK (SAFE)
 * - Only runs if password exists
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  if (!this.password) return   // ✅ EXTRA SAFETY
  this.password = await bcrypt.hash(this.password, 10)
})

export const User = mongoose.model('User', userSchema)
