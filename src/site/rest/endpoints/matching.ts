import type { JsonValue } from "../../types/json_value.type";
import type { RestCase } from "../../types/rest_case.type";
import type { RestEndpoint } from "../../types/rest_endpoint.type";
import { restSource } from "../rest_source";

const traceId: string = "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b";

const photoSha256: string = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

const pendingJob: JsonValue = {
  id: 4813,
  order_number: "ORD-20261022-7F3A91C2",
  awb_number: "KNX-20261022-MFRGGZDFMZTWQ",
  status: "pending",
  merchant_principal_id: "27f2d4c2-9519-4e8a-9857-355a0c066349",
  weight_kg: 2,
  driver_id: null,
  pickup: { latitude: -6.1754, longitude: 106.8272 },
  dropoff: { latitude: -6.2297, longitude: 106.8295 },
  assigned_at: null,
  delivered_at: null,
  inserted_at: "2026-10-22T03:15:01.902114Z"
};

const assignedJob: JsonValue = {
  id: 4813,
  order_number: "ORD-20261022-7F3A91C2",
  awb_number: "KNX-20261022-MFRGGZDFMZTWQ",
  status: "assigned",
  merchant_principal_id: "27f2d4c2-9519-4e8a-9857-355a0c066349",
  weight_kg: 2,
  driver_id: 17,
  pickup: { latitude: -6.1754, longitude: 106.8272 },
  dropoff: { latitude: -6.2297, longitude: 106.8295 },
  assigned_at: "2026-10-22T03:15:02.187430Z",
  delivered_at: null,
  inserted_at: "2026-10-22T03:15:01.902114Z"
};

const deliveredJob: JsonValue = {
  id: 4812,
  order_number: "ORD-20261022-1B8E04D7",
  awb_number: "KNX-20261022-NBSWY3DPEB3W6",
  status: "delivered",
  merchant_principal_id: "74183bec-5cd4-4e1b-ad14-11975e537dd6",
  weight_kg: 1,
  driver_id: 21,
  pickup: { latitude: -6.1862, longitude: 106.834 },
  dropoff: { latitude: -6.2615, longitude: 106.781 },
  assigned_at: "2026-10-22T02:31:40.551208Z",
  delivered_at: "2026-10-22T03:04:12.310577Z",
  inserted_at: "2026-10-22T02:31:39.874006Z"
};

const busyCourier: JsonValue = {
  id: 17,
  status: "busy",
  coordinates: { latitude: -6.1801, longitude: 106.8295 },
  speed_kmh: 24.5,
  bearing_deg: 87.5,
  recorded_at: "2026-10-22T03:14:58.000000Z",
  updated_at: "2026-10-22T03:15:00.412311Z"
};

const idleCourier: JsonValue = {
  id: 21,
  status: "online",
  coordinates: { latitude: -6.1689, longitude: 106.8203 },
  speed_kmh: null,
  bearing_deg: null,
  recorded_at: "2026-10-22T03:14:41.000000Z",
  updated_at: "2026-10-22T03:14:41.230954Z"
};

const unplacedCourier: JsonValue = {
  id: 9,
  status: "offline",
  coordinates: null,
  speed_kmh: null,
  bearing_deg: null,
  recorded_at: null,
  updated_at: "2026-10-22T02:58:07.664120Z"
};

export const matchingAnswers: readonly RestCase[] = [
  {
    status: 400,
    when: "rest.matching.answers.malformed",
    json: {
      errors: { detail: "Bad Request" },
      traceId
    },
    source: restSource("matching", "lib/fleet_pulse_web/endpoint.ex", 35, 38)
  },
  {
    status: 401,
    when: "rest.matching.answers.unauthorized",
    json: { error: "unauthorized" },
    source: restSource("matching", "lib/fleet_pulse_web/plugs/identity_auth.ex", 19, 52)
  },
  {
    status: 403,
    when: "rest.matching.answers.notAdmin",
    json: {
      error: "forbidden",
      message: "this account is a courier; this route is for admin"
    },
    source: restSource("matching", "lib/fleet_pulse_web/plugs/require_role.ex", 35, 44)
  },
  {
    status: 404,
    when: "rest.matching.answers.noRoute",
    json: {
      errors: { detail: "Not Found" },
      traceId
    },
    source: restSource("matching", "lib/fleet_pulse_web/controllers/error_json.ex", 18, 20)
  },
  {
    status: 406,
    when: "rest.matching.answers.notAcceptable",
    json: {
      errors: { detail: "Not Acceptable" },
      traceId
    },
    source: restSource("matching", "lib/fleet_pulse_web/router.ex", 8, 11)
  },
  {
    status: 413,
    when: "rest.matching.answers.tooLarge",
    json: {
      errors: { detail: "Request Entity Too Large" },
      traceId
    },
    source: restSource("matching", "lib/fleet_pulse_web/endpoint.ex", 35, 38)
  },
  {
    status: 500,
    when: "rest.matching.answers.internal",
    json: {
      errors: {
        detail:
          "something went wrong handling this request. It may have taken effect before it failed: read the current state before repeating it."
      },
      traceId
    },
    source: restSource("matching", "lib/fleet_pulse_web/controllers/error_json.ex", 10, 16)
  },
  {
    status: 503,
    when: "rest.matching.answers.database",
    json: {
      errors: { detail: "Service Unavailable" },
      traceId
    },
    source: restSource("matching", "lib/fleet_pulse_web/database_unavailable.ex", 1, 7)
  },
  {
    status: 503,
    when: "rest.matching.answers.identityUnavailable",
    json: { error: "identity_unavailable" },
    source: restSource("matching", "lib/fleet_pulse_web/plugs/identity_auth.ex", 36, 60)
  }
];

export const matchingEndpoints: readonly RestEndpoint[] = [
  {
    id: "matching.driverMe",
    service: "matching",
    method: "GET",
    path: "/api/v1/matching/driver/me",
    summary: "rest.matching.driverMe.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.matching.driverMe.who"
    },
    request: {
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.matching.driverMe.case.found",
        json: {
          data: {
            id: 17,
            vehicle_plate: "B 1234 KJT",
            capacity_kg: 20,
            status: "offline",
            active: true
          }
        },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/driver_profile_controller.ex", 44, 53)
      },
      {
        status: 403,
        when: "rest.matching.driverMe.case.pendingApproval",
        json: {
          error: "pending_approval",
          message: "this vehicle is filed and waiting for an administrator to approve the account"
        },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/driver_profile_controller.ex", 19, 25)
      },
      {
        status: 404,
        when: "rest.matching.driverMe.case.noDriverRecord",
        json: {
          error: "no_driver_record",
          message: "this account has no vehicle in this fleet yet"
        },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/driver_profile_controller.ex", 27, 33)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/driver_profile_controller.ex", 11, 35)
  },
  {
    id: "matching.listDrivers",
    service: "matching",
    method: "GET",
    path: "/api/v1/matching/drivers",
    summary: "rest.matching.listDrivers.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.matching.listDrivers.who"
    },
    request: {
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.matching.listDrivers.case.listed",
        json: {
          data: [busyCourier, idleCourier, unplacedCourier]
        },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/driver_controller.ex", 41, 51)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/driver_controller.ex", 14, 17)
  },
  {
    id: "matching.nearbyDrivers",
    service: "matching",
    method: "GET",
    path: "/api/v1/matching/drivers/nearby",
    summary: "rest.matching.nearbyDrivers.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.matching.nearbyDrivers.who"
    },
    request: {
      fields: [
        {
          name: "latitude",
          in: "query",
          type: "number",
          required: true,
          rule: "rest.matching.nearbyDrivers.field.latitude"
        },
        {
          name: "longitude",
          in: "query",
          type: "number",
          required: true,
          rule: "rest.matching.nearbyDrivers.field.longitude"
        },
        {
          name: "radius_km",
          in: "query",
          type: "number",
          required: false,
          rule: "rest.matching.nearbyDrivers.field.radiusKm"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.matching.nearbyDrivers.case.found",
        json: {
          data: [
            {
              id: 17,
              status: "busy",
              coordinates: { latitude: -6.1801, longitude: 106.8295 },
              speed_kmh: 24.5,
              bearing_deg: 87.5,
              recorded_at: "2026-10-22T03:14:58.000000Z",
              updated_at: "2026-10-22T03:15:00.412311Z",
              distance_km: 0.581
            },
            {
              id: 21,
              status: "online",
              coordinates: { latitude: -6.1689, longitude: 106.8203 },
              speed_kmh: null,
              bearing_deg: null,
              recorded_at: "2026-10-22T03:14:41.000000Z",
              updated_at: "2026-10-22T03:14:41.230954Z",
              distance_km: 1.051
            }
          ]
        },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/driver_controller.ex", 53, 55)
      },
      {
        status: 400,
        when: "rest.matching.nearbyDrivers.case.invalidQuery",
        json: { error: "invalid_nearby_query" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/driver_controller.ex", 67, 92)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/driver_controller.ex", 29, 39)
  },
  {
    id: "matching.getDriver",
    service: "matching",
    method: "GET",
    path: "/api/v1/matching/drivers/{id}",
    summary: "rest.matching.getDriver.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.matching.getDriver.who"
    },
    request: {
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.matching.getDriver.field.id"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.matching.getDriver.case.found",
        json: { data: busyCourier },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/driver_controller.ex", 41, 51)
      },
      {
        status: 400,
        when: "rest.matching.getDriver.case.invalidId",
        json: { error: "invalid_id" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/driver_controller.ex", 25, 25)
      },
      {
        status: 404,
        when: "rest.matching.getDriver.case.notTracked",
        json: { error: "not_found" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/driver_controller.ex", 24, 24)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/driver_controller.ex", 19, 27)
  },
  {
    id: "matching.listDispatches",
    service: "matching",
    method: "GET",
    path: "/api/v1/matching/backoffice/dispatches",
    summary: "rest.matching.listDispatches.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.matching.listDispatches.who"
    },
    request: {
      fields: [
        {
          name: "status",
          in: "query",
          type: "string",
          required: false,
          rule: "rest.matching.listDispatches.field.status"
        },
        {
          name: "limit",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.matching.listDispatches.field.limit"
        },
        {
          name: "before",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.matching.listDispatches.field.before"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.matching.listDispatches.case.page",
        json: {
          data: [assignedJob, deliveredJob],
          next_cursor: 4812
        },
        source: restSource("matching", "lib/fleet_pulse/dispatch.ex", 197, 211)
      },
      {
        status: 400,
        when: "rest.matching.listDispatches.case.invalidStatus",
        json: { error: "invalid_status" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 137, 147)
      },
      {
        status: 400,
        when: "rest.matching.listDispatches.case.invalidLimit",
        json: { error: "invalid_limit" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 149, 157)
      },
      {
        status: 400,
        when: "rest.matching.listDispatches.case.invalidCursor",
        json: { error: "invalid_cursor" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 159, 167)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 14, 24)
  },
  {
    id: "matching.dispatchSummary",
    service: "matching",
    method: "GET",
    path: "/api/v1/matching/backoffice/dispatches/summary",
    summary: "rest.matching.dispatchSummary.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.matching.dispatchSummary.who"
    },
    request: {
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.matching.dispatchSummary.case.counts",
        json: {
          data: {
            pending: 3,
            active: 11,
            delivered_today: 42
          }
        },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 26, 35)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 26, 35)
  },
  {
    id: "matching.getDispatch",
    service: "matching",
    method: "GET",
    path: "/api/v1/matching/backoffice/dispatches/{id}",
    summary: "rest.matching.getDispatch.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.matching.getDispatch.who"
    },
    request: {
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.matching.getDispatch.field.id"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.matching.getDispatch.case.found",
        json: {
          data: {
            id: 4812,
            order_number: "ORD-20261022-1B8E04D7",
            awb_number: "KNX-20261022-NBSWY3DPEB3W6",
            status: "delivered",
            merchant_principal_id: "74183bec-5cd4-4e1b-ad14-11975e537dd6",
            weight_kg: 1,
            driver_id: 21,
            pickup: { latitude: -6.1862, longitude: 106.834 },
            dropoff: { latitude: -6.2615, longitude: 106.781 },
            assigned_at: "2026-10-22T02:31:40.551208Z",
            delivered_at: "2026-10-22T03:04:12.310577Z",
            inserted_at: "2026-10-22T02:31:39.874006Z",
            proof_of_delivery: {
              photo_url:
                `https://storage.wildanfrananda.my.id/example-bucket/pod/4812/${photoSha256}.jpg` +
                "?X-Amz-Algorithm=AWS4-HMAC-SHA256" +
                "&X-Amz-Credential=<access-key>%2F20261022%2F<region>%2Fs3%2Faws4_request" +
                "&X-Amz-Date=20261022T031500Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host" +
                "&X-Amz-Signature=<signature>",
              signature:
                "data:image/png;base64," +
                "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            }
          }
        },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 125, 135)
      },
      {
        status: 400,
        when: "rest.matching.getDispatch.case.invalidId",
        json: { error: "invalid_id" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 44, 44)
      },
      {
        status: 404,
        when: "rest.matching.getDispatch.case.notFound",
        json: { error: "not_found" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 43, 43)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 37, 46)
  },
  {
    id: "matching.assignDispatch",
    service: "matching",
    method: "POST",
    path: "/api/v1/matching/backoffice/dispatches/{id}/assign",
    summary: "rest.matching.assignDispatch.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.matching.assignDispatch.who"
    },
    request: {
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.matching.assignDispatch.field.id"
        },
        {
          name: "driver_id",
          in: "body",
          type: "integer",
          required: true,
          rule: "rest.matching.assignDispatch.field.driverId"
        }
      ],
      json: {
        driver_id: 17
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.matching.assignDispatch.case.assigned",
        json: { data: assignedJob },
        source: restSource("matching", "lib/fleet_pulse/dispatch.ex", 256, 269)
      },
      {
        status: 400,
        when: "rest.matching.assignDispatch.case.driverIdRequired",
        json: { error: "driver_id_required" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 76, 76)
      },
      {
        status: 400,
        when: "rest.matching.assignDispatch.case.invalidId",
        json: { error: "invalid_id" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 72, 72)
      },
      {
        status: 404,
        when: "rest.matching.assignDispatch.case.notFound",
        json: { error: "not_found" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 67, 67)
      },
      {
        status: 404,
        when: "rest.matching.assignDispatch.case.driverNotFound",
        json: { error: "driver_not_found" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 68, 68)
      },
      {
        status: 409,
        when: "rest.matching.assignDispatch.case.alreadyAssigned",
        json: { error: "already_assigned" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 69, 69)
      },
      {
        status: 409,
        when: "rest.matching.assignDispatch.case.driverNotTracked",
        json: { error: "driver_not_tracked" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 70, 70)
      },
      {
        status: 409,
        when: "rest.matching.assignDispatch.case.driverUnavailable",
        json: { error: "driver_unavailable" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 71, 71)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 59, 76)
  },
  {
    id: "matching.unassignDispatch",
    service: "matching",
    method: "POST",
    path: "/api/v1/matching/backoffice/dispatches/{id}/unassign",
    summary: "rest.matching.unassignDispatch.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.matching.unassignDispatch.who"
    },
    request: {
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.matching.unassignDispatch.field.id"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.matching.unassignDispatch.case.unassigned",
        json: { data: pendingJob },
        source: restSource("matching", "lib/fleet_pulse/dispatch.ex", 271, 283)
      },
      {
        status: 400,
        when: "rest.matching.unassignDispatch.case.invalidId",
        json: { error: "invalid_id" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 90, 90)
      },
      {
        status: 404,
        when: "rest.matching.unassignDispatch.case.notFound",
        json: { error: "not_found" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 87, 87)
      },
      {
        status: 409,
        when: "rest.matching.unassignDispatch.case.notAssigned",
        json: { error: "not_assigned" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 88, 88)
      },
      {
        status: 409,
        when: "rest.matching.unassignDispatch.case.invalidTransition",
        json: { error: "invalid_transition" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 89, 89)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 78, 92)
  },
  {
    id: "matching.cancelDispatch",
    service: "matching",
    method: "POST",
    path: "/api/v1/matching/backoffice/dispatches/{id}/cancel",
    summary: "rest.matching.cancelDispatch.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.matching.cancelDispatch.who"
    },
    request: {
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.matching.cancelDispatch.field.id"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.matching.cancelDispatch.case.cancelled",
        json: {
          data: {
            id: 3920,
            order_number: null,
            awb_number: null,
            status: "cancelled",
            merchant_principal_id: null,
            weight_kg: 5,
            driver_id: null,
            pickup: { latitude: -6.2006, longitude: 106.7862 },
            dropoff: { latitude: -6.2441, longitude: 106.8007 },
            assigned_at: null,
            delivered_at: null,
            inserted_at: "2026-09-08T04:20:15.003871Z"
          }
        },
        source: restSource("matching", "lib/fleet_pulse/dispatch.ex", 337, 347)
      },
      {
        status: 400,
        when: "rest.matching.cancelDispatch.case.invalidId",
        json: { error: "invalid_id" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 103, 103)
      },
      {
        status: 404,
        when: "rest.matching.cancelDispatch.case.notFound",
        json: { error: "not_found" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 100, 100)
      },
      {
        status: 409,
        when: "rest.matching.cancelDispatch.case.boundToOrder",
        json: { error: "bound_to_order" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 102, 102)
      },
      {
        status: 409,
        when: "rest.matching.cancelDispatch.case.invalidTransition",
        json: { error: "invalid_transition" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 101, 101)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 94, 105)
  },
  {
    id: "matching.driverDispatches",
    service: "matching",
    method: "GET",
    path: "/api/v1/matching/backoffice/drivers/{driver_id}/dispatches",
    summary: "rest.matching.driverDispatches.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.matching.driverDispatches.who"
    },
    request: {
      fields: [
        {
          name: "driver_id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.matching.driverDispatches.field.driverId"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.matching.driverDispatches.case.listed",
        json: { data: [assignedJob] },
        source: restSource("matching", "lib/fleet_pulse/dispatch.ex", 234, 240)
      },
      {
        status: 400,
        when: "rest.matching.driverDispatches.case.invalidId",
        json: { error: "invalid_id" },
        source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 54, 55)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse_web/controllers/api/v1/dispatch_controller.ex", 48, 57)
  },
  {
    id: "matching.uploadProofPhoto",
    service: "matching",
    method: "PUT",
    host: "storage",
    path: "/{bucket}/pod/{dispatch_id}/{sha256}.jpg",
    summary: "rest.matching.uploadProofPhoto.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.matching.uploadProofPhoto.who"
    },
    request: {
      fields: [
        {
          name: "bucket",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.matching.uploadProofPhoto.field.bucket"
        },
        {
          name: "dispatch_id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.matching.uploadProofPhoto.field.dispatchId"
        },
        {
          name: "sha256",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.matching.uploadProofPhoto.field.sha256"
        },
        {
          name: "X-Amz-Algorithm",
          in: "query",
          type: "string",
          required: true,
          rule: "rest.matching.uploadProofPhoto.field.xAmzAlgorithm"
        },
        {
          name: "X-Amz-Credential",
          in: "query",
          type: "string",
          required: true,
          rule: "rest.matching.uploadProofPhoto.field.xAmzCredential"
        },
        {
          name: "X-Amz-Date",
          in: "query",
          type: "string",
          required: true,
          rule: "rest.matching.uploadProofPhoto.field.xAmzDate"
        },
        {
          name: "X-Amz-Expires",
          in: "query",
          type: "integer",
          required: true,
          rule: "rest.matching.uploadProofPhoto.field.xAmzExpires"
        },
        {
          name: "X-Amz-SignedHeaders",
          in: "query",
          type: "string",
          required: true,
          rule: "rest.matching.uploadProofPhoto.field.xAmzSignedHeaders"
        },
        {
          name: "X-Amz-Signature",
          in: "query",
          type: "string",
          required: true,
          rule: "rest.matching.uploadProofPhoto.field.xAmzSignature"
        },
        {
          name: "Host",
          in: "header",
          type: "string",
          required: true,
          rule: "rest.matching.uploadProofPhoto.field.host"
        },
        {
          name: "If-None-Match",
          in: "header",
          type: "string",
          required: true,
          rule: "rest.matching.uploadProofPhoto.field.ifNoneMatch"
        },
        {
          name: "x-amz-checksum-sha256",
          in: "header",
          type: "string",
          required: true,
          rule: "rest.matching.uploadProofPhoto.field.xAmzChecksumSha256"
        },
        {
          name: "photo",
          in: "body",
          type: "binary (image/jpeg)",
          required: true,
          rule: "rest.matching.uploadProofPhoto.field.photo"
        }
      ],
      headers: ["If-None-Match: *", "x-amz-checksum-sha256: u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7s="],
      contentType: "image/jpeg",
      raw: "<the JPEG's bytes>"
    },
    cases: [
      {
        status: 200,
        when: "rest.matching.uploadProofPhoto.case.stored",
        source: restSource("matching", "test/fleet_pulse/storage/s3_test.exs", 72, 83)
      },
      {
        status: 400,
        when: "rest.matching.uploadProofPhoto.case.badDigest",
        source: restSource("matching", "test/fleet_pulse/storage/s3_test.exs", 85, 93)
      },
      {
        status: 403,
        when: "rest.matching.uploadProofPhoto.case.signatureRefused",
        source: restSource("matching", "test/fleet_pulse/storage/s3_test.exs", 145, 171)
      },
      {
        status: 412,
        when: "rest.matching.uploadProofPhoto.case.alreadyStored",
        source: restSource("matching", "test/fleet_pulse/storage/s3_test.exs", 95, 104)
      }
    ],
    source: restSource("matching", "lib/fleet_pulse/storage/s3.ex", 24, 32)
  }
];
