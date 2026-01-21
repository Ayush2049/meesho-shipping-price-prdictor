import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const OUTPUT_DIR = path.join(__dirname, '../../../public/out')

export const saveImageBuffer = async (buffer, filename) => {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const filePath = path.join(OUTPUT_DIR, filename)

  await fs.promises.writeFile(filePath, buffer)

  return `/out/${filename}`
}
