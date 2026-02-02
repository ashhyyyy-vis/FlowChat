import { Socket } from "socket.io";
import { io } from "../../server";
import { findMatch } from "../../services/match.service";
import { dequeueUser } from "../../services/queue.service";

export async function tryMatch(socket: Socket) {
  const deviceId = socket.data.deviceId;

  // ask the match service
  const match = await findMatch(deviceId);

  if (!match) return;

  const { userA, userB } = match;

  // room id is ephemeral & random
  const roomId = `chat_${userA}_${userB}_${Date.now()}`;

  // remove both from queues
  await dequeueUser(userA);
  await dequeueUser(userB);

  // find sockets for both users
  const sockets = await io.fetchSockets();

  const socketA = sockets.find(s => s.data.deviceId === userA);
  const socketB = sockets.find(s => s.data.deviceId === userB);

  if (!socketA || !socketB) return;

  // join room
  socketA.join(roomId);
  socketB.join(roomId);

  // notify both users
  io.to(roomId).emit("match:found", {
    roomId,
  });
}
