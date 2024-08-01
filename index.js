/*
* Title: Cool-media.
* Description: Cool-media real-time notifications and messaging using Socket.IO.
* Author: Md. Moniruzzaman
* Date: 02-August-2024
*/

const io = require("socket.io")(8800, {
  cors: {
    origin: "*",  // Allows connections from any origin
  },
});

let activeUsers = [];

// Handle new user connection
io.on("connection", (socket) => {
  // When a new user is added
  socket.on("new-user-add", (newUserId) => {
    // Add user if not already in the list
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      // console.log("New User Connected", activeUsers);
    }
    // Notify all users of the updated list
    io.emit("get-users", activeUsers);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    // Remove user from the list
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    // console.log("User Disconnected", activeUsers);
    // Notify all users of the updated list
    io.emit("get-users", activeUsers);
  });

  // Handle sending messages to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      // Send message to the specified user
      io.to(user.socketId).emit("receive-message", data);
    }
  });

  // Handle sending love reaction notifications
  socket.on("send-love-notification", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    // console.log("Sending love notification to :", receiverId);
    if (user) {
      // Send love notification to the specified user
      io.to(user.socketId).emit("receive-love-notification", data);
    }
  });

  // Handle sending comment notifications
  socket.on("send-comment-notification", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    // console.log("Sending comment notification to :", receiverId);
    if (user) {
      // Send comment notification to the specified user
      io.to(user.socketId).emit("receive-comment-notification", data);
    }
  });
});
