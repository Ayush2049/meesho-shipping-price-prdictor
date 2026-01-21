import sharp from 'sharp'

export const processImage = async (req, res, next) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ error: 'Image file missing' })
    }

    const buffer = req.file.buffer

    // 🔹 TEMP bbox (replace later with real detection)
    const metadata = await sharp(buffer).metadata()

    const bbox = {
      x: 0,
      y: 0,
      width: metadata.width,
      height: metadata.height
    }

    req.processedImage = {
      buffer,
      bbox
    }

    next()
  } catch (err) {
    console.error('processImage error:', err)
    res.status(500).json({ error: 'Image processing failed' })
  }
}
