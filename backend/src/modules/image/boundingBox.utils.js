import sharp from 'sharp'

// Detect bounding box of product using simple geometry
export const detectBoundingBox = async (buffer) => {
  const image = sharp(buffer)
  const metadata = await image.metadata()

  const { width, height } = metadata

  // Convert to grayscale & threshold
  const { data, info } = await image
    .grayscale()
    .threshold(240)
    .raw()
    .toBuffer({ resolveWithObject: true })

  let minX = info.width
  let minY = info.height
  let maxX = 0
  let maxY = 0
  let hit = false

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = y * info.width + x
      if (data[idx] < 240) {
        hit = true
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
      }
    }
  }

  // Fallback: use full image
  if (!hit) {
    return {
      x: 0,
      y: 0,
      width,
      height,
      fallback: true
    }
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    fallback: false
  }
}
