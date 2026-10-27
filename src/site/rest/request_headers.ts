import type { RestEndpoint } from "../types/rest_endpoint.type";
import type { RestWebApp } from "../types/rest_web_app.type";
import { bff } from "./bff";
import { changesState } from "./changes_state";
import { messageHeaders } from "./message_headers";
import { restHosts } from "./rest_hosts";
import { webAppHosts } from "./web_app_hosts";

function browserHeaders(endpoint: RestEndpoint, via: RestWebApp): readonly string[] {
  const cookie = endpoint.service === "edge" ? [] : [`Cookie: ${bff.sessionCookie}=<session>`];
  const origin = changesState(endpoint.method) ? [`Origin: https://${restHosts[webAppHosts[via]]}`] : [];

  return [...cookie, ...origin];
}

export function requestHeaders(endpoint: RestEndpoint, via: RestWebApp | undefined): readonly string[] {
  if (via !== undefined) {
    return [...browserHeaders(endpoint, via), ...messageHeaders(endpoint.request)];
  }

  const authorization = endpoint.access.token === "required" ? ["Authorization: Bearer <access token>"] : [];

  return [...authorization, ...messageHeaders(endpoint.request)];
}
