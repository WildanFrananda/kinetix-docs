import type { RestCase } from "../../types/rest_case.type";
import type { RestEndpoint } from "../../types/rest_endpoint.type";
import { restSource } from "../rest_source";

const routes = "src/infrastructure/http/predicate_routes.ts";
const caller = "src/infrastructure/http/caller_of.ts";
const server = "src/infrastructure/http/http_server.ts";
const credentials = "src/infrastructure/http/credential_routes.ts";
const holder = "src/infrastructure/http/holder_routes.ts";
const snapshot = "src/infrastructure/http/registry_snapshot_routes.ts";
const presentations = "src/infrastructure/http/presentation_routes.ts";
const templateId = "4b5c6d7e-8f90-4a1b-9c2d-3e4f5a6b7c8d";
const credentialId = "7d8e9fa0-b1c2-4d3e-8f4a-5b6c7d8e9f0a";
const contractAddress = "5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e";
const classId = "6b696e657469783a7365616c3a636f75726965723a7631000000000000000000";
const holderPublicKey = "4242424242424242424242424242424242424242424242424242424242424242424242424242";
const holderDigest = "1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d";
const rowId = "a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3";
const txId = "007c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c7c";
const traceId = "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b";
const holderPolicy = [
  "default-src 'none'",
  "script-src 'self' 'wasm-unsafe-eval'",
  "connect-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'"
].join("; ");

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
  },
  {
    id: "seal.requestCourierCredential",
    service: "seal",
    method: "POST",
    path: "/api/v1/seal/courier-credentials",
    summary: "rest.seal.requestCourierCredential.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.seal.requestCourierCredential.who"
    },
    request: {
      fields: [
        {
          name: "holderPublicKey",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.seal.requestCourierCredential.field.holderPublicKey"
        }
      ],
      json: {
        holderPublicKey
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.seal.requestCourierCredential.case.existing",
        headers: [`Location: /api/v1/seal/courier-credentials/${credentialId}`, "Cache-Control: no-store"],
        json: {
          id: credentialId,
          status: "issued",
          issueDay: 20760,
          credential: {
            classId,
            attributes: [
              "128",
              "472",
              "95",
              "20760"
            ],
            salt: "5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a"
          },
          holderPublicKey,
          registry: {
            generation: 1,
            contractAddress,
            leafIndex: "17",
            txId
          }
        },
        source: restSource("seal", credentials, 88, 96)
      },
      {
        status: 202,
        when: "rest.seal.requestCourierCredential.case.accepted",
        headers: [`Location: /api/v1/seal/courier-credentials/${credentialId}`, "Cache-Control: no-store"],
        json: {
          id: credentialId,
          status: "pending",
          issueDay: 20760,
          credential: {
            classId,
            attributes: [
              "128",
              "472",
              "95",
              "20760"
            ],
            salt: "5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a"
          },
          holderPublicKey,
          registry: null
        },
        source: restSource("seal", credentials, 83, 87)
      },
      {
        status: 400,
        when: "rest.seal.requestCourierCredential.case.invalid",
        headers: ["Cache-Control: no-store"],
        json: {
          error: "INVALID_REQUEST",
          message: "the body must be { holderPublicKey }, a field element in decimal",
          traceId
        },
        source: restSource("seal", credentials, 70, 78)
      },
      {
        status: 403,
        when: "rest.seal.requestCourierCredential.case.notCourier",
        headers: ["Cache-Control: no-store"],
        json: {
          error: "COURIER_REQUIRED",
          message: "only a courier holds a courier credential",
          traceId
        },
        source: restSource("seal", credentials, 97, 100)
      },
      {
        status: 409,
        when: "rest.seal.requestCourierCredential.case.noDeliveries",
        headers: ["Cache-Control: no-store"],
        json: {
          error: "NO_DELIVERIES",
          message: "a credential needs at least one delivered order",
          traceId
        },
        source: restSource("seal", credentials, 108, 111)
      },
      {
        status: 409,
        when: "rest.seal.requestCourierCredential.case.issuedToday",
        headers: ["Cache-Control: no-store"],
        json: {
          error: "ISSUED_TODAY",
          message: "a credential was already issued today to another holder key",
          traceId
        },
        source: restSource("seal", credentials, 112, 115)
      },
      {
        status: 503,
        when: "rest.seal.requestCourierCredential.case.factsStale",
        headers: ["Retry-After: 60", "Cache-Control: no-store"],
        json: {
          error: "FACTS_UNAVAILABLE",
          message: "the delivery and review facts are not current; try again later",
          traceId
        },
        source: restSource("seal", credentials, 101, 107)
      }
    ],
    source: restSource("seal", credentials, 61, 117)
  },
  {
    id: "seal.getCourierCredential",
    service: "seal",
    method: "GET",
    path: "/api/v1/seal/courier-credentials/{id}",
    summary: "rest.seal.getCourierCredential.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.seal.getCourierCredential.who"
    },
    request: {
      fields: [
        {
          name: "id",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.seal.getCourierCredential.field.id"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.seal.getCourierCredential.case.found",
        headers: ["Cache-Control: no-store"],
        json: {
          id: credentialId,
          status: "issued",
          issueDay: 20760,
          credential: {
            classId,
            attributes: [
              "128",
              "472",
              "95",
              "20760"
            ],
            salt: "5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a"
          },
          holderPublicKey,
          registry: {
            generation: 1,
            contractAddress,
            leafIndex: "17",
            txId
          }
        },
        source: restSource("seal", credentials, 136, 136)
      },
      {
        status: 404,
        when: "rest.seal.getCourierCredential.case.notFound",
        headers: ["Cache-Control: no-store"],
        json: {
          error: "NOT_FOUND",
          message: "no such credential",
          traceId
        },
        source: restSource("seal", credentials, 128, 134)
      }
    ],
    source: restSource("seal", credentials, 119, 137)
  },
  {
    id: "seal.holder",
    service: "seal",
    method: "GET",
    path: "/api/v1/seal/holder",
    summary: "rest.seal.holder.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.seal.holder.who"
    },
    request: {
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.seal.holder.case.found",
        headers: ["Cache-Control: no-cache"],
        json: {
          digest: holderDigest,
          entry: `/api/v1/seal/holder/${holderDigest}/index.html`,
          notices: `/api/v1/seal/holder/${holderDigest}/THIRD_PARTY_NOTICES.txt`
        },
        source: restSource("seal", holder, 24, 33)
      }
    ],
    source: restSource("seal", holder, 24, 33)
  },
  {
    id: "seal.holderFile",
    service: "seal",
    method: "GET",
    path: "/api/v1/seal/holder/{digest}/{file}",
    summary: "rest.seal.holderFile.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.seal.holderFile.who"
    },
    request: {
      fields: [
        {
          name: "digest",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.seal.holderFile.field.digest"
        },
        {
          name: "file",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.seal.holderFile.field.file"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.seal.holderFile.case.page",
        headers: [
          "Content-Type: text/html; charset=utf-8",
          `Content-Security-Policy: ${holderPolicy}`,
          "Cache-Control: public, max-age=31536000, immutable",
          "X-Content-Type-Options: nosniff"
        ],
        source: restSource("seal", holder, 45, 54)
      },
      {
        status: 200,
        when: "rest.seal.holderFile.case.file",
        headers: [
          "Content-Type: application/wasm",
          "Cache-Control: public, max-age=31536000, immutable",
          "X-Content-Type-Options: nosniff"
        ],
        source: restSource("seal", holder, 49, 54)
      },
      {
        status: 404,
        when: "rest.seal.holderFile.case.notFound",
        headers: ["Cache-Control: no-store"],
        json: {
          error: "NOT_FOUND",
          message: "no such holder file",
          traceId
        },
        source: restSource("seal", holder, 38, 43)
      }
    ],
    source: restSource("seal", holder, 35, 55)
  },
  {
    id: "seal.registrySnapshot",
    service: "seal",
    method: "GET",
    path: "/api/v1/seal/registry/snapshot",
    summary: "rest.seal.registrySnapshot.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.seal.registrySnapshot.who"
    },
    request: {
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.seal.registrySnapshot.case.read",
        headers: ["Cache-Control: public, max-age=60"],
        json: {
          generation: 1,
          networkId: "preprod",
          contractAddress,
          contractState: "0c0c0c0c0c0c0c0c",
          zswapChainState: "0d0d0d0d0d0d0d0d",
          ledgerParameters: "0e0e0e0e0e0e0e0e",
          readAt: "2026-11-03T03:00:00.000Z"
        },
        source: restSource("seal", snapshot, 54, 57)
      },
      {
        status: 503,
        when: "rest.seal.registrySnapshot.case.unavailable",
        headers: ["Cache-Control: no-store", "Retry-After: 60"],
        json: {
          error: "REGISTRY_UNAVAILABLE",
          message: "the registry cannot be read now; try again later",
          traceId
        },
        source: restSource("seal", snapshot, 46, 52)
      }
    ],
    source: restSource("seal", snapshot, 33, 58)
  },
  {
    id: "seal.relayPresentation",
    service: "seal",
    method: "POST",
    path: "/api/v1/seal/presentations",
    summary: "rest.seal.relayPresentation.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.seal.relayPresentation.who"
    },
    request: {
      fields: [
        {
          name: "transaction",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.seal.relayPresentation.field.transaction"
        }
      ],
      json: {
        transaction: "0f0f0f0f0f0f0f0f"
      }
    },
    cases: [
      {
        status: 202,
        when: "rest.seal.relayPresentation.case.relayed",
        headers: ["Cache-Control: no-store"],
        json: {
          txId
        },
        source: restSource("seal", presentations, 85, 86)
      },
      {
        status: 400,
        when: "rest.seal.relayPresentation.case.invalid",
        headers: ["Cache-Control: no-store"],
        json: {
          error: "INVALID_REQUEST",
          message: "the body must be { transaction }, the bound transaction in hex",
          traceId
        },
        source: restSource("seal", presentations, 76, 80)
      },
      {
        status: 422,
        when: "rest.seal.relayPresentation.case.notPresentation",
        headers: ["Cache-Control: no-store"],
        json: {
          error: "NOT_A_PRESENTATION",
          message: "the call is not to the active registry",
          traceId
        },
        source: restSource("seal", presentations, 87, 88)
      },
      {
        status: 503,
        when: "rest.seal.relayPresentation.case.noRegistry",
        headers: ["Cache-Control: no-store", "Retry-After: 30"],
        json: {
          error: "REGISTRY_UNAVAILABLE",
          message: "no registry is active now; try again later",
          traceId
        },
        source: restSource("seal", presentations, 89, 93)
      },
      {
        status: 503,
        when: "rest.seal.relayPresentation.case.sponsorUnavailable",
        headers: ["Cache-Control: no-store", "Retry-After: 30"],
        json: {
          error: "SPONSOR_UNAVAILABLE",
          message: "the presentation cannot be sent now; try again later",
          traceId
        },
        source: restSource("seal", presentations, 94, 104)
      }
    ],
    source: restSource("seal", presentations, 71, 106)
  },
  {
    id: "seal.presentationStatus",
    service: "seal",
    method: "GET",
    path: "/api/v1/seal/presentations/{challenge}",
    summary: "rest.seal.presentationStatus.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.seal.presentationStatus.who"
    },
    request: {
      fields: [
        {
          name: "challenge",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.seal.presentationStatus.field.challenge"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.seal.presentationStatus.case.answered",
        headers: ["Cache-Control: no-store"],
        json: {
          status: "answered",
          predicateId: rowId,
          generation: 1
        },
        source: restSource("seal", presentations, 64, 68)
      },
      {
        status: 200,
        when: "rest.seal.presentationStatus.case.unanswered",
        headers: ["Cache-Control: no-store"],
        json: {
          status: "unanswered",
          predicateId: null,
          generation: 1
        },
        source: restSource("seal", presentations, 64, 68)
      },
      {
        status: 400,
        when: "rest.seal.presentationStatus.case.invalid",
        headers: ["Cache-Control: no-store"],
        json: {
          error: "INVALID_REQUEST",
          message: "a challenge is 32 bytes in lowercase hex",
          traceId
        },
        source: restSource("seal", presentations, 41, 43)
      },
      {
        status: 503,
        when: "rest.seal.presentationStatus.case.unavailable",
        headers: ["Cache-Control: no-store", "Retry-After: 30"],
        json: {
          error: "REGISTRY_UNAVAILABLE",
          message: "the registry cannot be read now; try again later",
          traceId
        },
        source: restSource("seal", presentations, 57, 62)
      }
    ],
    source: restSource("seal", presentations, 36, 69)
  }
];
