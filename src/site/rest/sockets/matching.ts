import type { JsonValue } from "../../types/json_value.type";
import type { RestSocket } from "../../types/rest_socket.type";
import type { RestSocketMessage } from "../../types/rest_socket_message.type";
import { phoenixSource } from "../phoenix_source";
import { restSource } from "../rest_source";

const driverSocket: string = "matching.driverSocket";

const topic: string = "driver:17";

const photoSha256: string = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

const photoUrl: string = `https://storage.wildanfrananda.my.id/example-bucket/pod/4812/${photoSha256}.jpg`;

const assignedJob: JsonValue = {
  id: 4812,
  status: "assigned",
  weight_kg: 2,
  pickup: { latitude: -6.1754, longitude: 106.8272 },
  dropoff: { latitude: -6.2088, longitude: 106.8456 },
  assigned_at: "2026-10-22T02:41:07.512904Z"
};

const pickedUpJob: JsonValue = {
  id: 4812,
  status: "picked_up",
  weight_kg: 2,
  pickup: { latitude: -6.1754, longitude: 106.8272 },
  dropoff: { latitude: -6.2088, longitude: 106.8456 },
  assigned_at: "2026-10-22T02:41:07.512904Z"
};

export const matchingSockets: readonly RestSocket[] = [
  {
    id: driverSocket,
    service: "matching",
    path: "/ws/v1/matching/driver",
    query: "vsn=2.0.0",
    summary: "rest.matching.driverSocket.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.matching.driverSocket.who"
    },
    request: {
      fields: [
        {
          name: "vsn",
          in: "query",
          type: "string",
          required: false,
          rule: "rest.matching.driverSocket.field.vsn"
        },
        {
          name: "Sec-WebSocket-Protocol",
          in: "header",
          type: "string",
          required: true,
          rule: "rest.matching.driverSocket.field.secWebSocketProtocol"
        }
      ],
      headers: ["Sec-WebSocket-Protocol: phoenix, base64url.bearer.phx.<access token>"]
    },
    cases: [
      {
        status: 101,
        when: "rest.matching.driverSocket.case.upgraded",
        headers: [
          "upgrade: websocket",
          "connection: Upgrade",
          "sec-websocket-accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=",
          "sec-websocket-protocol: phoenix"
        ],
        source: phoenixSource("lib/phoenix/transports/websocket.ex", 75, 80)
      },
      {
        status: 400,
        when: "rest.matching.driverSocket.case.notGet",
        source: phoenixSource("lib/phoenix/transports/websocket.ex", 95, 95)
      },
      {
        status: 400,
        when: "rest.matching.driverSocket.case.notUpgrade",
        raw: "'connection' header must contain 'upgrade', got [\"keep-alive\"]",
        source: phoenixSource("lib/phoenix/transports/websocket.ex", 76, 83)
      },
      {
        status: 403,
        when: "rest.matching.driverSocket.case.unreadableToken",
        source: restSource("matching", "lib/fleet_pulse_web/socket_auth_token.ex", 62, 80)
      },
      {
        status: 403,
        when: "rest.matching.driverSocket.case.origin",
        source: phoenixSource("lib/phoenix/socket/transport.ex", 346, 386)
      },
      {
        status: 403,
        when: "rest.matching.driverSocket.case.noPhoenix",
        source: phoenixSource("lib/phoenix/socket/transport.ex", 405, 455)
      },
      {
        status: 403,
        when: "rest.matching.driverSocket.case.version",
        source: phoenixSource("lib/phoenix/socket.ex", 501, 537)
      },
      {
        status: 403,
        when: "rest.matching.driverSocket.case.tokenRefused",
        source: restSource("matching", "lib/fleet_pulse_web/channels/driver_socket.ex", 27, 40)
      },
      {
        status: 403,
        when: "rest.matching.driverSocket.case.notCourier",
        source: restSource("matching", "lib/fleet_pulse_web/channels/driver_socket.ex", 46, 49)
      },
      {
        status: 403,
        when: "rest.matching.driverSocket.case.noCourierRecord",
        source: restSource("matching", "lib/fleet_pulse/tracking.ex", 126, 136)
      },
      {
        status: 503,
        when: "rest.matching.driverSocket.case.identityUnavailable",
        source: restSource("matching", "lib/fleet_pulse_web/channels/driver_socket.ex", 38, 39)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse_web/endpoint.ex", 9, 16)
  }
];

export const matchingSocketMessages: readonly RestSocketMessage[] = [
  {
    id: `${driverSocket}.join`,
    socket: driverSocket,
    direction: "send",
    topic: "driver:{driverId}",
    summary: "rest.matching.driverSocket.join.summary",
    frame: ["1", "1", topic, "phx_join", {}],
    replies: [
      {
        status: "ok",
        response: { status: "offline" },
        when: "rest.matching.driverSocket.join.reply.joined",
        source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 49, 56)
      },
      {
        status: "error",
        response: { reason: "invalid_topic" },
        when: "rest.matching.driverSocket.join.reply.invalidTopic",
        source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 198, 204)
      },
      {
        status: "error",
        response: { reason: "forbidden" },
        when: "rest.matching.driverSocket.join.reply.forbidden",
        source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 194, 196)
      },
      {
        status: "error",
        response: { reason: "join crashed" },
        when: "rest.matching.driverSocket.join.reply.joinCrashed",
        source: phoenixSource("lib/phoenix/channel/server.ex", 51, 53)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 49, 62)
  },
  {
    id: `${driverSocket}.heartbeat`,
    socket: driverSocket,
    direction: "send",
    topic: "phoenix",
    summary: "rest.matching.driverSocket.heartbeat.summary",
    frame: [null, "2", "phoenix", "heartbeat", {}],
    replies: [
      {
        status: "ok",
        response: {},
        when: "rest.matching.driverSocket.heartbeat.reply.alive",
        source: phoenixSource("lib/phoenix/socket.ex", 703, 712)
      }
    ],
    source: phoenixSource("lib/phoenix/socket.ex", 703, 712)
  },
  {
    id: `${driverSocket}.status`,
    socket: driverSocket,
    direction: "send",
    topic: "driver:{driverId}",
    summary: "rest.matching.driverSocket.status.summary",
    frame: ["1", "3", topic, "status", { status: "online" }],
    replies: [
      {
        status: "ok",
        response: { status: "online" },
        when: "rest.matching.driverSocket.status.reply.changed",
        source: restSource("matching", "lib/fleet_pulse/tracking/driver_state.ex", 221, 247)
      },
      {
        status: "error",
        response: { reason: "invalid_status" },
        when: "rest.matching.driverSocket.status.reply.invalidStatus",
        source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 99, 109)
      },
      {
        status: "error",
        response: { reason: "no_active_job" },
        when: "rest.matching.driverSocket.status.reply.noActiveJob",
        source: restSource("matching", "lib/fleet_pulse/tracking/driver_state.ex", 235, 237)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 96, 109)
  },
  {
    id: `${driverSocket}.ping`,
    socket: driverSocket,
    direction: "send",
    topic: "driver:{driverId}",
    summary: "rest.matching.driverSocket.ping.summary",
    frame: [
      "1",
      "4",
      topic,
      "ping",
      {
        latitude: -6.1781,
        longitude: 106.8235,
        recorded_at: "2026-10-22T02:40:06.250Z",
        speed_kmh: 21.6,
        bearing_deg: 87.5
      }
    ],
    replies: [
      {
        status: "ok",
        response: {},
        when: "rest.matching.driverSocket.ping.reply.accepted",
        source: restSource("matching", "lib/fleet_pulse/tracking/driver_state.ex", 359, 375)
      },
      {
        status: "error",
        response: { reason: "invalid_telemetry" },
        when: "rest.matching.driverSocket.ping.reply.invalidTelemetry",
        source: restSource("matching", "lib/fleet_pulse/tracking/telemetry.ex", 37, 100)
      },
      {
        status: "error",
        response: { reason: "rate_limited" },
        when: "rest.matching.driverSocket.ping.reply.rateLimited",
        source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 170, 192)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 69, 79)
  },
  {
    id: `${driverSocket}.pingBatch`,
    socket: driverSocket,
    direction: "send",
    topic: "driver:{driverId}",
    summary: "rest.matching.driverSocket.pingBatch.summary",
    frame: [
      "1",
      "5",
      topic,
      "ping_batch",
      {
        pings: [
          { latitude: -6.1932, longitude: 106.8201, recorded_at: "2026-10-22T02:21:04.000Z" },
          { latitude: -6.1937, longitude: 106.8209, recorded_at: "2026-10-22T02:21:09.000Z" },
          { latitude: -6.1702, longitude: 106.8311, recorded_at: "2026-10-20T23:10:00.000Z" }
        ]
      }
    ],
    replies: [
      {
        status: "ok",
        response: {
          stored: [0],
          duplicates: [1],
          refused: [{ index: 2, reason: "too_old" }]
        },
        when: "rest.matching.driverSocket.pingBatch.reply.read",
        source: restSource("matching", "lib/fleet_pulse/tracking/offline_history.ex", 35, 55)
      },
      {
        status: "error",
        response: { reason: "invalid_batch" },
        when: "rest.matching.driverSocket.pingBatch.reply.invalidBatch",
        source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 81, 94)
      },
      {
        status: "error",
        response: { reason: "batch_too_large" },
        when: "rest.matching.driverSocket.pingBatch.reply.batchTooLarge",
        source: restSource("matching", "lib/fleet_pulse/tracking/offline_history.ex", 32, 33)
      },
      {
        status: "error",
        response: { reason: "rate_limited" },
        when: "rest.matching.driverSocket.pingBatch.reply.rateLimited",
        source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 175, 178)
      },
      {
        status: "error",
        response: { reason: "unavailable" },
        when: "rest.matching.driverSocket.pingBatch.reply.unavailable",
        source: restSource("matching", "lib/fleet_pulse/tracking/offline_history.ex", 101, 123)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 81, 94)
  },
  {
    id: `${driverSocket}.pickup`,
    socket: driverSocket,
    direction: "send",
    topic: "driver:{driverId}",
    summary: "rest.matching.driverSocket.pickup.summary",
    frame: ["1", "6", topic, "pickup", { order_id: 4812 }],
    replies: [
      {
        status: "ok",
        response: {},
        when: "rest.matching.driverSocket.pickup.reply.pickedUp",
        source: restSource("matching", "lib/fleet_pulse/dispatch.ex", 316, 326)
      },
      {
        status: "error",
        response: { reason: "invalid_order_id" },
        when: "rest.matching.driverSocket.pickup.reply.invalidOrderId",
        source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 129, 131)
      },
      {
        status: "error",
        response: { reason: "not_found" },
        when: "rest.matching.driverSocket.pickup.reply.notFound",
        source: restSource("matching", "lib/fleet_pulse/dispatch.ex", 613, 623)
      },
      {
        status: "error",
        response: { reason: "forbidden" },
        when: "rest.matching.driverSocket.pickup.reply.forbidden",
        source: restSource("matching", "lib/fleet_pulse/dispatch.ex", 625, 627)
      },
      {
        status: "error",
        response: { reason: "invalid_transition" },
        when: "rest.matching.driverSocket.pickup.reply.invalidTransition",
        source: restSource("matching", "lib/fleet_pulse/dispatch.ex", 629, 650)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 111, 114)
  },
  {
    id: `${driverSocket}.podUpload`,
    socket: driverSocket,
    direction: "send",
    topic: "driver:{driverId}",
    summary: "rest.matching.driverSocket.podUpload.summary",
    frame: ["1", "7", topic, "pod_upload", { order_id: 4812, photo_sha256: photoSha256 }],
    replies: [
      {
        status: "ok",
        response: {
          upload_url:
            `${photoUrl}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=…&X-Amz-Date=20261022T031950Z` +
            "&X-Amz-Expires=600&X-Amz-SignedHeaders=host%3Bif-none-match%3Bx-amz-checksum-sha256&X-Amz-Signature=…",
          upload_headers: {
            "if-none-match": "*",
            "x-amz-checksum-sha256": "u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7s="
          },
          photo_url: photoUrl
        },
        when: "rest.matching.driverSocket.podUpload.reply.address",
        source: restSource("matching", "lib/fleet_pulse/dispatch.ex", 285, 304)
      },
      {
        status: "error",
        response: { reason: "invalid_order_id" },
        when: "rest.matching.driverSocket.podUpload.reply.invalidOrderId",
        source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 129, 131)
      },
      {
        status: "error",
        response: { reason: "invalid_photo_hash" },
        when: "rest.matching.driverSocket.podUpload.reply.invalidPhotoHash",
        source: restSource("matching", "lib/fleet_pulse/dispatch/proof.ex", 16, 24)
      },
      {
        status: "error",
        response: { reason: "not_found" },
        when: "rest.matching.driverSocket.podUpload.reply.notFound",
        source: restSource("matching", "lib/fleet_pulse/dispatch.ex", 164, 170)
      },
      {
        status: "error",
        response: { reason: "forbidden" },
        when: "rest.matching.driverSocket.podUpload.reply.forbidden",
        source: restSource("matching", "lib/fleet_pulse/dispatch.ex", 625, 627)
      },
      {
        status: "error",
        response: { reason: "invalid_transition" },
        when: "rest.matching.driverSocket.podUpload.reply.invalidTransition",
        source: restSource("matching", "lib/fleet_pulse/dispatch.ex", 349, 351)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 116, 122)
  },
  {
    id: `${driverSocket}.delivered`,
    socket: driverSocket,
    direction: "send",
    topic: "driver:{driverId}",
    summary: "rest.matching.driverSocket.delivered.summary",
    frame: [
      "1",
      "8",
      topic,
      "delivered",
      {
        order_id: 4812,
        pod_photo_url: photoUrl,
        pod_signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA…"
      }
    ],
    replies: [
      {
        status: "ok",
        response: {},
        when: "rest.matching.driverSocket.delivered.reply.delivered",
        source: restSource("matching", "lib/fleet_pulse/dispatch.ex", 390, 403)
      },
      {
        status: "error",
        response: { reason: "invalid_order_id" },
        when: "rest.matching.driverSocket.delivered.reply.invalidOrderId",
        source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 129, 131)
      },
      {
        status: "error",
        response: { reason: "not_found" },
        when: "rest.matching.driverSocket.delivered.reply.notFound",
        source: restSource("matching", "lib/fleet_pulse/dispatch.ex", 164, 170)
      },
      {
        status: "error",
        response: { reason: "forbidden" },
        when: "rest.matching.driverSocket.delivered.reply.forbidden",
        source: restSource("matching", "lib/fleet_pulse/dispatch.ex", 625, 627)
      },
      {
        status: "error",
        response: { reason: "invalid_transition" },
        when: "rest.matching.driverSocket.delivered.reply.invalidTransition",
        source: restSource("matching", "lib/fleet_pulse/dispatch.ex", 405, 405)
      },
      {
        status: "error",
        response: { reason: "signature_required" },
        when: "rest.matching.driverSocket.delivered.reply.signatureRequired",
        source: restSource("matching", "lib/fleet_pulse/dispatch/proof.ex", 51, 64)
      },
      {
        status: "error",
        response: { reason: "invalid_proof" },
        when: "rest.matching.driverSocket.delivered.reply.invalidProof",
        source: restSource("matching", "lib/fleet_pulse/dispatch.ex", 450, 486)
      },
      {
        status: "error",
        response: { reason: "proof_unverifiable" },
        when: "rest.matching.driverSocket.delivered.reply.proofUnverifiable",
        source: restSource("matching", "lib/fleet_pulse/dispatch.ex", 463, 486)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 124, 127)
  },
  {
    id: `${driverSocket}.activeOrder`,
    socket: driverSocket,
    direction: "receive",
    topic: "driver:{driverId}",
    summary: "rest.matching.driverSocket.activeOrder.summary",
    frame: ["1", null, topic, "active_order", { order: assignedJob }],
    replies: [],
    source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 139, 142)
  },
  {
    id: `${driverSocket}.orderAssigned`,
    socket: driverSocket,
    direction: "receive",
    topic: "driver:{driverId}",
    summary: "rest.matching.driverSocket.orderAssigned.summary",
    frame: ["1", null, topic, "order_assigned", assignedJob],
    replies: [],
    source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 144, 147)
  },
  {
    id: `${driverSocket}.orderUpdated`,
    socket: driverSocket,
    direction: "receive",
    topic: "driver:{driverId}",
    summary: "rest.matching.driverSocket.orderUpdated.summary",
    frame: ["1", null, topic, "order_updated", pickedUpJob],
    replies: [],
    source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 149, 152)
  },
  {
    id: `${driverSocket}.orderUnassigned`,
    socket: driverSocket,
    direction: "receive",
    topic: "driver:{driverId}",
    summary: "rest.matching.driverSocket.orderUnassigned.summary",
    frame: ["1", null, topic, "order_unassigned", { id: 4812 }],
    replies: [],
    source: restSource("matching", "lib/fleet_pulse_web/channels/driver_channel.ex", 154, 158)
  }
];
