import { Server } from "socket.io";
import http from "http";
import { addSocketUser, removeSocketUser } from "../utils/socketUsers";
let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "https://your-frontend.vercel.app",
      ],
      credentials: true,
    },
  });

io.on("connection", (socket) => {
  const userId = socket.handshake.auth?.userId;

  if (userId) {
    addSocketUser(userId, socket.id);
  }

  socket.on("disconnect", () => {
    removeSocketUser(socket.id);
  });
});

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
