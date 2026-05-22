import {User} from "../model/user.model.js";

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    
    // user join (frontend se userId bhejna hoga)
    socket.on("join", (userId) => {
      socket.userId = userId;
      console.log("User joined:", userId);
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.userId);

      try {
        if (socket.userId) {
          await User.findByIdAndUpdate(socket.userId, {
            lastSeen: new Date(),
          });
        }
      } catch (err) {
        console.error("lastSeen update failed:", err.message);
      }
    });
  });
};