import { ServerType, SocketType } from "../utils/types";
import { players, rooms } from "../utils/data";

export function updateScore(io: ServerType, socket: SocketType, word: string, scoreIncrease: number): void {
  const playerName = socket.data.playerName;
  const roomUuid = players.get(playerName);
  if (!roomUuid) return;

  const room = rooms.get(roomUuid);
  if (!room) return;

  room.updatePlayerScore(playerName, scoreIncrease);
  room.addPlayerWord(playerName, word);

  io.to(roomUuid).emit("playerScored", playerName, scoreIncrease, room.playerScores.get(playerName)!);
}
