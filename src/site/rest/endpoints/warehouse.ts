import type { RestCase } from "../../types/rest_case.type";
import type { RestEndpoint } from "../../types/rest_endpoint.type";
import { restSource } from "../rest_source";

const traceId: string = "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b";
const merchantPrincipalId: string = "3f6c1a2e-8b4d-4e7f-9a1c-5d2e7b8f0a14";
const orderNumber: string = "ORD-20261022-7F3A9C1B";
const returnNumber: string = "RMA-20261022-4C7D2E9A";
const html: string = "Content-Type: text/html; charset=utf-8";

export const warehouseAnswers: readonly RestCase[] = [
  {
    status: 400,
    when: "rest.warehouse.answers.unreadableBody",
    json: {
      error: "INVALID_REQUEST",
      message: "the request body could not be parsed as the content type it declares.",
      traceId: traceId
    },
    source: restSource("warehouse", "app/controllers/concerns/api_error_handling.rb", 83, 92)
  },
  {
    status: 400,
    when: "rest.warehouse.answers.badRequestJson",
    json: {
      status: 400,
      error: "Bad Request"
    },
    source: restSource("warehouse", "config/environments/production.rb", 13, 14)
  },
  {
    status: 400,
    when: "rest.warehouse.answers.badRequestHtml",
    headers: [html],
    source: restSource("warehouse", "public/400.html", 1, 135)
  },
  {
    status: 401,
    when: "rest.warehouse.answers.noToken",
    json: {
      error: "Unauthorized: a bearer token is required"
    },
    source: restSource("warehouse", "app/controllers/concerns/api_authentication.rb", 22, 31)
  },
  {
    status: 401,
    when: "rest.warehouse.answers.invalidToken",
    json: {
      error: "Unauthorized: invalid token"
    },
    source: restSource("warehouse", "app/controllers/concerns/api_authentication.rb", 33, 38)
  },
  {
    status: 403,
    when: "rest.warehouse.answers.notASeller",
    json: {
      error: "NOT_A_SELLER",
      message:
        "this token was not issued to a seller. An account approved as a seller after it signed in gets a seller's token when its session is refreshed."
    },
    source: restSource("warehouse", "app/controllers/concerns/api_authentication.rb", 80, 88)
  },
  {
    status: 403,
    when: "rest.warehouse.answers.notAMerchant",
    json: {
      error: "NOT_A_MERCHANT",
      message: "identity knows no merchant for this account."
    },
    source: restSource("warehouse", "app/controllers/concerns/api_authentication.rb", 90, 98)
  },
  {
    status: 403,
    when: "rest.warehouse.answers.notStaff",
    json: {
      error: "Forbidden: this account may not perform warehouse operations"
    },
    source: restSource("warehouse", "app/controllers/concerns/api_staff_authorization.rb", 15, 23)
  },
  {
    status: 404,
    when: "rest.warehouse.answers.noRouteJson",
    json: {
      status: 404,
      error: "Not Found"
    },
    source: restSource("warehouse", "config/routes.rb", 1, 32)
  },
  {
    status: 404,
    when: "rest.warehouse.answers.noRouteHtml",
    headers: [html],
    source: restSource("warehouse", "public/404.html", 1, 135)
  },
  {
    status: 500,
    when: "rest.warehouse.answers.internal",
    json: {
      error: "INTERNAL_ERROR",
      message:
        "something went wrong handling this request. No stock was moved or reserved unless a previous response said so.",
      traceId: traceId
    },
    source: restSource("warehouse", "app/controllers/concerns/api_error_handling.rb", 28, 42)
  },
  {
    status: 501,
    when: "rest.warehouse.answers.unsupportedMethod",
    source: restSource("warehouse", "config/puma.rb", 1, 17)
  },
  {
    status: 503,
    when: "rest.warehouse.answers.signingKeys",
    headers: ["Retry-After: 15"],
    json: {
      error: "IDENTITY_UNAVAILABLE",
      message: "we could not check this token with identity's keys, so the request was not applied."
    },
    source: restSource("warehouse", "app/controllers/concerns/api_authentication.rb", 39, 46)
  },
  {
    status: 503,
    when: "rest.warehouse.answers.identityUnavailable",
    headers: ["Retry-After: 15"],
    json: {
      error: "IDENTITY_UNAVAILABLE",
      message:
        "we could not check this account with identity, so the request was not applied. No stock was moved or reserved.",
      traceId: traceId
    },
    source: restSource("warehouse", "app/controllers/concerns/api_error_handling.rb", 55, 69)
  },
  {
    status: 503,
    when: "rest.warehouse.answers.orderUnavailable",
    headers: ["Retry-After: 15"],
    json: {
      error: "ORDER_UNAVAILABLE",
      message: "order-service did not answer, so nothing was recorded. Try again shortly.",
      traceId: traceId
    },
    source: restSource("warehouse", "app/controllers/concerns/api_error_handling.rb", 71, 81)
  }
];

export const warehouseEndpoints: readonly RestEndpoint[] = [
  {
    id: "warehouse.taskQueue",
    service: "warehouse",
    method: "GET",
    path: "/api/v1/warehouse/fulfillment_tasks/queue",
    summary: "rest.warehouse.taskQueue.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.warehouse.taskQueue.who"
    },
    request: {
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.warehouse.taskQueue.case.listed",
        json: [
          {
            id: 415,
            order_number: "ORD-20261021-B42E6D90",
            status: "packed",
            same_day_cutoff_at: "2026-10-21T05:00:00.000Z",
            created_at: "2026-10-21T01:12:44.208Z",
            tracking_number: "KNX-20261021-MZXW6YTBOI3DE",
            sla_urgency: "packed",
            lines: [
              {
                sku: "KERUDUNG-PINK-01",
                quantity: 1,
                bin_location: "B-02-1"
              }
            ]
          },
          {
            id: 418,
            order_number: orderNumber,
            status: "received",
            same_day_cutoff_at: "2026-10-22T05:00:00.000Z",
            created_at: "2026-10-22T02:41:09.512Z",
            tracking_number: null,
            sla_urgency: "due_soon",
            lines: [
              {
                sku: "GAMIS-RED-M",
                quantity: 2,
                bin_location: "A-01-3"
              }
            ]
          }
        ],
        source: restSource("warehouse", "app/services/fulfillment/task_queue_service.rb", 37, 81)
      }
    ],
    source: restSource("warehouse", "app/controllers/api/v1/fulfillment_tasks_controller.rb", 10, 19)
  },
  {
    id: "warehouse.setTaskStatus",
    service: "warehouse",
    method: "PATCH",
    path: "/api/v1/warehouse/fulfillment_tasks/{id}/status",
    summary: "rest.warehouse.setTaskStatus.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.warehouse.setTaskStatus.who"
    },
    request: {
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.warehouse.setTaskStatus.field.id"
        },
        {
          name: "status",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.warehouse.setTaskStatus.field.status"
        }
      ],
      json: {
        status: "packing"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.warehouse.setTaskStatus.case.moved",
        json: {
          order_notified: false,
          notify_error: null,
          dispatch_ref: null,
          id: 418,
          order_number: orderNumber,
          status: "packing",
          updated_at: "2026-10-22T03:15:07.482Z"
        },
        source: restSource("warehouse", "app/services/fulfillment/advance_task_service.rb", 58, 76)
      },
      {
        status: 200,
        when: "rest.warehouse.setTaskStatus.case.packed",
        json: {
          order_notified: true,
          notify_error: null,
          dispatch_ref: "DISP-2731",
          id: 418,
          order_number: orderNumber,
          status: "packed",
          updated_at: "2026-10-22T03:24:51.006Z"
        },
        source: restSource("warehouse", "app/services/fulfillment/advance_task_service.rb", 63, 76)
      },
      {
        status: 200,
        when: "rest.warehouse.setTaskStatus.case.orderUnreachable",
        json: {
          order_notified: false,
          notify_error:
            "order-service could not be told this parcel is packed, so no courier has been sent yet. Set the task to packed again to re-send the report.",
          dispatch_ref: null,
          id: 418,
          order_number: orderNumber,
          status: "packed",
          updated_at: "2026-10-22T03:24:51.006Z"
        },
        source: restSource("warehouse", "app/services/fulfillment/advance_task_service.rb", 94, 101)
      },
      {
        status: 200,
        when: "rest.warehouse.setTaskStatus.case.orderRefused",
        json: {
          order_notified: false,
          notify_error: "the order is CANCELLED, so there is nothing to send",
          dispatch_ref: null,
          id: 418,
          order_number: orderNumber,
          status: "packed",
          updated_at: "2026-10-22T03:24:51.006Z"
        },
        source: restSource("warehouse", "app/services/fulfillment/advance_task_service.rb", 72, 74)
      },
      {
        status: 404,
        when: "rest.warehouse.setTaskStatus.case.notFound",
        json: {
          error: "Fulfillment task not found"
        },
        source: restSource("warehouse", "app/services/fulfillment/advance_task_service.rb", 50, 51)
      },
      {
        status: 422,
        when: "rest.warehouse.setTaskStatus.case.unknownStatus",
        json: {
          error: "shipped is not a state this warehouse can put a task in"
        },
        source: restSource("warehouse", "app/services/fulfillment/advance_task_service.rb", 46, 48)
      },
      {
        status: 422,
        when: "rest.warehouse.setTaskStatus.case.notAllowed",
        json: {
          error: "a received task cannot be moved to packed"
        },
        source: restSource("warehouse", "app/services/fulfillment/advance_task_service.rb", 53, 56)
      },
      {
        status: 422,
        when: "rest.warehouse.setTaskStatus.case.changed",
        json: {
          error: "the task changed while this request was being handled; read it again"
        },
        source: restSource("warehouse", "app/services/fulfillment/advance_task_service.rb", 58, 61)
      }
    ],
    source: restSource("warehouse", "app/controllers/api/v1/fulfillment_tasks_controller.rb", 21, 34)
  },
  {
    id: "warehouse.printLabel",
    service: "warehouse",
    method: "POST",
    path: "/api/v1/warehouse/fulfillment_tasks/{id}/label",
    summary: "rest.warehouse.printLabel.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.warehouse.printLabel.who"
    },
    request: {
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.warehouse.printLabel.field.id"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.warehouse.printLabel.case.printed",
        json: {
          id: 233,
          fulfillment_task_id: 418,
          awb_number: "KNX-20261022-JBSWY3DPEHPK3",
          print_count: 1,
          reprint_count: 0
        },
        source: restSource("warehouse", "app/services/labels/generate_shipping_label_service.rb", 58, 68)
      },
      {
        status: 404,
        when: "rest.warehouse.printLabel.case.notFound",
        json: {
          error: "Fulfillment task not found"
        },
        source: restSource("warehouse", "app/services/labels/generate_shipping_label_service.rb", 45, 46)
      },
      {
        status: 422,
        when: "rest.warehouse.printLabel.case.cancelled",
        json: {
          error: "This task was cancelled by order; its parcel is not shipped"
        },
        source: restSource("warehouse", "app/services/labels/generate_shipping_label_service.rb", 47, 47)
      },
      {
        status: 422,
        when: "rest.warehouse.printLabel.case.noCourier",
        json: {
          error: "No courier has been assigned to this task yet, so it has no tracking number to print"
        },
        source: restSource("warehouse", "app/services/labels/generate_shipping_label_service.rb", 49, 56)
      }
    ],
    source: restSource("warehouse", "app/controllers/api/v1/fulfillment_tasks_controller.rb", 36, 45)
  },
  {
    id: "warehouse.verifyScan",
    service: "warehouse",
    method: "POST",
    path: "/api/v1/warehouse/fulfillment_tasks/{id}/verify_scan",
    summary: "rest.warehouse.verifyScan.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.warehouse.verifyScan.who"
    },
    request: {
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.warehouse.verifyScan.field.id"
        },
        {
          name: "scanned_code",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.warehouse.verifyScan.field.scannedCode"
        }
      ],
      json: {
        scanned_code: "GAMIS-RED-M"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.warehouse.verifyScan.case.matched",
        json: {
          fulfillment_task_id: 418,
          order_number: orderNumber,
          matched_sku: "GAMIS-RED-M",
          new_status: "packed",
          message: "✓ MATCHED! GAMIS-RED-M verified.",
          order_notified: true,
          notify_error: null,
          dispatch_ref: "DISP-2731"
        },
        source: restSource("warehouse", "app/services/fulfillment/verify_scan_service.rb", 73, 90)
      },
      {
        status: 404,
        when: "rest.warehouse.verifyScan.case.notFound",
        json: {
          error: "Fulfillment task #418 not found for this merchant"
        },
        source: restSource("warehouse", "app/services/fulfillment/verify_scan_service.rb", 44, 45)
      },
      {
        status: 422,
        when: "rest.warehouse.verifyScan.case.blank",
        json: {
          error: "Scanned barcode code cannot be blank"
        },
        source: restSource("warehouse", "app/services/fulfillment/verify_scan_service.rb", 41, 42)
      },
      {
        status: 422,
        when: "rest.warehouse.verifyScan.case.mismatch",
        json: {
          error: "✖ SKU MISMATCH! Scanned 'GAMIS-BLUE-M' does not match expected SKU (GAMIS-RED-M, KERUDUNG-PINK-01)"
        },
        source: restSource("warehouse", "app/services/fulfillment/verify_scan_service.rb", 47, 54)
      },
      {
        status: 422,
        when: "rest.warehouse.verifyScan.case.cancelled",
        json: {
          error: "this task is cancelled; there is nothing left to scan"
        },
        source: restSource("warehouse", "app/services/fulfillment/verify_scan_service.rb", 68, 71)
      },
      {
        status: 422,
        when: "rest.warehouse.verifyScan.case.changed",
        json: {
          error: "the task changed while this request was being handled; read it again"
        },
        source: restSource("warehouse", "app/services/fulfillment/advance_task_service.rb", 58, 61)
      }
    ],
    source: restSource("warehouse", "app/controllers/api/v1/fulfillment_tasks_controller.rb", 47, 60)
  },
  {
    id: "warehouse.openReturn",
    service: "warehouse",
    method: "POST",
    path: "/api/v1/warehouse/fulfillment_tasks/{fulfillment_task_id}/returns",
    summary: "rest.warehouse.openReturn.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.warehouse.openReturn.who"
    },
    request: {
      fields: [
        {
          name: "fulfillment_task_id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.warehouse.openReturn.field.fulfillmentTaskId"
        },
        {
          name: "reason",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.warehouse.openReturn.field.reason"
        }
      ],
      json: {
        reason: "Wrong size; the buyer sent it back unworn"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.warehouse.openReturn.case.alreadyOpen",
        json: {
          return_number: returnNumber,
          fulfillment_task_id: 418,
          already_open: true
        },
        source: restSource("warehouse", "app/controllers/api/v1/returns_controller.rb", 31, 36)
      },
      {
        status: 201,
        when: "rest.warehouse.openReturn.case.opened",
        json: {
          return_number: returnNumber,
          fulfillment_task_id: 418,
          already_open: false
        },
        source: restSource("warehouse", "app/controllers/api/v1/returns_controller.rb", 31, 36)
      },
      {
        status: 404,
        when: "rest.warehouse.openReturn.case.notFound",
        json: {
          error: "Fulfillment task not found"
        },
        source: restSource("warehouse", "app/controllers/api/v1/returns_controller.rb", 81, 92)
      },
      {
        status: 422,
        when: "rest.warehouse.openReturn.case.blankReason",
        json: {
          error: "Reason cannot be blank"
        },
        source: restSource("warehouse", "app/controllers/api/v1/returns_controller.rb", 18, 22)
      },
      {
        status: 502,
        when: "rest.warehouse.openReturn.case.refused",
        json: {
          error: "RETURN_NOT_RECORDED",
          message: "that order is PROCESSING_FULFILLMENT; a return is opened only against a delivered order"
        },
        source: restSource("warehouse", "app/controllers/api/v1/returns_controller.rb", 94, 100)
      }
    ],
    source: restSource("warehouse", "app/controllers/api/v1/returns_controller.rb", 10, 40)
  },
  {
    id: "warehouse.receiveReturnedGoods",
    service: "warehouse",
    method: "POST",
    path: "/api/v1/warehouse/returns/{return_number}/received",
    summary: "rest.warehouse.receiveReturnedGoods.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.warehouse.receiveReturnedGoods.who"
    },
    request: {
      fields: [
        {
          name: "return_number",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.warehouse.receiveReturnedGoods.field.returnNumber"
        },
        {
          name: "bin_code",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.warehouse.receiveReturnedGoods.field.binCode"
        },
        {
          name: "lines",
          in: "body",
          type: "array of object",
          required: true,
          rule: "rest.warehouse.receiveReturnedGoods.field.lines"
        },
        {
          name: "lines[].sku",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.warehouse.receiveReturnedGoods.field.linesSku"
        },
        {
          name: "lines[].quantity",
          in: "body",
          type: "integer",
          required: true,
          rule: "rest.warehouse.receiveReturnedGoods.field.linesQuantity"
        }
      ],
      json: {
        bin_code: "R-01-1",
        lines: [
          {
            sku: "GAMIS-RED-M",
            quantity: 1
          }
        ]
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.warehouse.receiveReturnedGoods.case.recorded",
        json: {
          return_number: returnNumber,
          already_recorded: false
        },
        source: restSource("warehouse", "app/controllers/api/v1/returns_controller.rb", 69, 73)
      },
      {
        status: 200,
        when: "rest.warehouse.receiveReturnedGoods.case.alreadyRecorded",
        json: {
          return_number: returnNumber,
          already_recorded: true
        },
        source: restSource("warehouse", "app/controllers/api/v1/returns_controller.rb", 69, 73)
      },
      {
        status: 400,
        when: "rest.warehouse.receiveReturnedGoods.case.notAList",
        json: {
          error: "lines must be a list of objects, each with a sku and a quantity"
        },
        source: restSource("warehouse", "app/controllers/api/v1/returns_controller.rb", 47, 52)
      },
      {
        status: 422,
        when: "rest.warehouse.receiveReturnedGoods.case.invalidLines",
        json: {
          error: "Every line needs a whole quantity of at least 1"
        },
        source: restSource("warehouse", "app/forms/returns/returned_lines_form.rb", 30, 38)
      },
      {
        status: 502,
        when: "rest.warehouse.receiveReturnedGoods.case.refused",
        json: {
          error: "RETURN_NOT_RECORDED",
          message: `3 of GAMIS-RED-M came back but order ${orderNumber} bought 2`
        },
        source: restSource("warehouse", "app/controllers/api/v1/returns_controller.rb", 94, 100)
      }
    ],
    source: restSource("warehouse", "app/controllers/api/v1/returns_controller.rb", 42, 77)
  },
  {
    id: "warehouse.merchantMe",
    service: "warehouse",
    method: "GET",
    path: "/api/v1/warehouse/merchants/me",
    summary: "rest.warehouse.merchantMe.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.warehouse.merchantMe.who"
    },
    request: {
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.warehouse.merchantMe.case.found",
        json: {
          id: 12,
          principal_id: merchantPrincipalId,
          cutoff_hour: 12,
          may_sell: true
        },
        source: restSource("warehouse", "app/controllers/api/v1/merchants_controller.rb", 11, 22)
      }
    ],
    source: restSource("warehouse", "app/controllers/api/v1/merchants_controller.rb", 10, 22)
  },
  {
    id: "warehouse.setCutoffHour",
    service: "warehouse",
    method: "PATCH",
    path: "/api/v1/warehouse/merchants/{id}",
    summary: "rest.warehouse.setCutoffHour.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.warehouse.setCutoffHour.who"
    },
    request: {
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.warehouse.setCutoffHour.field.id"
        },
        {
          name: "cutoff_hour",
          in: "body",
          type: "integer",
          required: true,
          rule: "rest.warehouse.setCutoffHour.field.cutoffHour"
        }
      ],
      json: {
        cutoff_hour: 14
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.warehouse.setCutoffHour.case.set",
        json: {
          id: 12,
          cutoff_hour: 14
        },
        source: restSource("warehouse", "app/controllers/api/v1/merchants_controller.rb", 52, 53)
      },
      {
        status: 403,
        when: "rest.warehouse.setCutoffHour.case.notTrading",
        json: {
          error: "MERCHANT_NOT_TRADING",
          message: "identity does not permit this merchant to trade, so how its store runs cannot change."
        },
        source: restSource("warehouse", "app/controllers/concerns/api_authentication.rb", 67, 77)
      },
      {
        status: 403,
        when: "rest.warehouse.setCutoffHour.case.notYours",
        json: {
          error: "Forbidden: that merchant is not yours"
        },
        source: restSource("warehouse", "app/controllers/api/v1/merchants_controller.rb", 29, 32)
      },
      {
        status: 422,
        when: "rest.warehouse.setCutoffHour.case.invalid",
        json: {
          error: "cutoff_hour must be between 0 and 23"
        },
        source: restSource("warehouse", "app/controllers/api/v1/merchants_controller.rb", 34, 50)
      }
    ],
    source: restSource("warehouse", "app/controllers/api/v1/merchants_controller.rb", 24, 54)
  },
  {
    id: "warehouse.replaceCutoffHour",
    service: "warehouse",
    method: "PUT",
    path: "/api/v1/warehouse/merchants/{id}",
    summary: "rest.warehouse.replaceCutoffHour.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.warehouse.setCutoffHour.who"
    },
    request: {
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.warehouse.setCutoffHour.field.id"
        },
        {
          name: "cutoff_hour",
          in: "body",
          type: "integer",
          required: true,
          rule: "rest.warehouse.setCutoffHour.field.cutoffHour"
        }
      ],
      json: {
        cutoff_hour: 14
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.warehouse.setCutoffHour.case.set",
        json: {
          id: 12,
          cutoff_hour: 14
        },
        source: restSource("warehouse", "app/controllers/api/v1/merchants_controller.rb", 52, 53)
      },
      {
        status: 403,
        when: "rest.warehouse.setCutoffHour.case.notTrading",
        json: {
          error: "MERCHANT_NOT_TRADING",
          message: "identity does not permit this merchant to trade, so how its store runs cannot change."
        },
        source: restSource("warehouse", "app/controllers/concerns/api_authentication.rb", 67, 77)
      },
      {
        status: 403,
        when: "rest.warehouse.setCutoffHour.case.notYours",
        json: {
          error: "Forbidden: that merchant is not yours"
        },
        source: restSource("warehouse", "app/controllers/api/v1/merchants_controller.rb", 29, 32)
      },
      {
        status: 422,
        when: "rest.warehouse.setCutoffHour.case.invalid",
        json: {
          error: "cutoff_hour must be between 0 and 23"
        },
        source: restSource("warehouse", "app/controllers/api/v1/merchants_controller.rb", 34, 50)
      }
    ],
    source: restSource("warehouse", "app/controllers/api/v1/merchants_controller.rb", 24, 54)
  },
  {
    id: "warehouse.upsertBin",
    service: "warehouse",
    method: "POST",
    path: "/api/v1/warehouse/bins",
    summary: "rest.warehouse.upsertBin.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.warehouse.upsertBin.who"
    },
    request: {
      fields: [
        {
          name: "bin_code",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.warehouse.upsertBin.field.binCode"
        },
        {
          name: "zone",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.warehouse.upsertBin.field.zone"
        },
        {
          name: "shelf_level",
          in: "body",
          type: "integer",
          required: false,
          rule: "rest.warehouse.upsertBin.field.shelfLevel"
        }
      ],
      json: {
        bin_code: "A-01-3",
        zone: "A",
        shelf_level: 3
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.warehouse.upsertBin.case.updated",
        json: {
          id: 57,
          bin_code: "A-01-3",
          zone: "A",
          shelf_level: 3
        },
        source: restSource("warehouse", "app/controllers/api/v1/bins_controller.rb", 26, 32)
      },
      {
        status: 201,
        when: "rest.warehouse.upsertBin.case.created",
        json: {
          id: 57,
          bin_code: "A-01-3",
          zone: "A",
          shelf_level: 3
        },
        source: restSource("warehouse", "app/controllers/api/v1/bins_controller.rb", 26, 32)
      },
      {
        status: 422,
        when: "rest.warehouse.upsertBin.case.invalid",
        json: {
          error: "Bin code can't be blank, Zone can't be blank"
        },
        source: restSource("warehouse", "app/controllers/api/v1/bins_controller.rb", 21, 24)
      }
    ],
    source: restSource("warehouse", "app/controllers/api/v1/bins_controller.rb", 11, 33)
  },
  {
    id: "warehouse.receiveStock",
    service: "warehouse",
    method: "POST",
    path: "/api/v1/warehouse/stock_receipts",
    summary: "rest.warehouse.receiveStock.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.warehouse.receiveStock.who"
    },
    request: {
      fields: [
        {
          name: "bin_code",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.warehouse.receiveStock.field.binCode"
        },
        {
          name: "sku",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.warehouse.receiveStock.field.sku"
        },
        {
          name: "quantity",
          in: "body",
          type: "integer",
          required: true,
          rule: "rest.warehouse.receiveStock.field.quantity"
        },
        {
          name: "idempotency_key",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.warehouse.receiveStock.field.idempotencyKey"
        },
        {
          name: "merchant_principal_id",
          in: "body",
          type: "string (uuid)",
          required: true,
          rule: "rest.warehouse.receiveStock.field.merchantPrincipalId"
        },
        {
          name: "note",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.warehouse.receiveStock.field.note"
        }
      ],
      json: {
        bin_code: "A-01-3",
        sku: "GAMIS-RED-M",
        quantity: 24,
        idempotency_key: "rcv-20261022-0007",
        merchant_principal_id: merchantPrincipalId,
        note: "Inbound delivery, carton 2 of 3"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.warehouse.receiveStock.case.replayed",
        json: {
          id: 2214,
          sku: "GAMIS-RED-M",
          quantity: 24,
          bin_code: "A-01-3",
          quantity_on_hand: 31,
          replayed: true
        },
        source: restSource("warehouse", "app/services/inventory/receive_stock_service.rb", 143, 157)
      },
      {
        status: 201,
        when: "rest.warehouse.receiveStock.case.booked",
        json: {
          id: 2214,
          sku: "GAMIS-RED-M",
          quantity: 24,
          bin_code: "A-01-3",
          quantity_on_hand: 36,
          replayed: false
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_receipts_controller.rb", 40, 48)
      },
      {
        status: 400,
        when: "rest.warehouse.receiveStock.case.missingField",
        json: {
          error: "idempotency_key is required"
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_receipts_controller.rb", 15, 26)
      },
      {
        status: 400,
        when: "rest.warehouse.receiveStock.case.notUuid",
        json: {
          error: "merchant_principal_id must be a UUID"
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_receipts_controller.rb", 49, 50)
      },
      {
        status: 409,
        when: "rest.warehouse.receiveStock.case.keyConflict",
        json: {
          error: "IDEMPOTENCY_KEY_CONFLICT",
          message: "that idempotency_key already booked a different receipt for this merchant"
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_receipts_controller.rb", 60, 64)
      },
      {
        status: 409,
        when: "rest.warehouse.receiveStock.case.wrongOwner",
        json: {
          error: "that sku is already on this shelf under a different merchant"
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_receipts_controller.rb", 65, 68)
      },
      {
        status: 422,
        when: "rest.warehouse.receiveStock.case.invalidQuantity",
        json: {
          error: "INVALID_QUANTITY"
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_receipts_controller.rb", 72, 73)
      },
      {
        status: 422,
        when: "rest.warehouse.receiveStock.case.invalidSku",
        json: {
          error: "sku is required and must be at most 128 characters"
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_receipts_controller.rb", 51, 54)
      },
      {
        status: 422,
        when: "rest.warehouse.receiveStock.case.unknownMerchant",
        json: {
          error: "UNKNOWN_MERCHANT",
          message: "identity knows no merchant with that principal, so no goods can be booked for it"
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_receipts_controller.rb", 55, 59)
      },
      {
        status: 422,
        when: "rest.warehouse.receiveStock.case.binNotFound",
        json: {
          error: "no bin with that code — create it before booking goods into it"
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_receipts_controller.rb", 69, 71)
      }
    ],
    source: restSource("warehouse", "app/controllers/api/v1/stock_receipts_controller.rb", 11, 75)
  },
  {
    id: "warehouse.adjustStock",
    service: "warehouse",
    method: "POST",
    path: "/api/v1/warehouse/stock_adjustments",
    summary: "rest.warehouse.adjustStock.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.warehouse.adjustStock.who"
    },
    request: {
      fields: [
        {
          name: "bin_code",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.warehouse.adjustStock.field.binCode"
        },
        {
          name: "sku",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.warehouse.adjustStock.field.sku"
        },
        {
          name: "quantity_delta",
          in: "body",
          type: "integer",
          required: true,
          rule: "rest.warehouse.adjustStock.field.quantityDelta"
        },
        {
          name: "reason",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.warehouse.adjustStock.field.reason"
        },
        {
          name: "idempotency_key",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.warehouse.adjustStock.field.idempotencyKey"
        },
        {
          name: "merchant_principal_id",
          in: "body",
          type: "string (uuid)",
          required: true,
          rule: "rest.warehouse.adjustStock.field.merchantPrincipalId"
        },
        {
          name: "note",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.warehouse.adjustStock.field.note"
        }
      ],
      json: {
        bin_code: "A-01-3",
        sku: "GAMIS-RED-M",
        quantity_delta: -2,
        reason: "DAMAGE",
        idempotency_key: "adj-20261022-0003",
        merchant_principal_id: merchantPrincipalId,
        note: "Two units torn at the seam"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.warehouse.adjustStock.case.replayed",
        json: {
          id: 377,
          sku: "GAMIS-RED-M",
          quantity_delta: -2,
          reason: "DAMAGE",
          bin_code: "A-01-3",
          quantity_before: 36,
          quantity_on_hand: 31,
          reserved_quantity: 2,
          replayed: true
        },
        source: restSource("warehouse", "app/services/inventory/adjust_stock_service.rb", 165, 183)
      },
      {
        status: 201,
        when: "rest.warehouse.adjustStock.case.adjusted",
        json: {
          id: 377,
          sku: "GAMIS-RED-M",
          quantity_delta: -2,
          reason: "DAMAGE",
          bin_code: "A-01-3",
          quantity_before: 36,
          quantity_on_hand: 34,
          reserved_quantity: 4,
          replayed: false
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_adjustments_controller.rb", 40, 52)
      },
      {
        status: 400,
        when: "rest.warehouse.adjustStock.case.missingField",
        json: {
          error: "idempotency_key is required"
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_adjustments_controller.rb", 15, 26)
      },
      {
        status: 400,
        when: "rest.warehouse.adjustStock.case.notUuid",
        json: {
          error: "merchant_principal_id must be a UUID"
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_adjustments_controller.rb", 61, 62)
      },
      {
        status: 409,
        when: "rest.warehouse.adjustStock.case.wouldCutReserved",
        json: {
          error: "that would cut into stock already reserved for orders",
          quantity_on_hand: 34,
          reserved_quantity: 4,
          max_reduction: 30
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_adjustments_controller.rb", 53, 60)
      },
      {
        status: 409,
        when: "rest.warehouse.adjustStock.case.keyConflict",
        json: {
          error: "IDEMPOTENCY_KEY_CONFLICT",
          message: "that idempotency_key already made a different adjustment for this merchant"
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_adjustments_controller.rb", 63, 67)
      },
      {
        status: 409,
        when: "rest.warehouse.adjustStock.case.wrongOwner",
        json: {
          error: "that stock belongs to a different merchant"
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_adjustments_controller.rb", 68, 69)
      },
      {
        status: 409,
        when: "rest.warehouse.adjustStock.case.noOwner",
        json: {
          error: "that stock predates ownership — book it in again naming the merchant first"
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_adjustments_controller.rb", 70, 73)
      },
      {
        status: 422,
        when: "rest.warehouse.adjustStock.case.invalidDelta",
        json: {
          error: "INVALID_DELTA"
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_adjustments_controller.rb", 83, 85)
      },
      {
        status: 422,
        when: "rest.warehouse.adjustStock.case.unknownReason",
        json: {
          error: "reason must be one of DAMAGE, SHRINKAGE, MISCOUNT, RETURN_TO_SUPPLIER, EXPIRY"
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_adjustments_controller.rb", 79, 82)
      },
      {
        status: 422,
        when: "rest.warehouse.adjustStock.case.binNotFound",
        json: {
          error: "no bin with that code"
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_adjustments_controller.rb", 74, 75)
      },
      {
        status: 422,
        when: "rest.warehouse.adjustStock.case.stockNotFound",
        json: {
          error: "that sku is not on that shelf — nothing to adjust"
        },
        source: restSource("warehouse", "app/controllers/api/v1/stock_adjustments_controller.rb", 76, 78)
      }
    ],
    source: restSource("warehouse", "app/controllers/api/v1/stock_adjustments_controller.rb", 11, 86)
  }
];
