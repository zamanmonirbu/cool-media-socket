const io = require("socket.io")(8800, {
  cors: {
    origin: "https://cool-media-client.vercel.app",
  },
});


let activeUsers = [];

io.on("connection", (socket) => {
  socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      // console.log("New User Connected", activeUsers);
    }
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    // console.log("User Disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
    }
  });

  // handle love reaction notification
  socket.on("send-love-notification", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    // console.log("Sending love notification to :", receiverId);
    if (user) {
      io.to(user.socketId).emit("receive-love-notification", data);
    }
  });

  // handle comment notification
  socket.on("send-comment-notification", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    // console.log("Sending comment notification to :", receiverId);
    if (user) {
      io.to(user.socketId).emit("receive-comment-notification", data);
    }
  });
});
