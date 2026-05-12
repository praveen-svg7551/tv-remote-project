const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {

  console.log("Connected:", socket.id);

  // Join room
  socket.on("join-room", (roomId) => {

    socket.join(roomId);

    console.log("Joined Room:", roomId);

  });

  // Remote buttons
  socket.on("remote-command", ({ roomId, command }) => {

    io.to(roomId).emit("receive-command", command);

  });

  // Send website link
  socket.on("send-link", ({ roomId, link }) => {

    console.log("LINK:", link);

    io.to(roomId).emit("receive-link", link);

  });

  // Mouse movement
  socket.on("mouse-move", ({ roomId, x, y }) => {

    io.to(roomId).emit("mouse-update", {
      x,
      y,
    });

  });

  // Mouse click
  socket.on("mouse-click", ({ roomId }) => {

    io.to(roomId).emit("mouse-clicked");

  });

  socket.on("disconnect", () => {

    console.log("Disconnected:", socket.id);

  });

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {

  console.log(`Server running on ${PORT}`);

});