import type { RestMessage } from "../types/rest_message.type";
import type { RestPayload } from "../types/rest_payload.type";

export function messagePayload(message: RestMessage): RestPayload | undefined {
  if (message.json !== undefined) {
    return { lang: "json", code: JSON.stringify(message.json, null, 2) };
  }

  if (message.raw !== undefined) {
    const json = message.contentType !== undefined && message.contentType.includes("json");

    return { lang: json ? "json" : "text", code: message.raw };
  }

  return undefined;
}
