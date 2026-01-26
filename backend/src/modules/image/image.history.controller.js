import { Image } from './image.model.js'

export const getMyImages = async (req, res, next) => {
  try {
    const userId = req.user.userId

    const images = await Image.find({ user: userId })
      .sort({ createdAt: -1 }) // latest first
      .lean()

    return res.json({
      valid: true,
      count: images.length,
      images
    })
  } catch (err) {
    next(err)
  }
}
