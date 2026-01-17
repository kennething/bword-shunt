import { UUID } from "crypto";

export type CallbackFn = (success: boolean, message?: string) => void;

export interface ServerToClientEvents {}

export interface ClientToServerEvents {
  createRoom: (playerName: string, callback: CallbackFn) => void;
  joinRoom: (roomUuid: UUID, playerName: string, callback: CallbackFn) => void;
  leaveRoom: (playerName: string) => void;
  submitName: (name: string, callback: CallbackFn) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  playerName: string;
}
