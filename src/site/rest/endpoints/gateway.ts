import type { RestCase } from "../../types/rest_case.type";
import type { RestEndpoint } from "../../types/rest_endpoint.type";
import { kongSource } from "../kong_source";
import { restSource } from "../rest_source";

const json = "application/json; charset=utf-8";
const plain = "text/plain; charset=utf-8";
const requestId = "b9a1f0c4e2d34a7c9f1e6d2b8a4c0e1f";
const challenge = 'WWW-Authenticate: Bearer error="invalid_token"';

function kongError(message: string): string {
  return `{\n  "message":"${message}",\n  "request_id":"${requestId}"\n}`;
}

export const gatewayAnswers: readonly RestCase[] = [
  {
    status: 401,
    when: "rest.gateway.answers.noToken",
    headers: ["WWW-Authenticate: Bearer"],
    contentType: json,
    raw: '{"message":"Unauthorized"}',
    source: kongSource("kong/plugins/jwt/handler.lua", 160, 165)
  },
  {
    status: 401,
    when: "rest.gateway.answers.multipleTokens",
    headers: [challenge],
    contentType: json,
    raw: '{"message":"Multiple tokens provided"}',
    source: kongSource("kong/plugins/jwt/handler.lua", 160, 167)
  },
  {
    status: 401,
    when: "rest.gateway.answers.badToken",
    headers: [challenge],
    contentType: json,
    raw: '{"message":"Bad token; invalid JSON"}',
    source: kongSource("kong/plugins/jwt/handler.lua", 174, 177)
  },
  {
    status: 401,
    when: "rest.gateway.answers.noIssuer",
    headers: [challenge],
    contentType: json,
    raw: "{\"message\":\"No mandatory 'iss' in claims\"}",
    source: kongSource("kong/plugins/jwt/handler.lua", 182, 187)
  },
  {
    status: 401,
    when: "rest.gateway.answers.unknownIssuer",
    headers: [challenge],
    contentType: json,
    raw: "{\"message\":\"No credentials found for given 'iss'\"}",
    source: kongSource("kong/plugins/jwt/handler.lua", 197, 199)
  },
  {
    status: 401,
    when: "rest.gateway.answers.algorithm",
    headers: [challenge],
    contentType: json,
    raw: '{"message":"Invalid algorithm"}',
    source: kongSource("kong/plugins/jwt/handler.lua", 204, 206)
  },
  {
    status: 401,
    when: "rest.gateway.answers.signature",
    headers: [challenge],
    contentType: json,
    raw: '{"message":"Invalid signature"}',
    source: kongSource("kong/plugins/jwt/handler.lua", 226, 228)
  },
  {
    status: 401,
    when: "rest.gateway.answers.expired",
    headers: [challenge],
    contentType: json,
    raw: '{"exp":"token expired"}',
    source: kongSource("kong/plugins/jwt/jwt_parser.lua", 405, 412)
  },
  {
    status: 401,
    when: "rest.gateway.answers.noExpiry",
    headers: [challenge],
    contentType: json,
    raw: '{"exp":"must be a number"}',
    source: kongSource("kong/plugins/jwt/jwt_parser.lua", 434, 435)
  },
  {
    status: 404,
    when: "rest.gateway.answers.noRoute",
    contentType: json,
    raw: kongError("no Route matched with those values"),
    source: kongSource("kong/runloop/handler.lua", 1190, 1198)
  },
  {
    status: 413,
    when: "rest.gateway.answers.tooLarge",
    contentType: json,
    raw: kongError("Request size limit exceeded"),
    source: kongSource("kong/plugins/request-size-limiting/handler.lua", 31, 40)
  },
  {
    status: 429,
    when: "rest.gateway.answers.rateLimited",
    headers: [
      "Retry-After: 17",
      "RateLimit-Limit: 100",
      "RateLimit-Remaining: 0",
      "RateLimit-Reset: 17",
      "X-RateLimit-Limit-Minute: 100",
      "X-RateLimit-Remaining-Minute: 0"
    ],
    contentType: json,
    raw: kongError("API rate limit exceeded"),
    source: kongSource("kong/plugins/rate-limiting/handler.lua", 194, 201)
  },
  {
    status: 502,
    when: "rest.gateway.answers.badUpstream",
    contentType: plain,
    raw: `An invalid response was received from the upstream server\nrequest_id: ${requestId}`,
    source: kongSource("kong/error_handlers.lua", 13, 28)
  },
  {
    status: 503,
    when: "rest.gateway.answers.serviceDown",
    contentType: json,
    raw: kongError("name resolution failed"),
    source: kongSource("kong/runloop/balancer/init.lua", 378, 384)
  },
  {
    status: 504,
    when: "rest.gateway.answers.timeout",
    contentType: plain,
    raw: `The upstream server is timing out\nrequest_id: ${requestId}`,
    source: kongSource("kong/error_handlers.lua", 50, 91)
  }
];

export const gatewayEndpoints: readonly RestEndpoint[] = [
  {
    id: "gateway.health",
    service: "gateway",
    method: "GET",
    path: "/health",
    summary: "rest.gateway.health.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.gateway.health.who"
    },
    request: {
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.gateway.health.case.up",
        contentType: "application/json",
        raw: '{"status":"ok","gateway":"kinetix-api-gateway","engine":"Kong/DB-less (Apple Pkl)"}',
        source: restSource("gateway", "config/gateway.pkl", 14, 35)
      }
    ],
    source: restSource("gateway", "config/gateway.pkl", 14, 35)
  }
];
