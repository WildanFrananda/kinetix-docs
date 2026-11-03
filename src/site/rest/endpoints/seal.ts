import type { RestCase } from "../../types/rest_case.type";
import type { RestEndpoint } from "../../types/rest_endpoint.type";
import { restSource } from "../rest_source";

const routes = "src/infrastructure/http/predicate_routes.ts";
const caller = "src/infrastructure/http/caller_of.ts";
const server = "src/infrastructure/http/http_server.ts";
const templateId = "4b5c6d7e-8f90-4a1b-9c2d-3e4f5a6b7c8d";

export const sealAnswers: readonly RestCase[] = [
  {
    status: 400,
    when: "rest.seal.answers.unreadable",
    json: {
      error: "INVALID_REQUEST",
      message: "the request could not be read",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("seal", server, 48, 55)
  },
  {
    status: 401,
    when: "rest.seal.answers.tokenRefused",
    headers: ["WWW-Authenticate: Bearer"],
    json: {
      error: "TOKEN_REFUSED",
      message: "a valid access token is required",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("seal", caller, 30, 35)
  },
  {
    status: 413,
    when: "rest.seal.answers.tooLarge",
    json: {
      error: "PAYLOAD_TOO_LARGE",
      message: "the request could not be read",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("seal", server, 9, 12)
  },
  {
    status: 415,
    when: "rest.seal.answers.notJson",
    json: {
      error: "JSON_REQUIRED",
      message: "the request could not be read",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("seal", server, 14, 16)
  },
  {
    status: 500,
    when: "rest.seal.answers.internal",
    json: {
      status: "error",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("seal", server, 59, 59)
  },
  {
    status: 503,
    when: "rest.seal.answers.identityUnavailable",
    json: {
      error: "IDENTITY_UNAVAILABLE",
      message: "the token cannot be checked now",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("seal", caller, 18, 27)
  }
];

export const sealEndpoints: readonly RestEndpoint[] = [
  {
    id: "seal.listPredicates",
    service: "seal",
    method: "GET",
    path: "/api/v1/seal/predicates",
    summary: "rest.seal.listPredicates.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.seal.listPredicates.who"
    },
    request: {
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.seal.listPredicates.case.listed",
        headers: ["Cache-Control: public, max-age=60"],
        json: {
          registry: {
            generation: 1,
            contractAddress: "5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e"
          },
          predicates: [
            {
              id: "4b5c6d7e-8f90-4a1b-9c2d-3e4f5a6b7c8d",
              status: "live",
              class: "courier",
              classId: "6b696e657469783a7365616c3a636f75726965723a7631000000000000000000",
              label: "Experienced courier",
              minimums: {
                deliveries: 100,
                ratingHundredths: 450,
                daysActive: 90
              },
              freshnessDays: 30,
              approvedAt: "2026-11-03T03:00:00.000Z",
              withdrawnAt: null,
              rows: [
                {
                  id: "a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3",
                  minimums: [
                    "100",
                    "450",
                    "90",
                    "20725"
                  ],
                  minimumIssueDay: 20725,
                  minimumIssueDate: "2026-09-29",
                  current: true,
                  placed: true
                },
                {
                  id: "b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4",
                  minimums: [
                    "100",
                    "450",
                    "90",
                    "20718"
                  ],
                  minimumIssueDay: 20718,
                  minimumIssueDate: "2026-09-22",
                  current: false,
                  placed: true
                }
              ]
            }
          ]
        },
        source: restSource("seal", routes, 122, 126)
      }
    ],
    source: restSource("seal", routes, 122, 126)
  },
  {
    id: "seal.getPredicate",
    service: "seal",
    method: "GET",
    path: "/api/v1/seal/predicates/{id}",
    summary: "rest.seal.getPredicate.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.seal.getPredicate.who"
    },
    request: {
      fields: [
        {
          name: "id",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.seal.getPredicate.field.id"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.seal.getPredicate.case.found",
        headers: ["Cache-Control: public, max-age=60"],
        json: {
          id: "4b5c6d7e-8f90-4a1b-9c2d-3e4f5a6b7c8d",
          status: "withdrawn",
          class: "courier",
          classId: "6b696e657469783a7365616c3a636f75726965723a7631000000000000000000",
          label: "Experienced courier",
          minimums: {
            deliveries: 100,
            ratingHundredths: 450,
            daysActive: 90
          },
          freshnessDays: 30,
          approvedAt: "2026-11-03T03:00:00.000Z",
          withdrawnAt: "2026-11-04T08:30:00.000Z",
          rows: []
        },
        source: restSource("seal", routes, 139, 139)
      },
      {
        status: 404,
        when: "rest.seal.getPredicate.case.notFound",
        headers: ["Cache-Control: no-store"],
        json: {
          error: "NOT_FOUND",
          message: "no such predicate",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("seal", routes, 132, 137)
      }
    ],
    source: restSource("seal", routes, 128, 140)
  },
  {
    id: "seal.approvePredicate",
    service: "seal",
    method: "POST",
    path: "/api/v1/seal/predicates",
    summary: "rest.seal.approvePredicate.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.seal.approvePredicate.who"
    },
    request: {
      fields: [
        {
          name: "class",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.seal.approvePredicate.field.class"
        },
        {
          name: "label",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.seal.approvePredicate.field.label"
        },
        {
          name: "minimums",
          in: "body",
          type: "object",
          required: true,
          rule: "rest.seal.approvePredicate.field.minimums"
        },
        {
          name: "freshnessDays",
          in: "body",
          type: "integer",
          required: true,
          rule: "rest.seal.approvePredicate.field.freshnessDays"
        }
      ],
      json: {
        class: "courier",
        label: "Experienced courier",
        minimums: {
          deliveries: 100,
          ratingHundredths: 450,
          daysActive: 90
        },
        freshnessDays: 30
      }
    },
    cases: [
      {
        status: 201,
        when: "rest.seal.approvePredicate.case.approved",
        headers: [`Location: /api/v1/seal/predicates/${templateId}`, "Cache-Control: no-store"],
        json: {
          id: "4b5c6d7e-8f90-4a1b-9c2d-3e4f5a6b7c8d",
          status: "live",
          class: "courier",
          classId: "6b696e657469783a7365616c3a636f75726965723a7631000000000000000000",
          label: "Experienced courier",
          minimums: {
            deliveries: 100,
            ratingHundredths: 450,
            daysActive: 90
          },
          freshnessDays: 30,
          approvedAt: "2026-11-03T03:00:00.000Z",
          withdrawnAt: null,
          rows: [
            {
              id: "a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3",
              minimums: [
                "100",
                "450",
                "90",
                "20725"
              ],
              minimumIssueDay: 20725,
              minimumIssueDate: "2026-09-29",
              current: true,
              placed: false
            },
            {
              id: "b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4b4",
              minimums: [
                "100",
                "450",
                "90",
                "20718"
              ],
              minimumIssueDay: 20718,
              minimumIssueDate: "2026-09-22",
              current: false,
              placed: false
            }
          ]
        },
        source: restSource("seal", routes, 168, 172)
      },
      {
        status: 400,
        when: "rest.seal.approvePredicate.case.invalid",
        json: {
          error: "INVALID_REQUEST",
          message: "the body must be { class, label, minimums, freshnessDays } within the class's bounds",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("seal", routes, 151, 163)
      },
      {
        status: 403,
        when: "rest.seal.approvePredicate.case.notAdmin",
        json: {
          error: "ADMIN_REQUIRED",
          message: "only an admin approves predicates",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("seal", routes, 173, 174)
      },
      {
        status: 409,
        when: "rest.seal.approvePredicate.case.exists",
        json: {
          error: "PREDICATE_EXISTS",
          message: "a live predicate already has these minimums",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("seal", routes, 175, 178)
      },
      {
        status: 409,
        when: "rest.seal.approvePredicate.case.full",
        json: {
          error: "TOO_MANY_PREDICATES",
          message: "a class holds at most 8 live predicates; withdraw one first",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("seal", routes, 179, 188)
      }
    ],
    source: restSource("seal", routes, 142, 190)
  },
  {
    id: "seal.withdrawPredicate",
    service: "seal",
    method: "DELETE",
    path: "/api/v1/seal/predicates/{id}",
    summary: "rest.seal.withdrawPredicate.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.seal.withdrawPredicate.who"
    },
    request: {
      fields: [
        {
          name: "id",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.seal.withdrawPredicate.field.id"
        }
      ]
    },
    cases: [
      {
        status: 204,
        when: "rest.seal.withdrawPredicate.case.withdrawn",
        headers: ["Cache-Control: no-store"],
        source: restSource("seal", routes, 205, 207)
      },
      {
        status: 403,
        when: "rest.seal.withdrawPredicate.case.notAdmin",
        json: {
          error: "ADMIN_REQUIRED",
          message: "only an admin withdraws predicates",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("seal", routes, 208, 209)
      },
      {
        status: 404,
        when: "rest.seal.withdrawPredicate.case.notFound",
        json: {
          error: "NOT_FOUND",
          message: "no such predicate",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("seal", routes, 210, 211)
      }
    ],
    source: restSource("seal", routes, 192, 213)
  }
];
