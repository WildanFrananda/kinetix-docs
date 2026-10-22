import type { RestEndpoint } from "../types/rest_endpoint.type";
import { messageBody } from "./message_body";
import { restHosts } from "./rest_hosts";

export function requestMessage(endpoint: RestEndpoint): string {
  const authorization = endpoint.access.token === "required" ? ["Authorization: Bearer <access token>"] : [];

  return [
    `${endpoint.method} ${endpoint.request.target} HTTP/1.1`,
    `Host: ${restHosts[endpoint.host ?? "api"]}`,
    ...authorization,
    ...messageBody(endpoint.request)
  ].join("\n");
}
