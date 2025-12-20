import { Server } from "socket.io";
import http from "http";
import { env } from "./env";

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: env.APP_ORIGIN ||"http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth?.userId as string | undefined;

    //console.log("SOCKET CONNECTED:", socket.id);
    //console.log("AUTH USER ID:", userId);

   
    if (userId) {
      socket.join(`user:${userId}`);
     // console.log(`User ${userId} joined room user:${userId}`);
    }

    socket.on("disconnect", () => {
      //console.log("SOCKET DISCONNECTED:", socket.id);
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
