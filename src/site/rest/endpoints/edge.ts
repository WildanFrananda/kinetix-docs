import type { RestCase } from "../../types/rest_case.type";
import type { RestEndpoint } from "../../types/rest_endpoint.type";
import { restSource } from "../rest_source";

const requestId = "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b";
const edgeRequestId = "a1b2c3d4e5f60718293a4b5c6d7e8f90";
const sessionValue = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
const pendingValue = "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB";
const attributes = "Path=/; Secure; HttpOnly; SameSite=Strict";
const noStore = "Cache-Control: no-store";
const sellerWebSession = `Set-Cookie: __Host-kx_session=${sessionValue}; ${attributes}; Max-Age=2592000`;
const backofficeSession = `Set-Cookie: __Host-kx_session=${sessionValue}; ${attributes}`;
const challengePending = `Set-Cookie: __Host-kx_pending=${pendingValue}; ${attributes}; Max-Age=300`;
const enrolmentPending = `Set-Cookie: __Host-kx_pending=${pendingValue}; ${attributes}; Max-Age=600`;
const expiredSession = `Set-Cookie: __Host-kx_session=; ${attributes}; Max-Age=0`;
const expiredPending = `Set-Cookie: __Host-kx_pending=; ${attributes}; Max-Age=0`;
const sendsSession = "Cookie: __Host-kx_session=<session>";
const sendsPending = "Cookie: __Host-kx_pending=<pending>";

export const edgeAnswers: readonly RestCase[] = [
  {
    status: 401,
    when: "rest.edge.answers.sessionRequired",
    headers: [noStore],
    json: {
      error: "SESSION_REQUIRED",
      message: "Sign in first.",
      requestId
    },
    source: restSource("edge", "src/http/session_use.tl", 29, 32)
  },
  {
    status: 401,
    when: "rest.edge.answers.sessionEnded",
    headers: [expiredSession, noStore],
    json: {
      error: "SESSION_ENDED",
      message: "The session has ended. Sign in again.",
      requestId
    },
    source: restSource("edge", "src/http/session_use.tl", 22, 42)
  },
  {
    status: 403,
    when: "rest.edge.answers.csrfRefused",
    headers: [noStore],
    json: {
      error: "CSRF_REFUSED",
      message: "This request did not come from the application's own page, so nothing was done.",
      requestId
    },
    source: restSource("edge", "src/http/router.tl", 161, 185)
  },
  {
    status: 403,
    when: "rest.edge.answers.roleRefused",
    headers: [expiredSession, noStore],
    json: {
      error: "ROLE_REFUSED",
      message: "This account cannot use this application.",
      requestId
    },
    source: restSource("edge", "src/http/session_use.tl", 52, 63)
  },
  {
    status: 404,
    when: "rest.edge.answers.notFound",
    headers: [noStore],
    json: {
      error: "NOT_FOUND",
      message: "Nothing is served at this path.",
      requestId
    },
    source: restSource("edge", "src/http/router.tl", 207, 210)
  },
  {
    status: 404,
    when: "rest.edge.answers.refusedPath",
    headers: [noStore],
    json: {
      error: "NOT_FOUND",
      message: "Nothing is served at this path.",
      requestId
    },
    source: restSource("edge", "src/http/forward.tl", 81, 84)
  },
  {
    status: 405,
    when: "rest.edge.answers.methodNotAllowed",
    headers: ["Allow: GET", noStore],
    json: {
      error: "METHOD_NOT_ALLOWED",
      message: "This path does not take that method.",
      requestId
    },
    source: restSource("edge", "src/http/router.tl", 214, 216)
  },
  {
    status: 413,
    when: "rest.edge.answers.payloadTooLarge",
    headers: [noStore],
    json: {
      error: "PAYLOAD_TOO_LARGE",
      message: "The request body is larger than the edge accepts.",
      requestId: edgeRequestId
    },
    source: restSource("edge", "nginx/nginx.conf", 39, 40)
  },
  {
    status: 414,
    when: "rest.edge.answers.uriTooLong",
    headers: [noStore],
    json: {
      error: "URI_TOO_LONG",
      message: "The request path is longer than the edge accepts.",
      requestId: edgeRequestId
    },
    source: restSource("edge", "nginx/nginx.conf", 133, 137)
  },
  {
    status: 415,
    when: "rest.edge.answers.jsonRequired",
    headers: [noStore],
    json: {
      error: "JSON_REQUIRED",
      message: "Request bodies must be application/json.",
      requestId
    },
    source: restSource("edge", "src/http/router.tl", 168, 174)
  },
  {
    status: 431,
    when: "rest.edge.answers.headersTooLarge",
    headers: [noStore],
    json: {
      error: "HEADERS_TOO_LARGE",
      message: "The request headers are larger than the edge accepts.",
      requestId: edgeRequestId
    },
    source: restSource("edge", "nginx/nginx.conf", 139, 143)
  },
  {
    status: 500,
    when: "rest.edge.answers.internal",
    headers: [noStore],
    json: {
      error: "INTERNAL_ERROR",
      message: "Something went wrong in the edge, and it is not known how much of this request took effect.",
      requestId
    },
    source: restSource("edge", "src/http/router.tl", 187, 200)
  },
  {
    status: 502,
    when: "rest.edge.answers.identityFailed",
    headers: [noStore],
    json: {
      error: "IDENTITY_FAILED",
      message: "identity answered in a way the edge does not understand, so nothing was decided.",
      requestId
    },
    source: restSource("edge", "src/http/sign_in.tl", 44, 55)
  },
  {
    status: 503,
    when: "rest.edge.answers.storeUnavailable",
    headers: [noStore],
    json: {
      error: "SESSION_STORE_UNAVAILABLE",
      message: "The session store could not be reached, so nothing was checked. Try again later.",
      requestId
    },
    source: restSource("edge", "src/http/sign_in.tl", 164, 171)
  },
  {
    status: 503,
    when: "rest.edge.answers.identityUnavailable",
    headers: [noStore],
    json: {
      error: "IDENTITY_UNAVAILABLE",
      message: "identity could not be reached, so nothing was decided. Try again later.",
      requestId
    },
    source: restSource("edge", "src/http/sign_in.tl", 35, 42)
  },
  {
    status: 503,
    when: "rest.edge.answers.apiUnavailable",
    headers: [noStore],
    json: {
      error: "API_UNAVAILABLE",
      message:
        "The API could not be reached, and it is not known whether the request took effect. Read the current state first.",
      requestId
    },
    source: restSource("edge", "src/http/forward.tl", 61, 68)
  }
];

export const edgeEndpoints: readonly RestEndpoint[] = [
  {
    id: "edge.session",
    service: "edge",
    method: "GET",
    path: "/bff/session",
    summary: "rest.edge.session.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.edge.session.who"
    },
    request: {
      headers: [sendsSession],
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.edge.session.case.signedIn",
        headers: [noStore],
        json: {
          authenticated: true,
          role: "seller",
          principalId: "0f8b6c1e-5a2d-4c3b-9e7f-1a2b3c4d5e6f",
          expiresAt: "2026-11-02T08:00:00.000Z"
        },
        source: restSource("edge", "src/http/session_endpoint.tl", 37, 46)
      },
      {
        status: 200,
        when: "rest.edge.session.case.anonymous",
        headers: [noStore],
        json: {
          authenticated: false
        },
        source: restSource("edge", "src/http/session_endpoint.tl", 28, 35)
      },
      {
        status: 200,
        when: "rest.edge.session.case.ended",
        headers: [expiredSession, noStore],
        json: {
          authenticated: false
        },
        source: restSource("edge", "src/http/session_endpoint.tl", 28, 35)
      }
    ],
    source: restSource("edge", "src/http/session_endpoint.tl", 14, 47)
  },
  {
    id: "edge.login",
    service: "edge",
    method: "POST",
    path: "/bff/login",
    summary: "rest.edge.login.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.edge.login.who"
    },
    request: {
      fields: [
        {
          name: "email",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.edge.login.field.email"
        },
        {
          name: "password",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.edge.login.field.password"
        }
      ],
      json: {
        email: "seller@example.com",
        password: "correct horse battery staple"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.edge.login.case.session",
        headers: [sellerWebSession, noStore],
        json: {
          authenticated: true,
          role: "seller",
          principalId: "0f8b6c1e-5a2d-4c3b-9e7f-1a2b3c4d5e6f",
          expiresAt: "2026-11-02T08:00:00.000Z"
        },
        source: restSource("edge", "src/http/sign_in.tl", 112, 132)
      },
      {
        status: 200,
        when: "rest.edge.login.case.challenge",
        headers: [challengePending, noStore],
        json: {
          mfaRequired: true
        },
        source: restSource("edge", "src/http/sign_in.tl", 156, 158)
      },
      {
        status: 200,
        when: "rest.edge.login.case.enrolment",
        headers: [enrolmentPending, noStore],
        json: {
          mfaEnrolmentRequired: true
        },
        source: restSource("edge", "src/http/sign_in.tl", 156, 161)
      },
      {
        status: 400,
        when: "rest.edge.login.case.invalid",
        headers: [noStore],
        json: {
          error: "INVALID_REQUEST",
          message: "The request body is not what this endpoint takes.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 211, 217)
      },
      {
        status: 401,
        when: "rest.edge.login.case.wrongCredentials",
        headers: [noStore],
        json: {
          error: "SIGN_IN_REFUSED",
          message: "The email or the password is not correct.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 178, 180)
      },
      {
        status: 403,
        when: "rest.edge.login.case.roleRefused",
        headers: [noStore],
        json: {
          error: "ROLE_REFUSED",
          message: "This account cannot use this application.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 99, 110)
      },
      {
        status: 429,
        when: "rest.edge.login.case.delayed",
        headers: ["Retry-After: 4", noStore],
        json: {
          error: "SIGN_IN_DELAYED",
          message:
            "Too many unsuccessful sign-in attempts for this account. Nothing was checked; try again after Retry-After.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 57, 64)
      },
      {
        status: 429,
        when: "rest.edge.login.case.throttled",
        headers: ["Retry-After: 42", noStore],
        json: {
          error: "TOO_MANY_REQUESTS",
          message: "Too many requests. Try again after Retry-After.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 57, 64)
      }
    ],
    source: restSource("edge", "src/http/sign_in.tl", 211, 226)
  },
  {
    id: "edge.register",
    service: "edge",
    method: "POST",
    path: "/bff/register",
    summary: "rest.edge.register.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.edge.register.who"
    },
    request: {
      fields: [
        {
          name: "email",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.edge.register.field.email"
        },
        {
          name: "password",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.edge.register.field.password"
        }
      ],
      json: {
        email: "new.seller@example.com",
        password: "correct horse battery staple"
      }
    },
    cases: [
      {
        status: 201,
        when: "rest.edge.register.case.created",
        headers: [sellerWebSession, noStore],
        json: {
          authenticated: true,
          role: "customer",
          principalId: "7d4e2a1b-8c3f-4e5d-9a6b-2c1d0e9f8a7b",
          expiresAt: "2026-11-03T08:00:00.000Z"
        },
        source: restSource("edge", "src/http/sign_up.tl", 43, 48)
      },
      {
        status: 400,
        when: "rest.edge.register.case.invalid",
        headers: [noStore],
        json: {
          error: "INVALID_REQUEST",
          message: "The request body is not what this endpoint takes.",
          requestId
        },
        source: restSource("edge", "src/http/sign_up.tl", 51, 57)
      },
      {
        status: 400,
        when: "rest.edge.register.case.rejected",
        headers: [noStore],
        json: {
          error: "INVALID_REQUEST",
          message: "password must be longer than or equal to 12 characters",
          requestId
        },
        source: restSource("edge", "src/http/sign_up.tl", 19, 28)
      },
      {
        status: 409,
        when: "rest.edge.register.case.emailTaken",
        headers: [noStore],
        json: {
          error: "EMAIL_TAKEN",
          message: "An account with this email address already exists. Sign in instead.",
          requestId
        },
        source: restSource("edge", "src/http/sign_up.tl", 35, 37)
      },
      {
        status: 429,
        when: "rest.edge.register.case.throttled",
        headers: ["Retry-After: 42", noStore],
        json: {
          error: "TOO_MANY_REQUESTS",
          message: "Too many requests. Try again after Retry-After.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 57, 64)
      }
    ],
    source: restSource("edge", "src/http/sign_up.tl", 51, 66)
  },
  {
    id: "edge.verifyTwoFactor",
    service: "edge",
    method: "POST",
    path: "/bff/2fa/verify",
    summary: "rest.edge.verifyTwoFactor.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.edge.verifyTwoFactor.who"
    },
    request: {
      headers: [sendsPending],
      fields: [
        {
          name: "code",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.edge.verifyTwoFactor.field.code"
        }
      ],
      json: {
        code: "123456"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.edge.verifyTwoFactor.case.sessionBackoffice",
        headers: [backofficeSession, expiredPending, noStore],
        json: {
          authenticated: true,
          role: "admin",
          principalId: "3c9d2e7a-6b1f-4d8e-a5c4-7e2f1b0a9d8c",
          expiresAt: "2026-10-26T08:15:00.000Z"
        },
        source: restSource("edge", "src/http/sign_in.tl", 86, 133)
      },
      {
        status: 200,
        when: "rest.edge.verifyTwoFactor.case.sessionSellerWeb",
        headers: [sellerWebSession, expiredPending, noStore],
        json: {
          authenticated: true,
          role: "seller",
          principalId: "0f8b6c1e-5a2d-4c3b-9e7f-1a2b3c4d5e6f",
          expiresAt: "2026-11-02T08:00:00.000Z"
        },
        source: restSource("edge", "src/http/sign_in.tl", 86, 133)
      },
      {
        status: 400,
        when: "rest.edge.verifyTwoFactor.case.invalid",
        headers: [noStore],
        json: {
          error: "INVALID_REQUEST",
          message: "The request body is not what this endpoint takes.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 265, 272)
      },
      {
        status: 401,
        when: "rest.edge.verifyTwoFactor.case.codeRefused",
        headers: [noStore],
        json: {
          error: "CODE_REFUSED",
          message: "The code was not accepted. Try the next one, or sign in again if this keeps happening.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 243, 250)
      },
      {
        status: 401,
        when: "rest.edge.verifyTwoFactor.case.signInRequired",
        headers: [expiredPending, noStore],
        json: {
          error: "SIGN_IN_REQUIRED",
          message: "No sign-in is in progress, or it has expired. Sign in again.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 228, 236)
      },
      {
        status: 401,
        when: "rest.edge.verifyTwoFactor.case.challengeEnded",
        headers: [expiredPending, noStore],
        json: {
          error: "SIGN_IN_REQUIRED",
          message: "No sign-in is in progress, or it has expired. Sign in again.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 243, 248)
      },
      {
        status: 403,
        when: "rest.edge.verifyTwoFactor.case.roleRefused",
        headers: [expiredPending, noStore],
        json: {
          error: "ROLE_REFUSED",
          message: "This account cannot use this application.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 99, 110)
      },
      {
        status: 429,
        when: "rest.edge.verifyTwoFactor.case.delayed",
        headers: ["Retry-After: 4", noStore],
        json: {
          error: "SIGN_IN_DELAYED",
          message:
            "Too many unsuccessful sign-in attempts for this account. Nothing was checked; try again after Retry-After.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 57, 64)
      },
      {
        status: 429,
        when: "rest.edge.verifyTwoFactor.case.throttled",
        headers: ["Retry-After: 42", noStore],
        json: {
          error: "TOO_MANY_REQUESTS",
          message: "Too many requests. Try again after Retry-After.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 57, 64)
      }
    ],
    source: restSource("edge", "src/http/sign_in.tl", 274, 296)
  },
  {
    id: "edge.setupTwoFactor",
    service: "edge",
    method: "POST",
    path: "/bff/2fa/setup",
    summary: "rest.edge.setupTwoFactor.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.edge.setupTwoFactor.who"
    },
    request: {
      headers: [sendsPending],
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.edge.setupTwoFactor.case.secret",
        headers: [noStore],
        json: {
          twoFactorSecret: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          qrCodeUrl:
            "otpauth://totp/Kinetix%3Aadmin%40example.com?secret=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA&issuer=Kinetix&algorithm=SHA1&digits=6&period=30",
          enabled: false
        },
        source: restSource("edge", "src/http/sign_in.tl", 323, 330)
      },
      {
        status: 401,
        when: "rest.edge.setupTwoFactor.case.signInRequired",
        headers: [expiredPending, noStore],
        json: {
          error: "SIGN_IN_REQUIRED",
          message: "No sign-in is in progress, or it has expired. Sign in again.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 228, 236)
      },
      {
        status: 409,
        when: "rest.edge.setupTwoFactor.case.alreadyEnabled",
        headers: [noStore],
        json: {
          error: "TWO_FACTOR_ALREADY_ENABLED",
          message: "Two-factor authentication is already enabled for this account. Sign in again.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 309, 312)
      },
      {
        status: 429,
        when: "rest.edge.setupTwoFactor.case.throttled",
        headers: ["Retry-After: 42", noStore],
        json: {
          error: "TOO_MANY_REQUESTS",
          message: "Too many requests. Try again after Retry-After.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 57, 64)
      }
    ],
    source: restSource("edge", "src/http/sign_in.tl", 333, 350)
  },
  {
    id: "edge.enableTwoFactor",
    service: "edge",
    method: "POST",
    path: "/bff/2fa/enable",
    summary: "rest.edge.enableTwoFactor.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.edge.enableTwoFactor.who"
    },
    request: {
      headers: [sendsPending],
      fields: [
        {
          name: "code",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.edge.enableTwoFactor.field.code"
        }
      ],
      json: {
        code: "123456"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.edge.enableTwoFactor.case.enabled",
        headers: [expiredPending, noStore],
        json: {
          enabled: true
        },
        source: restSource("edge", "src/http/sign_in.tl", 366, 371)
      },
      {
        status: 400,
        when: "rest.edge.enableTwoFactor.case.invalid",
        headers: [noStore],
        json: {
          error: "INVALID_REQUEST",
          message: "The request body is not what this endpoint takes.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 265, 272)
      },
      {
        status: 401,
        when: "rest.edge.enableTwoFactor.case.codeRefused",
        headers: [noStore],
        json: {
          error: "CODE_REFUSED",
          message: "The code was not accepted. Try the next one, or sign in again if this keeps happening.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 358, 360)
      },
      {
        status: 401,
        when: "rest.edge.enableTwoFactor.case.signInRequired",
        headers: [expiredPending, noStore],
        json: {
          error: "SIGN_IN_REQUIRED",
          message: "No sign-in is in progress, or it has expired. Sign in again.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 228, 236)
      },
      {
        status: 429,
        when: "rest.edge.enableTwoFactor.case.delayed",
        headers: ["Retry-After: 4", noStore],
        json: {
          error: "SIGN_IN_DELAYED",
          message:
            "Too many unsuccessful sign-in attempts for this account. Nothing was checked; try again after Retry-After.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 57, 64)
      },
      {
        status: 429,
        when: "rest.edge.enableTwoFactor.case.throttled",
        headers: ["Retry-After: 42", noStore],
        json: {
          error: "TOO_MANY_REQUESTS",
          message: "Too many requests. Try again after Retry-After.",
          requestId
        },
        source: restSource("edge", "src/http/sign_in.tl", 57, 64)
      }
    ],
    source: restSource("edge", "src/http/sign_in.tl", 374, 396)
  },
  {
    id: "edge.logout",
    service: "edge",
    method: "POST",
    path: "/bff/logout",
    summary: "rest.edge.logout.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.edge.logout.who"
    },
    request: {
      headers: [sendsSession],
      fields: []
    },
    cases: [
      {
        status: 204,
        when: "rest.edge.logout.case.signedOut",
        headers: [expiredSession, expiredPending, noStore],
        source: restSource("edge", "src/http/logout.tl", 31, 53)
      },
      {
        status: 503,
        when: "rest.edge.logout.case.identityUnavailable",
        headers: [noStore],
        json: {
          error: "IDENTITY_UNAVAILABLE",
          message: "identity could not be reached, so nothing was decided. Try again later.",
          requestId
        },
        source: restSource("edge", "src/http/logout.tl", 76, 94)
      }
    ],
    source: restSource("edge", "src/http/logout.tl", 107, 125)
  }
];
