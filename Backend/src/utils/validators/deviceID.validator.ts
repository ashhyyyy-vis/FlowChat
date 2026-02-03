// src/utils/validators/deviceId.validator.ts

export function validateDeviceId(deviceId: unknown): true {
  if (!deviceId) {
    throw new Error('Device ID missing')
  }

  return true
}
