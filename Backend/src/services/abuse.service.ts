// services/abuse.service.ts
import Report from "../models/report";

export async function getAbuseScore(deviceId: string) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  return Report.countDocuments({
    reportedDeviceId: deviceId,
    createdAt: { $gte: since }
  });
}
