const express = require("express");
// const http = require("http");
// const socketIo = require("socket.io");
const cors = require("cors");


const app = express();
const server = require("http").createServer(app);
// const io = socketIo(server);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
const PORT = process.env.PORT || 8080;
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("code-update", (data) => {
    console.log("connected");
    socket.broadcast.emit("code-update", data);

    io.sockets.emit(data);
    console.log("sent data");
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("start-typing", (username) => {
    // Broadcast a message to all clients to refresh their pages
    io.sockets.emit("refresh-page");
  });

  // socket.on('start-typing', (username) => {
  //   // Broadcast the username to other clients
  //   socket.broadcast.emit('user-typing', username);
  // });
  socket.emit("me", socket.id);
  console.log(socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
  socket.on("reconnect", (attemptNumber) => {
    console.log(`Reconnected after ${attemptNumber} attempts`);
  });
});

// When the user stops typing, emit a message

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
