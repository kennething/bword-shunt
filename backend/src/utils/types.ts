import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "./events";
import { Server, type Socket } from "socket.io";
import { UUID } from "crypto";

export type ServerType = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type SocketType = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

/** Represents a game room */
export class Room {
  /** UUID for the room */
  uuid: UUID;
  /** Name of the host player */
  hostName: string;
  /** List of player names in the room, including the host */
  players: string[];
  /** Map of player names to their scores */
  playerScores = new Map<string, number>();
  /** Map of player names to their word history */
  playerHistory = new Map<string, string[]>();
  /** Game timer */
  private timer = 80;

  constructor(uuid: UUID, hostName: string) {
    this.uuid = uuid;
    this.hostName = hostName;
    this.players = [];
    this.addPlayer(hostName);
  }

  /** Adds a player to the room
   * @param playerName - The name of the player to add
   */
  addPlayer(playerName: string): void {
    this.players.push(playerName);
    this.playerScores.set(playerName, 0);
    this.playerHistory.set(playerName, []);
  }

  /** Removes a player from the room
   * @param playerName - The name of the player to remove
   */
  removePlayer(playerName: string): void {
    this.players = this.players.filter((name) => name !== playerName);
    this.playerScores.delete(playerName);
    this.playerHistory.delete(playerName);
  }

  /** Starts the game timer */
  async startTimer(): Promise<void> {
    this.timer = 80;

    let isDone = false;
    const intervalId = setInterval(() => {
      if (this.timer <= 0) {
        clearInterval(intervalId);
        isDone = true;
      }

      this.timer--;
    }, 1000);

    while (!isDone) await new Promise((resolve) => setTimeout(resolve, 100));
  }

  /** Updates the score of a player
   * @param playerName - The name of the player whose score is to be updated
   * @param score - The score to add to the player's current score
   */
  updatePlayerScore(playerName: string, score: number): void {
    if (!this.playerScores.has(playerName)) return;

    const currentScore = this.playerScores.get(playerName)!;
    this.playerScores.set(playerName, currentScore + score);
  }

  /** Adds a word to a player's history
   * @param playerName - The name of the player
   * @param word - The word to add
   */
  addPlayerWord(playerName: string, word: string): void {
    if (!this.playerHistory.has(playerName)) return;

    const history = this.playerHistory.get(playerName)!;
    history.push(word);
    this.playerHistory.set(playerName, history);
  }

  /** Resets player scores and histories for a new game */
  reset(): void {
    this.playerScores.clear();
    this.playerHistory.clear();
    for (const player of this.players) {
      this.playerScores.set(player, 0);
      this.playerHistory.set(player, []);
    }
  }
}
