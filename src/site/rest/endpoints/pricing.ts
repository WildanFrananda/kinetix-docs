import type { JsonValue } from "../../types/json_value.type";
import type { RestCase } from "../../types/rest_case.type";
import type { RestEndpoint } from "../../types/rest_endpoint.type";
import { restSource } from "../rest_source";

const traceId: string = "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b";
const merchant: string = "3f6c1a2e-9b4d-4e7a-8c5f-2d1e0b9a8c7d";
const idempotencyKey: string = "Idempotency-Key: 11111111-2222-4333-8444-555555555555";
const replayed: string = "Idempotent-Replayed: true";
const createdAt: string = "2026-10-22T03:15:00.482913Z";

function refusal(error: string, message: string): JsonValue {
  return {
    error: error,
    message: message,
    traceId: traceId
  };
}

const discount: JsonValue = {
  id: "8e2b4c6d-1f3a-4b5c-9d7e-0a1b2c3d4e5f",
  title: "Diskon Sepatu Lari 15%",
  discount_type: "PERCENTAGE",
  value: "15.00",
  target_product_id: "SHOES-RUN-42",
  target_category_id: null,
  active: true,
  start_time: "2026-11-01T00:00:00Z",
  end_time: "2026-11-11T16:59:59Z",
  created_at: createdAt,
  updated_at: createdAt,
  merchant_principal_id: merchant
};

const voucher: JsonValue = {
  id: "c4d5e6f7-0a1b-4c2d-8e3f-5a6b7c8d9e0f",
  code: "HARBOLNAS25",
  title: "Potongan Rp25.000 Harbolnas",
  discount_type: "FIXED",
  value: "25000.00",
  min_spend: "150000.00",
  max_discount: null,
  quota: 500,
  used_count: 0,
  active: true,
  expires_at: "2026-12-12T16:59:59Z",
  created_at: createdAt,
  updated_at: createdAt,
  merchant_principal_id: merchant
};

const usedVoucher: JsonValue = {
  id: "c4d5e6f7-0a1b-4c2d-8e3f-5a6b7c8d9e0f",
  code: "HARBOLNAS25",
  title: "Potongan Rp25.000 Harbolnas",
  discount_type: "FIXED",
  value: "25000.00",
  min_spend: "150000.00",
  max_discount: null,
  quota: 500,
  used_count: 137,
  active: true,
  expires_at: "2026-12-12T16:59:59Z",
  created_at: createdAt,
  updated_at: "2026-11-02T05:21:44.067390Z",
  merchant_principal_id: merchant
};

const publicVoucher: JsonValue = {
  code: "HARBOLNAS25",
  title: "Potongan Rp25.000 Harbolnas",
  discount_type: "FIXED",
  value: "25000.00",
  min_spend: "150000.00",
  max_discount: null,
  expires_at: "2026-12-12T16:59:59Z",
  merchant_principal_id: merchant
};

const flashSale: JsonValue = {
  id: "5a7b9c1d-3e5f-4a6b-8c9d-0e1f2a3b4c5d",
  title: "Flash Sale 11.11 Sepatu Lari",
  product_id: "SHOES-RUN-42",
  flash_price: "349000.00",
  stock_limit: 50,
  stock_sold: 0,
  active: true,
  start_time: "2026-11-11T02:00:00Z",
  end_time: "2026-11-11T04:00:00Z",
  created_at: createdAt,
  updated_at: createdAt,
  merchant_principal_id: merchant
};

const keyRequired: JsonValue = refusal(
  "IDEMPOTENCY_KEY_REQUIRED",
  "a create needs an Idempotency-Key header naming this one promotion. A retry sends the same key and gets back what the first attempt created."
);
const keyTooLong: JsonValue = refusal("IDEMPOTENCY_KEY_TOO_LONG", "an Idempotency-Key is at most 255 characters.");
const wrongRole: JsonValue = refusal("FORBIDDEN", "this endpoint needs the admin or seller role.");
const noMerchant: JsonValue = refusal("FORBIDDEN", "identity knows no merchant for this account");
const notTrading: JsonValue = refusal("FORBIDDEN", "identity does not permit this merchant to trade");
const notYours: JsonValue = refusal("FORBIDDEN", "product SHOES-RUN-42 belongs to another merchant");
const noProduct: JsonValue = refusal("NOT_FOUND", "catalog has no product SHOES-RUN-42");
const keyReused: JsonValue = refusal(
  "UNPROCESSABLE",
  "this Idempotency-Key was already used for a different request; send a new key to create another promotion"
);

export const pricingAnswers: readonly RestCase[] = [
  {
    status: 400,
    when: "rest.pricing.answers.invalidJson",
    json: refusal("INVALID_JSON", "the body is not valid JSON: EOF while parsing a value at line 1 column 0"),
    source: restSource("pricing", "src/guards/json_body.rs", 38, 72)
  },
  {
    status: 401,
    when: "rest.pricing.answers.unauthorized",
    json: refusal("UNAUTHORIZED", "this endpoint needs a valid identity access token."),
    source: restSource("pricing", "src/guards/bearer.rs", 47, 52)
  },
  {
    status: 404,
    when: "rest.pricing.answers.notFound",
    json: refusal("NOT_FOUND", "no endpoint of this service serves that path."),
    source: restSource("pricing", "src/routes/catchers.rs", 11, 23)
  },
  {
    status: 405,
    when: "rest.pricing.answers.methodNotAllowed",
    headers: ["Allow: GET, HEAD, POST"],
    json: refusal("METHOD_NOT_ALLOWED", "this path does not take DELETE; it takes GET, HEAD, POST."),
    source: restSource("pricing", "src/routes/method_not_allowed.rs", 16, 35)
  },
  {
    status: 413,
    when: "rest.pricing.answers.tooLarge",
    json: refusal("PAYLOAD_TOO_LARGE", "the body is larger than the 1MiB this endpoint reads"),
    source: restSource("pricing", "src/guards/json_body.rs", 27, 37)
  },
  {
    status: 500,
    when: "rest.pricing.answers.internal",
    json: refusal(
      "INTERNAL_ERROR",
      "something went wrong handling this request. No voucher, discount or quota was changed unless a previous response said so."
    ),
    source: restSource("pricing", "src/error.rs", 76, 88)
  },
  {
    status: 503,
    when: "rest.pricing.answers.database",
    json: refusal(
      "DATABASE_UNAVAILABLE",
      "pricing cannot reach its database right now. Nothing was changed; try again."
    ),
    source: restSource("pricing", "src/error.rs", 89, 100)
  },
  {
    status: 503,
    when: "rest.pricing.answers.identityKeys",
    json: refusal(
      "IDENTITY_UNAVAILABLE",
      "pricing cannot check the access token because identity's signing keys cannot be fetched right now. Nothing was changed; try again."
    ),
    source: restSource("pricing", "src/guards/bearer.rs", 53, 56)
  },
  {
    status: 503,
    when: "rest.pricing.answers.dependency",
    json: refusal(
      "UPSTREAM_UNAVAILABLE",
      "pricing depends on a service that is not answering right now. Nothing was changed; try again."
    ),
    source: restSource("pricing", "src/error.rs", 107, 119)
  }
];

export const pricingEndpoints: readonly RestEndpoint[] = [
  {
    id: "pricing.createDiscount",
    service: "pricing",
    method: "POST",
    path: "/api/v1/pricing/discounts",
    summary: "rest.pricing.createDiscount.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.pricing.createDiscount.who"
    },
    request: {
      target: "/api/v1/pricing/discounts",
      fields: [
        {
          name: "Idempotency-Key",
          in: "header",
          type: "string",
          required: true,
          rule: "rest.pricing.createDiscount.field.idempotencyKey"
        },
        {
          name: "title",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.pricing.createDiscount.field.title"
        },
        {
          name: "discount_type",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.pricing.createDiscount.field.discountType"
        },
        {
          name: "value",
          in: "body",
          type: "string (decimal)",
          required: true,
          rule: "rest.pricing.createDiscount.field.value"
        },
        {
          name: "target_product_id",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.pricing.createDiscount.field.targetProductId"
        },
        {
          name: "target_category_id",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.pricing.createDiscount.field.targetCategoryId"
        },
        {
          name: "start_time",
          in: "body",
          type: "string (ISO 8601 date-time)",
          required: true,
          rule: "rest.pricing.createDiscount.field.startTime"
        },
        {
          name: "end_time",
          in: "body",
          type: "string (ISO 8601 date-time)",
          required: true,
          rule: "rest.pricing.createDiscount.field.endTime"
        }
      ],
      headers: [idempotencyKey],
      json: {
        title: "Diskon Sepatu Lari 15%",
        discount_type: "PERCENTAGE",
        value: "15",
        target_product_id: "SHOES-RUN-42",
        start_time: "2026-11-01T00:00:00Z",
        end_time: "2026-11-11T16:59:59Z"
      }
    },
    cases: [
      {
        status: 201,
        when: "rest.pricing.createDiscount.case.created",
        json: discount,
        source: restSource("pricing", "src/routes/discount_routes.rs", 32, 40)
      },
      {
        status: 201,
        when: "rest.pricing.createDiscount.case.replayed",
        headers: [replayed],
        json: discount,
        source: restSource("pricing", "src/repositories/discount_repository.rs", 58, 68)
      },
      {
        status: 400,
        when: "rest.pricing.createDiscount.case.keyMissing",
        json: keyRequired,
        source: restSource("pricing", "src/guards/idempotency_key.rs", 30, 36)
      },
      {
        status: 400,
        when: "rest.pricing.createDiscount.case.keyTooLong",
        json: keyTooLong,
        source: restSource("pricing", "src/guards/idempotency_key.rs", 37, 43)
      },
      {
        status: 400,
        when: "rest.pricing.createDiscount.case.terms",
        json: refusal("INVALID_REQUEST", "start_time must be before end_time"),
        source: restSource("pricing", "src/services/promotion_terms.rs", 46, 59)
      },
      {
        status: 403,
        when: "rest.pricing.createDiscount.case.role",
        json: wrongRole,
        source: restSource("pricing", "src/guards/admin_or_merchant_guard.rs", 27, 33)
      },
      {
        status: 403,
        when: "rest.pricing.createDiscount.case.noMerchant",
        json: noMerchant,
        source: restSource("pricing", "src/services/promotion_service.rs", 43, 45)
      },
      {
        status: 403,
        when: "rest.pricing.createDiscount.case.notTrading",
        json: notTrading,
        source: restSource("pricing", "src/services/promotion_service.rs", 47, 51)
      },
      {
        status: 403,
        when: "rest.pricing.createDiscount.case.notYours",
        json: notYours,
        source: restSource("pricing", "src/services/promotion_service.rs", 53, 61)
      },
      {
        status: 404,
        when: "rest.pricing.createDiscount.case.noProduct",
        json: noProduct,
        source: restSource("pricing", "src/services/promotion_service.rs", 117, 120)
      },
      {
        status: 422,
        when: "rest.pricing.createDiscount.case.invalidBody",
        json: refusal(
          "INVALID_BODY",
          "discount_type: unknown variant `PERCENT`, expected `PERCENTAGE` or `FIXED` at line 3 column 28"
        ),
        source: restSource("pricing", "src/guards/json_body.rs", 74, 83)
      },
      {
        status: 422,
        when: "rest.pricing.createDiscount.case.keyReused",
        json: keyReused,
        source: restSource("pricing", "src/repositories/promotion_creation_ledger.rs", 53, 59)
      }
    ],
    source: restSource("pricing", "src/routes/discount_routes.rs", 13, 41)
  },
  {
    id: "pricing.listDiscounts",
    service: "pricing",
    method: "GET",
    path: "/api/v1/pricing/discounts",
    summary: "rest.pricing.listDiscounts.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.pricing.listDiscounts.who"
    },
    request: {
      target: "/api/v1/pricing/discounts",
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.pricing.listDiscounts.case.listed",
        json: [
          {
            id: "a7c9e1f3-2b4d-4f6a-8c0e-1d3f5a7b9c2e",
            title: "Diskon Kaos Polos 20%",
            discount_type: "PERCENTAGE",
            value: "20.00",
            target_product_id: "TSHIRT-BASIC-M",
            target_category_id: null,
            active: true,
            start_time: "2026-10-20T00:00:00Z",
            end_time: "2026-10-31T16:59:59Z",
            created_at: "2026-10-19T08:42:11.204517Z",
            updated_at: "2026-10-19T08:42:11.204517Z",
            merchant_principal_id: merchant
          },
          {
            id: "d1e2f3a4-5b6c-4d7e-8f9a-0b1c2d3e4f5a",
            title: "Hemat Rp10.000 Alas Kaki",
            discount_type: "FIXED",
            value: "10000.00",
            target_product_id: null,
            target_category_id: "footwear",
            active: true,
            start_time: "2026-10-01T00:00:00Z",
            end_time: "2026-12-31T16:59:59Z",
            created_at: "2026-09-30T10:05:37.918266Z",
            updated_at: "2026-09-30T10:05:37.918266Z",
            merchant_principal_id: null
          }
        ],
        source: restSource("pricing", "src/repositories/discount_repository.rs", 20, 33)
      }
    ],
    source: restSource("pricing", "src/routes/discount_routes.rs", 43, 48)
  },
  {
    id: "pricing.createVoucher",
    service: "pricing",
    method: "POST",
    path: "/api/v1/pricing/vouchers",
    summary: "rest.pricing.createVoucher.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.pricing.createVoucher.who"
    },
    request: {
      target: "/api/v1/pricing/vouchers",
      fields: [
        {
          name: "Idempotency-Key",
          in: "header",
          type: "string",
          required: true,
          rule: "rest.pricing.createVoucher.field.idempotencyKey"
        },
        {
          name: "code",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.pricing.createVoucher.field.code"
        },
        {
          name: "title",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.pricing.createVoucher.field.title"
        },
        {
          name: "discount_type",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.pricing.createVoucher.field.discountType"
        },
        {
          name: "value",
          in: "body",
          type: "string (decimal)",
          required: true,
          rule: "rest.pricing.createVoucher.field.value"
        },
        {
          name: "min_spend",
          in: "body",
          type: "string (decimal)",
          required: true,
          rule: "rest.pricing.createVoucher.field.minSpend"
        },
        {
          name: "max_discount",
          in: "body",
          type: "string (decimal)",
          required: false,
          rule: "rest.pricing.createVoucher.field.maxDiscount"
        },
        {
          name: "quota",
          in: "body",
          type: "integer",
          required: true,
          rule: "rest.pricing.createVoucher.field.quota"
        },
        {
          name: "expires_at",
          in: "body",
          type: "string (ISO 8601 date-time)",
          required: true,
          rule: "rest.pricing.createVoucher.field.expiresAt"
        }
      ],
      headers: [idempotencyKey],
      json: {
        code: "harbolnas25",
        title: "Potongan Rp25.000 Harbolnas",
        discount_type: "FIXED",
        value: "25000",
        min_spend: "150000",
        quota: 500,
        expires_at: "2026-12-12T16:59:59Z"
      }
    },
    cases: [
      {
        status: 201,
        when: "rest.pricing.createVoucher.case.created",
        json: voucher,
        source: restSource("pricing", "src/routes/voucher_routes.rs", 33, 41)
      },
      {
        status: 201,
        when: "rest.pricing.createVoucher.case.replayed",
        headers: [replayed],
        json: voucher,
        source: restSource("pricing", "src/repositories/voucher_repository.rs", 71, 81)
      },
      {
        status: 400,
        when: "rest.pricing.createVoucher.case.keyMissing",
        json: keyRequired,
        source: restSource("pricing", "src/guards/idempotency_key.rs", 30, 36)
      },
      {
        status: 400,
        when: "rest.pricing.createVoucher.case.keyTooLong",
        json: keyTooLong,
        source: restSource("pricing", "src/guards/idempotency_key.rs", 37, 43)
      },
      {
        status: 400,
        when: "rest.pricing.createVoucher.case.terms",
        json: refusal("INVALID_REQUEST", "max_discount must be greater than zero"),
        source: restSource("pricing", "src/services/promotion_terms.rs", 16, 44)
      },
      {
        status: 403,
        when: "rest.pricing.createVoucher.case.role",
        json: wrongRole,
        source: restSource("pricing", "src/guards/admin_or_merchant_guard.rs", 27, 33)
      },
      {
        status: 403,
        when: "rest.pricing.createVoucher.case.noMerchant",
        json: noMerchant,
        source: restSource("pricing", "src/services/promotion_service.rs", 43, 45)
      },
      {
        status: 403,
        when: "rest.pricing.createVoucher.case.notTrading",
        json: notTrading,
        source: restSource("pricing", "src/services/promotion_service.rs", 47, 51)
      },
      {
        status: 409,
        when: "rest.pricing.createVoucher.case.codeTaken",
        json: refusal(
          "CONFLICT",
          "a voucher with the code 'HARBOLNAS25' already exists; voucher codes are unique across every merchant"
        ),
        source: restSource("pricing", "src/repositories/voucher_repository.rs", 119, 130)
      },
      {
        status: 422,
        when: "rest.pricing.createVoucher.case.invalidBody",
        json: refusal("INVALID_BODY", 'quota: invalid type: string "500", expected i32 at line 7 column 16'),
        source: restSource("pricing", "src/guards/json_body.rs", 74, 83)
      },
      {
        status: 422,
        when: "rest.pricing.createVoucher.case.keyReused",
        json: keyReused,
        source: restSource("pricing", "src/repositories/promotion_creation_ledger.rs", 53, 59)
      }
    ],
    source: restSource("pricing", "src/routes/voucher_routes.rs", 17, 42)
  },
  {
    id: "pricing.applyVoucher",
    service: "pricing",
    method: "POST",
    path: "/api/v1/pricing/vouchers/apply",
    summary: "rest.pricing.applyVoucher.summary",
    access: {
      token: "optional",
      gatewayVerifies: false,
      who: "rest.pricing.applyVoucher.who"
    },
    request: {
      target: "/api/v1/pricing/vouchers/apply",
      fields: [
        {
          name: "code",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.pricing.applyVoucher.field.code"
        },
        {
          name: "cart_subtotal",
          in: "body",
          type: "string (decimal)",
          required: true,
          rule: "rest.pricing.applyVoucher.field.cartSubtotal"
        },
        {
          name: "merchant_principal_id",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.pricing.applyVoucher.field.merchantPrincipalId"
        }
      ],
      json: {
        code: "harbolnas25",
        cart_subtotal: "289000",
        merchant_principal_id: merchant
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.pricing.applyVoucher.case.buyerView",
        json: publicVoucher,
        source: restSource("pricing", "src/services/promotion_service.rs", 66, 76)
      },
      {
        status: 200,
        when: "rest.pricing.applyVoucher.case.ownerView",
        json: usedVoucher,
        source: restSource("pricing", "src/services/promotion_service.rs", 78, 104)
      },
      {
        status: 200,
        when: "rest.pricing.applyVoucher.case.none",
        json: null,
        source: restSource("pricing", "src/routes/voucher_routes.rs", 64, 78)
      },
      {
        status: 400,
        when: "rest.pricing.applyVoucher.case.blank",
        json: refusal("INVALID_REQUEST", "Voucher code cannot be blank"),
        source: restSource("pricing", "src/routes/voucher_routes.rs", 58, 62)
      },
      {
        status: 422,
        when: "rest.pricing.applyVoucher.case.invalidBody",
        json: refusal(
          "INVALID_BODY",
          'cart_subtotal: invalid value: string "Rp150.000", expected a Decimal type representing a fixed-point number at line 3 column 30'
        ),
        source: restSource("pricing", "src/guards/json_body.rs", 74, 83)
      }
    ],
    source: restSource("pricing", "src/routes/voucher_routes.rs", 44, 82)
  },
  {
    id: "pricing.getVoucher",
    service: "pricing",
    method: "GET",
    path: "/api/v1/pricing/vouchers/{code}",
    summary: "rest.pricing.getVoucher.summary",
    access: {
      token: "optional",
      gatewayVerifies: false,
      who: "rest.pricing.getVoucher.who"
    },
    request: {
      target: "/api/v1/pricing/vouchers/HARBOLNAS25",
      fields: [
        {
          name: "code",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.pricing.getVoucher.field.code"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.pricing.getVoucher.case.buyerView",
        json: publicVoucher,
        source: restSource("pricing", "src/services/promotion_service.rs", 66, 76)
      },
      {
        status: 200,
        when: "rest.pricing.getVoucher.case.ownerView",
        json: usedVoucher,
        source: restSource("pricing", "src/services/promotion_service.rs", 78, 104)
      },
      {
        status: 404,
        when: "rest.pricing.getVoucher.case.notFound",
        json: refusal("NOT_FOUND", "Voucher 'HARBOLNAS25' not found"),
        source: restSource("pricing", "src/routes/voucher_routes.rs", 91, 97)
      }
    ],
    source: restSource("pricing", "src/routes/voucher_routes.rs", 84, 101)
  },
  {
    id: "pricing.createFlashSale",
    service: "pricing",
    method: "POST",
    path: "/api/v1/pricing/flash-sales",
    summary: "rest.pricing.createFlashSale.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.pricing.createFlashSale.who"
    },
    request: {
      target: "/api/v1/pricing/flash-sales",
      fields: [
        {
          name: "Idempotency-Key",
          in: "header",
          type: "string",
          required: true,
          rule: "rest.pricing.createFlashSale.field.idempotencyKey"
        },
        {
          name: "title",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.pricing.createFlashSale.field.title"
        },
        {
          name: "product_id",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.pricing.createFlashSale.field.productId"
        },
        {
          name: "flash_price",
          in: "body",
          type: "string (decimal)",
          required: true,
          rule: "rest.pricing.createFlashSale.field.flashPrice"
        },
        {
          name: "stock_limit",
          in: "body",
          type: "integer",
          required: true,
          rule: "rest.pricing.createFlashSale.field.stockLimit"
        },
        {
          name: "start_time",
          in: "body",
          type: "string (ISO 8601 date-time)",
          required: true,
          rule: "rest.pricing.createFlashSale.field.startTime"
        },
        {
          name: "end_time",
          in: "body",
          type: "string (ISO 8601 date-time)",
          required: true,
          rule: "rest.pricing.createFlashSale.field.endTime"
        }
      ],
      headers: [idempotencyKey],
      json: {
        title: "Flash Sale 11.11 Sepatu Lari",
        product_id: "SHOES-RUN-42",
        flash_price: "349000",
        stock_limit: 50,
        start_time: "2026-11-11T02:00:00Z",
        end_time: "2026-11-11T04:00:00Z"
      }
    },
    cases: [
      {
        status: 201,
        when: "rest.pricing.createFlashSale.case.created",
        json: flashSale,
        source: restSource("pricing", "src/routes/flash_sale_routes.rs", 30, 38)
      },
      {
        status: 201,
        when: "rest.pricing.createFlashSale.case.replayed",
        headers: [replayed],
        json: flashSale,
        source: restSource("pricing", "src/repositories/flash_sale_repository.rs", 85, 95)
      },
      {
        status: 400,
        when: "rest.pricing.createFlashSale.case.keyMissing",
        json: keyRequired,
        source: restSource("pricing", "src/guards/idempotency_key.rs", 30, 36)
      },
      {
        status: 400,
        when: "rest.pricing.createFlashSale.case.keyTooLong",
        json: keyTooLong,
        source: restSource("pricing", "src/guards/idempotency_key.rs", 37, 43)
      },
      {
        status: 400,
        when: "rest.pricing.createFlashSale.case.terms",
        json: refusal("INVALID_REQUEST", "stock_limit must be at least 1"),
        source: restSource("pricing", "src/services/promotion_terms.rs", 61, 71)
      },
      {
        status: 403,
        when: "rest.pricing.createFlashSale.case.role",
        json: wrongRole,
        source: restSource("pricing", "src/guards/admin_or_merchant_guard.rs", 27, 33)
      },
      {
        status: 403,
        when: "rest.pricing.createFlashSale.case.noMerchant",
        json: noMerchant,
        source: restSource("pricing", "src/services/promotion_service.rs", 43, 45)
      },
      {
        status: 403,
        when: "rest.pricing.createFlashSale.case.notTrading",
        json: notTrading,
        source: restSource("pricing", "src/services/promotion_service.rs", 47, 51)
      },
      {
        status: 403,
        when: "rest.pricing.createFlashSale.case.notYours",
        json: notYours,
        source: restSource("pricing", "src/services/promotion_service.rs", 53, 61)
      },
      {
        status: 404,
        when: "rest.pricing.createFlashSale.case.noProduct",
        json: noProduct,
        source: restSource("pricing", "src/services/promotion_service.rs", 117, 120)
      },
      {
        status: 422,
        when: "rest.pricing.createFlashSale.case.invalidBody",
        json: refusal(
          "INVALID_BODY",
          "the body does not match this endpoint: missing field `stock_limit` at line 7 column 1"
        ),
        source: restSource("pricing", "src/guards/json_body.rs", 74, 83)
      },
      {
        status: 422,
        when: "rest.pricing.createFlashSale.case.keyReused",
        json: keyReused,
        source: restSource("pricing", "src/repositories/promotion_creation_ledger.rs", 53, 59)
      }
    ],
    source: restSource("pricing", "src/routes/flash_sale_routes.rs", 15, 39)
  },
  {
    id: "pricing.getFlashSale",
    service: "pricing",
    method: "GET",
    path: "/api/v1/pricing/flash-sales/{product_id}",
    summary: "rest.pricing.getFlashSale.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.pricing.getFlashSale.who"
    },
    request: {
      target: "/api/v1/pricing/flash-sales/SHOES-RUN-42",
      fields: [
        {
          name: "product_id",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.pricing.getFlashSale.field.productId"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.pricing.getFlashSale.case.onSale",
        json: {
          id: "5a7b9c1d-3e5f-4a6b-8c9d-0e1f2a3b4c5d",
          title: "Flash Sale 11.11 Sepatu Lari",
          product_id: "SHOES-RUN-42",
          flash_price: "349000.00",
          stock_limit: 50,
          stock_sold: 23,
          active: true,
          start_time: "2026-11-11T02:00:00Z",
          end_time: "2026-11-11T04:00:00Z",
          created_at: createdAt,
          updated_at: "2026-11-11T02:41:09.553820Z",
          merchant_principal_id: merchant
        },
        source: restSource("pricing", "src/repositories/flash_sale_repository.rs", 129, 144)
      },
      {
        status: 200,
        when: "rest.pricing.getFlashSale.case.none",
        json: null,
        source: restSource("pricing", "src/routes/flash_sale_routes.rs", 41, 51)
      }
    ],
    source: restSource("pricing", "src/routes/flash_sale_routes.rs", 41, 51)
  }
];
