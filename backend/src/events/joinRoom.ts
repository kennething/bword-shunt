import { Room, ServerType, SocketType } from "../utils/types";
import { players, rooms } from "../utils/data";
import { CallbackFn } from "../utils/events";
import { UUID } from "crypto";

export function joinRoom(io: ServerType, socket: SocketType, roomUuid: UUID, playerName: string, callback: CallbackFn<string | Room>): void {
  const room = rooms.get(roomUuid);
  if (!room) return callback(false, "Room does not exist");
  if (room.players.length >= 68) return callback(false, "Room is full");

  if (players.has(playerName)) return callback(false, "Player name already taken");
  players.set(playerName, roomUuid);
  room.addPlayer(playerName);
  socket.join(roomUuid);

  socket.data.playerName = playerName;
  callback(true, room);

  socket.emit("updateRoom", room.hostName, room.players);
  io.to(roomUuid).emit("updateRoom", room.hostName, room.players);
}
