import { Router, Request, Response } from 'express'
import { uploadVerificationImage } from '../middleware/uploadVerificationImage'
import { verifyImage } from '../ai/verify'

const router = Router()

router.post(
  '/verify',
  uploadVerificationImage.single('file'),
  async (req: Request, res: Response) => {
    try {
      // 1. basic validation
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Image file is required'
        })
      }

      const deviceId = req.body.deviceId
      if (!deviceId) {
        return res.status(400).json({
          success: false,
          message: 'Device ID is required'
        })
      }

      // 2. temp file path from multer
      const filePath = req.file.path

      // 3. call AI verification service
      const result = await verifyImage(filePath)

      // 4. for now: just return result
      // (DB persistence comes later)
      return res.json({
        success: true,
        gender: result.detectedGender,
        confidence: result.confidence
      })

    } catch (err: any) {
      console.error('Verification route error:', err)

      return res.status(500).json({
        success: false,
        message: err.message || 'Verification failed'
      })
    }
  }
)

export default router
