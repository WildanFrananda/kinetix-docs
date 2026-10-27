import type { RestMethod } from "../types/rest_method.type";

export function changesState(method: RestMethod): boolean {
  return method !== "GET";
}
