import { Router } from 'express'
import authRoutes from './modules/auth/auth.routes.js'
import imageRoutes from './modules/image/image.routes.js'

const router = Router()

router.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Low Shipping Optimizer API' })
})
router.use('/auth', authRoutes)
router.use('/', imageRoutes)

export default router
