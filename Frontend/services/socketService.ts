import { io, Socket } from "socket.io-client";
import { getStableDeviceId } from "./deviceService";

const SOCKET_URL = "http://localhost:3000";

let socket: Socket | null = null;

export const getSocket = async (): Promise<Socket> => {
    if (socket?.connected) return socket;

    const deviceId = await getStableDeviceId();

    socket = io(SOCKET_URL, {
        auth: {
            deviceId,
        },
        transports: ["websocket"],
        autoConnect: true,
    });

    socket.on("connect", () => {
        console.log("Socket connected:", socket?.id);
    });

    socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
