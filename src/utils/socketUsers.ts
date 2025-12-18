const socketUsers = new Map<string, string>();

export const addSocketUser = (userId: string, socketId: string) => {
  socketUsers.set(userId, socketId);
};

export const removeSocketUser = (socketId: string) => {
  for (const [userId, sId] of socketUsers.entries()) {
    if (sId === socketId) {
      socketUsers.delete(userId);
      break;
    }
  }
};

export const getSocketIdByUser = (userId: string) => {
  return socketUsers.get(userId);
};
