import './bootstrap.js'
import app from './app.js'
import { envConfig } from './config/env.config.js'
import { connectDB } from './config/db.config.js' // ✅ ADD

const PORT = envConfig.port

await connectDB() // ✅ MUST BE BEFORE app.listen

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`)
})
