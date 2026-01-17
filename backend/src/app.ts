import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./utils/events";
import { updateScore } from "./events/updateScore";
import { createRoom } from "./events/createRoom";
import { disconnect } from "./events/disconnect";
import { startGame } from "./events/startGame";
import { leaveRoom } from "./events/leaveRoom";
import { joinRoom } from "./events/joinRoom";
import express, { Router } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import "dotenv/config";
import fs from "fs";

const app = express();
app.use(cors()).use(express.json());

const projectRoot = process.cwd();
const routesDir = path.join(projectRoot, "src", "routes");
fs.readdirSync(routesDir).forEach(async (file) => {
  if (!file.endsWith(".ts")) return;

  const routePath = path.join(routesDir, file);
  const router = (await import(routePath)).default as Router;
  app.use("/", router);
});

const server = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, { cors: {} });

io.on("connection", (socket) => {
  socket.on("createRoom", (playerName, callback) => createRoom(socket, playerName, callback));
  socket.on("joinRoom", (roomUuid, playerName, callback) => joinRoom(io, socket, roomUuid, playerName, callback));
  socket.on("leaveRoom", (playerName) => leaveRoom(io, socket, playerName));
  socket.on("startGame", () => startGame(io, socket));
  socket.on("updateScore", (word, scoreIncrease) => updateScore(io, socket, word, scoreIncrease));
  socket.on("disconnect", () => disconnect(io, socket));
});

const port = Number(process.env.PORT) || 6969;
server.listen(port, "0.0.0.0", () => console.log(`Server is up on port ${port}`));
