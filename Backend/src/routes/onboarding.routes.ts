import { Router, Request, Response } from 'express'
import queryProfile from '../services/profile.service'
import { getVerificationByDeviceId } from '../services/verification.service'

const onboardingRoute = Router()

onboardingRoute.post('/', async (req: Request, res: Response) => {
  if (!req.deviceId) {
    return res.status(400).json({
      message: 'Device ID missing'
    })
  }

  try {
    const user = req.body

    // 1. fetch verified gender from backend (NOT from frontend)
    const verification = await getVerificationByDeviceId(req.deviceId)

    if (!verification || !verification.verifiedGender) {
      return res.status(403).json({
        message: 'User not verified'
      })
    }

    // 2. create profile using trusted gender
    const profile = await queryProfile(
      req.deviceId,
      user.nickName,
      user.shortBio,
      user.pronouns,
      verification.verifiedGender, // <- TRUSTED
      user.preferredPartnerGender
    )

    return res.status(200).json({
      message: 'Profile created successfully',
      profile
    })

  } catch (error) {
    console.error('Onboarding failed:', error)
    return res.status(500).json({
      message: 'Profile creation failed'
    })
  }
})

export default onboardingRoute
