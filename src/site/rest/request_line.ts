import type { RestEndpoint } from "../types/rest_endpoint.type";
import type { RestWebApp } from "../types/rest_web_app.type";
import { bff } from "./bff";
import { restOrigins } from "./rest_origins";
import { webAppHosts } from "./web_app_hosts";

export function requestLine(endpoint: RestEndpoint, via: RestWebApp | undefined): string {
  if (via === undefined) {
    return `${endpoint.method} ${restOrigins[endpoint.host ?? "api"]}${endpoint.path}`;
  }

  const prefix = endpoint.service === "edge" ? "" : bff.prefix;

  return `${endpoint.method} ${restOrigins[webAppHosts[via]]}${prefix}${endpoint.path}`;
}
