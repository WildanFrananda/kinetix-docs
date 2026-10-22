import type { RestCase } from "../../types/rest_case.type";
import type { RestEndpoint } from "../../types/rest_endpoint.type";
import { restSource } from "../rest_source";

const deviceApi = "src/main/scala/com/kinetix/notification/infrastructure/http/DeviceApi.scala";
const httpApi = "src/main/scala/com/kinetix/notification/infrastructure/http/HttpApi.scala";
const deviceRegistry = "src/main/scala/com/kinetix/notification/infrastructure/persistence/PostgresDeviceRegistry.scala";
const verifyDevice = "src/main/scala/com/kinetix/notification/application/VerifyDevice.scala";
const handsetToken = "f7Kq2mXr0Ts:APA91bG3exampleHandsetRegistrationTokenK9vL2pQ8wR4tY6uI0oP3aS5dF7gH1jK";

export const notificationAnswers: readonly RestCase[] = [
  {
    status: 400,
    when: "rest.notification.answers.malformed",
    json: {
      error: "MALFORMED_BODY"
    },
    source: restSource("notification", deviceApi, 100, 110)
  },
  {
    status: 401,
    when: "rest.notification.answers.unauthenticated",
    headers: ["WWW-Authenticate: Bearer"],
    json: {
      error: "UNAUTHENTICATED"
    },
    source: restSource("notification", deviceApi, 83, 98)
  },
  {
    status: 404,
    when: "rest.notification.answers.notFound",
    json: {
      error: "NOT_FOUND"
    },
    source: restSource("notification", httpApi, 34, 39)
  },
  {
    status: 405,
    when: "rest.notification.answers.methodNotAllowed",
    headers: ["Allow: POST"],
    json: {
      error: "METHOD_NOT_ALLOWED"
    },
    source: restSource("notification", httpApi, 34, 38)
  },
  {
    status: 413,
    when: "rest.notification.answers.tooLarge",
    json: {
      error: "BODY_TOO_LARGE"
    },
    source: restSource("notification", deviceApi, 100, 106)
  },
  {
    status: 500,
    when: "rest.notification.answers.internal",
    headers: ["Content-Length: 0"],
    source: restSource("notification", "src/main/scala/com/kinetix/notification/Main.scala", 175, 185)
  },
  {
    status: 503,
    when: "rest.notification.answers.database",
    json: {
      error: "STORE_UNAVAILABLE",
      message: "the delivery record could not be reached"
    },
    source: restSource("notification", deviceApi, 126, 130)
  },
  {
    status: 503,
    when: "rest.notification.answers.keysUnreadable",
    json: {
      error: "TOKEN_UNVERIFIABLE"
    },
    source: restSource("notification", deviceApi, 95, 97)
  }
];

export const notificationEndpoints: readonly RestEndpoint[] = [
  {
    id: "notification.registerDevice",
    service: "notification",
    method: "POST",
    path: "/api/v1/notifications/devices",
    summary: "rest.notification.registerDevice.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.notification.registerDevice.who"
    },
    request: {
      target: "/api/v1/notifications/devices",
      fields: [
        {
          name: "device_token",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.notification.registerDevice.field.deviceToken"
        },
        {
          name: "platform",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.notification.registerDevice.field.platform"
        }
      ],
      json: {
        device_token: handsetToken,
        platform: "ANDROID"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.notification.registerDevice.case.added",
        json: {
          registered: true,
          already_registered: false
        },
        source: restSource("notification", deviceRegistry, 83, 94)
      },
      {
        status: 200,
        when: "rest.notification.registerDevice.case.refreshed",
        json: {
          registered: true,
          already_registered: true
        },
        source: restSource("notification", deviceRegistry, 34, 35)
      },
      {
        status: 202,
        when: "rest.notification.registerDevice.case.verificationPending",
        json: {
          registered: false,
          state: "DEVICE_VERIFICATION_PENDING",
          expires_at: "2026-10-22T03:25:00.481236Z"
        },
        source: restSource("notification", deviceApi, 52, 60)
      },
      {
        status: 400,
        when: "rest.notification.registerDevice.case.invalidDeviceToken",
        json: {
          error: "INVALID_DEVICE_TOKEN",
          message: "device_token is required and at most 512 characters"
        },
        source: restSource("notification", deviceApi, 43, 44)
      },
      {
        status: 400,
        when: "rest.notification.registerDevice.case.invalidPlatform",
        json: {
          error: "INVALID_PLATFORM",
          message: "platform must be ANDROID or IOS"
        },
        source: restSource("notification", deviceApi, 43, 45)
      }
    ],
    source: restSource("notification", deviceApi, 40, 60)
  },
  {
    id: "notification.verifyDevice",
    service: "notification",
    method: "POST",
    path: "/api/v1/notifications/devices/verify",
    summary: "rest.notification.verifyDevice.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.notification.verifyDevice.who"
    },
    request: {
      target: "/api/v1/notifications/devices/verify",
      fields: [
        {
          name: "device_token",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.notification.verifyDevice.field.deviceToken"
        },
        {
          name: "nonce",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.notification.verifyDevice.field.nonce"
        }
      ],
      json: {
        device_token: handsetToken,
        nonce: "Vq3tX8mK2pL7wR9cN4bY6hJ1sD5fG0aZ-eU_iO3kQ7w"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.notification.verifyDevice.case.verified",
        json: {
          registered: true,
          already_registered: false
        },
        source: restSource("notification", deviceRegistry, 105, 112)
      },
      {
        status: 400,
        when: "rest.notification.verifyDevice.case.invalidDeviceToken",
        json: {
          error: "INVALID_DEVICE_TOKEN",
          message: "device_token is required and at most 512 characters"
        },
        source: restSource("notification", deviceApi, 65, 66)
      },
      {
        status: 400,
        when: "rest.notification.verifyDevice.case.invalidNonce",
        json: {
          error: "INVALID_NONCE",
          message: "nonce is required and at most 128 characters"
        },
        source: restSource("notification", deviceApi, 65, 67)
      },
      {
        status: 422,
        when: "rest.notification.verifyDevice.case.notPending",
        json: {
          error: "VERIFICATION_NOT_PENDING",
          message: "no proof is pending for this device and principal; register the device again"
        },
        source: restSource("notification", verifyDevice, 19, 24)
      },
      {
        status: 422,
        when: "rest.notification.verifyDevice.case.nonceMismatch",
        json: {
          error: "VERIFICATION_FAILED",
          message: "the nonce does not match the one sent to this device; 4 attempt(s) left"
        },
        source: restSource("notification", deviceRegistry, 114, 120)
      }
    ],
    source: restSource("notification", deviceApi, 62, 71)
  },
  {
    id: "notification.forgetDevice",
    service: "notification",
    method: "DELETE",
    path: "/api/v1/notifications/devices",
    summary: "rest.notification.forgetDevice.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.notification.forgetDevice.who"
    },
    request: {
      target: "/api/v1/notifications/devices",
      fields: [
        {
          name: "device_token",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.notification.forgetDevice.field.deviceToken"
        }
      ],
      json: {
        device_token: handsetToken
      }
    },
    cases: [
      {
        status: 204,
        when: "rest.notification.forgetDevice.case.forgotten",
        source: restSource("notification", deviceApi, 78, 81)
      },
      {
        status: 400,
        when: "rest.notification.forgetDevice.case.invalidDeviceToken",
        json: {
          error: "INVALID_DEVICE_TOKEN",
          message: "device_token is required and at most 512 characters"
        },
        source: restSource("notification", deviceApi, 76, 77)
      }
    ],
    source: restSource("notification", deviceApi, 73, 81)
  }
];
