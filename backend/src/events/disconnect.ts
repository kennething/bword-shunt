import { players, rooms } from "../utils/data";
import { SocketType } from "../utils/types";

export function disconnect(socket: SocketType): void {
  const playerName = socket.data.playerName;
  const roomUuid = players.get(playerName);
  if (!roomUuid) return;

  const room = rooms.get(roomUuid);
  if (!room) return;

  room.removePlayer(playerName);
  players.delete(playerName);

  if (room.players.length === 0) rooms.delete(roomUuid);
}
