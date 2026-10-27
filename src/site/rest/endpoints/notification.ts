import type { RestCase } from "../../types/rest_case.type";
import type { RestEndpoint } from "../../types/rest_endpoint.type";
import { restSource } from "../rest_source";

const deviceApi = "src/main/scala/com/kinetix/notification/infrastructure/http/DeviceApi.scala";
const httpApi = "src/main/scala/com/kinetix/notification/infrastructure/http/HttpApi.scala";
const deviceRegistry = "src/main/scala/com/kinetix/notification/infrastructure/persistence/PostgresDeviceRegistry.scala";
const verifyDevice = "src/main/scala/com/kinetix/notification/application/VerifyDevice.scala";
const deviceChallenge = "src/main/scala/com/kinetix/notification/domain/DeviceChallenge.scala";
const pushSender = "src/main/scala/com/kinetix/notification/infrastructure/http/HttpPushSender.scala";
const handsetToken = "f7Kq2mXr0Ts:APA91bG3exampleHandsetRegistrationTokenK9vL2pQ8wR4tY6uI0oP3aS5dF7gH1jK";

export const notificationAnswers: readonly RestCase[] = [
  {
    status: 400,
    when: "rest.notification.answers.malformed",
    json: {
      error: "MALFORMED_BODY"
    },
    source: restSource("notification", deviceApi, 107, 117)
  },
  {
    status: 401,
    when: "rest.notification.answers.unauthenticated",
    headers: ["WWW-Authenticate: Bearer"],
    json: {
      error: "UNAUTHENTICATED"
    },
    source: restSource("notification", deviceApi, 90, 105)
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
    source: restSource("notification", deviceApi, 107, 113)
  },
  {
    status: 500,
    when: "rest.notification.answers.internal",
    headers: ["Content-Length: 0"],
    source: restSource("notification", "src/main/scala/com/kinetix/notification/Main.scala", 192, 202)
  },
  {
    status: 503,
    when: "rest.notification.answers.database",
    json: {
      error: "STORE_UNAVAILABLE",
      message: "the device registry could not be reached; try again later"
    },
    source: restSource("notification", deviceApi, 133, 138)
  },
  {
    status: 503,
    when: "rest.notification.answers.keysUnreadable",
    json: {
      error: "TOKEN_UNVERIFIABLE"
    },
    source: restSource("notification", deviceApi, 102, 104)
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
        source: restSource("notification", deviceRegistry, 106, 117)
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
        source: restSource("notification", deviceApi, 59, 67)
      },
      {
        status: 400,
        when: "rest.notification.registerDevice.case.invalidDeviceToken",
        json: {
          error: "INVALID_DEVICE_TOKEN",
          message: "device_token is required and at most 512 characters"
        },
        source: restSource("notification", deviceApi, 50, 51)
      },
      {
        status: 400,
        when: "rest.notification.registerDevice.case.invalidPlatform",
        json: {
          error: "INVALID_PLATFORM",
          message: "platform must be ANDROID or IOS"
        },
        source: restSource("notification", deviceApi, 50, 52)
      },
      {
        status: 422,
        when: "rest.notification.registerDevice.case.addressGone",
        json: {
          error: "ADDRESS_GONE",
          message:
            "the push provider says this device token no longer exists; get a fresh FCM token and register it again"
        },
        source: restSource("notification", deviceApi, 148, 150)
      },
      {
        status: 422,
        when: "rest.notification.registerDevice.case.foreignToken",
        json: {
          error: "ADDRESS_GONE",
          message:
            "the push provider says this device token belongs to another app; get an FCM token from this app and register it"
        },
        source: restSource("notification", pushSender, 130, 140)
      },
      {
        status: 429,
        when: "rest.notification.registerDevice.case.alreadyPending",
        headers: ["Retry-After: 413"],
        json: {
          error: "VERIFICATION_ALREADY_PENDING",
          message:
            "a proof was already sent to this device for this principal; echo its nonce, or register again after 2026-10-22T03:25:00.481236Z"
        },
        source: restSource("notification", deviceApi, 170, 185)
      },
      {
        status: 429,
        when: "rest.notification.registerDevice.case.limitReached",
        headers: ["Retry-After: 1878"],
        json: {
          error: "VERIFICATION_LIMIT_REACHED",
          message: "this device was sent 3 proofs within an hour; register again after 2026-10-22T04:02:17.903114Z"
        },
        source: restSource("notification", deviceChallenge, 35, 43)
      },
      {
        status: 502,
        when: "rest.notification.registerDevice.case.senderRejected",
        json: {
          error: "SENDER_REJECTED",
          message: "the push provider refused the message; repeating the request unchanged does not help"
        },
        source: restSource("notification", deviceApi, 145, 145)
      },
      {
        status: 503,
        when: "rest.notification.registerDevice.case.senderUnavailable",
        json: {
          error: "SENDER_UNAVAILABLE",
          message:
            "the push provider did not answer; 3 attempts were made, with 200 ms and 600 ms back-off; try again later"
        },
        source: restSource("notification", deviceApi, 139, 140)
      },
      {
        status: 503,
        when: "rest.notification.registerDevice.case.senderThrottled",
        headers: ["Retry-After: 30"],
        json: {
          error: "SENDER_UNAVAILABLE",
          message:
            "the push provider is limiting how much this service may send; 3 attempts were made, with 200 ms and 600 ms back-off; try again after Retry-After"
        },
        source: restSource("notification", deviceApi, 141, 142)
      },
      {
        status: 503,
        when: "rest.notification.registerDevice.case.senderCredentials",
        json: {
          error: "SENDER_UNAVAILABLE",
          message:
            "the push provider did not accept this service's credentials; the request is not at fault; try again later"
        },
        source: restSource("notification", deviceApi, 143, 144)
      }
    ],
    source: restSource("notification", deviceApi, 47, 67)
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
        source: restSource("notification", deviceRegistry, 134, 141)
      },
      {
        status: 400,
        when: "rest.notification.verifyDevice.case.invalidDeviceToken",
        json: {
          error: "INVALID_DEVICE_TOKEN",
          message: "device_token is required and at most 512 characters"
        },
        source: restSource("notification", deviceApi, 72, 73)
      },
      {
        status: 400,
        when: "rest.notification.verifyDevice.case.invalidNonce",
        json: {
          error: "INVALID_NONCE",
          message: "nonce is required and at most 128 characters"
        },
        source: restSource("notification", deviceApi, 72, 74)
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
        source: restSource("notification", deviceRegistry, 143, 149)
      }
    ],
    source: restSource("notification", deviceApi, 69, 78)
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
        source: restSource("notification", deviceApi, 85, 88)
      },
      {
        status: 400,
        when: "rest.notification.forgetDevice.case.invalidDeviceToken",
        json: {
          error: "INVALID_DEVICE_TOKEN",
          message: "device_token is required and at most 512 characters"
        },
        source: restSource("notification", deviceApi, 83, 84)
      }
    ],
    source: restSource("notification", deviceApi, 80, 88)
  }
];
