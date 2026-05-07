import app from "./app.js"
import express from "express"
import http from "http"
import { Server } from "socket.io"
import Message from "./model/Message.js"
import User from "./model/User.js";
import path from "path";

app.get("/", (req, res) => {
  res.send("app is running....")
})

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLT_URL,
    credentials: true
  }
})

const onlineUsers = new Map();
io.on('connection', (socket) => {

  //register the user 
  socket.on('register', (userId) => {
    onlineUsers.set(userId, socket.id);


  });

  //send message event
  socket.on("sendMessage", async ({ receiverId, message }) => {

    const receiverSocketId = onlineUsers.get(receiverId);
    const senderSocketId = socket.id;

    try {
      // 1. Populate sender and receiver info from DB
      const populatedMessage = await Message.findById(message._id)
        .populate("sender", "username email")
        .populate("receiver", "username email");

      // 2. Emit to receiver if online
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", message);
      }

      // 3. Emit to sender
      if (senderSocketId) {
        io.to(senderSocketId).emit("receiveMessage", populatedMessage);
      }
    } catch (error) {
      console.error("Socket message error:", error.message);
    }
  });


  socket.on("sendNotification", async ({ userId, location }) => {

    try {
      const user = await User.find({ _id: { $ne: userId }, location });

      user.forEach(element => {


        const receiverSocketId = onlineUsers.get(element._id.toString());


        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveNotification", "notification");
          console.log("notification emitted")
        }
      });
    } catch (e) {
      console.log(e.message);
    }
  });




  socket.on("manualLogout", () => {
    for (const [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
        break;
      }
    }

  });
})


const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
