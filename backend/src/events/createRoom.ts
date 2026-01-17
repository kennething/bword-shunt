import { Room, SocketType } from "../utils/types";
import { players, rooms } from "../utils/data";
import { CallbackFn } from "../utils/events";
import { randomUUID } from "crypto";

export function createRoom(socket: SocketType, playerName: string, callback: CallbackFn): void {
  const roomUuid = randomUUID();

  if (players.has(playerName)) return callback(false, "Player name already taken");
  players.set(playerName, roomUuid);

  rooms.set(roomUuid, new Room(roomUuid, playerName));

  socket.join(roomUuid);
  socket.data.playerName = playerName;
  callback(true);
}
