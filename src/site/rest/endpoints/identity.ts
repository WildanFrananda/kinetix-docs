import type { RestCase } from "../../types/rest_case.type";
import type { RestEndpoint } from "../../types/rest_endpoint.type";
import { restSource } from "../rest_source";

export const identityAnswers: readonly RestCase[] = [
  {
    status: 400,
    when: "rest.identity.answers.malformedJson",
    json: {
      error: "REQUEST_REFUSED",
      message: "Body is not valid JSON but content-type is set to 'application/json'",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("identity", "src/infrastructure/observability/unhandled_exception_filter.ts", 53, 69)
  },
  {
    status: 400,
    when: "rest.identity.answers.emptyJson",
    json: {
      error: "REQUEST_REFUSED",
      message: "Body cannot be empty when content-type is set to 'application/json'",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("identity", "src/infrastructure/observability/unhandled_exception_filter.ts", 53, 69)
  },
  {
    status: 401,
    when: "rest.identity.answers.bearerRequired",
    json: {
      message: "A Bearer token is required",
      error: "Unauthorized",
      statusCode: 401,
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("identity", "src/adapters/guards/jwt_auth.guard.ts", 25, 33)
  },
  {
    status: 401,
    when: "rest.identity.answers.invalidToken",
    json: {
      message: "Invalid token",
      error: "Unauthorized",
      statusCode: 401,
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("identity", "src/application/services/token.service.ts", 302, 325)
  },
  {
    status: 401,
    when: "rest.identity.answers.notAccessToken",
    json: {
      message: "This is not an access token",
      error: "Unauthorized",
      statusCode: 401,
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("identity", "src/application/services/token.service.ts", 122, 127)
  },
  {
    status: 401,
    when: "rest.identity.answers.revoked",
    json: {
      message: "This token has been revoked",
      error: "Unauthorized",
      statusCode: 401,
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("identity", "src/application/services/token.service.ts", 129, 132)
  },
  {
    status: 404,
    when: "rest.identity.answers.unknownRoute",
    json: {
      message: "Cannot DELETE /api/v1/users/42/profile",
      error: "Not Found",
      statusCode: 404,
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("identity", "src/infrastructure/observability/unhandled_exception_filter.ts", 53, 69)
  },
  {
    status: 413,
    when: "rest.identity.answers.bodyTooLarge",
    json: {
      error: "REQUEST_REFUSED",
      message: "Request body is too large",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("identity", "src/infrastructure/observability/unhandled_exception_filter.ts", 53, 69)
  },
  {
    status: 415,
    when: "rest.identity.answers.unsupportedMediaType",
    json: {
      error: "REQUEST_REFUSED",
      message: "Unsupported Media Type",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("identity", "src/infrastructure/observability/unhandled_exception_filter.ts", 53, 69)
  },
  {
    status: 500,
    when: "rest.identity.answers.internal",
    json: {
      error: "INTERNAL_ERROR",
      message:
        "something went wrong handling this request, and it is not known how much of it took effect. Read the current state before retrying.",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("identity", "src/infrastructure/observability/unhandled_exception_filter.ts", 71, 88)
  },
  {
    status: 503,
    when: "rest.identity.answers.database",
    json: {
      error: "DATABASE_UNAVAILABLE",
      message: "identity could not reach its database, so it cannot say what this request would have done. Retry later.",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("identity", "src/infrastructure/observability/unhandled_exception_filter.ts", 31, 50)
  }
];

export const identityEndpoints: readonly RestEndpoint[] = [
  {
    id: "identity.login",
    service: "identity",
    method: "POST",
    path: "/api/v1/auth/login",
    summary: "rest.identity.login.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.identity.login.who"
    },
    request: {
      target: "/api/v1/auth/login",
      fields: [
        {
          name: "email",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.login.field.email"
        },
        {
          name: "password",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.login.field.password"
        }
      ],
      json: {
        email: "buyer@example.com",
        password: "correct horse battery staple"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.identity.login.case.signedIn",
        headers: ["X-RateLimit-Limit: 5", "X-RateLimit-Remaining: 4", "X-RateLimit-Reset: 60"],
        json: {
          accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.<claims>.<signature>",
          refreshToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.<claims>.<signature>",
          expiresIn: 900,
          tokenType: "Bearer",
          user: {
            id: 42,
            email: "buyer@example.com",
            role: "customer",
            principalId: "0f8b6c1e-5a2d-4c3b-9e7f-1a2b3c4d5e6f"
          }
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 191, 206)
      },
      {
        status: 200,
        when: "rest.identity.login.case.secondFactor",
        headers: ["X-RateLimit-Limit: 5", "X-RateLimit-Remaining: 4", "X-RateLimit-Reset: 60"],
        json: {
          mfaRequired: true,
          challengeToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.<claims>.<signature>",
          expiresIn: 300
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 36, 49)
      },
      {
        status: 400,
        when: "rest.identity.login.case.invalid",
        json: {
          message: ["email must be an email"],
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/infrastructure/http/http_pipeline.ts", 7, 13)
      },
      {
        status: 401,
        when: "rest.identity.login.case.wrongCredentials",
        json: {
          message: "Invalid email or password credentials",
          error: "Unauthorized",
          statusCode: 401,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 51, 64)
      },
      {
        status: 429,
        when: "rest.identity.login.case.throttled",
        headers: ["Retry-After: 42"],
        json: {
          error: "REQUEST_REFUSED",
          message: "ThrottlerException: Too Many Requests",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/controllers/auth.controller.ts", 23, 29)
      }
    ],
    source: restSource("identity", "src/adapters/controllers/auth.controller.ts", 23, 29)
  },
  {
    id: "identity.register",
    service: "identity",
    method: "POST",
    path: "/api/v1/auth/register",
    summary: "rest.identity.register.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.identity.register.who"
    },
    request: {
      target: "/api/v1/auth/register",
      fields: [
        {
          name: "email",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.register.field.email"
        },
        {
          name: "password",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.register.field.password"
        }
      ],
      json: {
        email: "buyer@example.com",
        password: "correct horse battery staple"
      }
    },
    cases: [
      {
        status: 201,
        when: "rest.identity.register.case.registered",
        headers: ["X-RateLimit-Limit: 5", "X-RateLimit-Remaining: 4", "X-RateLimit-Reset: 60"],
        json: {
          accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.<claims>.<signature>",
          refreshToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.<claims>.<signature>",
          expiresIn: 900,
          tokenType: "Bearer",
          user: {
            id: 42,
            email: "buyer@example.com",
            role: "customer",
            principalId: "0f8b6c1e-5a2d-4c3b-9e7f-1a2b3c4d5e6f"
          }
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 92, 106)
      },
      {
        status: 400,
        when: "rest.identity.register.case.invalid",
        json: {
          message: ["password must be longer than or equal to 12 characters"],
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/infrastructure/http/http_pipeline.ts", 7, 13)
      },
      {
        status: 409,
        when: "rest.identity.register.case.emailTaken",
        json: {
          message: "Email address is already registered",
          error: "Conflict",
          statusCode: 409,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 94, 97)
      },
      {
        status: 429,
        when: "rest.identity.register.case.throttled",
        headers: ["Retry-After: 42"],
        json: {
          error: "REQUEST_REFUSED",
          message: "ThrottlerException: Too Many Requests",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/controllers/auth.controller.ts", 39, 45)
      }
    ],
    source: restSource("identity", "src/adapters/controllers/auth.controller.ts", 39, 45)
  },
  {
    id: "identity.refresh",
    service: "identity",
    method: "POST",
    path: "/api/v1/auth/refresh",
    summary: "rest.identity.refresh.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.identity.refresh.who"
    },
    request: {
      target: "/api/v1/auth/refresh",
      fields: [
        {
          name: "refreshToken",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.refresh.field.refreshToken"
        }
      ],
      json: {
        refreshToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.<claims>.<signature>"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.identity.refresh.case.rotated",
        headers: ["X-RateLimit-Limit: 10", "X-RateLimit-Remaining: 9", "X-RateLimit-Reset: 60"],
        json: {
          accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.<claims>.<signature>",
          refreshToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.<claims>.<signature>",
          expiresIn: 900,
          tokenType: "Bearer",
          user: {
            id: 42,
            email: "buyer@example.com",
            role: "customer",
            principalId: "0f8b6c1e-5a2d-4c3b-9e7f-1a2b3c4d5e6f"
          }
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 108, 128)
      },
      {
        status: 400,
        when: "rest.identity.refresh.case.invalid",
        json: {
          message: ["refreshToken is required"],
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/infrastructure/http/http_pipeline.ts", 7, 13)
      },
      {
        status: 401,
        when: "rest.identity.refresh.case.invalidToken",
        json: {
          message: "Invalid token",
          error: "Unauthorized",
          statusCode: 401,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/token.service.ts", 302, 325)
      },
      {
        status: 401,
        when: "rest.identity.refresh.case.notRefreshToken",
        json: {
          message: "This is not a refresh token",
          error: "Unauthorized",
          statusCode: 401,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/token.service.ts", 177, 183)
      },
      {
        status: 401,
        when: "rest.identity.refresh.case.accountGone",
        json: {
          message: "The account behind this token no longer exists",
          error: "Unauthorized",
          statusCode: 401,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 110, 113)
      },
      {
        status: 401,
        when: "rest.identity.refresh.case.notRecognised",
        json: {
          message: "This refresh token is not recognised",
          error: "Unauthorized",
          statusCode: 401,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/token.service.ts", 199, 201)
      },
      {
        status: 401,
        when: "rest.identity.refresh.case.revoked",
        json: {
          message: "This refresh token has been revoked",
          error: "Unauthorized",
          statusCode: 401,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/token.service.ts", 203, 205)
      },
      {
        status: 401,
        when: "rest.identity.refresh.case.reused",
        json: {
          message: "This refresh token has already been used; the session has been revoked",
          error: "Unauthorized",
          statusCode: 401,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/token.service.ts", 207, 210)
      },
      {
        status: 429,
        when: "rest.identity.refresh.case.throttled",
        headers: ["Retry-After: 42"],
        json: {
          error: "REQUEST_REFUSED",
          message: "ThrottlerException: Too Many Requests",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/controllers/auth.controller.ts", 47, 53)
      }
    ],
    source: restSource("identity", "src/adapters/controllers/auth.controller.ts", 47, 53)
  },
  {
    id: "identity.verifyTwoFactor",
    service: "identity",
    method: "POST",
    path: "/api/v1/auth/2fa/verify",
    summary: "rest.identity.verifyTwoFactor.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.identity.verifyTwoFactor.who"
    },
    request: {
      target: "/api/v1/auth/2fa/verify",
      fields: [
        {
          name: "challengeToken",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.verifyTwoFactor.field.challengeToken"
        },
        {
          name: "code",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.verifyTwoFactor.field.code"
        }
      ],
      json: {
        challengeToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.<claims>.<signature>",
        code: "492039"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.identity.verifyTwoFactor.case.signedIn",
        headers: ["X-RateLimit-Limit: 5", "X-RateLimit-Remaining: 4", "X-RateLimit-Reset: 60"],
        json: {
          accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.<claims>.<signature>",
          refreshToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.<claims>.<signature>",
          expiresIn: 900,
          tokenType: "Bearer",
          user: {
            id: 42,
            email: "buyer@example.com",
            role: "customer",
            principalId: "0f8b6c1e-5a2d-4c3b-9e7f-1a2b3c4d5e6f"
          }
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 82, 89)
      },
      {
        status: 400,
        when: "rest.identity.verifyTwoFactor.case.invalid",
        json: {
          message: ["code must be six digits"],
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/infrastructure/http/http_pipeline.ts", 7, 13)
      },
      {
        status: 401,
        when: "rest.identity.verifyTwoFactor.case.invalidChallenge",
        json: {
          message: "Invalid token",
          error: "Unauthorized",
          statusCode: 401,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/token.service.ts", 302, 325)
      },
      {
        status: 401,
        when: "rest.identity.verifyTwoFactor.case.notChallenge",
        json: {
          message: "This is not a two-factor challenge",
          error: "Unauthorized",
          statusCode: 401,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/token.service.ts", 169, 175)
      },
      {
        status: 401,
        when: "rest.identity.verifyTwoFactor.case.accountGone",
        json: {
          message: "The account behind this challenge no longer exists",
          error: "Unauthorized",
          statusCode: 401,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 68, 71)
      },
      {
        status: 401,
        when: "rest.identity.verifyTwoFactor.case.notEnabled",
        json: {
          message: "This account does not have two-factor authentication enabled",
          error: "Unauthorized",
          statusCode: 401,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 73, 75)
      },
      {
        status: 401,
        when: "rest.identity.verifyTwoFactor.case.wrongCode",
        json: {
          message: "That code is not valid",
          error: "Unauthorized",
          statusCode: 401,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 77, 80)
      },
      {
        status: 401,
        when: "rest.identity.verifyTwoFactor.case.challengeUsed",
        json: {
          message: "This challenge has already been answered; sign in again",
          error: "Unauthorized",
          statusCode: 401,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/token.service.ts", 157, 167)
      },
      {
        status: 401,
        when: "rest.identity.verifyTwoFactor.case.codeUsed",
        json: {
          message: "That code has already been used; sign in again with the next one",
          error: "Unauthorized",
          statusCode: 401,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 84, 87)
      },
      {
        status: 429,
        when: "rest.identity.verifyTwoFactor.case.throttled",
        headers: ["Retry-After: 42"],
        json: {
          error: "REQUEST_REFUSED",
          message: "ThrottlerException: Too Many Requests",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/controllers/auth.controller.ts", 31, 37)
      }
    ],
    source: restSource("identity", "src/adapters/controllers/auth.controller.ts", 31, 37)
  },
  {
    id: "identity.logout",
    service: "identity",
    method: "POST",
    path: "/api/v1/auth/logout",
    summary: "rest.identity.logout.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.identity.logout.who"
    },
    request: {
      target: "/api/v1/auth/logout",
      fields: [
        {
          name: "refreshToken",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.identity.logout.field.refreshToken"
        }
      ],
      json: {
        refreshToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.<claims>.<signature>"
      }
    },
    cases: [
      {
        status: 204,
        when: "rest.identity.logout.case.signedOut",
        headers: ["X-RateLimit-Limit: 10", "X-RateLimit-Remaining: 9", "X-RateLimit-Reset: 60"],
        source: restSource("identity", "src/application/services/token.service.ts", 233, 240)
      },
      {
        status: 400,
        when: "rest.identity.logout.case.invalid",
        json: {
          message: ["refreshToken must not be empty when it is sent"],
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/infrastructure/http/http_pipeline.ts", 7, 13)
      },
      {
        status: 401,
        when: "rest.identity.logout.case.invalidRefreshToken",
        json: {
          message: "Invalid token",
          error: "Unauthorized",
          statusCode: 401,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/token.service.ts", 302, 325)
      },
      {
        status: 401,
        when: "rest.identity.logout.case.notRefreshToken",
        json: {
          message: "This is not a refresh token",
          error: "Unauthorized",
          statusCode: 401,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/token.service.ts", 177, 183)
      },
      {
        status: 403,
        when: "rest.identity.logout.case.otherAccount",
        json: {
          message: "That refresh token belongs to another account",
          error: "Forbidden",
          statusCode: 403,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 134, 136)
      },
      {
        status: 429,
        when: "rest.identity.logout.case.throttled",
        headers: ["Retry-After: 42"],
        json: {
          error: "REQUEST_REFUSED",
          message: "ThrottlerException: Too Many Requests",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/infrastructure/http/throttle_policy.ts", 3, 6)
      }
    ],
    source: restSource("identity", "src/adapters/controllers/auth.controller.ts", 55, 59)
  },
  {
    id: "identity.me",
    service: "identity",
    method: "GET",
    path: "/api/v1/auth/me",
    summary: "rest.identity.me.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.identity.me.who"
    },
    request: {
      target: "/api/v1/auth/me",
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.identity.me.case.current",
        headers: ["X-RateLimit-Limit: 10", "X-RateLimit-Remaining: 9", "X-RateLimit-Reset: 60"],
        json: {
          principalId: "0f8b6c1e-5a2d-4c3b-9e7f-1a2b3c4d5e6f",
          userId: 42,
          email: "buyer@example.com",
          role: "customer",
          expiresAt: "2026-10-22T03:30:00.000Z"
        },
        source: restSource("identity", "src/adapters/controllers/auth.controller.ts", 61, 71)
      },
      {
        status: 429,
        when: "rest.identity.me.case.throttled",
        headers: ["Retry-After: 42"],
        json: {
          error: "REQUEST_REFUSED",
          message: "ThrottlerException: Too Many Requests",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/infrastructure/http/throttle_policy.ts", 3, 6)
      }
    ],
    source: restSource("identity", "src/adapters/controllers/auth.controller.ts", 61, 71)
  },
  {
    id: "identity.setupTwoFactor",
    service: "identity",
    method: "POST",
    path: "/api/v1/auth/2fa/setup/{id}",
    summary: "rest.identity.setupTwoFactor.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.identity.setupTwoFactor.who"
    },
    request: {
      target: "/api/v1/auth/2fa/setup/42",
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.identity.setupTwoFactor.field.id"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.identity.setupTwoFactor.case.secretIssued",
        headers: ["X-RateLimit-Limit: 10", "X-RateLimit-Remaining: 9", "X-RateLimit-Reset: 60"],
        json: {
          twoFactorSecret: "<32 base32 characters>",
          qrCodeUrl:
            "otpauth://totp/Kinetix%3Abuyer%40example.com?secret=<32 base32 characters>&issuer=Kinetix&algorithm=SHA1&digits=6&period=30",
          enabled: false
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 152, 157)
      },
      {
        status: 403,
        when: "rest.identity.setupTwoFactor.case.notOwn",
        json: {
          message: "This account may only act on its own resources",
          error: "Forbidden",
          statusCode: 403,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/guards/self_or_staff.guard.ts", 41, 49)
      },
      {
        status: 404,
        when: "rest.identity.setupTwoFactor.case.accountGone",
        json: {
          message: "User with ID 42 not found",
          error: "Not Found",
          statusCode: 404,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 144, 147)
      },
      {
        status: 409,
        when: "rest.identity.setupTwoFactor.case.alreadyEnabled",
        json: {
          message: "Two-factor authentication is already enabled for this account",
          error: "Conflict",
          statusCode: 409,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 148, 150)
      },
      {
        status: 429,
        when: "rest.identity.setupTwoFactor.case.throttled",
        headers: ["Retry-After: 42"],
        json: {
          error: "REQUEST_REFUSED",
          message: "ThrottlerException: Too Many Requests",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/infrastructure/http/throttle_policy.ts", 3, 6)
      }
    ],
    source: restSource("identity", "src/adapters/controllers/auth.controller.ts", 73, 79)
  },
  {
    id: "identity.enableTwoFactor",
    service: "identity",
    method: "POST",
    path: "/api/v1/auth/2fa/enable/{id}",
    summary: "rest.identity.enableTwoFactor.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.identity.enableTwoFactor.who"
    },
    request: {
      target: "/api/v1/auth/2fa/enable/42",
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.identity.enableTwoFactor.field.id"
        },
        {
          name: "code",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.enableTwoFactor.field.code"
        }
      ],
      json: {
        code: "492039"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.identity.enableTwoFactor.case.enabled",
        headers: ["X-RateLimit-Limit: 5", "X-RateLimit-Remaining: 4", "X-RateLimit-Reset: 60"],
        json: {
          enabled: true
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 160, 173)
      },
      {
        status: 400,
        when: "rest.identity.enableTwoFactor.case.invalid",
        json: {
          message: ["code must be six digits"],
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/infrastructure/http/http_pipeline.ts", 7, 13)
      },
      {
        status: 400,
        when: "rest.identity.enableTwoFactor.case.noSecret",
        json: {
          message: "Request a two-factor secret before enabling it",
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 162, 164)
      },
      {
        status: 403,
        when: "rest.identity.enableTwoFactor.case.notOwn",
        json: {
          message: "This account may only act on its own resources",
          error: "Forbidden",
          statusCode: 403,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/guards/self_or_staff.guard.ts", 41, 49)
      },
      {
        status: 404,
        when: "rest.identity.enableTwoFactor.case.accountGone",
        json: {
          message: "User with ID 42 not found",
          error: "Not Found",
          statusCode: 404,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 213, 216)
      },
      {
        status: 422,
        when: "rest.identity.enableTwoFactor.case.wrongCode",
        json: {
          message: "That code is not valid",
          error: "Unprocessable Entity",
          statusCode: 422,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 222, 225)
      },
      {
        status: 422,
        when: "rest.identity.enableTwoFactor.case.codeUsed",
        json: {
          message: "That code has already been used; wait for the next one",
          error: "Unprocessable Entity",
          statusCode: 422,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 227, 230)
      },
      {
        status: 429,
        when: "rest.identity.enableTwoFactor.case.throttled",
        headers: ["Retry-After: 42"],
        json: {
          error: "REQUEST_REFUSED",
          message: "ThrottlerException: Too Many Requests",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/controllers/auth.controller.ts", 81, 92)
      }
    ],
    source: restSource("identity", "src/adapters/controllers/auth.controller.ts", 81, 92)
  },
  {
    id: "identity.disableTwoFactor",
    service: "identity",
    method: "POST",
    path: "/api/v1/auth/2fa/disable/{id}",
    summary: "rest.identity.disableTwoFactor.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.identity.disableTwoFactor.who"
    },
    request: {
      target: "/api/v1/auth/2fa/disable/42",
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.identity.disableTwoFactor.field.id"
        },
        {
          name: "code",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.disableTwoFactor.field.code"
        }
      ],
      json: {
        code: "730581"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.identity.disableTwoFactor.case.disabled",
        headers: ["X-RateLimit-Limit: 5", "X-RateLimit-Remaining: 4", "X-RateLimit-Reset: 60"],
        json: {
          enabled: false
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 175, 189)
      },
      {
        status: 400,
        when: "rest.identity.disableTwoFactor.case.invalid",
        json: {
          message: ["code must be six digits"],
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/infrastructure/http/http_pipeline.ts", 7, 13)
      },
      {
        status: 403,
        when: "rest.identity.disableTwoFactor.case.notOwn",
        json: {
          message: "This account may only act on its own resources",
          error: "Forbidden",
          statusCode: 403,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/guards/self_or_staff.guard.ts", 41, 49)
      },
      {
        status: 404,
        when: "rest.identity.disableTwoFactor.case.accountGone",
        json: {
          message: "User with ID 42 not found",
          error: "Not Found",
          statusCode: 404,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 213, 216)
      },
      {
        status: 409,
        when: "rest.identity.disableTwoFactor.case.notEnabled",
        json: {
          message: "Two-factor authentication is not enabled for this account",
          error: "Conflict",
          statusCode: 409,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 177, 179)
      },
      {
        status: 422,
        when: "rest.identity.disableTwoFactor.case.wrongCode",
        json: {
          message: "That code is not valid",
          error: "Unprocessable Entity",
          statusCode: 422,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 222, 225)
      },
      {
        status: 422,
        when: "rest.identity.disableTwoFactor.case.codeUsed",
        json: {
          message: "That code has already been used; wait for the next one",
          error: "Unprocessable Entity",
          statusCode: 422,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 227, 230)
      },
      {
        status: 429,
        when: "rest.identity.disableTwoFactor.case.throttled",
        headers: ["Retry-After: 42"],
        json: {
          error: "REQUEST_REFUSED",
          message: "ThrottlerException: Too Many Requests",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/controllers/auth.controller.ts", 94, 105)
      }
    ],
    source: restSource("identity", "src/adapters/controllers/auth.controller.ts", 94, 105)
  },
  {
    id: "identity.getProfile",
    service: "identity",
    method: "GET",
    path: "/api/v1/users/{id}/profile",
    summary: "rest.identity.getProfile.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.identity.getProfile.who"
    },
    request: {
      target: "/api/v1/users/42/profile",
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.identity.getProfile.field.id"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.identity.getProfile.case.profile",
        json: {
          id: 17,
          userId: 42,
          fullName: "Siti Rahmawati",
          phoneNumber: "+6281234567890",
          streetAddress: "Jalan Kenanga Raya No. 17",
          city: "Jakarta Selatan",
          postalCode: "12730",
          avatarUrl: "https://cdn.example.com/avatars/42.jpg",
          latitude: -6.2615,
          longitude: 106.8106,
          geocodedAt: "2026-10-21T09:12:44.318Z"
        },
        source: restSource("identity", "src/application/services/user_profile_usecase.service.ts", 17, 23)
      },
      {
        status: 400,
        when: "rest.identity.getProfile.case.badId",
        json: {
          message: "An account id is a whole number from 1 to 2147483647",
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/decorators/account_id_param.decorator.ts", 5, 13)
      },
      {
        status: 403,
        when: "rest.identity.getProfile.case.notOwn",
        json: {
          message: "This account may only act on its own resources",
          error: "Forbidden",
          statusCode: 403,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/guards/self_or_staff.guard.ts", 41, 49)
      },
      {
        status: 404,
        when: "rest.identity.getProfile.case.noProfile",
        json: {
          message: "Profile not found for User ID 42",
          error: "Not Found",
          statusCode: 404,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/user_profile_usecase.service.ts", 19, 21)
      }
    ],
    source: restSource("identity", "src/adapters/controllers/user_profile.controller.ts", 13, 17)
  },
  {
    id: "identity.updateProfile",
    service: "identity",
    method: "PUT",
    path: "/api/v1/users/{id}/profile",
    summary: "rest.identity.updateProfile.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.identity.updateProfile.who"
    },
    request: {
      target: "/api/v1/users/42/profile",
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.identity.updateProfile.field.id"
        },
        {
          name: "fullName",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.identity.updateProfile.field.fullName"
        },
        {
          name: "phoneNumber",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.identity.updateProfile.field.phoneNumber"
        },
        {
          name: "streetAddress",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.identity.updateProfile.field.streetAddress"
        },
        {
          name: "city",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.identity.updateProfile.field.city"
        },
        {
          name: "postalCode",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.identity.updateProfile.field.postalCode"
        },
        {
          name: "avatarUrl",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.identity.updateProfile.field.avatarUrl"
        }
      ],
      json: {
        fullName: "Siti Rahmawati",
        phoneNumber: "+6281234567890",
        streetAddress: "Jalan Kenanga Raya No. 17",
        city: "Jakarta Selatan",
        postalCode: "12730"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.identity.updateProfile.case.saved",
        json: {
          id: 17,
          userId: 42,
          fullName: "Siti Rahmawati",
          phoneNumber: "+6281234567890",
          streetAddress: "Jalan Kenanga Raya No. 17",
          city: "Jakarta Selatan",
          postalCode: "12730",
          avatarUrl: null,
          latitude: -6.2615,
          longitude: 106.8106,
          geocodedAt: "2026-10-22T03:15:00.274Z"
        },
        source: restSource("identity", "src/application/services/user_profile_usecase.service.ts", 25, 58)
      },
      {
        status: 400,
        when: "rest.identity.updateProfile.case.invalid",
        json: {
          message: ["avatarUrl must be an https URL"],
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/infrastructure/http/http_pipeline.ts", 7, 13)
      },
      {
        status: 400,
        when: "rest.identity.updateProfile.case.badId",
        json: {
          message: "An account id is a whole number from 1 to 2147483647",
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/decorators/account_id_param.decorator.ts", 5, 13)
      },
      {
        status: 403,
        when: "rest.identity.updateProfile.case.notOwn",
        json: {
          message: "This account may only act on its own resources",
          error: "Forbidden",
          statusCode: 403,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/guards/self_or_staff.guard.ts", 41, 49)
      },
      {
        status: 404,
        when: "rest.identity.updateProfile.case.noAccount",
        json: {
          message: "No account with ID 9999",
          error: "Not Found",
          statusCode: 404,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource(
          "identity",
          "src/infrastructure/persistence/adapters/typeorm_profile_repository.adapter.ts",
          42,
          44
        )
      },
      {
        status: 409,
        when: "rest.identity.updateProfile.case.concurrent",
        json: {
          message:
            "The profile of account 42 was created by another request at the same time; read it and retry",
          error: "Conflict",
          statusCode: 409,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource(
          "identity",
          "src/infrastructure/persistence/adapters/typeorm_profile_repository.adapter.ts",
          45,
          50
        )
      }
    ],
    source: restSource("identity", "src/adapters/controllers/user_profile.controller.ts", 19, 26)
  },
  {
    id: "identity.listSellerApplications",
    service: "identity",
    method: "GET",
    path: "/api/v1/sellers/applications",
    summary: "rest.identity.listSellerApplications.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.identity.listSellerApplications.who"
    },
    request: {
      target: "/api/v1/sellers/applications?status=pending&limit=50",
      fields: [
        {
          name: "status",
          in: "query",
          type: "string",
          required: false,
          rule: "rest.identity.listSellerApplications.field.status"
        },
        {
          name: "limit",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.identity.listSellerApplications.field.limit"
        },
        {
          name: "after",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.identity.listSellerApplications.field.after"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.identity.listSellerApplications.case.page",
        json: {
          applications: [
            {
              applicationId: 12,
              userId: 57,
              email: "toko.kenari@example.com",
              storeName: "Toko Kopi Kenari",
              businessRegistrationNumber: "9120301234567",
              taxId: "01.234.567.8-012.000",
              streetAddress: "Jalan Flamboyan No. 8",
              city: "Jakarta Pusat",
              postalCode: "10330",
              status: "pending",
              verifiedAt: null
            }
          ],
          nextAfterId: null
        },
        source: restSource(
          "identity",
          "src/infrastructure/persistence/adapters/typeorm_merchant_verification_repository.adapter.ts",
          62,
          96
        )
      },
      {
        status: 400,
        when: "rest.identity.listSellerApplications.case.invalid",
        json: {
          message: ["limit must not be greater than 200"],
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/infrastructure/http/http_pipeline.ts", 7, 13)
      },
      {
        status: 403,
        when: "rest.identity.listSellerApplications.case.notAdmin",
        json: {
          message: "This account does not have access to this resource",
          error: "Forbidden",
          statusCode: 403,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/guards/roles.guard.ts", 23, 28)
      }
    ],
    source: restSource("identity", "src/adapters/controllers/seller_onboarding.controller.ts", 18, 25)
  },
  {
    id: "identity.getSellerApplication",
    service: "identity",
    method: "GET",
    path: "/api/v1/sellers/{id}/application",
    summary: "rest.identity.getSellerApplication.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.identity.getSellerApplication.who"
    },
    request: {
      target: "/api/v1/sellers/57/application",
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.identity.getSellerApplication.field.id"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.identity.getSellerApplication.case.application",
        json: {
          id: 12,
          userId: 57,
          storeName: "Toko Kopi Kenari",
          businessRegistrationNumber: "9120301234567",
          taxId: "01.234.567.8-012.000",
          status: "pending",
          verifiedAt: null,
          streetAddress: "Jalan Flamboyan No. 8",
          city: "Jakarta Pusat",
          postalCode: "10330"
        },
        source: restSource("identity", "src/application/services/seller_onboarding_usecase.service.ts", 112, 119)
      },
      {
        status: 400,
        when: "rest.identity.getSellerApplication.case.badId",
        json: {
          message: "An account id is a whole number from 1 to 2147483647",
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/decorators/account_id_param.decorator.ts", 5, 13)
      },
      {
        status: 403,
        when: "rest.identity.getSellerApplication.case.notOwn",
        json: {
          message: "This account may only act on its own resources",
          error: "Forbidden",
          statusCode: 403,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/guards/self_or_staff.guard.ts", 41, 49)
      },
      {
        status: 404,
        when: "rest.identity.getSellerApplication.case.none",
        json: {
          message: "No seller application found for User ID 57",
          error: "Not Found",
          statusCode: 404,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/seller_onboarding_usecase.service.ts", 114, 116)
      }
    ],
    source: restSource("identity", "src/adapters/controllers/seller_onboarding.controller.ts", 27, 32)
  },
  {
    id: "identity.onboardSeller",
    service: "identity",
    method: "POST",
    path: "/api/v1/sellers/{id}/onboard",
    summary: "rest.identity.onboardSeller.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.identity.onboardSeller.who"
    },
    request: {
      target: "/api/v1/sellers/57/onboard",
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.identity.onboardSeller.field.id"
        },
        {
          name: "storeName",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.onboardSeller.field.storeName"
        },
        {
          name: "businessRegistrationNumber",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.onboardSeller.field.businessRegistrationNumber"
        },
        {
          name: "taxId",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.onboardSeller.field.taxId"
        },
        {
          name: "streetAddress",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.onboardSeller.field.streetAddress"
        },
        {
          name: "city",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.onboardSeller.field.city"
        },
        {
          name: "postalCode",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.onboardSeller.field.postalCode"
        }
      ],
      json: {
        storeName: "Toko Kopi Kenari",
        businessRegistrationNumber: "9120301234567",
        taxId: "01.234.567.8-012.000",
        streetAddress: "Jalan Flamboyan No. 8",
        city: "Jakarta Pusat",
        postalCode: "10330"
      }
    },
    cases: [
      {
        status: 201,
        when: "rest.identity.onboardSeller.case.filed",
        json: {
          id: 12,
          userId: 57,
          storeName: "Toko Kopi Kenari",
          businessRegistrationNumber: "9120301234567",
          taxId: "01.234.567.8-012.000",
          status: "pending",
          streetAddress: "Jalan Flamboyan No. 8",
          city: "Jakarta Pusat",
          postalCode: "10330"
        },
        source: restSource("identity", "src/application/services/seller_onboarding_usecase.service.ts", 45, 75)
      },
      {
        status: 400,
        when: "rest.identity.onboardSeller.case.invalid",
        json: {
          message: ["storeName should not be empty"],
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/infrastructure/http/http_pipeline.ts", 7, 13)
      },
      {
        status: 400,
        when: "rest.identity.onboardSeller.case.badId",
        json: {
          message: "An account id is a whole number from 1 to 2147483647",
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/decorators/account_id_param.decorator.ts", 5, 13)
      },
      {
        status: 403,
        when: "rest.identity.onboardSeller.case.notOwn",
        json: {
          message: "This account may only act on its own resources",
          error: "Forbidden",
          statusCode: 403,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/guards/self_or_staff.guard.ts", 41, 49)
      },
      {
        status: 404,
        when: "rest.identity.onboardSeller.case.noAccount",
        json: {
          message: "User with ID 9999 not found",
          error: "Not Found",
          statusCode: 404,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/seller_onboarding_usecase.service.ts", 38, 41)
      },
      {
        status: 409,
        when: "rest.identity.onboardSeller.case.alreadyVerified",
        json: {
          message: "This account is already a verified merchant",
          error: "Conflict",
          statusCode: 409,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/seller_onboarding_usecase.service.ts", 47, 50)
      },
      {
        status: 409,
        when: "rest.identity.onboardSeller.case.wrongRole",
        json: {
          message: "Account 63 is a courier; making it a seller would revoke that role",
          error: "Conflict",
          statusCode: 409,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/seller_onboarding_usecase.service.ts", 208, 216)
      },
      {
        status: 409,
        when: "rest.identity.onboardSeller.case.concurrent",
        json: {
          message:
            "A seller application for account 57 was filed by another request at the same time; read it and retry",
          error: "Conflict",
          statusCode: 409,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource(
          "identity",
          "src/infrastructure/persistence/adapters/typeorm_merchant_verification_repository.adapter.ts",
          50,
          55
        )
      }
    ],
    source: restSource("identity", "src/adapters/controllers/seller_onboarding.controller.ts", 34, 43)
  },
  {
    id: "identity.verifySeller",
    service: "identity",
    method: "POST",
    path: "/api/v1/sellers/{id}/verify",
    summary: "rest.identity.verifySeller.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.identity.verifySeller.who"
    },
    request: {
      target: "/api/v1/sellers/57/verify",
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.identity.verifySeller.field.id"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.identity.verifySeller.case.approved",
        json: {
          id: 8,
          userId: 57,
          storeName: "Toko Kopi Kenari",
          slug: "toko-kopi-kenari",
          businessRegistrationNumber: "9120301234567",
          taxId: "01.234.567.8-012.000",
          status: "verified",
          verifiedAt: "2026-10-22T03:15:00.412Z",
          streetAddress: "Jalan Flamboyan No. 8",
          city: "Jakarta Pusat",
          postalCode: "10330",
          latitude: -6.1912,
          longitude: 106.8389,
          geocodedAt: "2026-10-22T03:15:00.415Z"
        },
        source: restSource("identity", "src/application/services/seller_onboarding_usecase.service.ts", 135, 195)
      },
      {
        status: 400,
        when: "rest.identity.verifySeller.case.badId",
        json: {
          message: "An account id is a whole number from 1 to 2147483647",
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/decorators/account_id_param.decorator.ts", 5, 13)
      },
      {
        status: 403,
        when: "rest.identity.verifySeller.case.notAdmin",
        json: {
          message: "This account does not have access to this resource",
          error: "Forbidden",
          statusCode: 403,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/guards/roles.guard.ts", 23, 28)
      },
      {
        status: 404,
        when: "rest.identity.verifySeller.case.none",
        json: {
          message: "No seller application found for User ID 57",
          error: "Not Found",
          statusCode: 404,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/seller_onboarding_usecase.service.ts", 114, 116)
      },
      {
        status: 409,
        when: "rest.identity.verifySeller.case.notPending",
        json: {
          message: "The seller application of account 57 is rejected, not pending",
          error: "Conflict",
          statusCode: 409,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/seller_onboarding_usecase.service.ts", 197, 206)
      },
      {
        status: 409,
        when: "rest.identity.verifySeller.case.wrongRole",
        json: {
          message: "Account 57 is a courier; making it a seller would revoke that role",
          error: "Conflict",
          statusCode: 409,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/seller_onboarding_usecase.service.ts", 208, 216)
      },
      {
        status: 409,
        when: "rest.identity.verifySeller.case.concurrent",
        json: {
          message:
            "The merchant of account 57 or its store slug was written by another request at the same time; retry the approval",
          error: "Conflict",
          statusCode: 409,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource(
          "identity",
          "src/infrastructure/persistence/adapters/typeorm_merchant_repository.adapter.ts",
          119,
          124
        )
      }
    ],
    source: restSource("identity", "src/adapters/controllers/seller_onboarding.controller.ts", 45, 51)
  },
  {
    id: "identity.rejectSeller",
    service: "identity",
    method: "POST",
    path: "/api/v1/sellers/{id}/reject",
    summary: "rest.identity.rejectSeller.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.identity.rejectSeller.who"
    },
    request: {
      target: "/api/v1/sellers/57/reject",
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.identity.rejectSeller.field.id"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.identity.rejectSeller.case.rejected",
        json: {
          id: 12,
          userId: 57,
          storeName: "Toko Kopi Kenari",
          businessRegistrationNumber: "9120301234567",
          taxId: "01.234.567.8-012.000",
          status: "rejected",
          verifiedAt: null,
          streetAddress: "Jalan Flamboyan No. 8",
          city: "Jakarta Pusat",
          postalCode: "10330"
        },
        source: restSource("identity", "src/application/services/seller_onboarding_usecase.service.ts", 127, 133)
      },
      {
        status: 400,
        when: "rest.identity.rejectSeller.case.badId",
        json: {
          message: "An account id is a whole number from 1 to 2147483647",
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/decorators/account_id_param.decorator.ts", 5, 13)
      },
      {
        status: 403,
        when: "rest.identity.rejectSeller.case.notAdmin",
        json: {
          message: "This account does not have access to this resource",
          error: "Forbidden",
          statusCode: 403,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/guards/roles.guard.ts", 23, 28)
      },
      {
        status: 404,
        when: "rest.identity.rejectSeller.case.none",
        json: {
          message: "No seller application found for User ID 57",
          error: "Not Found",
          statusCode: 404,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/seller_onboarding_usecase.service.ts", 114, 116)
      },
      {
        status: 409,
        when: "rest.identity.rejectSeller.case.notPending",
        json: {
          message: "The seller application of account 57 is verified, not pending",
          error: "Conflict",
          statusCode: 409,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/seller_onboarding_usecase.service.ts", 197, 206)
      }
    ],
    source: restSource("identity", "src/adapters/controllers/seller_onboarding.controller.ts", 53, 59)
  },
  {
    id: "identity.registerCourier",
    service: "identity",
    method: "POST",
    path: "/api/v1/couriers/register",
    summary: "rest.identity.registerCourier.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.identity.registerCourier.who"
    },
    request: {
      target: "/api/v1/couriers/register",
      fields: [
        {
          name: "email",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.registerCourier.field.email"
        },
        {
          name: "password",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.registerCourier.field.password"
        },
        {
          name: "fullName",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.registerCourier.field.fullName"
        },
        {
          name: "phoneNumber",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.registerCourier.field.phoneNumber"
        },
        {
          name: "vehiclePlate",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.identity.registerCourier.field.vehiclePlate"
        },
        {
          name: "capacityKg",
          in: "body",
          type: "integer",
          required: true,
          rule: "rest.identity.registerCourier.field.capacityKg"
        }
      ],
      json: {
        email: "kurir.budi@example.com",
        password: "motor bebek merah tua",
        fullName: "Budi Santoso",
        phoneNumber: "+6281298765432",
        vehiclePlate: "B 1234 XYZ",
        capacityKg: 20
      }
    },
    cases: [
      {
        status: 201,
        when: "rest.identity.registerCourier.case.filed",
        headers: ["X-RateLimit-Limit: 5", "X-RateLimit-Remaining: 4", "X-RateLimit-Reset: 60"],
        json: {
          accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.<claims>.<signature>",
          refreshToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.<claims>.<signature>",
          expiresIn: 900,
          tokenType: "Bearer",
          user: {
            id: 63,
            email: "kurir.budi@example.com",
            role: "customer",
            principalId: "3c9e2a41-7b5d-4f08-9a1c-2d6e8f0b4c17"
          },
          driverId: 118
        },
        source: restSource("identity", "src/application/services/courier_registration_usecase.service.ts", 39, 62)
      },
      {
        status: 400,
        when: "rest.identity.registerCourier.case.invalid",
        json: {
          message: ["capacityKg must not be greater than 5000"],
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/infrastructure/http/http_pipeline.ts", 7, 13)
      },
      {
        status: 400,
        when: "rest.identity.registerCourier.case.fleetRefused",
        json: {
          error: "REGISTRATION_REFUSED",
          message:
            "Your account exists, but the fleet refused the vehicle: the fleet row could not be written: %{vehicle_plate: [\"has already been taken\"]}. Correct the vehicle details and submit again with the same email and password; the account will be reused.",
          accountExists: true,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource(
          "identity",
          "src/application/services/courier_registration_usecase.service.ts",
          137,
          146
        )
      },
      {
        status: 409,
        when: "rest.identity.registerCourier.case.emailRace",
        json: {
          message: "Email address is already registered",
          error: "Conflict",
          statusCode: 409,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/auth_usecase.service.ts", 94, 97)
      },
      {
        status: 409,
        when: "rest.identity.registerCourier.case.wrongPassword",
        json: {
          message: "An account with that email address already exists",
          error: "Conflict",
          statusCode: 409,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/courier_registration_usecase.service.ts", 77, 84)
      },
      {
        status: 409,
        when: "rest.identity.registerCourier.case.wrongRole",
        json: {
          message:
            "That account is a seller, and filing a vehicle under it would make it a courier. A courier registers with an account of its own.",
          error: "Conflict",
          statusCode: 409,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/courier_registration_usecase.service.ts", 86, 91)
      },
      {
        status: 409,
        when: "rest.identity.registerCourier.case.twoFactor",
        json: {
          message:
            "That account has two-factor authentication enabled, so registration cannot be resumed here. Sign in normally and file the vehicle from the app.",
          error: "Conflict",
          statusCode: 409,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/courier_registration_usecase.service.ts", 93, 98)
      },
      {
        status: 429,
        when: "rest.identity.registerCourier.case.throttled",
        headers: ["Retry-After: 42"],
        json: {
          error: "REQUEST_REFUSED",
          message: "ThrottlerException: Too Many Requests",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/controllers/courier_onboarding.controller.ts", 33, 39)
      },
      {
        status: 503,
        when: "rest.identity.registerCourier.case.fleetUnavailable",
        json: {
          error: "FLEET_UNAVAILABLE",
          message:
            "Your account exists, but the fleet could not be reached to file your vehicle. Submit the same details again to finish — nothing will be duplicated.",
          accountExists: true,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource(
          "identity",
          "src/application/services/courier_registration_usecase.service.ts",
          148,
          154
        )
      }
    ],
    source: restSource("identity", "src/adapters/controllers/courier_onboarding.controller.ts", 33, 39)
  },
  {
    id: "identity.listCourierApplications",
    service: "identity",
    method: "GET",
    path: "/api/v1/couriers/applications",
    summary: "rest.identity.listCourierApplications.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.identity.listCourierApplications.who"
    },
    request: {
      target: "/api/v1/couriers/applications?status=pending",
      fields: [
        {
          name: "status",
          in: "query",
          type: "string",
          required: false,
          rule: "rest.identity.listCourierApplications.field.status"
        },
        {
          name: "limit",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.identity.listCourierApplications.field.limit"
        },
        {
          name: "after",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.identity.listCourierApplications.field.after"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.identity.listCourierApplications.case.page",
        headers: ["X-RateLimit-Limit: 10", "X-RateLimit-Remaining: 9", "X-RateLimit-Reset: 60"],
        json: {
          applications: [
            {
              applicationId: 5,
              principalId: "3c9e2a41-7b5d-4f08-9a1c-2d6e8f0b4c17",
              userId: 63,
              email: "kurir.budi@example.com",
              driverId: 118,
              status: "pending",
              filedAt: "2026-10-21T07:42:10.226Z",
              approvedAt: null
            }
          ],
          nextAfterId: null
        },
        source: restSource(
          "identity",
          "src/infrastructure/persistence/adapters/typeorm_courier_application_repository.adapter.ts",
          47,
          99
        )
      },
      {
        status: 400,
        when: "rest.identity.listCourierApplications.case.invalid",
        json: {
          message: ["status must be one of the following values: pending, approved"],
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/infrastructure/http/http_pipeline.ts", 7, 13)
      },
      {
        status: 403,
        when: "rest.identity.listCourierApplications.case.notAdmin",
        json: {
          message: "This account does not have access to this resource",
          error: "Forbidden",
          statusCode: 403,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/guards/roles.guard.ts", 23, 28)
      },
      {
        status: 429,
        when: "rest.identity.listCourierApplications.case.throttled",
        headers: ["Retry-After: 42"],
        json: {
          error: "REQUEST_REFUSED",
          message: "ThrottlerException: Too Many Requests",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/infrastructure/http/throttle_policy.ts", 3, 6)
      }
    ],
    source: restSource("identity", "src/adapters/controllers/courier_onboarding.controller.ts", 41, 48)
  },
  {
    id: "identity.approveCourier",
    service: "identity",
    method: "POST",
    path: "/api/v1/couriers/{principalId}/approve",
    summary: "rest.identity.approveCourier.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.identity.approveCourier.who"
    },
    request: {
      target: "/api/v1/couriers/3c9e2a41-7b5d-4f08-9a1c-2d6e8f0b4c17/approve",
      fields: [
        {
          name: "principalId",
          in: "path",
          type: "string (uuid)",
          required: true,
          rule: "rest.identity.approveCourier.field.principalId"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.identity.approveCourier.case.approved",
        headers: ["X-RateLimit-Limit: 10", "X-RateLimit-Remaining: 9", "X-RateLimit-Reset: 60"],
        json: {
          principalId: "3c9e2a41-7b5d-4f08-9a1c-2d6e8f0b4c17",
          email: "kurir.budi@example.com",
          role: "courier",
          driverId: 118,
          fleetActivated: true
        },
        source: restSource("identity", "src/application/services/courier_onboarding_usecase.service.ts", 79, 91)
      },
      {
        status: 400,
        when: "rest.identity.approveCourier.case.badPrincipal",
        json: {
          message: "Validation failed (uuid is expected)",
          error: "Bad Request",
          statusCode: 400,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/controllers/courier_onboarding.controller.ts", 54, 56)
      },
      {
        status: 403,
        when: "rest.identity.approveCourier.case.notAdmin",
        json: {
          message: "This account does not have access to this resource",
          error: "Forbidden",
          statusCode: 403,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/adapters/guards/roles.guard.ts", 23, 28)
      },
      {
        status: 404,
        when: "rest.identity.approveCourier.case.unknown",
        json: {
          message: "No account is registered under principal 3c9e2a41-7b5d-4f08-9a1c-2d6e8f0b4c17",
          error: "Not Found",
          statusCode: 404,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/courier_onboarding_usecase.service.ts", 48, 56)
      },
      {
        status: 409,
        when: "rest.identity.approveCourier.case.wrongRole",
        json: {
          message:
            "Account 3c9e2a41-7b5d-4f08-9a1c-2d6e8f0b4c17 is a seller; promoting it to courier would revoke that role",
          error: "Conflict",
          statusCode: 409,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/courier_onboarding_usecase.service.ts", 63, 67)
      },
      {
        status: 409,
        when: "rest.identity.approveCourier.case.noVehicle",
        json: {
          error: "NO_DRIVER_RECORD",
          message:
            "This account has filed no vehicle, so it cannot be approved as a courier. Nothing was changed; it must register a vehicle first.",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/courier_onboarding_usecase.service.ts", 124, 131)
      },
      {
        status: 429,
        when: "rest.identity.approveCourier.case.throttled",
        headers: ["Retry-After: 42"],
        json: {
          error: "REQUEST_REFUSED",
          message: "ThrottlerException: Too Many Requests",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/infrastructure/http/throttle_policy.ts", 3, 6)
      },
      {
        status: 502,
        when: "rest.identity.approveCourier.case.fleetRefused",
        json: {
          error: "REGISTRATION_REFUSED",
          message:
            "The fleet refused to activate this driver (REGISTRATION_REFUSED: the fleet row could not be written: %{vehicle_plate: [\"can't be blank\"]}). Nothing was changed.",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/courier_onboarding_usecase.service.ts", 133, 139)
      },
      {
        status: 503,
        when: "rest.identity.approveCourier.case.fleetUnavailable",
        json: {
          error: "FLEET_UNAVAILABLE",
          message:
            "The account is now a courier, but the fleet could not be told to activate the driver. Approve again once the fleet is reachable; nothing will be duplicated.",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("identity", "src/application/services/courier_onboarding_usecase.service.ts", 142, 147)
      }
    ],
    source: restSource("identity", "src/adapters/controllers/courier_onboarding.controller.ts", 50, 58)
  },
  {
    id: "identity.jwks",
    service: "identity",
    method: "GET",
    path: "/.well-known/jwks.json",
    summary: "rest.identity.jwks.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.identity.jwks.who"
    },
    request: {
      target: "/.well-known/jwks.json",
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.identity.jwks.case.keys",
        headers: ["Cache-Control: public, max-age=300"],
        contentType: "application/jwk-set+json; charset=utf-8",
        json: {
          keys: [
            {
              kty: "RSA",
              n: "<modulus, base64url>",
              e: "AQAB",
              kid: "<RFC 7638 thumbprint, base64url>",
              use: "sig",
              alg: "RS256"
            }
          ]
        },
        source: restSource("identity", "src/infrastructure/crypto/jwt_key_provider.ts", 126, 137)
      }
    ],
    source: restSource("identity", "src/adapters/controllers/jwks.controller.ts", 10, 17)
  }
];
