export const errorMiddleware = (err, req, res, next) => {
  console.error(err)

  if (err.message.includes('JPEG')) {
    return res.status(400).json({ valid: false, error: err.message })
  }

  if (err.message.includes('RGB')) {
    return res.status(400).json({ valid: false, error: err.message })
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      valid: false,
      error: 'Image size exceeds 5MB limit'
    })
  }

  res.status(500).json({
    valid: false,
    error: err.message || 'Internal Server Error'
  })
}
