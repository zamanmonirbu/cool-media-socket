const io = require("socket.io")(8800, {
  cors: {
    origin: "https://cool-media-fronend.netlify.app",
  },
});

// http://localhost:8800

let activeUsers = [];

io.on("connection", (socket) => {
  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId);
    console.log("Data: ", data);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
    }
  });

  // handle love reaction notification
  socket.on("send-love-notification", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending love notification to :", receiverId);
    console.log("Data: ", data);
    if (user) {
      io.to(user.socketId).emit("receive-love-notification", data);
    }
  });

  // handle comment notification
  socket.on("send-comment-notification", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending comment notification to :", receiverId);
    console.log("Data: ", data);
    if (user) {
      io.to(user.socketId).emit("receive-comment-notification", data);
    }
  });
});
