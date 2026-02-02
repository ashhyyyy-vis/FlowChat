import { Socket } from "socket.io";
import { enqueueUser, isUserQueued } from "../../services/queue.service";
import { getlimit } from "../../services/limits.service";
import queryProfile from "../../services/profile.service";

export async function handleEnterQueue(
  socket: Socket
) {
  const deviceId = socket.data.deviceId;

  // 1️⃣ Load profile (source of truth)
  const profile = await queryProfile(deviceId);
  if (!profile) {
    socket.emit("queue:error", "Profile not found");
    return;
  }

  const gender = profile.verifiedGender;
  const preference = profile.preferredPartnerGender;

  // 2️⃣ Prevent duplicate queueing (by gender)
  const alreadyQueued = await isUserQueued(deviceId, gender);
  if (alreadyQueued) {
    socket.emit("queue:error", "Already in queue");
    return;
  }

  // 3️⃣ Enforce limits (can depend on preference)
  const allowed = await getlimit(deviceId);
  if (!allowed) {
    socket.emit("queue:error", "Daily limit reached");
    return;
  }

  // 4️⃣ Enqueue by identity (gender)
  await enqueueUser(deviceId, gender);

  socket.emit("queue:joined", {
    preference,
  });
}
