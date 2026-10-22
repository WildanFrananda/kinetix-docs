import type { RestCase } from "../../types/rest_case.type";
import type { RestEndpoint } from "../../types/rest_endpoint.type";
import { restSource } from "../rest_source";

export const searchAnswers: readonly RestCase[] = [
  {
    status: 404,
    when: "rest.search.answers.unknownPath",
    headers: ["X-Content-Type-Options: nosniff"],
    contentType: "text/plain; charset=utf-8",
    raw: "404 page not found",
    source: restSource("search", "internal/httpapi/router.go", 24, 30)
  },
  {
    status: 405,
    when: "rest.search.answers.methodNotAllowed",
    headers: ["Allow: GET"],
    source: restSource("search", "internal/httpapi/router.go", 24, 26)
  },
  {
    status: 503,
    when: "rest.search.answers.indexUnavailable",
    contentType: "application/json; charset=utf-8",
    json: {
      error: "index_unavailable"
    },
    source: restSource("search", "internal/typesense/errors.go", 27, 37)
  }
];

export const searchEndpoints: readonly RestEndpoint[] = [
  {
    id: "search.searchProducts",
    service: "search",
    method: "GET",
    path: "/api/v1/products/search",
    summary: "rest.search.searchProducts.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.search.searchProducts.who"
    },
    request: {
      target: "/api/v1/products/search?q=kaos%20hitam&category=pakaian&sort=price_asc&limit=24&offset=0",
      fields: [
        {
          name: "q",
          in: "query",
          type: "string",
          required: false,
          rule: "rest.search.searchProducts.field.q"
        },
        {
          name: "category",
          in: "query",
          type: "string, repeatable",
          required: false,
          rule: "rest.search.searchProducts.field.category"
        },
        {
          name: "sort",
          in: "query",
          type: "string",
          required: false,
          rule: "rest.search.searchProducts.field.sort"
        },
        {
          name: "limit",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.search.searchProducts.field.limit"
        },
        {
          name: "offset",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.search.searchProducts.field.offset"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.search.searchProducts.case.results",
        contentType: "application/json; charset=utf-8",
        json: {
          total: 2,
          hits: [
            {
              id: "KAOS-HITAM-M",
              merchant_id: "3b2f8c1d-6e4a-4f7b-9c2d-5a1e8f0b7c3d",
              title: "Kaos Polos Hitam M",
              description: "Kaos katun combed 30s, potongan reguler.",
              categories: ["pakaian"],
              price_minor: 8900000,
              currency: "IDR",
              updated_at_ms: 1792572000000,
              score: 578730123365187
            },
            {
              id: "KAOS-HITAM-XL",
              merchant_id: "9d4e1a7b-2c5f-4e8a-b3d6-0f1c2a3b4c5d",
              title: "Kaos Hitam Oversize XL",
              categories: ["pakaian"],
              price_minor: 11500000,
              currency: "IDR",
              updated_at_ms: 1792637880000,
              score: 578730123365187
            }
          ],
          facets: {
            categories: [
              {
                value: "pakaian",
                count: 2
              }
            ],
            currency: [
              {
                value: "IDR",
                count: 2
              }
            ],
            merchant_id: [
              {
                value: "3b2f8c1d-6e4a-4f7b-9c2d-5a1e8f0b7c3d",
                count: 1
              },
              {
                value: "9d4e1a7b-2c5f-4e8a-b3d6-0f1c2a3b4c5d",
                count: 1
              }
            ]
          },
          index: {
            indexed_through_ms: 1792637880000,
            age_seconds: 12,
            stale: false
          }
        },
        source: restSource("search", "internal/httpapi/wire.go", 48, 87)
      },
      {
        status: 200,
        when: "rest.search.searchProducts.case.stale",
        contentType: "application/json; charset=utf-8",
        json: {
          total: 1,
          hits: [
            {
              id: "KAOS-HITAM-M",
              merchant_id: "3b2f8c1d-6e4a-4f7b-9c2d-5a1e8f0b7c3d",
              title: "Kaos Polos Hitam M",
              description: "Kaos katun combed 30s, potongan reguler.",
              categories: ["pakaian"],
              price_minor: 8900000,
              currency: "IDR",
              updated_at_ms: 1792572000000,
              score: 578730123365187
            }
          ],
          facets: {
            categories: [
              {
                value: "pakaian",
                count: 1
              }
            ],
            currency: [
              {
                value: "IDR",
                count: 1
              }
            ],
            merchant_id: [
              {
                value: "3b2f8c1d-6e4a-4f7b-9c2d-5a1e8f0b7c3d",
                count: 1
              }
            ]
          },
          index: {
            indexed_through_ms: 1792572000000,
            age_seconds: 1260,
            stale: true
          }
        },
        source: restSource("search", "internal/querying/finder.go", 59, 72)
      },
      {
        status: 200,
        when: "rest.search.searchProducts.case.notSynced",
        contentType: "application/json; charset=utf-8",
        json: {
          total: 1,
          hits: [
            {
              id: "KAOS-HITAM-M",
              merchant_id: "3b2f8c1d-6e4a-4f7b-9c2d-5a1e8f0b7c3d",
              title: "Kaos Polos Hitam M",
              description: "Kaos katun combed 30s, potongan reguler.",
              categories: ["pakaian"],
              price_minor: 8900000,
              currency: "IDR",
              updated_at_ms: 1792572000000,
              score: 578730123365187
            }
          ],
          facets: {
            categories: [
              {
                value: "pakaian",
                count: 1
              }
            ],
            currency: [
              {
                value: "IDR",
                count: 1
              }
            ],
            merchant_id: [
              {
                value: "3b2f8c1d-6e4a-4f7b-9c2d-5a1e8f0b7c3d",
                count: 1
              }
            ]
          },
          index: {
            indexed_through_ms: null,
            age_seconds: null,
            stale: true
          }
        },
        source: restSource("search", "internal/httpapi/wire.go", 89, 103)
      },
      {
        status: 400,
        when: "rest.search.searchProducts.case.notANumber",
        contentType: "application/json; charset=utf-8",
        json: {
          error: "malformed_query"
        },
        source: restSource("search", "internal/httpapi/router.go", 112, 124)
      },
      {
        status: 400,
        when: "rest.search.searchProducts.case.invalid",
        contentType: "application/json; charset=utf-8",
        json: {
          error: "malformed_query"
        },
        source: restSource("search", "internal/search/query.go", 67, 146)
      },
      {
        status: 400,
        when: "rest.search.searchProducts.case.categoryNotExact",
        contentType: "application/json; charset=utf-8",
        json: {
          error: "malformed_query"
        },
        source: restSource("search", "internal/typesense/query.go", 10, 22)
      },
      {
        status: 400,
        when: "rest.search.searchProducts.case.refused",
        contentType: "application/json; charset=utf-8",
        json: {
          error: "malformed_query"
        },
        source: restSource("search", "internal/typesense/errors.go", 18, 37)
      },
      {
        status: 500,
        when: "rest.search.searchProducts.case.corruptRecord",
        contentType: "application/json; charset=utf-8",
        json: {
          error: "corrupt_record"
        },
        source: restSource("search", "internal/typesense/documents.go", 79, 88)
      },
      {
        status: 503,
        when: "rest.search.searchProducts.case.checkpointUnavailable",
        contentType: "application/json; charset=utf-8",
        json: {
          error: "dependency_unavailable"
        },
        source: restSource("search", "internal/postgres/checkpoint.go", 25, 39)
      }
    ],
    source: restSource("search", "internal/httpapi/router.go", 33, 66)
  },
  {
    id: "search.suggestProducts",
    service: "search",
    method: "GET",
    path: "/api/v1/products/suggest",
    summary: "rest.search.suggestProducts.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.search.suggestProducts.who"
    },
    request: {
      target: "/api/v1/products/suggest?q=kaos%20hi&limit=5",
      fields: [
        {
          name: "q",
          in: "query",
          type: "string",
          required: false,
          rule: "rest.search.suggestProducts.field.q"
        },
        {
          name: "limit",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.search.suggestProducts.field.limit"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.search.suggestProducts.case.suggestions",
        contentType: "application/json; charset=utf-8",
        json: {
          suggestions: [
            "Kaos Polos Hitam M",
            "Kaos Hitam Oversize XL",
            "Kaos Hiking Dry-Fit"
          ]
        },
        source: restSource("search", "internal/typesense/searcher.go", 121, 163)
      },
      {
        status: 200,
        when: "rest.search.suggestProducts.case.empty",
        contentType: "application/json; charset=utf-8",
        json: {
          suggestions: []
        },
        source: restSource("search", "internal/querying/finder.go", 84, 86)
      },
      {
        status: 400,
        when: "rest.search.suggestProducts.case.notANumber",
        contentType: "application/json; charset=utf-8",
        json: {
          error: "malformed_query"
        },
        source: restSource("search", "internal/httpapi/router.go", 112, 124)
      },
      {
        status: 400,
        when: "rest.search.suggestProducts.case.invalid",
        contentType: "application/json; charset=utf-8",
        json: {
          error: "malformed_query"
        },
        source: restSource("search", "internal/search/suggest_query.go", 10, 24)
      },
      {
        status: 400,
        when: "rest.search.suggestProducts.case.refused",
        contentType: "application/json; charset=utf-8",
        json: {
          error: "malformed_query"
        },
        source: restSource("search", "internal/typesense/errors.go", 18, 37)
      }
    ],
    source: restSource("search", "internal/httpapi/router.go", 68, 94)
  }
];
