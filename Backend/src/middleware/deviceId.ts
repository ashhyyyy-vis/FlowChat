import { Request, Response, NextFunction } from 'express'
import { validateDeviceId } from '../utils/validators/deviceID.validator'
import { AppError } from '../domain/types'

const deviceIdMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const rawDeviceId = req.headers['device-id']

    // normalize header value to string | undefined
    const deviceId = Array.isArray(rawDeviceId)
      ? rawDeviceId[0]
      : rawDeviceId

    // throws if invalid
    validateDeviceId(deviceId)

    // now TS KNOWS this is a string
    req.deviceId = deviceId as string

    next()
  } catch (error: any) {
    const err = error as AppError
    err.status = 400
    next(err)
  }
}

export default deviceIdMiddleware
