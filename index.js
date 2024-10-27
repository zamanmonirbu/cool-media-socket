const io = require("socket.io")(8800, {
  cors: {
    origin: "*",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // console.log("A user connected with socket ID:", socket.id);

  socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      // console.log(`User ${newUserId} connected. Active users:`, activeUsers);
    }
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    // console.log(`User with socket ID ${socket.id} disconnected. Active users:`, activeUsers);
    io.emit("get-users", activeUsers);
  });

  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
      // console.log(`Message sent to user ${receiverId}. Data:`, data);
    } else {
      // console.log(`User ${receiverId} not found for message.`);
    }
  });

  socket.on("new-order", (orderData) => {
    const { sellerId, orderDetails } = orderData;
    const seller = activeUsers.find((user) => user.userId === sellerId);
    if (seller) {
      io.to(seller.socketId).emit("receive-order-notification", {
        message: `You have a new order! Order details: ${orderDetails}`,
        orderDetails: orderDetails,
      });
      // console.log(`Order notification sent to seller ${sellerId}. Order details:`, orderDetails);
    } else {
      // console.log(`Seller ${sellerId} not found for order notification.`);
    }
  });
});
