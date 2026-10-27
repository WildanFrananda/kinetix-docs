import type { RestSocket } from "../types/rest_socket.type";
import { bff } from "./bff";
import { restHosts } from "./rest_hosts";
import { webAppHosts } from "./web_app_hosts";

export function socketUrl(socket: RestSocket): string {
  if (socket.via !== undefined) {
    return `wss://${restHosts[webAppHosts[socket.via]]}${bff.prefix}${socket.path}?${socket.query}`;
  }

  return `wss://${restHosts[socket.host ?? "api"]}${socket.path}?${socket.query}`;
}
