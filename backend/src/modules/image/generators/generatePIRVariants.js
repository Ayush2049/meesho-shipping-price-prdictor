// src/modules/image/generators/generatePIRVariants.js
import sharp from 'sharp'
import { CANVAS_SIZE } from '../constants/pir.constants.js'

const VARIANTS = [
  { label: 'MICRO_COMPACT', pir: 0.32, squeeze: [0.88, 0.88] },
  { label: 'MICRO_WIDE', pir: 0.32, squeeze: [1.05, 0.75] },
  { label: 'SAFE_COMPACT', pir: 0.40, squeeze: [0.92, 0.92] },
  { label: 'NORMAL', pir: 0.50, squeeze: [1.0, 1.0] },
  { label: 'WIDE', pir: 0.55, squeeze: [1.12, 0.78] },
  { label: 'DENSE', pir: 0.65, squeeze: [1.05, 1.05] }
]

export const generatePIRVariants = async (buffer, bbox) => {
  const variants = []

  const cropped = await sharp(buffer)
    .extract({
      left: Math.round(bbox.x),
      top: Math.round(bbox.y),
      width: Math.round(bbox.width),
      height: Math.round(bbox.height)
    })
    .toBuffer()

  const productArea = bbox.width * bbox.height
  const canvasArea = CANVAS_SIZE * CANVAS_SIZE

  for (const v of VARIANTS) {
    let scale = Math.sqrt((v.pir * canvasArea) / productArea)
    scale = Math.min(1.15, Math.max(scale, 0.3))

    const width = Math.round(bbox.width * scale * v.squeeze[0])
    const height = Math.round(bbox.height * scale * v.squeeze[1])

    const resized = await sharp(cropped).resize(width, height).toBuffer()

    const output = await sharp({
      create: {
        width: CANVAS_SIZE,
        height: CANVAS_SIZE,
        channels: 3,
        background: { r: 255, g: 255, b: 255 }
      }
    })
      .composite([{
        input: resized, left: Math.floor((CANVAS_SIZE - width) / 2),
        top: Math.floor((CANVAS_SIZE - height) / 2)
      }])
      .jpeg({ quality: 90 })
      .toBuffer()

    variants.push({
      probe: v.label,
      pir: v.pir,
      width,
      height,
      evf: Math.max(width, height),
      compactness: Math.min(width, height) / Math.max(width, height),
      resolution: width * height,
      imageUrl: `data:image/jpeg;base64,${output.toString('base64')}`
    })
  }

  return variants   // ✅ ~6–8 images
}
