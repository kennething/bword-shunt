import { ServerType, SocketType } from "../utils/types";
import { players, rooms } from "../utils/data";

export function leaveRoom(io: ServerType, socket: SocketType, playerName: string): void {
  const roomUuid = players.get(playerName);
  if (!roomUuid) return;

  const room = rooms.get(roomUuid);
  if (!room) return;

  if (socket.data.playerName === playerName) socket.leave(roomUuid);
  room.removePlayer(playerName);
  players.delete(playerName);

  if (room.players.length === 0) return void rooms.delete(roomUuid);
  if (!room.players.includes(room.hostName)) room.hostName = room.players[0];

  socket.emit("updateRoom", room.hostName, room.players);
  io.to(roomUuid).emit("updateRoom", room.hostName, room.players);
}
