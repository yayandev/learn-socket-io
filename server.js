import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
const app = express();
const server = createServer(app);
const io = new Server(server);
const prisma = new PrismaClient();
app.get("/", (req, res) => {
  res.sendFile(new URL("./index.html", import.meta.url).pathname);
});

dotenv.config();

io.on("connection", (socket) => {
  socket.on("user", (user) => {
    console.log(user + " connected");
    socket.on("disconnect", () => {
      console.log(user + " disconnected");
    });
  });

  socket.on("chat message", (value) => {
    prisma.chat
      .create({
        data: {
          message: value.msg,
          sender: value.username,
        },
      })
      .then((result) => {
        io.emit("chat message", result);
        console.log(result);
      });
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
