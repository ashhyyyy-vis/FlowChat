import { io } from "../server";
import { authenticateSocketDevice } from "./middleware/deviceAuth";
import { handleEnterQueue } from "./handlers/queue.handlers";

io.use(authenticateSocketDevice);

io.on("connection", (socket) => {

  socket.on("queue:enter", async () => {
  try {
    await handleEnterQueue(socket);
  } catch (err) {
    console.error(err);
    socket.emit("queue:error", "Internal error");
  }
});


  // 👇 ADD THIS HERE
  socket.on("chat:message", ({ roomId, message }) => {
  if (!roomId || !message) return;
  if (!socket.rooms.has(roomId)) return;

  socket.to(roomId).emit("chat:message", {
    from: socket.data.deviceId,
    message,
  });
});

  socket.on("chat:leave", ({ roomId }) => {
    if (!roomId) return;

    socket.leave(roomId);

    socket.to(roomId).emit("chat:ended", {
      reason: "peer_left",
    });
  });
  socket.on("chat:next", async ({ roomId }) => {
  if (!roomId) return;

  // leave current room
  socket.leave(roomId);

  socket.to(roomId).emit("chat:ended", {
    reason: "peer_next",
  });

  // re-enter queue using existing logic
  await handleEnterQueue(socket);
});

  socket.on("disconnect", () => {
  const rooms = Array.from(socket.rooms);

  rooms.forEach((roomId) => {
    // socket.id is always a room — skip it
    if (roomId !== socket.id) {
      socket.to(roomId).emit("chat:ended", {
        reason: "peer_disconnected",
      });
    }
  });
});

});
