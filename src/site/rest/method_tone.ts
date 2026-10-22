import type { RestMethod } from "../types/rest_method.type";
import type { RestTone } from "../types/rest_tone.type";

const tones: Readonly<Record<RestMethod, RestTone>> = {
  GET: "blue",
  POST: "green",
  PUT: "orange",
  PATCH: "orange",
  DELETE: "red"
};

export function methodTone(method: RestMethod): RestTone {
  return tones[method];
}
