import { Socket } from "socket.io";
import { enqueueUser, isUserQueued , Gender} from "../../services/queue.service";
import { getlimit } from "../../services/limits.service";

type QueuePreference = "male" | "female" | "any";

export async function handleEnterQueue(
  socket: Socket,
  preference: QueuePreference
) {
  const deviceId = socket.data.deviceId;

  // sanity guard
  if (!preference) {
    socket.emit("queue:error", "Preference required");
    return;
  }

  // prevent duplicate queueing
  const alreadyQueued = await isUserQueued(deviceId, preference);
  if (alreadyQueued) {
    socket.emit("queue:error", "Already in queue");
    return;
  }

  // enforce fairness limits
  const allowed = await getlimit(deviceId);
  if (!allowed) {
    socket.emit("queue:error", "Daily limit reached");
    return;
  }

  // enqueue
  await enqueueUser(deviceId, preference);

  socket.emit("queue:joined", {
    preference,
  });
}
