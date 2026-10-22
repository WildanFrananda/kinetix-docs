import type { RestEndpoint } from "../types/rest_endpoint.type";
import { restHosts } from "./rest_hosts";

export function requestLine(endpoint: RestEndpoint): string {
  return `${endpoint.method} https://${restHosts[endpoint.host ?? "api"]}${endpoint.request.target}`;
}
