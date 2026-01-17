import { players, rooms } from "../utils/data";
import { CallbackFn } from "../utils/events";
import { SocketType } from "../utils/types";
import { UUID } from "crypto";

export function joinRoom(socket: SocketType, roomUuid: UUID, playerName: string, callback: CallbackFn): void {
  const room = rooms.get(roomUuid);
  if (!room) return callback(false, "Room does not exist");

  if (players.has(playerName)) return callback(false, "Player name already taken");
  players.set(playerName, roomUuid);
  room.addPlayer(playerName);
  socket.join(roomUuid);

  socket.data.playerName = playerName;
  callback(true);
}
