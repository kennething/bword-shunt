import { ServerType, SocketType } from "../utils/types";
import { players, rooms } from "../utils/data";

export function disconnect(io: ServerType, socket: SocketType): void {
  const playerName = socket.data.playerName;
  const roomUuid = players.get(playerName);
  if (!roomUuid) return;

  const room = rooms.get(roomUuid);
  if (!room) return;

  room.removePlayer(playerName);
  players.delete(playerName);

  if (room.players.length === 0) return void rooms.delete(roomUuid);
  if (!room.players.includes(room.hostName)) room.hostName = room.players[0];

  io.to(roomUuid).emit("updateRoom", room.hostName, room.players);
}
