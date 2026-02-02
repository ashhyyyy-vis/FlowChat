import { Socket } from "socket.io";
import { io } from "../../server";
import { findMatch } from "../../services/match.service";
import queryProfile from "../../services/profile.service";

export async function tryMatch(socket: Socket) {
  const deviceId = socket.data.deviceId;

  // 1️⃣ Load requester context
  const profile = await queryProfile(deviceId);
    if (!profile) return;

    const gender = profile.verifiedGender;
    const preference = profile.preferredPartnerGender;

    const peerDeviceId = await findMatch({
    deviceId,
    gender,
    preference,
    });


  if (!peerDeviceId) return;

  // 3️⃣ Find both live sockets
  const sockets = await io.fetchSockets();

  const socketA = sockets.find(s => s.data.deviceId === deviceId);
  const socketB = sockets.find(s => s.data.deviceId === peerDeviceId);

  if (!socketA || !socketB) {
    // match.service already dequeued
    // reconnect flow will re-queue later
    return;
  }

  // 4️⃣ Create ephemeral room
  const roomId = `chat_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  socketA.join(roomId);
  socketB.join(roomId);

  // 5️⃣ Notify both sides
  socketA.emit("match:found", {
    roomId,
    peerId: peerDeviceId,
  });

  socketB.emit("match:found", {
    roomId,
    peerId: deviceId,
  });
}
