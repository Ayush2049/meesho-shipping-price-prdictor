import sharp from 'sharp'

export const validateImageBuffer = async (buffer) => {
  const metadata = await sharp(buffer).metadata()

  if (metadata.format !== 'jpeg') {
    throw new Error('Only JPEG images are allowed')
  }

  if (metadata.channels !== 3) {
    throw new Error('Image must be RGB')
  }

  if (!metadata.width || !metadata.height) {
    throw new Error('Invalid image dimensions')
  }

  return true
}
