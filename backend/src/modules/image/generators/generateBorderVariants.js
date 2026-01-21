import sharp from 'sharp'
import { CANVAS_SIZE } from '../constants/pir.constants.js'

const BORDER_VARIANTS = [
  { label: 'BORDER_ORANGE_40', border: 40, color: { r: 255, g: 92, b: 38 } },
  { label: 'BORDER_ORANGE_32', border: 32, color: { r: 255, g: 92, b: 38 } },
  { label: 'BORDER_GREEN_36', border: 36, color: { r: 34, g: 197, b: 94 } },
  { label: 'BORDER_GREEN_28', border: 28, color: { r: 34, g: 197, b: 94 } },
  { label: 'BORDER_GREEN_20', border: 20, color: { r: 34, g: 197, b: 94 } },
  { label: 'NO_BORDER', border: 0, color: { r: 255, g: 255, b: 255 } }
]

// 🔒 HARD-LOCKED BASELINE SHIPPING GEOMETRY (DO NOT CHANGE)
const LOCKED_EVF = 840
const LOCKED_COMPACTNESS = 0.99
const LOCKED_RESOLUTION = Math.round(840 * 840 * 0.99) // informational only

export const generateBorderVariants = async (buffer, bbox) => {
  const variants = []

  // 1️⃣ Crop product (visual only)
  const cropped = await sharp(buffer)
    .extract({
      left: Math.round(bbox.x),
      top: Math.round(bbox.y),
      width: Math.round(bbox.width),
      height: Math.round(bbox.height)
    })
    .toBuffer()

  // 2️⃣ Resize ONLY for visuals (shipping does NOT depend on this anymore)
  const scale =
    Math.min(CANVAS_SIZE / bbox.width, CANVAS_SIZE / bbox.height) * 0.82

  const productWidth = Math.round(bbox.width * scale)
  const productHeight = Math.round(bbox.height * scale)

  const resizedProduct = await sharp(cropped)
    .resize(productWidth, productHeight)
    .toBuffer()

  // 3️⃣ Image-level border variants (VISUAL ONLY)
  for (const v of BORDER_VARIANTS) {
    const finalWidth = productWidth + v.border * 2
    const finalHeight = productHeight + v.border * 2

    const output = await sharp({
      create: {
        width: finalWidth,
        height: finalHeight,
        channels: 3,
        background: v.color
      }
    })
      .composite([{ input: resizedProduct, left: v.border, top: v.border }])

      // 🔥 Meesho-safe JPEG profile (unchanged)
      .jpeg({
        quality: 88,
        chromaSubsampling: '4:2:0',
        mozjpeg: true,
        trellisQuantisation: true
      })
      .toBuffer()

    variants.push({
      probe: v.label,
      source: 'BORDER',

      // 🔒 ABSOLUTE SHIPPING LOCK (THIS IS THE FIX)
      evf: LOCKED_EVF,
      compactness: LOCKED_COMPACTNESS,
      resolution: LOCKED_RESOLUTION,
      pir: 0.4,
      shippingLocked: true,

      imageUrl: `data:image/jpeg;base64,${output.toString('base64')}`
    })
  }

  return variants
}
