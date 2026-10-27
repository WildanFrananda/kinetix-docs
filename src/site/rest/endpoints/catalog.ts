import type { RestCase } from "../../types/rest_case.type";
import type { RestEndpoint } from "../../types/rest_endpoint.type";
import { restSource } from "../rest_source";

export const catalogAnswers: readonly RestCase[] = [
  {
    status: 400,
    when: "rest.catalog.answers.parseError",
    json: {
      error: "PARSE_ERROR",
      message: "JSON parse error - Expecting ',' delimiter: line 1 column 23 (char 22)",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("catalog", "core/api/exception_handler.py", 125, 128)
  },
  {
    status: 400,
    when: "rest.catalog.answers.notAnObject",
    json: {
      error: "INVALID_INPUT",
      message: "must be a JSON object",
      field: "body",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("catalog", "core/api/request_body.py", 8, 13)
  },
  {
    status: 400,
    when: "rest.catalog.answers.tooManyFields",
    json: {
      error: "TOO_MANY_FIELDS",
      message: "this request carries more than 1000 query or form fields, so it was not read",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("catalog", "core/api/exception_handler.py", 106, 107)
  },
  {
    status: 401,
    when: "rest.catalog.answers.noToken",
    headers: ["WWW-Authenticate: Bearer"],
    json: {
      error: "NOT_AUTHENTICATED",
      message: "a verified access token is required",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("catalog", "core/api/caller.py", 7, 12)
  },
  {
    status: 401,
    when: "rest.catalog.answers.invalidToken",
    headers: ["WWW-Authenticate: Bearer"],
    json: {
      error: "AUTHENTICATION_FAILED",
      message: "Invalid token",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("catalog", "core/infrastructure/security/identity_token_authentication.py", 39, 54)
  },
  {
    status: 404,
    when: "rest.catalog.answers.unknownPath",
    json: {
      error: "NOT_FOUND",
      message: "nothing is served at this path",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("catalog", "core/api/error_handlers.py", 10, 11)
  },
  {
    status: 405,
    when: "rest.catalog.answers.methodNotAllowed",
    headers: ["Allow: GET, HEAD, OPTIONS"],
    json: {
      error: "METHOD_NOT_ALLOWED",
      message: "Method \"POST\" not allowed.",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("catalog", "core/api/exception_handler.py", 125, 128)
  },
  {
    status: 406,
    when: "rest.catalog.answers.notAcceptable",
    json: {
      error: "NOT_ACCEPTABLE",
      message: "Could not satisfy the request Accept header.",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("catalog", "core/api/exception_handler.py", 125, 128)
  },
  {
    status: 413,
    when: "rest.catalog.answers.bodyTooLarge",
    json: {
      error: "BODY_TOO_LARGE",
      message: "the request body is larger than 2621440 bytes, so it was not read",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("catalog", "core/api/exception_handler.py", 99, 104)
  },
  {
    status: 415,
    when: "rest.catalog.answers.unsupportedMediaType",
    json: {
      error: "UNSUPPORTED_MEDIA_TYPE",
      message: "Unsupported media type \"text/plain\" in request.",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("catalog", "core/api/exception_handler.py", 125, 128)
  },
  {
    status: 500,
    when: "rest.catalog.answers.internal",
    json: {
      error: "INTERNAL_ERROR",
      message: "something went wrong handling this request. No product or stock was changed unless a previous response said so.",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("catalog", "core/api/exception_handler.py", 56, 61)
  },
  {
    status: 503,
    when: "rest.catalog.answers.databaseUnavailable",
    headers: ["Retry-After: 15"],
    json: {
      error: "DATABASE_UNAVAILABLE",
      message: "the catalogue could not reach its database, so this request could not be answered. Try again shortly.",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("catalog", "core/api/exception_handler.py", 112, 122)
  },
  {
    status: 503,
    when: "rest.catalog.answers.keysUnavailable",
    json: {
      error: "IDENTITY_KEYS_UNAVAILABLE",
      message: "we could not verify this token right now because identity did not answer. The token was not rejected.",
      traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
    },
    source: restSource("catalog", "core/infrastructure/security/identity_token_authentication.py", 36, 51)
  }
];

export const catalogEndpoints: readonly RestEndpoint[] = [
  {
    id: "catalog.listProducts",
    service: "catalog",
    method: "GET",
    path: "/api/v1/products",
    summary: "rest.catalog.listProducts.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.catalog.listProducts.who"
    },
    request: {
      fields: [
        {
          name: "category",
          in: "query",
          type: "string",
          required: false,
          rule: "rest.catalog.listProducts.field.category"
        },
        {
          name: "q",
          in: "query",
          type: "string",
          required: false,
          rule: "rest.catalog.listProducts.field.q"
        },
        {
          name: "page",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.catalog.listProducts.field.page"
        },
        {
          name: "page_size",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.catalog.listProducts.field.page_size"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.catalog.listProducts.case.listed",
        json: {
          count: 5,
          page: 1,
          page_size: 2,
          results: [
            {
              id: 42,
              sku: "KAOS-HITAM-M",
              title: "Kaos Polos Hitam M",
              category: "Pakaian",
              category_slug: "pakaian",
              price: "89000.00",
              currency: "IDR",
              image_url: "https://images.example.com/kaos-hitam-m.jpg",
              merchant_principal_id: "3b2f8c1d-6e4a-4f7b-9c2d-5a1e8f0b7c3d",
              weight_grams: 250,
              available_stock: 12,
              is_in_stock: true,
              stock_status: "in_stock"
            },
            {
              id: 37,
              sku: "KAOS-POLO-PUTIH-L",
              title: "Kaos Polo Putih L",
              category: "Pakaian",
              category_slug: "pakaian",
              price: "125000.00",
              currency: "IDR",
              image_url: "",
              merchant_principal_id: "9d4e1a7b-2c5f-4e8a-b3d6-0f1c2a3b4c5d",
              weight_grams: null,
              available_stock: 0,
              is_in_stock: false,
              stock_status: "out_of_stock"
            }
          ]
        },
        source: restSource("catalog", "core/application/services/product_service.py", 63, 91)
      },
      {
        status: 200,
        when: "rest.catalog.listProducts.case.stockUnknown",
        json: {
          count: 5,
          page: 1,
          page_size: 2,
          results: [
            {
              id: 42,
              sku: "KAOS-HITAM-M",
              title: "Kaos Polos Hitam M",
              category: "Pakaian",
              category_slug: "pakaian",
              price: "89000.00",
              currency: "IDR",
              image_url: "https://images.example.com/kaos-hitam-m.jpg",
              merchant_principal_id: "3b2f8c1d-6e4a-4f7b-9c2d-5a1e8f0b7c3d",
              weight_grams: 250,
              available_stock: null,
              is_in_stock: null,
              stock_status: "unknown"
            },
            {
              id: 37,
              sku: "KAOS-POLO-PUTIH-L",
              title: "Kaos Polo Putih L",
              category: "Pakaian",
              category_slug: "pakaian",
              price: "125000.00",
              currency: "IDR",
              image_url: "",
              merchant_principal_id: "9d4e1a7b-2c5f-4e8a-b3d6-0f1c2a3b4c5d",
              weight_grams: null,
              available_stock: 0,
              is_in_stock: false,
              stock_status: "out_of_stock"
            }
          ]
        },
        source: restSource("catalog", "core/infrastructure/grpc/bin_stock_client.py", 81, 97)
      },
      {
        status: 400,
        when: "rest.catalog.listProducts.case.invalid",
        json: {
          error: "INVALID_INPUT",
          message: "must be at most 100",
          field: "page_size",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/application/services/product_filter_parser.py", 26, 47)
      }
    ],
    source: restSource("catalog", "core/api/views/product_collection_view.py", 13, 18)
  },
  {
    id: "catalog.listMyProducts",
    service: "catalog",
    method: "GET",
    path: "/api/v1/products/mine",
    summary: "rest.catalog.listMyProducts.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.catalog.listMyProducts.who"
    },
    request: {
      fields: [
        {
          name: "category",
          in: "query",
          type: "string",
          required: false,
          rule: "rest.catalog.listMyProducts.field.category"
        },
        {
          name: "q",
          in: "query",
          type: "string",
          required: false,
          rule: "rest.catalog.listMyProducts.field.q"
        },
        {
          name: "page",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.catalog.listMyProducts.field.page"
        },
        {
          name: "page_size",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.catalog.listMyProducts.field.page_size"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.catalog.listMyProducts.case.listed",
        json: {
          count: 14,
          page: 1,
          page_size: 2,
          results: [
            {
              id: 42,
              sku: "KAOS-HITAM-M",
              title: "Kaos Polos Hitam M",
              description: "Kaos katun combed 30s, potongan reguler.",
              category: "Pakaian",
              category_slug: "pakaian",
              category_id: 3,
              price: "89000.00",
              currency: "IDR",
              image_url: "https://images.example.com/kaos-hitam-m.jpg",
              merchant_principal_id: "3b2f8c1d-6e4a-4f7b-9c2d-5a1e8f0b7c3d",
              weight_grams: 250,
              is_active: true
            },
            {
              id: 40,
              sku: "KAOS-HITAM-S",
              title: "Kaos Polos Hitam S",
              description: "",
              category: "Pakaian",
              category_slug: "pakaian",
              category_id: 3,
              price: "85000.00",
              currency: "IDR",
              image_url: "",
              merchant_principal_id: "3b2f8c1d-6e4a-4f7b-9c2d-5a1e8f0b7c3d",
              weight_grams: null,
              is_active: false
            }
          ]
        },
        source: restSource("catalog", "core/application/services/product_service.py", 93, 111)
      },
      {
        status: 400,
        when: "rest.catalog.listMyProducts.case.invalid",
        json: {
          error: "INVALID_INPUT",
          message: "must be a positive whole number",
          field: "page",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/application/services/product_filter_parser.py", 26, 47)
      },
      {
        status: 403,
        when: "rest.catalog.listMyProducts.case.notSeller",
        json: {
          error: "SELLER_REQUIRED",
          message: "only a seller account has products of its own",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/api/caller.py", 15, 20)
      }
    ],
    source: restSource("catalog", "core/api/views/merchant_product_collection_view.py", 15, 23)
  },
  {
    id: "catalog.getProduct",
    service: "catalog",
    method: "GET",
    path: "/api/v1/products/{sku}",
    summary: "rest.catalog.getProduct.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.catalog.getProduct.who"
    },
    request: {
      fields: [
        {
          name: "sku",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.catalog.getProduct.field.sku"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.catalog.getProduct.case.found",
        json: {
          id: 42,
          sku: "KAOS-HITAM-M",
          title: "Kaos Polos Hitam M",
          description: "Kaos katun combed 30s, potongan reguler.",
          category: "Pakaian",
          category_slug: "pakaian",
          price: "89000.00",
          currency: "IDR",
          image_url: "https://images.example.com/kaos-hitam-m.jpg",
          merchant_principal_id: "3b2f8c1d-6e4a-4f7b-9c2d-5a1e8f0b7c3d",
          weight_grams: 250,
          warehouse_stock: {
            sku: "KAOS-HITAM-M",
            bin_location: "A-01-03",
            available_quantity: 12,
            reserved_quantity: 3,
            stock_status: "in_stock"
          }
        },
        source: restSource("catalog", "core/application/services/product_service.py", 113, 146)
      },
      {
        status: 200,
        when: "rest.catalog.getProduct.case.stockUnknown",
        json: {
          id: 42,
          sku: "KAOS-HITAM-M",
          title: "Kaos Polos Hitam M",
          description: "Kaos katun combed 30s, potongan reguler.",
          category: "Pakaian",
          category_slug: "pakaian",
          price: "89000.00",
          currency: "IDR",
          image_url: "https://images.example.com/kaos-hitam-m.jpg",
          merchant_principal_id: "3b2f8c1d-6e4a-4f7b-9c2d-5a1e8f0b7c3d",
          weight_grams: 250,
          warehouse_stock: {
            sku: "KAOS-HITAM-M",
            bin_location: null,
            available_quantity: null,
            reserved_quantity: null,
            stock_status: "unknown"
          }
        },
        source: restSource("catalog", "core/infrastructure/grpc/bin_stock_client.py", 42, 55)
      },
      {
        status: 404,
        when: "rest.catalog.getProduct.case.notFound",
        json: {
          error: "PRODUCT_NOT_FOUND",
          message: "no product with this SKU is on sale",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/api/views/product_detail_view.py", 16, 17)
      }
    ],
    source: restSource("catalog", "core/api/views/product_detail_view.py", 13, 19)
  },
  {
    id: "catalog.createProduct",
    service: "catalog",
    method: "POST",
    path: "/api/v1/products/create",
    summary: "rest.catalog.createProduct.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.catalog.createProduct.who"
    },
    request: {
      fields: [
        {
          name: "sku",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.catalog.createProduct.field.sku"
        },
        {
          name: "title",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.catalog.createProduct.field.title"
        },
        {
          name: "description",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.catalog.createProduct.field.description"
        },
        {
          name: "price",
          in: "body",
          type: "string (decimal) or number",
          required: true,
          rule: "rest.catalog.createProduct.field.price"
        },
        {
          name: "currency",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.catalog.createProduct.field.currency"
        },
        {
          name: "image_url",
          in: "body",
          type: "string (URL)",
          required: false,
          rule: "rest.catalog.createProduct.field.image_url"
        },
        {
          name: "category_id",
          in: "body",
          type: "integer",
          required: true,
          rule: "rest.catalog.createProduct.field.category_id"
        },
        {
          name: "weight_grams",
          in: "body",
          type: "integer",
          required: true,
          rule: "rest.catalog.createProduct.field.weight_grams"
        }
      ],
      json: {
        sku: "KAOS-HITAM-M",
        title: "Kaos Polos Hitam M",
        description: "Kaos katun combed 30s, potongan reguler.",
        price: "89000.00",
        currency: "IDR",
        image_url: "https://images.example.com/kaos-hitam-m.jpg",
        category_id: 3,
        weight_grams: 250
      }
    },
    cases: [
      {
        status: 201,
        when: "rest.catalog.createProduct.case.created",
        json: {
          id: 42,
          sku: "KAOS-HITAM-M",
          title: "Kaos Polos Hitam M",
          description: "Kaos katun combed 30s, potongan reguler.",
          category: "Pakaian",
          category_slug: "pakaian",
          category_id: 3,
          price: "89000.00",
          currency: "IDR",
          image_url: "https://images.example.com/kaos-hitam-m.jpg",
          merchant_principal_id: "3b2f8c1d-6e4a-4f7b-9c2d-5a1e8f0b7c3d",
          weight_grams: 250,
          is_active: true
        },
        source: restSource("catalog", "core/api/views/product_create_view.py", 15, 22)
      },
      {
        status: 400,
        when: "rest.catalog.createProduct.case.invalid",
        json: {
          error: "INVALID_INPUT",
          message: "is required: shipping is priced by weight",
          field: "weight_grams",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/application/services/product_field_parser.py", 23, 112)
      },
      {
        status: 400,
        when: "rest.catalog.createProduct.case.unknownCategory",
        json: {
          error: "INVALID_INPUT",
          message: "no category 99",
          field: "category_id",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/application/services/product_service.py", 220, 224)
      },
      {
        status: 403,
        when: "rest.catalog.createProduct.case.notMerchant",
        json: {
          error: "MERCHANT_MAY_NOT_SELL",
          message: "identity knows no merchant for this account",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/application/services/product_service.py", 148, 151)
      },
      {
        status: 403,
        when: "rest.catalog.createProduct.case.mayNotSell",
        json: {
          error: "MERCHANT_MAY_NOT_SELL",
          message: "identity does not permit this merchant to trade (standing: pending)",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/application/services/product_service.py", 153, 157)
      },
      {
        status: 409,
        when: "rest.catalog.createProduct.case.skuTaken",
        json: {
          error: "SKU_TAKEN",
          message: "another product already uses the SKU KAOS-HITAM-M",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/infrastructure/repositories/django_product_repository.py", 202, 205)
      },
      {
        status: 503,
        when: "rest.catalog.createProduct.case.identityUnavailable",
        headers: ["Retry-After: 15"],
        json: {
          error: "IDENTITY_UNAVAILABLE",
          message: "we could not check this merchant account right now, so the request was not applied. Nothing was created, changed or deleted.",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/api/exception_handler.py", 89, 94)
      }
    ],
    source: restSource("catalog", "core/api/views/product_create_view.py", 14, 22)
  },
  {
    id: "catalog.updateProduct",
    service: "catalog",
    method: "PUT",
    path: "/api/v1/products/manage/{id}",
    summary: "rest.catalog.updateProduct.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.catalog.updateProduct.who"
    },
    request: {
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.catalog.updateProduct.field.id"
        },
        {
          name: "sku",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.catalog.updateProduct.field.sku"
        },
        {
          name: "title",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.catalog.updateProduct.field.title"
        },
        {
          name: "description",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.catalog.updateProduct.field.description"
        },
        {
          name: "price",
          in: "body",
          type: "string (decimal) or number",
          required: false,
          rule: "rest.catalog.updateProduct.field.price"
        },
        {
          name: "currency",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.catalog.updateProduct.field.currency"
        },
        {
          name: "image_url",
          in: "body",
          type: "string (URL)",
          required: false,
          rule: "rest.catalog.updateProduct.field.image_url"
        },
        {
          name: "category_id",
          in: "body",
          type: "integer",
          required: false,
          rule: "rest.catalog.updateProduct.field.category_id"
        },
        {
          name: "is_active",
          in: "body",
          type: "boolean",
          required: false,
          rule: "rest.catalog.updateProduct.field.is_active"
        },
        {
          name: "weight_grams",
          in: "body",
          type: "integer",
          required: false,
          rule: "rest.catalog.updateProduct.field.weight_grams"
        }
      ],
      json: {
        price: "79000.00",
        weight_grams: 260
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.catalog.updateProduct.case.updated",
        json: {
          id: 42,
          sku: "KAOS-HITAM-M",
          title: "Kaos Polos Hitam M",
          description: "Kaos katun combed 30s, potongan reguler.",
          category: "Pakaian",
          category_slug: "pakaian",
          category_id: 3,
          price: "79000.00",
          currency: "IDR",
          image_url: "https://images.example.com/kaos-hitam-m.jpg",
          merchant_principal_id: "3b2f8c1d-6e4a-4f7b-9c2d-5a1e8f0b7c3d",
          weight_grams: 260,
          is_active: true
        },
        source: restSource("catalog", "core/application/services/product_service.py", 179, 206)
      },
      {
        status: 400,
        when: "rest.catalog.updateProduct.case.invalid",
        json: {
          error: "INVALID_INPUT",
          message: "must be at most 9999999999.99",
          field: "price",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/application/services/product_field_parser.py", 120, 133)
      },
      {
        status: 400,
        when: "rest.catalog.updateProduct.case.unknownCategory",
        json: {
          error: "INVALID_INPUT",
          message: "no category 99",
          field: "category_id",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/application/services/product_service.py", 220, 224)
      },
      {
        status: 400,
        when: "rest.catalog.updateProduct.case.skuChanged",
        json: {
          error: "INVALID_INPUT",
          message: "cannot change once the product exists; a new SKU is a new product",
          field: "sku",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/application/services/product_service.py", 191, 192)
      },
      {
        status: 403,
        when: "rest.catalog.updateProduct.case.notMerchant",
        json: {
          error: "MERCHANT_MAY_NOT_SELL",
          message: "identity knows no merchant for this account",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/application/services/product_service.py", 148, 151)
      },
      {
        status: 403,
        when: "rest.catalog.updateProduct.case.mayNotSell",
        json: {
          error: "MERCHANT_MAY_NOT_SELL",
          message: "identity does not permit this merchant to trade (standing: suspended)",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/application/services/product_service.py", 153, 157)
      },
      {
        status: 403,
        when: "rest.catalog.updateProduct.case.notOwner",
        json: {
          error: "NOT_PRODUCT_OWNER",
          message: "Product does not belong to this merchant",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/application/services/product_service.py", 188, 189)
      },
      {
        status: 404,
        when: "rest.catalog.updateProduct.case.notFound",
        json: {
          error: "PRODUCT_NOT_FOUND",
          message: "no product with this id",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/api/views/product_manage_view.py", 25, 26)
      },
      {
        status: 503,
        when: "rest.catalog.updateProduct.case.identityUnavailable",
        headers: ["Retry-After: 15"],
        json: {
          error: "IDENTITY_UNAVAILABLE",
          message: "we could not check this merchant account right now, so the request was not applied. Nothing was created, changed or deleted.",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/api/exception_handler.py", 89, 94)
      }
    ],
    source: restSource("catalog", "core/api/views/product_manage_view.py", 18, 28)
  },
  {
    id: "catalog.deleteProduct",
    service: "catalog",
    method: "DELETE",
    path: "/api/v1/products/manage/{id}",
    summary: "rest.catalog.deleteProduct.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.catalog.deleteProduct.who"
    },
    request: {
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.catalog.deleteProduct.field.id"
        }
      ]
    },
    cases: [
      {
        status: 204,
        when: "rest.catalog.deleteProduct.case.withdrawn",
        source: restSource("catalog", "core/infrastructure/repositories/django_product_repository.py", 208, 212)
      },
      {
        status: 403,
        when: "rest.catalog.deleteProduct.case.notMerchant",
        json: {
          error: "MERCHANT_MAY_NOT_SELL",
          message: "identity knows no merchant for this account",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/application/services/product_service.py", 148, 151)
      },
      {
        status: 403,
        when: "rest.catalog.deleteProduct.case.mayNotSell",
        json: {
          error: "MERCHANT_MAY_NOT_SELL",
          message: "identity does not permit this merchant to trade (standing: closed)",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/application/services/product_service.py", 153, 157)
      },
      {
        status: 403,
        when: "rest.catalog.deleteProduct.case.notOwner",
        json: {
          error: "NOT_PRODUCT_OWNER",
          message: "Product does not belong to this merchant",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/application/services/product_service.py", 215, 216)
      },
      {
        status: 404,
        when: "rest.catalog.deleteProduct.case.notFound",
        json: {
          error: "PRODUCT_NOT_FOUND",
          message: "no product with this id",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/api/views/product_manage_view.py", 36, 37)
      },
      {
        status: 503,
        when: "rest.catalog.deleteProduct.case.identityUnavailable",
        headers: ["Retry-After: 15"],
        json: {
          error: "IDENTITY_UNAVAILABLE",
          message: "we could not check this merchant account right now, so the request was not applied. Nothing was created, changed or deleted.",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/api/exception_handler.py", 89, 94)
      }
    ],
    source: restSource("catalog", "core/api/views/product_manage_view.py", 30, 39)
  },
  {
    id: "catalog.listCategories",
    service: "catalog",
    method: "GET",
    path: "/api/v1/categories",
    summary: "rest.catalog.listCategories.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.catalog.listCategories.who"
    },
    request: {
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.catalog.listCategories.case.listed",
        json: [
          {
            id: 3,
            name: "Pakaian",
            slug: "pakaian"
          },
          {
            id: 4,
            name: "Aksesori",
            slug: "aksesori"
          }
        ],
        source: restSource("catalog", "core/api/views/category_collection_view.py", 16, 20)
      }
    ],
    source: restSource("catalog", "core/api/views/category_collection_view.py", 16, 20)
  },
  {
    id: "catalog.getCategory",
    service: "catalog",
    method: "GET",
    path: "/api/v1/categories/{id}",
    summary: "rest.catalog.getCategory.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.catalog.getCategory.who"
    },
    request: {
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.catalog.getCategory.field.id"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.catalog.getCategory.case.found",
        json: {
          id: 3,
          name: "Pakaian",
          slug: "pakaian"
        },
        source: restSource("catalog", "core/api/views/category_detail_view.py", 19, 24)
      },
      {
        status: 404,
        when: "rest.catalog.getCategory.case.notFound",
        json: {
          error: "CATEGORY_NOT_FOUND",
          message: "no category with this id",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/api/views/category_detail_view.py", 21, 22)
      }
    ],
    source: restSource("catalog", "core/api/views/category_detail_view.py", 19, 24)
  },
  {
    id: "catalog.createCategory",
    service: "catalog",
    method: "POST",
    path: "/api/v1/categories",
    summary: "rest.catalog.createCategory.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.catalog.createCategory.who"
    },
    request: {
      fields: [
        {
          name: "name",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.catalog.createCategory.field.name"
        },
        {
          name: "slug",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.catalog.createCategory.field.slug"
        }
      ],
      json: {
        name: "Pakaian",
        slug: "pakaian"
      }
    },
    cases: [
      {
        status: 201,
        when: "rest.catalog.createCategory.case.created",
        json: {
          id: 3,
          name: "Pakaian",
          slug: "pakaian"
        },
        source: restSource("catalog", "core/api/views/category_collection_view.py", 22, 27)
      },
      {
        status: 400,
        when: "rest.catalog.createCategory.case.invalid",
        json: {
          error: "INVALID_INPUT",
          message: "must be 1 to 128 letters, digits, hyphens or underscores",
          field: "slug",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/application/services/category_service.py", 37, 58)
      },
      {
        status: 403,
        when: "rest.catalog.createCategory.case.notAdmin",
        json: {
          error: "ADMIN_REQUIRED",
          message: "this account may not manage categories",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/api/caller.py", 23, 28)
      },
      {
        status: 409,
        when: "rest.catalog.createCategory.case.taken",
        json: {
          error: "CATEGORY_TAKEN",
          message: "another category already uses the name Pakaian or the slug pakaian",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/infrastructure/repositories/django_product_repository.py", 235, 236)
      }
    ],
    source: restSource("catalog", "core/api/views/category_collection_view.py", 22, 27)
  },
  {
    id: "catalog.updateCategory",
    service: "catalog",
    method: "PUT",
    path: "/api/v1/categories/{id}",
    summary: "rest.catalog.updateCategory.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.catalog.updateCategory.who"
    },
    request: {
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.catalog.updateCategory.field.id"
        },
        {
          name: "name",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.catalog.updateCategory.field.name"
        },
        {
          name: "slug",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.catalog.updateCategory.field.slug"
        }
      ],
      json: {
        name: "Pakaian Pria",
        slug: "pakaian-pria"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.catalog.updateCategory.case.updated",
        json: {
          id: 3,
          name: "Pakaian Pria",
          slug: "pakaian-pria"
        },
        source: restSource("catalog", "core/api/views/category_detail_view.py", 26, 37)
      },
      {
        status: 400,
        when: "rest.catalog.updateCategory.case.invalid",
        json: {
          error: "INVALID_INPUT",
          message: "is required",
          field: "slug",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/application/services/category_service.py", 24, 58)
      },
      {
        status: 403,
        when: "rest.catalog.updateCategory.case.notAdmin",
        json: {
          error: "ADMIN_REQUIRED",
          message: "this account may not manage categories",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/api/caller.py", 23, 28)
      },
      {
        status: 404,
        when: "rest.catalog.updateCategory.case.notFound",
        json: {
          error: "CATEGORY_NOT_FOUND",
          message: "no category with this id",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/api/views/category_detail_view.py", 34, 35)
      },
      {
        status: 409,
        when: "rest.catalog.updateCategory.case.taken",
        json: {
          error: "CATEGORY_TAKEN",
          message: "another category already uses the name Pakaian Pria or the slug pakaian-pria",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/infrastructure/repositories/django_product_repository.py", 235, 236)
      }
    ],
    source: restSource("catalog", "core/api/views/category_detail_view.py", 26, 37)
  },
  {
    id: "catalog.deleteCategory",
    service: "catalog",
    method: "DELETE",
    path: "/api/v1/categories/{id}",
    summary: "rest.catalog.deleteCategory.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.catalog.deleteCategory.who"
    },
    request: {
      fields: [
        {
          name: "id",
          in: "path",
          type: "integer",
          required: true,
          rule: "rest.catalog.deleteCategory.field.id"
        }
      ]
    },
    cases: [
      {
        status: 204,
        when: "rest.catalog.deleteCategory.case.deleted",
        source: restSource("catalog", "core/api/views/category_detail_view.py", 39, 45)
      },
      {
        status: 403,
        when: "rest.catalog.deleteCategory.case.notAdmin",
        json: {
          error: "ADMIN_REQUIRED",
          message: "this account may not manage categories",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/api/caller.py", 23, 28)
      },
      {
        status: 404,
        when: "rest.catalog.deleteCategory.case.notFound",
        json: {
          error: "CATEGORY_NOT_FOUND",
          message: "no category with this id",
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/api/views/category_detail_view.py", 42, 43)
      },
      {
        status: 409,
        when: "rest.catalog.deleteCategory.case.inUse",
        json: {
          error: "CATEGORY_IN_USE",
          message: "category 4 still holds 12 product(s), active or withdrawn; move them to another category first",
          product_count: 12,
          traceId: "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b"
        },
        source: restSource("catalog", "core/infrastructure/repositories/django_product_repository.py", 239, 242)
      }
    ],
    source: restSource("catalog", "core/api/views/category_detail_view.py", 39, 45)
  }
];
