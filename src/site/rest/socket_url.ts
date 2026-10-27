import type { RestSocket } from "../types/rest_socket.type";
import { restHosts } from "./rest_hosts";

export function socketUrl(socket: RestSocket): string {
  return `wss://${restHosts[socket.host ?? "api"]}${socket.path}?${socket.query}`;
}
