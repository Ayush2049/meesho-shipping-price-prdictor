import mongoose from 'mongoose'

const imageVariantSchema = new mongoose.Schema({
  rank: Number,
  probe: String,
  slab: String,
  estimatedShipping: Number,
  resolution: Number,
  imageUrl: String,
  visualHint: Object
})

const imageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      required: true
    },
    originalImageUrl: String, // optional (future)
    variants: [imageVariantSchema]
  },
  { timestamps: true }
)

export const Image = mongoose.model('Image', imageSchema)
