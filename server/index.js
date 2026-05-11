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

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });

  // Remote Buttons
  socket.on("remote-command", ({ roomId, command }) => {
    io.to(roomId).emit("receive-command", command);
  });

  // Send Link
  socket.on("send-link", ({ roomId, link }) => {
    io.to(roomId).emit("receive-link", link);
  });

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});