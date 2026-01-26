import dotenv from 'dotenv'

import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import { corsConfig } from './config/cors.config.js'
import routes from './routes.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
dotenv.config()   // ✅ MUST
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// ✅ ONE static mount with forced download



app.use(cors(corsConfig))
app.options(/.*/, cors())
// ✅ preflight support

app.use(express.json())

app.use('/api', routes)
app.use(errorMiddleware)

export default app
