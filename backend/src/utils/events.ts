import { Room } from "./types";
import { UUID } from "crypto";

export type CallbackFn<T = string> = (success: boolean, data?: T) => void;

export interface ServerToClientEvents {
  updateRoom: (hostName: string, players: string[]) => void;
  startGame: (board: string[][]) => void;
  abortGame: () => void;
  playerScored: (playerName: string, scoreIncrease: number, newScore: number) => void;
  endGame: (scores: Record<string, number>, histories: Record<string, string[]>) => void;
}

export interface ClientToServerEvents {
  createRoom: (playerName: string, callback: CallbackFn) => void;
  joinRoom: (roomUuid: UUID, playerName: string, callback: CallbackFn<string | Room>) => void;
  leaveRoom: (playerName: string) => void;

  /** for the host to emit */
  startGame: () => void;
  /** any player submits a word */
  updateScore: (word: string, scoreIncrease: number) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  playerName: string;
}
