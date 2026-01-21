import sharp from 'sharp'
import { CANVAS_SIZE } from '../../constants/pir.constants.js'

/**
 * IMAGE-LEVEL BORDER VARIANTS
 * - Product geometry LOCKED
 * - Border around FULL IMAGE (not product)
 * - Shipping remains stable
 */

const BORDER_VARIANTS = [
  { label: 'BORDER_ORANGE_40', border: 40, color: { r: 255, g: 92, b: 38 } },
  { label: 'BORDER_ORANGE_32', border: 32, color: { r: 255, g: 92, b: 38 } },
  { label: 'BORDER_GREEN_28', border: 28, color: { r: 34, g: 197, b: 94 } },
  {
    label: 'NO_BORDER', border: 0, color: { r: 255, g: 255, b: 255 },
  }, { label: 'BORDER_GREEN_36', border: 36, color: { r: 34, g: 197, b: 94 } },
  { label: 'BORDER_GREEN_28', border: 28, color: { r: 34, g: 197, b: 94 } },
  { label: 'BORDER_GREEN_20', border: 20, color: { r: 34, g: 197, b: 94 } },

  { label: 'NO_BORDER', border: 0, color: { r: 255, g: 255, b: 255 } }
]

export const generatePIRVariants = async (buffer, bbox) => {
  const variants = []

  // 1️⃣ Crop product (truth geometry)
  const cropped = await sharp(buffer)
    .extract({
      left: Math.round(bbox.x),
      top: Math.round(bbox.y),
      width: Math.round(bbox.width),
      height: Math.round(bbox.height)
    })
    .toBuffer()

  // 2️⃣ Baseline resize (DO NOT TOUCH)
  const scale =
    Math.min(CANVAS_SIZE / bbox.width, CANVAS_SIZE / bbox.height) * 0.82

  const productWidth = Math.round(bbox.width * scale)
  const productHeight = Math.round(bbox.height * scale)

  const resizedProduct = await sharp(cropped)
    .resize(productWidth, productHeight, { kernel: sharp.kernel.lanczos3 })
    .toBuffer()

  const evf = Math.max(productWidth, productHeight)
  const compactness = Math.min(productWidth, productHeight) / evf
  const resolution = productWidth * productHeight

  // 3️⃣ Generate image-level border variants
  for (const v of BORDER_VARIANTS) {
    const finalWidth = productWidth + v.border * 2
    const finalHeight = productHeight + v.border * 2

    const output = await sharp({
      create: {
        width: finalWidth,
        height: finalHeight,
        channels: 3,
        background: v.color // 🎯 BORDER COLOR
      }
    })
      .composite([
        {
          input: resizedProduct,
          left: v.border,
          top: v.border
        }
      ])
      .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
      .toBuffer()

    variants.push({
      probe: v.label,
      width: productWidth,
      height: productHeight,
      evf,
      compactness,
      resolution,
      border: v.border,
      imageBuffer: output
    })
  }

  return variants
}
