import './bootstrap.js'     // ✅ MUST BE FIRST


import app from './app.js'
import { envConfig } from './config/env.config.js'


const PORT = envConfig.port

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`)
})
