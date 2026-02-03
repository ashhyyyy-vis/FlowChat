import multer from 'multer'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { Request } from 'express'

// ensure temp directory exists
const tempDir = path.join(os.tmpdir(), 'verification-images')
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, tempDir)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    cb(null, name + ext)
  }
})

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: any
) {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed'))
  }
  cb(null, true)
}

export const uploadVerificationImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})
