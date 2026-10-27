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

const securityTxt = [
  "Contact: https://github.com/WildanFrananda/kinetix-docs/security/advisories/new",
  "Expires: 2027-10-21T00:00:00.000Z",
  "Preferred-Languages: en, id",
  "Canonical: https://api.wildanfrananda.my.id/.well-known/security.txt",
  "Policy: https://docs.wildanfrananda.my.id/reference/report-a-vulnerability/",
  ""
].join("\n");

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
    status: 403,
    when: "rest.gateway.answers.staffNetwork",
    contentType: json,
    raw: kongError("This route is not available from your network"),
    source: kongSource("kong/plugins/ip-restriction/handler.lua", 84, 91)
  },
  {
    status: 404,
    when: "rest.gateway.answers.noRoute",
    contentType: json,
    raw: kongError("no Route matched with those values"),
    source: kongSource("kong/runloop/handler.lua", 1190, 1198)
  },
  {
    status: 404,
    when: "rest.gateway.answers.appHost",
    contentType: json,
    raw: '{"message":"Not found"}',
    source: kongSource("kong/plugins/request-termination/handler.lua", 72, 73)
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
    source: kongSource("kong/runloop/balancer/init.lua", 380, 385)
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
        raw: '{"status":"ok"}',
        source: restSource("gateway", "config/gateway.pkl", 162, 169)
      }
    ],
    source: restSource("gateway", "config/gateway.pkl", 157, 171)
  },
  {
    id: "gateway.securityTxt",
    service: "gateway",
    method: "GET",
    path: "/.well-known/security.txt",
    summary: "rest.gateway.securityTxt.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.gateway.securityTxt.who"
    },
    request: {
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.gateway.securityTxt.case.served",
        contentType: plain,
        raw: securityTxt,
        source: restSource("gateway", "config/gateway.pkl", 40, 47)
      }
    ],
    source: restSource("gateway", "config/gateway.pkl", 173, 187)
  }
];
