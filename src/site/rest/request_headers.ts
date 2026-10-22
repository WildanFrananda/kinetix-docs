import type { RestEndpoint } from "../types/rest_endpoint.type";
import { messageHeaders } from "./message_headers";

export function requestHeaders(endpoint: RestEndpoint): readonly string[] {
  const authorization = endpoint.access.token === "required" ? ["Authorization: Bearer <access token>"] : [];

  return [...authorization, ...messageHeaders(endpoint.request)];
}
