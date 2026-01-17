import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./events";
import { type Socket } from "socket.io";
import { UUID } from "crypto";

export type SocketType = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

/** Represents a game room */
export class Room {
  /** UUID for the room */
  uuid: UUID;
  /** Name of the host player */
  hostName: string;
  /** List of player names in the room, including the host */
  players: string[];

  constructor(uuid: UUID, hostName: string) {
    this.uuid = uuid;
    this.hostName = hostName;
    this.players = [hostName];
  }

  /** Adds a player to the room */
  addPlayer(playerName: string): void {
    this.players.push(playerName);
  }

  /** Removes a player from the room */
  removePlayer(playerName: string): void {
    this.players = this.players.filter((name) => name !== playerName);
  }
}
