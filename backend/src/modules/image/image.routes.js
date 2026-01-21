import { Router } from 'express'
import { upload } from '../../config/multer.config.js'
import { uploadAndGenerateVariants } from './image.controller.js'

const router = Router()

router.post(
  '/generate',
  upload.single('image'),
  uploadAndGenerateVariants
)

export default router
