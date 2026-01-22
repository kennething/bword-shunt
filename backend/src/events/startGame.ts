import { generateBoard, getRandomItem } from "../../../frontend/app/utils/functions";
import { ServerType, SocketType } from "../utils/types";
import { players, rooms } from "../utils/data";

const wordEndings = ["", "s", "e", "es", "ed", "ng", "ngs", "ing", "ings", "es", "er", "ers", "ate", "ates", "or", "ors", "on", "ons"];

export function startGame(io: ServerType, socket: SocketType): void {
  const selectedPattern = getRandomItem(wordEndings);
  console.log(`🟩🟩🟩 ${new Date().toLocaleString()} -> ${selectedPattern}`);
  const board = generateBoard(selectedPattern, ["j", "q", "u", "v", "w", "x", "y", "z"]);

  const playerName = socket.data.playerName;
  const roomUuid = players.get(playerName);
  if (!roomUuid) return;

  const room = rooms.get(roomUuid);
  if (!room) return;
  if (room.hostName !== playerName) return;
  if (room.players.length < 2) return;

  io.to(roomUuid).emit("startGame", board);

  setTimeout(async () => {
    await room.startTimer();

    io.to(roomUuid).emit("endGame", Object.fromEntries(room.playerScores.entries()), Object.fromEntries(room.playerHistory.entries()));
    room.reset();
  }, 5000);
}
