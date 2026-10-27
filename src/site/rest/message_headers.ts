import type { RestMessage } from "../types/rest_message.type";
import type { RestSocket } from "../types/rest_socket.type";
import { bff } from "./bff";
import { restHosts } from "./rest_hosts";
import { webAppHosts } from "./web_app_hosts";

export function messageHeaders(message: RestMessage): readonly string[] {
  const headers = message.headers ?? [];

  if (message.json !== undefined) {
    return [...headers, `Content-Type: ${message.contentType ?? "application/json"}`];
  }

  if (message.raw !== undefined && message.contentType !== undefined) {
    return [...headers, `Content-Type: ${message.contentType}`];
  }

  return headers;
}

export function socketHeaders(socket: RestSocket): readonly string[] {
  if (socket.via === undefined) {
    return messageHeaders(socket.request);
  }

  return [
    `Cookie: ${bff.sessionCookie}=<session>`,
    `Origin: https://${restHosts[webAppHosts[socket.via]]}`,
    ...messageHeaders(socket.request)
  ];
}
