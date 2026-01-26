import { Router } from 'express'
import { upload } from '../../config/multer.config.js'
import { uploadAndGenerateVariants } from './image.controller.js'
import { getMyImages } from './image.history.controller.js'
import { requireAuth } from '../auth/auth.middleware.js'
import { generationRateLimit } from '../../middlewares/rateLimit.middleware.js' // ✅ FIX

const router = Router()

// 🔐 Generate images (rate-limited)
router.post(
  '/generate',
  requireAuth,              // 🔐 auth first
  generationRateLimit,      // ⏳ rate limit second
  upload.single('image'),
  uploadAndGenerateVariants
)

// 🔐 Fetch saved images for logged-in user
router.get(
  '/my-images',
  requireAuth,
  getMyImages
)

export default router
