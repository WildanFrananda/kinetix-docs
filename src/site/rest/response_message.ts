import type { RestCase } from "../types/rest_case.type";
import { messageBody } from "./message_body";
import { statusReasons } from "./status_reasons";

export function responseMessage(entry: RestCase): string {
  const reason = statusReasons[entry.status];

  if (reason === undefined) {
    throw new Error(`no reason phrase for status ${entry.status}`);
  }

  return [`HTTP/1.1 ${entry.status} ${reason}`, ...messageBody(entry)].join("\n");
}
