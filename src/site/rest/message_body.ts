import type { RestMessage } from "../types/rest_message.type";

export function messageBody(message: RestMessage): readonly string[] {
  const headers = message.headers ?? [];

  if (message.json !== undefined) {
    return [
      ...headers,
      `Content-Type: ${message.contentType ?? "application/json"}`,
      "",
      JSON.stringify(message.json, null, 2)
    ];
  }

  if (message.raw !== undefined) {
    const type = message.contentType === undefined ? [] : [`Content-Type: ${message.contentType}`];

    return [...headers, ...type, "", message.raw];
  }

  return headers;
}
