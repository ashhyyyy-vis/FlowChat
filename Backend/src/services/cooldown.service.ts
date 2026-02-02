// services/cooldown.service.ts
import redisClient from "../config/redis";

export async function isOnCooldown(deviceId: string) {
  const key = `cooldown:${deviceId}`;
  return await redisClient.exists(key);
}

export async function applyCooldown(
  deviceId: string,
  minutes: number
) {
  const key = `cooldown:${deviceId}`;
  await redisClient.set(key, "1", {
    EX: minutes * 60
  });
}
