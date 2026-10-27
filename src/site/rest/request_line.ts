import type { RestEndpoint } from "../types/rest_endpoint.type";
import type { RestWebApp } from "../types/rest_web_app.type";
import { bff } from "./bff";
import { restHosts } from "./rest_hosts";
import { webAppHosts } from "./web_app_hosts";

export function requestLine(endpoint: RestEndpoint, via: RestWebApp | undefined): string {
  if (via === undefined) {
    return `${endpoint.method} https://${restHosts[endpoint.host ?? "api"]}${endpoint.path}`;
  }

  const prefix = endpoint.service === "edge" ? "" : bff.prefix;

  return `${endpoint.method} https://${restHosts[webAppHosts[via]]}${prefix}${endpoint.path}`;
}
