import { matchingSocketMessages, matchingSockets } from "./sockets/matching";
import type { RestSocket } from "../types/rest_socket.type";
import type { RestSocketMessage } from "../types/rest_socket_message.type";

export const restSockets: readonly RestSocket[] = [...matchingSockets];

export const restSocketMessages: readonly RestSocketMessage[] = [...matchingSocketMessages];

export function restSocket(id: string): RestSocket {
  const socket = restSockets.find((candidate) => candidate.id === id);

  if (socket === undefined) {
    throw new Error(`no socket "${id}"`);
  }

  return socket;
}

export function restSocketMessage(id: string): RestSocketMessage {
  const message = restSocketMessages.find((candidate) => candidate.id === id);

  if (message === undefined) {
    throw new Error(`no socket message "${id}"`);
  }

  return message;
}
