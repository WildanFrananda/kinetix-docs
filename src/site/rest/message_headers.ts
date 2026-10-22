import type { RestMessage } from "../types/rest_message.type";

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
