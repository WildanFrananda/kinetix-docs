import type { RestSocket } from "../../types/rest_socket.type";
import type { RestSocketMessage } from "../../types/rest_socket_message.type";
import { restSource } from "../rest_source";

const driverSocket = "matching.driverSocket";
const merchantSocket = "matching.merchantSocket";
const buyerSocket = "edge.buyerSocket";

const photoSha256 = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const photoUrl = `https://storage.wildanfrananda.my.id/kinetix-delivery-proof/orders/4812/${photoSha256}.jpg`;
const orderNumber = "ORD-2026-4812";
const orderUuid = "019a0000-0000-7000-8000-000000000101";

const assignedOrder = {
  id: 4812,
  orderNumber,
  awbNumber: "KX-4812",
  status: "assigned",
  merchantPrincipalId: "merch-01",
  driverId: 17,
  weightKg: 2,
  pickup: { latitude: -6.1754, longitude: 106.8272 },
  dropoff: { latitude: -6.2297, longitude: 106.8295 },
  assignedAt: "2026-11-16T03:15:02.187430Z",
  deliveredAt: null,
  podPhotoUrl: null,
  podSignature: null,
  eventSequence: 1
};

const pickedUpOrder = {
  ...assignedOrder,
  status: "picked_up",
  eventSequence: 2
};

const deliveredOrder = {
  ...pickedUpOrder,
  status: "delivered",
  deliveredAt: "2026-11-16T03:42:10.000000Z",
  podPhotoUrl: photoUrl,
  podSignature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA…",
  eventSequence: 3
};

const requestId = "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b";

function edgeError(error: string, message: string) {
  return { error, message, requestId };
}

function commandError(requestId: string, code: string, reason: string, message: string, retryable = false) {
  return {
    event: "command.error",
    requestId,
    schemaVersion: 1,
    occurredAt: "2026-11-16T02:40:00Z",
    error: { code, reason, message, retryable }
  };
}

export const matchingSockets: readonly RestSocket[] = [
  {
    id: driverSocket,
    service: "matching",
    path: "/ws/v1/events",
    summary: "rest.matching.driverSocket.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.matching.driverSocket.who"
    },
    request: {
      fields: [],
      headers: ["Authorization: Bearer <accessToken>"]
    },
    cases: [
      {
        status: 101,
        when: "rest.matching.driverSocket.case.upgraded",
        source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 38, 63)
      },
      {
        status: 401,
        json: edgeError("SESSION_REQUIRED", "Sign in first."),
        when: "rest.matching.driverSocket.case.sessionRequired",
        source: restSource("edge", "src/http/event_socket.tl", 608, 612)
      },
      {
        status: 401,
        json: edgeError("SESSION_ENDED", "The session has ended. Sign in again."),
        when: "rest.matching.driverSocket.case.sessionEnded",
        source: restSource("edge", "src/http/event_socket.tl", 534, 538)
      },
      {
        status: 426,
        headers: ["Upgrade: websocket"],
        json: edgeError("WEBSOCKET_REQUIRED", "This path takes a WebSocket upgrade only."),
        when: "rest.matching.driverSocket.case.websocketRequired",
        source: restSource("edge", "src/http/event_socket.tl", 602, 606)
      },
      {
        status: 429,
        json: edgeError("TOO_MANY_REQUESTS", "Too many requests. Try again after Retry-After."),
        when: "rest.matching.driverSocket.case.throttled",
        source: restSource("edge", "src/http/event_socket.tl", 528, 532)
      },
      {
        status: 502,
        json: edgeError("IDENTITY_FAILED", "identity answered in a way the edge does not understand, so nothing was decided."),
        when: "rest.matching.driverSocket.case.identityFailed",
        source: restSource("edge", "src/http/event_socket.tl", 540, 559)
      },
      {
        status: 503,
        json: edgeError("IDENTITY_UNAVAILABLE", "identity could not be reached, so nothing was decided. Try again later."),
        when: "rest.matching.driverSocket.case.identityUnavailable",
        source: restSource("edge", "src/http/event_socket.tl", 521, 526)
      },
      {
        status: 503,
        json: edgeError("API_UNAVAILABLE", "The API could not be reached, and it is not known whether the request took effect. Read the current state first."),
        when: "rest.matching.driverSocket.case.apiUnavailable",
        source: restSource("edge", "src/http/event_socket.tl", 450, 454)
      }
    ],
    source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 38, 75)
  },
  {
    id: merchantSocket,
    service: "matching",
    via: "seller-web",
    path: "/ws/v1/events",
    summary: "rest.matching.merchantSocket.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.matching.merchantSocket.who"
    },
    request: {
      fields: [],
      headers: []
    },
    cases: [
      {
        status: 101,
        when: "rest.matching.merchantSocket.case.upgraded",
        source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 77, 98)
      },
      {
        status: 401,
        json: edgeError("SESSION_REQUIRED", "Sign in first."),
        when: "rest.matching.merchantSocket.case.sessionRequired",
        source: restSource("edge", "src/http/event_socket.tl", 584, 588)
      },
      {
        status: 401,
        json: edgeError("SESSION_ENDED", "The session has ended. Sign in again."),
        when: "rest.matching.merchantSocket.case.sessionEnded",
        source: restSource("edge", "src/http/event_socket.tl", 584, 588)
      },
      {
        status: 403,
        json: edgeError("CSRF_REFUSED", "This request did not come from the application's own page, so nothing was done."),
        when: "rest.matching.merchantSocket.case.csrfRefused",
        source: restSource("edge", "src/http/event_socket.tl", 572, 576)
      },
      {
        status: 403,
        json: edgeError("ROLE_REFUSED", "This account cannot use this application."),
        when: "rest.matching.merchantSocket.case.roleRefused",
        source: restSource("edge", "src/http/event_socket.tl", 584, 588)
      },
      {
        status: 426,
        headers: ["Upgrade: websocket"],
        json: edgeError("WEBSOCKET_REQUIRED", "This path takes a WebSocket upgrade only."),
        when: "rest.matching.merchantSocket.case.websocketRequired",
        source: restSource("edge", "src/http/event_socket.tl", 566, 570)
      },
      {
        status: 503,
        json: edgeError("SESSION_STORE_UNAVAILABLE", "The session store could not be reached, so nothing was checked. Try again later."),
        when: "rest.matching.merchantSocket.case.storeUnavailable",
        source: restSource("edge", "src/http/event_socket.tl", 578, 582)
      },
      {
        status: 503,
        json: edgeError("IDENTITY_UNAVAILABLE", "identity could not be reached, so nothing was decided. Try again later."),
        when: "rest.matching.merchantSocket.case.identityUnavailable",
        source: restSource("edge", "src/http/event_socket.tl", 584, 588)
      }
    ],
    source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 77, 98)
  },
  {
    id: buyerSocket,
    service: "edge",
    path: "/ws/v1/events",
    summary: "rest.edge.buyerSocket.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.edge.buyerSocket.who"
    },
    request: {
      fields: [],
      headers: ["Authorization: Bearer <accessToken>"]
    },
    cases: [
      {
        status: 101,
        when: "rest.edge.buyerSocket.case.upgraded",
        source: restSource("edge", "src/http/event_socket.tl", 456, 466)
      },
      {
        status: 401,
        json: edgeError("SESSION_REQUIRED", "Sign in first."),
        when: "rest.edge.buyerSocket.case.sessionRequired",
        source: restSource("edge", "src/http/event_socket.tl", 608, 612)
      },
      {
        status: 401,
        json: edgeError("SESSION_ENDED", "The session has ended. Sign in again."),
        when: "rest.edge.buyerSocket.case.sessionEnded",
        source: restSource("edge", "src/http/event_socket.tl", 534, 538)
      },
      {
        status: 426,
        headers: ["Upgrade: websocket"],
        json: edgeError("WEBSOCKET_REQUIRED", "This path takes a WebSocket upgrade only."),
        when: "rest.edge.buyerSocket.case.websocketRequired",
        source: restSource("edge", "src/http/event_socket.tl", 602, 606)
      },
      {
        status: 429,
        json: edgeError("TOO_MANY_REQUESTS", "Too many requests. Try again after Retry-After."),
        when: "rest.edge.buyerSocket.case.throttled",
        source: restSource("edge", "src/http/event_socket.tl", 528, 532)
      },
      {
        status: 502,
        json: edgeError("IDENTITY_FAILED", "identity answered in a way the edge does not understand, so nothing was decided."),
        when: "rest.edge.buyerSocket.case.identityFailed",
        source: restSource("edge", "src/http/event_socket.tl", 540, 559)
      },
      {
        status: 503,
        json: edgeError("IDENTITY_UNAVAILABLE", "identity could not be reached, so nothing was decided. Try again later."),
        when: "rest.edge.buyerSocket.case.identityUnavailable",
        source: restSource("edge", "src/http/event_socket.tl", 521, 526)
      }
    ],
    source: restSource("edge", "src/http/event_socket.tl", 601, 630)
  }
];

export const matchingSocketMessages: readonly RestSocketMessage[] = [
  {
    id: `${driverSocket}.snapshot`,
    socket: driverSocket,
    direction: "receive",
    summary: "rest.matching.driverSocket.snapshot.summary",
    frame: {
      event: "matching.job.snapshot",
      eventId: "019a0000-0000-7000-8000-000000000001",
      schemaVersion: 1,
      orderId: null,
      sequence: null,
      occurredAt: "2026-11-16T02:40:00Z",
      data: { dutyStatus: "offline", activeOrder: null }
    },
    replies: [],
    source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 38, 63)
  },
  {
    id: `${driverSocket}.heartbeat`,
    socket: driverSocket,
    direction: "send",
    summary: "rest.matching.driverSocket.heartbeat.summary",
    frame: {
      event: "system.ping",
      requestId: "req-ping-1",
      schemaVersion: 1,
      data: {}
    },
    replies: [
      {
        status: "ok",
        frame: {
          event: "system.pong",
          requestId: "req-ping-1",
          schemaVersion: 1,
          occurredAt: "2026-11-16T02:40:01Z",
          data: { serverTime: "2026-11-16T02:40:01Z" }
        },
        when: "rest.matching.driverSocket.heartbeat.reply.alive",
        source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 244, 246)
      }
    ],
    source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 244, 246)
  },
  {
    id: `${driverSocket}.status`,
    socket: driverSocket,
    direction: "send",
    summary: "rest.matching.driverSocket.status.summary",
    frame: {
      event: "courier.duty.set",
      requestId: "req-duty-1",
      schemaVersion: 1,
      data: { status: "online" }
    },
    replies: [
      {
        status: "ok",
        frame: {
          event: "command.ack",
          requestId: "req-duty-1",
          schemaVersion: 1,
          occurredAt: "2026-11-16T02:40:02Z",
          data: { status: "online" }
        },
        when: "rest.matching.driverSocket.status.reply.changed",
        source: restSource("matching", "lib/kinetix_matching/tracking/driver_state.ex", 221, 247)
      },
      {
        status: "error",
        frame: commandError("req-duty-1", "INVALID_STATUS", "invalid_status", "Duty status is invalid"),
        when: "rest.matching.driverSocket.status.reply.invalidStatus",
        source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 293, 313)
      },
      {
        status: "error",
        frame: commandError(
          "req-duty-1",
          "NO_ACTIVE_JOB",
          "no_active_job",
          "Busy duty status requires an active assigned job"
        ),
        when: "rest.matching.driverSocket.status.reply.noActiveJob",
        source: restSource("matching", "lib/kinetix_matching/tracking/driver_state.ex", 235, 237)
      }
    ],
    source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 293, 313)
  },
  {
    id: `${driverSocket}.ping`,
    socket: driverSocket,
    direction: "send",
    summary: "rest.matching.driverSocket.ping.summary",
    frame: {
      event: "courier.location.ping",
      requestId: "req-loc-1",
      schemaVersion: 1,
      data: {
        latitude: -6.1781,
        longitude: 106.8235,
        recordedAt: "2026-11-16T02:40:06.250Z",
        speedKmh: 21.6,
        bearingDeg: 87.5
      }
    },
    replies: [
      {
        status: "ok",
        frame: {
          event: "command.ack",
          requestId: "req-loc-1",
          schemaVersion: 1,
          occurredAt: "2026-11-16T02:40:06Z",
          data: { accepted: true }
        },
        when: "rest.matching.driverSocket.ping.reply.accepted",
        source: restSource("matching", "lib/kinetix_matching/tracking/driver_state.ex", 359, 375)
      },
      {
        status: "error",
        frame: commandError(
          "req-loc-1",
          "INVALID_TELEMETRY",
          "invalid_telemetry",
          "Invalid GPS telemetry payload"
        ),
        when: "rest.matching.driverSocket.ping.reply.invalidTelemetry",
        source: restSource("matching", "lib/kinetix_matching/tracking/telemetry.ex", 37, 100)
      },
      {
        status: "error",
        frame: commandError(
          "req-loc-1",
          "RATE_LIMITED",
          "rate_limited",
          "Rate limit exceeded; slow down",
          true
        ),
        when: "rest.matching.driverSocket.ping.reply.rateLimited",
        source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 405, 408)
      }
    ],
    source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 252, 267)
  },
  {
    id: `${driverSocket}.pingBatch`,
    socket: driverSocket,
    direction: "send",
    summary: "rest.matching.driverSocket.pingBatch.summary",
    frame: {
      event: "courier.location.batch",
      requestId: "req-batch-1",
      schemaVersion: 1,
      data: {
        pings: [
          { latitude: -6.1932, longitude: 106.8201, recordedAt: "2026-11-16T02:21:04.000Z" },
          { latitude: -6.1937, longitude: 106.8209, recordedAt: "2026-11-16T02:21:09.000Z" },
          { latitude: -6.1702, longitude: 106.8311, recordedAt: "2026-11-14T23:10:00.000Z" }
        ]
      }
    },
    replies: [
      {
        status: "ok",
        frame: {
          event: "command.ack",
          requestId: "req-batch-1",
          schemaVersion: 1,
          occurredAt: "2026-11-16T02:41:00Z",
          data: {
            stored: [0],
            duplicates: [1],
            refused: [{ index: 2, reason: "too_old" }]
          }
        },
        when: "rest.matching.driverSocket.pingBatch.reply.read",
        source: restSource("matching", "lib/kinetix_matching/tracking/offline_history.ex", 35, 55)
      },
      {
        status: "error",
        frame: commandError(
          "req-batch-1",
          "INVALID_BATCH",
          "invalid_batch",
          "Invalid offline ping batch payload"
        ),
        when: "rest.matching.driverSocket.pingBatch.reply.invalidBatch",
        source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 289, 291)
      },
      {
        status: "error",
        frame: commandError(
          "req-batch-1",
          "BATCH_TOO_LARGE",
          "batch_too_large",
          "Ping batch exceeds maximum allowed size"
        ),
        when: "rest.matching.driverSocket.pingBatch.reply.batchTooLarge",
        source: restSource("matching", "lib/kinetix_matching/tracking/offline_history.ex", 32, 33)
      },
      {
        status: "error",
        frame: commandError(
          "req-batch-1",
          "RATE_LIMITED",
          "rate_limited",
          "Rate limit exceeded; slow down",
          true
        ),
        when: "rest.matching.driverSocket.pingBatch.reply.rateLimited",
        source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 410, 413)
      },
      {
        status: "error",
        frame: commandError(
          "req-batch-1",
          "UNAVAILABLE",
          "unavailable",
          "Service temporarily unavailable",
          true
        ),
        when: "rest.matching.driverSocket.pingBatch.reply.unavailable",
        source: restSource("matching", "lib/kinetix_matching/tracking/offline_history.ex", 101, 120)
      }
    ],
    source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 269, 291)
  },
  {
    id: `${driverSocket}.pickup`,
    socket: driverSocket,
    direction: "send",
    summary: "rest.matching.driverSocket.pickup.summary",
    frame: {
      event: "matching.job.pickup",
      requestId: "req-pickup-1",
      schemaVersion: 1,
      data: { orderId: 4812 }
    },
    replies: [
      {
        status: "ok",
        frame: {
          event: "command.ack",
          requestId: "req-pickup-1",
          schemaVersion: 1,
          occurredAt: "2026-11-16T03:17:00Z",
          data: { order: pickedUpOrder }
        },
        when: "rest.matching.driverSocket.pickup.reply.pickedUp",
        source: restSource("matching", "lib/kinetix_matching/dispatch.ex", 318, 327)
      },
      {
        status: "error",
        frame: commandError(
          "req-pickup-1",
          "INVALID_ORDER_ID",
          "invalid_order_id",
          "orderId must be a positive integer"
        ),
        when: "rest.matching.driverSocket.pickup.reply.invalidOrderId",
        source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 375, 378)
      },
      {
        status: "error",
        frame: commandError("req-pickup-1", "NOT_FOUND", "not_found", "Requested resource was not found"),
        when: "rest.matching.driverSocket.pickup.reply.notFound",
        source: restSource("matching", "lib/kinetix_matching/dispatch.ex", 618, 627)
      },
      {
        status: "error",
        frame: commandError(
          "req-pickup-1",
          "FORBIDDEN",
          "forbidden",
          "Action not permitted for this principal"
        ),
        when: "rest.matching.driverSocket.pickup.reply.forbidden",
        source: restSource("matching", "lib/kinetix_matching/dispatch.ex", 630, 631)
      },
      {
        status: "error",
        frame: commandError(
          "req-pickup-1",
          "INVALID_TRANSITION",
          "invalid_transition",
          "Order cannot transition from its current state"
        ),
        when: "rest.matching.driverSocket.pickup.reply.invalidTransition",
        source: restSource("matching", "lib/kinetix_matching/dispatch.ex", 635, 658)
      }
    ],
    source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 315, 333)
  },
  {
    id: `${driverSocket}.podUpload`,
    socket: driverSocket,
    direction: "send",
    summary: "rest.matching.driverSocket.podUpload.summary",
    frame: {
      event: "matching.job.podUpload",
      requestId: "req-pod-1",
      schemaVersion: 1,
      data: { orderId: 4812, photoSha256 }
    },
    replies: [
      {
        status: "ok",
        frame: {
          event: "command.ack",
          requestId: "req-pod-1",
          schemaVersion: 1,
          occurredAt: "2026-11-16T03:19:50Z",
          data: {
            uploadUrl:
              `${photoUrl}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=…&X-Amz-Date=20261116T031950Z` +
              "&X-Amz-Expires=600&X-Amz-SignedHeaders=host%3Bif-none-match%3Bx-amz-checksum-sha256&X-Amz-Signature=…",
            uploadHeaders: {
              "if-none-match": "*",
              "x-amz-checksum-sha256": "u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7s="
            },
            photoUrl
          }
        },
        when: "rest.matching.driverSocket.podUpload.reply.address",
        source: restSource("matching", "lib/kinetix_matching/dispatch.ex", 289, 305)
      },
      {
        status: "error",
        frame: commandError(
          "req-pod-1",
          "INVALID_ORDER_ID",
          "invalid_order_id",
          "orderId must be a positive integer"
        ),
        when: "rest.matching.driverSocket.podUpload.reply.invalidOrderId",
        source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 375, 378)
      },
      {
        status: "error",
        frame: commandError(
          "req-pod-1",
          "INVALID_PHOTO_HASH",
          "invalid_photo_hash",
          "photoSha256 must be a valid SHA-256 hex digest"
        ),
        when: "rest.matching.driverSocket.podUpload.reply.invalidPhotoHash",
        source: restSource("matching", "lib/kinetix_matching/dispatch/proof.ex", 17, 24)
      },
      {
        status: "error",
        frame: commandError("req-pod-1", "NOT_FOUND", "not_found", "Requested resource was not found"),
        when: "rest.matching.driverSocket.podUpload.reply.notFound",
        source: restSource("matching", "lib/kinetix_matching/dispatch.ex", 166, 172)
      },
      {
        status: "error",
        frame: commandError(
          "req-pod-1",
          "FORBIDDEN",
          "forbidden",
          "Action not permitted for this principal"
        ),
        when: "rest.matching.driverSocket.podUpload.reply.forbidden",
        source: restSource("matching", "lib/kinetix_matching/dispatch.ex", 630, 631)
      },
      {
        status: "error",
        frame: commandError(
          "req-pod-1",
          "INVALID_TRANSITION",
          "invalid_transition",
          "Order cannot transition from its current state"
        ),
        when: "rest.matching.driverSocket.podUpload.reply.invalidTransition",
        source: restSource("matching", "lib/kinetix_matching/dispatch.ex", 351, 352)
      }
    ],
    source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 335, 351)
  },
  {
    id: `${driverSocket}.delivered`,
    socket: driverSocket,
    direction: "send",
    summary: "rest.matching.driverSocket.delivered.summary",
    frame: {
      event: "matching.job.delivered",
      requestId: "req-deliv-1",
      schemaVersion: 1,
      data: {
        orderId: 4812,
        podPhotoUrl: photoUrl,
        podSignature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA…"
      }
    },
    replies: [
      {
        status: "ok",
        frame: {
          event: "command.ack",
          requestId: "req-deliv-1",
          schemaVersion: 1,
          occurredAt: "2026-11-16T03:42:10Z",
          data: { order: deliveredOrder }
        },
        when: "rest.matching.driverSocket.delivered.reply.delivered",
        source: restSource("matching", "lib/kinetix_matching/dispatch.ex", 392, 405)
      },
      {
        status: "error",
        frame: commandError(
          "req-deliv-1",
          "INVALID_ORDER_ID",
          "invalid_order_id",
          "orderId must be a positive integer"
        ),
        when: "rest.matching.driverSocket.delivered.reply.invalidOrderId",
        source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 375, 378)
      },
      {
        status: "error",
        frame: commandError("req-deliv-1", "NOT_FOUND", "not_found", "Requested resource was not found"),
        when: "rest.matching.driverSocket.delivered.reply.notFound",
        source: restSource("matching", "lib/kinetix_matching/dispatch.ex", 166, 172)
      },
      {
        status: "error",
        frame: commandError(
          "req-deliv-1",
          "FORBIDDEN",
          "forbidden",
          "Action not permitted for this principal"
        ),
        when: "rest.matching.driverSocket.delivered.reply.forbidden",
        source: restSource("matching", "lib/kinetix_matching/dispatch.ex", 630, 631)
      },
      {
        status: "error",
        frame: commandError(
          "req-deliv-1",
          "INVALID_TRANSITION",
          "invalid_transition",
          "Order cannot transition from its current state"
        ),
        when: "rest.matching.driverSocket.delivered.reply.invalidTransition",
        source: restSource("matching", "lib/kinetix_matching/dispatch.ex", 407, 407)
      },
      {
        status: "error",
        frame: commandError("req-deliv-1", "SIGNATURE_REQUIRED", "signature_required", "Command failed"),
        when: "rest.matching.driverSocket.delivered.reply.signatureRequired",
        source: restSource("matching", "lib/kinetix_matching/dispatch/proof.ex", 53, 64)
      },
      {
        status: "error",
        frame: commandError("req-deliv-1", "INVALID_PROOF", "invalid_proof", "Proof of delivery is invalid"),
        when: "rest.matching.driverSocket.delivered.reply.invalidProof",
        source: restSource("matching", "lib/kinetix_matching/dispatch.ex", 455, 489)
      },
      {
        status: "error",
        frame: commandError(
          "req-deliv-1",
          "PROOF_UNVERIFIABLE",
          "proof_unverifiable",
          "Uploaded proof photo could not be verified yet",
          true
        ),
        when: "rest.matching.driverSocket.delivered.reply.proofUnverifiable",
        source: restSource("matching", "lib/kinetix_matching/dispatch.ex", 480, 489)
      }
    ],
    source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 353, 373)
  },
  {
    id: `${driverSocket}.orderAssigned`,
    socket: driverSocket,
    direction: "receive",
    summary: "rest.matching.driverSocket.orderAssigned.summary",
    frame: {
      event: "matching.job.assigned",
      eventId: "019a0000-0000-7000-8000-000000000002",
      schemaVersion: 1,
      orderId: orderNumber,
      sequence: 1,
      occurredAt: "2026-11-16T03:15:02Z",
      data: { order: assignedOrder }
    },
    replies: [],
    source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 117, 127)
  },
  {
    id: `${driverSocket}.orderUpdated`,
    socket: driverSocket,
    direction: "receive",
    summary: "rest.matching.driverSocket.orderUpdated.summary",
    frame: {
      event: "matching.job.updated",
      eventId: "019a0000-0000-7000-8000-000000000003",
      schemaVersion: 1,
      orderId: orderNumber,
      sequence: 2,
      occurredAt: "2026-11-16T03:17:00Z",
      data: { order: pickedUpOrder }
    },
    replies: [],
    source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 129, 139)
  },
  {
    id: `${driverSocket}.orderUnassigned`,
    socket: driverSocket,
    direction: "receive",
    summary: "rest.matching.driverSocket.orderUnassigned.summary",
    frame: {
      event: "matching.job.unassigned",
      eventId: "019a0000-0000-7000-8000-000000000004",
      schemaVersion: 1,
      orderId: orderNumber,
      sequence: 2,
      occurredAt: "2026-11-16T03:16:00Z",
      data: { id: 4812, orderNumber }
    },
    replies: [],
    source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 141, 172)
  },
  {
    id: `${merchantSocket}.snapshot`,
    socket: merchantSocket,
    direction: "receive",
    summary: "rest.matching.merchantSocket.snapshot.summary",
    frame: {
      event: "matching.job.snapshot",
      eventId: "019a0000-0000-7000-8000-000000000005",
      schemaVersion: 1,
      orderId: null,
      sequence: null,
      occurredAt: "2026-11-16T03:14:00Z",
      data: {
        orders: [
          {
            id: 4812,
            orderNumber,
            awbNumber: "KX-4812",
            status: "pending",
            merchantPrincipalId: "merch-01",
            driverId: null,
            weightKg: 2,
            pickup: { latitude: -6.1754, longitude: 106.8272 },
            dropoff: { latitude: -6.2297, longitude: 106.8295 },
            assignedAt: null,
            deliveredAt: null,
            podPhotoUrl: null,
            podSignature: null,
            eventSequence: 0
          }
        ]
      }
    },
    replies: [],
    source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 77, 98)
  },
  {
    id: `${merchantSocket}.heartbeat`,
    socket: merchantSocket,
    direction: "send",
    summary: "rest.matching.merchantSocket.heartbeat.summary",
    frame: {
      event: "system.ping",
      requestId: "req-seller-ping-1",
      schemaVersion: 1,
      data: {}
    },
    replies: [
      {
        status: "ok",
        frame: {
          event: "system.pong",
          requestId: "req-seller-ping-1",
          schemaVersion: 1,
          occurredAt: "2026-11-16T03:14:30Z",
          data: { serverTime: "2026-11-16T03:14:30Z" }
        },
        when: "rest.matching.merchantSocket.heartbeat.reply.alive",
        source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 244, 246)
      }
    ],
    source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 244, 246)
  },
  {
    id: `${merchantSocket}.orderUpdated`,
    socket: merchantSocket,
    direction: "receive",
    summary: "rest.matching.merchantSocket.orderUpdated.summary",
    frame: {
      event: "matching.job.updated",
      eventId: "019a0000-0000-7000-8000-000000000006",
      schemaVersion: 1,
      orderId: orderNumber,
      sequence: 1,
      occurredAt: "2026-11-16T03:15:02Z",
      data: { order: assignedOrder }
    },
    replies: [],
    source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 174, 187)
  },
  {
    id: `${buyerSocket}.heartbeat`,
    socket: buyerSocket,
    direction: "send",
    summary: "rest.edge.buyerSocket.heartbeat.summary",
    frame: {
      event: "system.ping",
      requestId: "req-buyer-ping-1",
      schemaVersion: 1,
      data: {}
    },
    replies: [
      {
        status: "ok",
        frame: {
          event: "system.pong",
          eventId: "019a0000-0000-7000-8000-000000000007",
          requestId: "req-buyer-ping-1",
          schemaVersion: 1,
          occurredAt: "2026-11-16T03:18:00Z",
          sentAt: "2026-11-16T03:18:00Z",
          data: {}
        },
        when: "rest.edge.buyerSocket.heartbeat.reply.alive",
        source: restSource("edge", "src/http/event_socket.tl", 419, 422)
      }
    ],
    source: restSource("edge", "src/http/event_socket.tl", 419, 422)
  },
  {
    id: `${buyerSocket}.subscribe`,
    socket: buyerSocket,
    direction: "send",
    summary: "rest.edge.buyerSocket.subscribe.summary",
    frame: {
      event: "subscription.subscribe",
      requestId: "req-sub-1",
      schemaVersion: 1,
      data: { orderId: orderUuid }
    },
    replies: [
      {
        status: "ok",
        frame: {
          event: "command.ack",
          eventId: "019a0000-0000-7000-8000-000000000008",
          requestId: "req-sub-1",
          schemaVersion: 1,
          occurredAt: "2026-11-16T03:18:05Z",
          sentAt: "2026-11-16T03:18:05Z",
          data: { subscribed: true, orderId: orderUuid, orderNumber }
        },
        when: "rest.edge.buyerSocket.subscribe.reply.subscribed",
        source: restSource("edge", "src/http/event_socket.tl", 289, 305)
      },
      {
        status: "error",
        frame: commandError(
          "req-sub-1",
          "INVALID_ORDER_ID",
          "invalid_order_id",
          "A valid orderId is required."
        ),
        when: "rest.edge.buyerSocket.subscribe.reply.invalidOrderId",
        source: restSource("edge", "src/http/event_socket.tl", 263, 280)
      },
      {
        status: "error",
        frame: commandError(
          "req-sub-1",
          "FORBIDDEN",
          "forbidden",
          "You are not authorized to perform this action."
        ),
        when: "rest.edge.buyerSocket.subscribe.reply.forbidden",
        source: restSource("edge", "src/http/event_socket.tl", 240, 242)
      },
      {
        status: "error",
        frame: commandError(
          "req-sub-1",
          "ORDER_NOT_FOUND",
          "order_not_found",
          "The requested order was not found."
        ),
        when: "rest.edge.buyerSocket.subscribe.reply.notFound",
        source: restSource("edge", "src/http/event_socket.tl", 243, 260)
      },
      {
        status: "error",
        frame: commandError(
          "req-sub-1",
          "UPSTREAM_UNAVAILABLE",
          "upstream_unavailable",
          "Upstream service is temporarily unavailable.",
          true
        ),
        when: "rest.edge.buyerSocket.subscribe.reply.unavailable",
        source: restSource("edge", "src/http/event_socket.tl", 237, 297)
      }
    ],
    source: restSource("edge", "src/http/event_socket.tl", 266, 305)
  },
  {
    id: `${buyerSocket}.unsubscribe`,
    socket: buyerSocket,
    direction: "send",
    summary: "rest.edge.buyerSocket.unsubscribe.summary",
    frame: {
      event: "subscription.unsubscribe",
      requestId: "req-unsub-1",
      schemaVersion: 1,
      data: { orderId: orderUuid }
    },
    replies: [
      {
        status: "ok",
        frame: {
          event: "command.ack",
          eventId: "019a0000-0000-7000-8000-000000000009",
          requestId: "req-unsub-1",
          schemaVersion: 1,
          occurredAt: "2026-11-16T03:43:00Z",
          sentAt: "2026-11-16T03:43:00Z",
          data: { unsubscribed: true, orderId: orderUuid }
        },
        when: "rest.edge.buyerSocket.unsubscribe.reply.unsubscribed",
        source: restSource("edge", "src/http/event_socket.tl", 315, 329)
      },
      {
        status: "error",
        frame: commandError(
          "req-unsub-1",
          "INVALID_ORDER_ID",
          "invalid_order_id",
          "A valid orderId is required."
        ),
        when: "rest.edge.buyerSocket.unsubscribe.reply.invalidOrderId",
        source: restSource("edge", "src/http/event_socket.tl", 309, 313)
      }
    ],
    source: restSource("edge", "src/http/event_socket.tl", 307, 329)
  },
  {
    id: `${buyerSocket}.locationUpdated`,
    socket: buyerSocket,
    direction: "receive",
    summary: "rest.edge.buyerSocket.locationUpdated.summary",
    frame: {
      event: "courier.location.updated",
      eventId: "019a0000-0000-7000-8000-000000000010",
      schemaVersion: 1,
      orderId: orderNumber,
      sequence: null,
      occurredAt: "2026-11-16T03:20:00Z",
      data: {
        driverId: 17,
        latitude: -6.1781,
        longitude: 106.8235,
        bearingDeg: 87.5,
        speedKmh: 21.6,
        recordedAt: "2026-11-16T03:19:59.500000Z"
      }
    },
    replies: [],
    source: restSource("matching", "lib/kinetix_matching_web/event_socket.ex", 385, 401)
  }
];
