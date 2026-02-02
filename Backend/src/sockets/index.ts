import { io } from "../server";
import { authenticateSocketDevice } from "./middleware/deviceAuth";
import { handleEnterQueue } from "./handlers/queue.handlers";

io.use(authenticateSocketDevice);

io.on("connection", (socket) => {
  const deviceId = socket.data.deviceId;

  console.log("Socket connected:", socket.id, "Device:", deviceId);

  socket.on("queue:enter", async (preference) => {
    try {
      await handleEnterQueue(socket, preference);
    } catch (err) {
      console.error(err);
      socket.emit("queue:error", "Internal error");
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id, "Device:", deviceId);
  });
});
