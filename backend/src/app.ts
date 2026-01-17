import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./utils/events";
import { createRoom } from "./events/createRoom";
import { disconnect } from "./events/disconnect";
import express, { Router } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import "dotenv/config";
import fs from "fs";
import { joinRoom } from "./events/joinRoom";

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
  console.log("a");
  socket.on("createRoom", (playerName, callback) => createRoom(socket, playerName, callback));
  socket.on("joinRoom", (roomUuid, playerName, callback) => joinRoom(socket, roomUuid, playerName, callback));
  socket.on("disconnect", () => disconnect(socket));
});

const port = Number(process.env.PORT) || 6969;
server.listen(port, "0.0.0.0", () => console.log(`Server is up on port ${port}`));
