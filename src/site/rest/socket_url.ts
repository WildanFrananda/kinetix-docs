import type { RestSocket } from "../types/rest_socket.type";
import { bff } from "./bff";
import { restOrigins } from "./rest_origins";
import { socketOrigin } from "./socket_origin";
import { webAppHosts } from "./web_app_hosts";

export function socketUrl(socket: RestSocket): string {
  const query = socket.query === undefined || socket.query === "" ? "" : `?${socket.query}`;

  if (socket.via !== undefined) {
    return `${socketOrigin(restOrigins[webAppHosts[socket.via]])}${bff.prefix}${socket.path}${query}`;
  }

  return `${socketOrigin(restOrigins[socket.host ?? "api"])}${socket.path}${query}`;
}
