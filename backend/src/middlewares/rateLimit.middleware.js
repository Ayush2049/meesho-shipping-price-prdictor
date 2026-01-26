// src/middlewares/rateLimit.middleware.js

const userRequests = new Map()

const WINDOW_MS = 60 * 1000       // 1 minute
const MAX_REQUESTS = 5            // 5 generations per minute

export const generationRateLimit = (req, res, next) => {
  const userId = req.user?.userId

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const now = Date.now()

  const record = userRequests.get(userId) || {
    count: 0,
    firstRequestTime: now
  }

  // ⏱ Reset window if expired
  if (now - record.firstRequestTime > WINDOW_MS) {
    record.count = 0
    record.firstRequestTime = now
  }

  record.count += 1
  userRequests.set(userId, record)

  // 🚫 Limit exceeded
  if (record.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil(
      (WINDOW_MS - (now - record.firstRequestTime)) / 1000
    )

    return res.status(429).json({
      error: 'Too many image generations',
      message: `Please wait ${retryAfter}s before trying again`
    })
  }

  next()
}
