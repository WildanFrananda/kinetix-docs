import type { JsonValue } from "../types/json_value.type";
import type { RestSocketFrame } from "../types/rest_socket_frame.type";
import type { RestSocketMessage } from "../types/rest_socket_message.type";
import type { RestSocketReply } from "../types/rest_socket_reply.type";

const frameWidest = 56;
const lineWidest = 64;

function compact(value: JsonValue): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => compact(item)).join(", ")}]`;
  }

  if (value !== null && typeof value === "object") {
    return `{${Object.entries(value)
      .map(([key, item]) => `${JSON.stringify(key)}: ${compact(item)}`)
      .join(", ")}}`;
  }

  return JSON.stringify(value);
}

function layout(value: JsonValue, indent: string, lead: number): string {
  const line = compact(value);

  if (lead + line.length <= lineWidest || value === null || typeof value !== "object") {
    return line;
  }

  const inner = `${indent}  `;

  if (Array.isArray(value)) {
    const items = value.map((item) => `${inner}${layout(item, inner, inner.length)}`);

    return `[\n${items.join(",\n")}\n${indent}]`;
  }

  const entries = Object.entries(value).map(([key, item]) => {
    const prefix = `${inner}${JSON.stringify(key)}: `;

    return `${prefix}${layout(item, inner, prefix.length)}`;
  });

  return `{\n${entries.join(",\n")}\n${indent}}`;
}

export function frameCode(frame: RestSocketFrame): string {
  const line = compact(frame);

  if (line.length <= frameWidest) {
    return line;
  }

  return layout(frame, "", lineWidest);
}

export function replyFrame(message: RestSocketMessage, reply: RestSocketReply): RestSocketFrame {
  const [joinRef, ref, topic] = message.frame;

  return [joinRef, ref, topic, "phx_reply", { status: reply.status, response: reply.response }];
}
