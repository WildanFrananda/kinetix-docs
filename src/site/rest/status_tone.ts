import type { RestTone } from "../types/rest_tone.type";

export function statusTone(status: number): RestTone {
  if (status < 300) {
    return "green";
  }

  if (status < 400) {
    return "blue";
  }

  if (status < 500) {
    return "orange";
  }

  return "red";
}
