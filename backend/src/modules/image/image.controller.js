import { ALLOWED_CATEGORIES } from '../../constants/categories.constants.js'
import { validateImageBuffer } from './image.validator.js'
import { detectBoundingBox } from './boundingBox.utils.js'
import { generatePIRVariants } from './canvasGenerator.utils.js'
import { computeShippingScores } from '../shipping/shipping.service.js'
import cloudinary from '../../config/cloudinary.config.js'
import { Image } from './image.model.js'

export const uploadAndGenerateVariants = async (req, res, next) => {
  try {
    const { category } = req.body
    const file = req.file

    // ✅ 1️⃣ Validate category
    if (!category || !ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' })
    }

    // ✅ 2️⃣ Validate file
    if (!file) {
      return res.status(400).json({ error: 'Image file is required' })
    }

    // ✅ 3️⃣ Validate image buffer
    await validateImageBuffer(file.buffer)

    // ✅ 4️⃣ Detect bounding box
    const boundingBox = await detectBoundingBox(file.buffer)
    console.log('📦 Bounding box:', boundingBox)

    // ✅ 5️⃣ Generate variants (memory only)
    const variants = await generatePIRVariants(file.buffer, boundingBox)
    console.log('🎨 Generated variants:', variants.length)
    console.log('🔍 First variant has imageBuffer?', !!variants[0]?.imageBuffer)

    // ✅ 6️⃣ Compute shipping scores
    const scoredVariants = computeShippingScores({
      category,
      variants,
      boundingBox
    })
    console.log('📊 Scored variants:', scoredVariants.length)
    console.log('🔍 First scored variant has imageBuffer?', !!scoredVariants[0]?.imageBuffer)

    // ✅ 7️⃣ Upload ALL variants to Cloudinary in parallel
    console.log('📤 Starting parallel uploads...')

    const uploadPromises = scoredVariants.map(async (variant, i) => {
      console.log(`📤 Starting upload ${i + 1}/${scoredVariants.length} - ${variant.probe}`)

      if (!variant.imageBuffer) {
        console.error('❌ Missing imageBuffer for variant:', variant.rank)
        return null
      }

      try {
        const base64Image = `data:image/jpeg;base64,${variant.imageBuffer.toString('base64')}`

        const uploadResult = await cloudinary.uploader.upload(
          base64Image,
          {
            folder: 'meesho-variants',
            public_id: `variant_${variant.rank}_${Date.now()}_${i}`,
            overwrite: true,
            resource_type: 'image'
          }
        )

        console.log(`✅ Uploaded ${i + 1}/${scoredVariants.length}:`, uploadResult.secure_url)

        return {
          rank: variant.rank,
          pir: variant.pir,
          probe: variant.probe,
          slab: variant.slab,
          estimatedShipping: variant.estimatedShipping,
          resolution: variant.resolution,
          dpi: variant.dpi,
          jpegQuality: variant.jpegQuality,
          imageUrl: uploadResult.secure_url,
          visualHint: variant.visualHint
        }
      } catch (uploadError) {
        console.error(`❌ Upload failed for variant ${variant.rank}:`, uploadError.message)
        return null
      }
    })

    // Wait for all uploads to complete
    const uploadedVariants = await Promise.all(uploadPromises)

    // Filter out any failed uploads
    const finalVariants = uploadedVariants.filter(v => v !== null)

    console.log(`✅ Completed ${finalVariants.length}/${scoredVariants.length} uploads`)
    // ✅ SAVE GENERATION TO MONGODB (NON-DESTRUCTIVE ADDITION)
    await Image.create({
      user: req.user.userId,   // from JWT
      category,
      variants: finalVariants
    })

    // ✅ 8️⃣ Final response
    return res.json({
      valid: true,
      count: finalVariants.length,
      variants: finalVariants
    })
  } catch (err) {
    console.error('💥 Error in uploadAndGenerateVariants:', err)
    next(err)
  }
}