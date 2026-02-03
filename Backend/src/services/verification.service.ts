// src/services/verification.service.ts

import Profile from '../models/profile' 
// adjust path/name to your actual model

export async function getVerificationByDeviceId(deviceId: string) {
  if (!deviceId) return null

  const verification = await Profile.findOne({ deviceId }).lean()

  return verification
}
