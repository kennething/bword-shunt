import { generateBoard } from "../../../frontend/app/utils/functions";
import { ServerType, SocketType } from "../utils/types";
import { players, rooms } from "../utils/data";

export function startGame(io: ServerType, socket: SocketType): void {
  const board = generateBoard("", ["j", "q", "u", "v", "w", "x", "y", "z"]);

  const playerName = socket.data.playerName;
  const roomUuid = players.get(playerName);
  if (!roomUuid) return;

  const room = rooms.get(roomUuid);
  if (!room) return;
  if (room.hostName !== playerName) return;
  if (room.players.length < 2) return;

  let ready = 0;
  io.to(roomUuid).emit("startGame", board, (success) => {
    if (success) ready++;
  });

  setTimeout(async () => {
    if (ready !== room.players.length - 1) {
      io.to(roomUuid).emit("abortGame");
      return;
    }

    await room.startTimer();

    io.to(roomUuid).emit("endGame", Object.fromEntries(room.playerScores.entries()), Object.fromEntries(room.playerHistory.entries()));
    room.reset();
  }, 5000);
}
