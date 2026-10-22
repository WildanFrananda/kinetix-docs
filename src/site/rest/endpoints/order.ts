import type { RestCase } from "../../types/rest_case.type";
import type { RestEndpoint } from "../../types/rest_endpoint.type";
import { restSource } from "../rest_source";

const buyer = "4c2e8a71-5b3d-4f6e-9a1c-7d8e2f3b4a50";
const merchant = "a3d5f7b9-2c4e-4a6b-8d0f-1e3a5c7b9d21";
const courier = "e7b1c3d5-9f2a-4b6c-8e0d-3a5c7e9b1d42";
const orderId = "0b6d3c2e-8f1a-4c5d-9e2b-1a2b3c4d5e6f";
const orderNumber = "ORD-20261022-7F3A9C1B";
const requestId = "6f1c2b9e-3d4a-4f5e-8a7b-9c0d1e2f3a4b";
const traceContext = "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-00";

const cartUnavailable = {
  error: "CART_UNAVAILABLE",
  message: "your cart cannot be reached right now; nothing was changed. Try again shortly."
};

const cartBusy = {
  error: "CART_BUSY",
  message: "the cart changed under each of 10 attempts to edit it, so this edit was not applied; try again"
};

const coffeeLine = {
  productId: "KOPI-ARABIKA-250",
  productTitle: "Kopi Arabika Gayo 250 g",
  unitPrice: 85000,
  quantity: 2,
  categoryId: "kopi",
  merchantPrincipalId: merchant,
  lineTotal: 170000
};

const palmSugarLine = {
  productId: "GULA-AREN-500",
  productTitle: "Gula Aren Cair 500 ml",
  unitPrice: 32000,
  quantity: 1,
  categoryId: "pemanis",
  merchantPrincipalId: merchant,
  lineTotal: 32000
};

const shippingAddress = "Jl. Contoh Raya No. 12, Menteng, Jakarta Pusat 10310";

export const orderAnswers: readonly RestCase[] = [
  {
    status: 400,
    when: "rest.order.answers.unreadableBody",
    contentType: "application/problem+json",
    json: {
      type: "https://tools.ietf.org/html/rfc9110#section-15.5.1",
      title: "One or more validation errors occurred.",
      status: 400,
      errors: {
        request: ["The request field is required."],
        "$.quantity": [
          "The JSON value could not be converted to System.Int32. Path: $.quantity | LineNumber: 0 | BytePositionInLine: 48."
        ]
      },
      traceId: traceContext
    },
    source: restSource("order", "Program.cs", 307, 311)
  },
  {
    status: 400,
    when: "rest.order.answers.emptyBody",
    contentType: "application/problem+json",
    json: {
      type: "https://tools.ietf.org/html/rfc9110#section-15.5.1",
      title: "One or more validation errors occurred.",
      status: 400,
      errors: {
        "": ["A non-empty request body is required."],
        request: ["The request field is required."]
      },
      traceId: traceContext
    },
    source: restSource("order", "Program.cs", 307, 311)
  },
  {
    status: 401,
    when: "rest.order.answers.tokenMissing",
    headers: ["WWW-Authenticate: Bearer"],
    source: restSource("order", "Security/AccessTokenValidation.cs", 15, 18)
  },
  {
    status: 401,
    when: "rest.order.answers.tokenExpired",
    headers: [
      "WWW-Authenticate: Bearer error=\"invalid_token\", error_description=\"The token expired at '10/22/2026 03:15:00'\""
    ],
    source: restSource("order", "Security/AccessTokenValidation.cs", 27, 40)
  },
  {
    status: 401,
    when: "rest.order.answers.tokenInvalid",
    headers: [
      "WWW-Authenticate: Bearer error=\"invalid_token\", error_description=\"The signature key was not found\""
    ],
    source: restSource("order", "Security/AccessTokenValidation.cs", 27, 40)
  },
  {
    status: 401,
    when: "rest.order.answers.notAccessToken",
    headers: ["WWW-Authenticate: Bearer error=\"invalid_token\""],
    source: restSource("order", "Security/AccessTokenValidation.cs", 41, 48)
  },
  {
    status: 404,
    when: "rest.order.answers.unknownPath",
    source: restSource("order", "Program.cs", 390, 392)
  },
  {
    status: 405,
    when: "rest.order.answers.methodNotAllowed",
    headers: ["Allow: POST"],
    source: restSource("order", "Program.cs", 390, 392)
  },
  {
    status: 415,
    when: "rest.order.answers.unsupportedMediaType",
    contentType: "application/problem+json",
    json: {
      type: "https://tools.ietf.org/html/rfc9110#section-15.5.16",
      title: "Unsupported Media Type",
      status: 415,
      traceId: traceContext
    },
    source: restSource("order", "Program.cs", 307, 311)
  },
  {
    status: 500,
    when: "rest.order.answers.internal",
    json: {
      error: "INTERNAL_ERROR",
      message:
        "something went wrong handling this request, and whether any of it took effect is not known here. Check before repeating it; repeat a checkout only with the same Idempotency-Key, which cannot charge twice.",
      traceId: requestId
    },
    source: restSource("order", "Infrastructure/Http/UnhandledExceptionHandler.cs", 13, 36)
  },
  {
    status: 503,
    when: "rest.order.answers.keysUnavailable",
    json: {
      error: "IDENTITY_UNAVAILABLE",
      message:
        "your sign-in cannot be checked right now: identity's signing keys could not be fetched. Nothing was done; try again shortly."
    },
    source: restSource("order", "Security/AccessTokenValidation.cs", 49, 66)
  }
];

const cart = {
  customerPrincipalId: buyer,
  items: [coffeeLine, palmSugarLine],
  appliedVoucherCode: "HEMAT10",
  subtotal: 202000,
  updatedAt: "2026-10-22T03:15:07.4829137Z"
};

const placedOrder = {
  id: orderId,
  orderNumber,
  customerPrincipalId: buyer,
  merchantPrincipalId: merchant,
  driverPrincipalId: null,
  status: "PAID",
  subtotal: 202000,
  discountAmount: 20200,
  appliedVoucher: "HEMAT10",
  finalTotal: 193800,
  shippingAddress,
  shippingServiceTier: "KINETIX_REGULAR",
  baseShippingFee: 12000,
  shippingDiscount: 0,
  finalShippingFee: 12000,
  distanceKm: 7.42,
  shippingQuoteBasis: "DISTANCE_QUOTED",
  createdAt: "2026-10-22T03:15:07.4829137Z",
  items: [
    {
      id: "5e8a2c4f-7b1d-4e3a-9c6f-2d4b8e1a7c30",
      productId: "KOPI-ARABIKA-250",
      productTitle: "Kopi Arabika Gayo 250 g",
      unitPrice: 85000,
      quantity: 2,
      lineSubtotal: 170000
    },
    {
      id: "9c3e5a7b-1d2f-4b6e-8a0c-4e6a8c2e0b51",
      productId: "GULA-AREN-500",
      productTitle: "Gula Aren Cair 500 ml",
      unitPrice: 32000,
      quantity: 1,
      lineSubtotal: 32000
    }
  ]
};

const deliveredOrder = {
  ...placedOrder,
  driverPrincipalId: courier,
  status: "DELIVERED",
  createdAt: "2026-10-22T03:15:07.482913Z"
};

const fulfillingOrder = {
  ...placedOrder,
  status: "PROCESSING_FULFILLMENT",
  createdAt: "2026-10-22T03:15:07.482913Z"
};

const allStatuses = [
  "PENDING_PAYMENT",
  "PAID",
  "PROCESSING_FULFILLMENT",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED"
];

function queryInvalid(name: string, value: string): RestCase["json"] {
  return {
    type: "https://tools.ietf.org/html/rfc9110#section-15.5.1",
    title: "One or more validation errors occurred.",
    status: 400,
    errors: {
      [name]: [`The value '${value}' is not valid.`]
    },
    traceId: traceContext
  };
}

export const orderEndpoints: readonly RestEndpoint[] = [
  {
    id: "order.getCart",
    service: "order",
    method: "GET",
    path: "/api/v1/cart",
    summary: "rest.order.getCart.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.order.getCart.who"
    },
    request: {
      target: "/api/v1/cart",
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.order.getCart.case.cart",
        json: cart,
        source: restSource("order", "Application/Services/CartService.cs", 17, 20)
      },
      {
        status: 200,
        when: "rest.order.getCart.case.empty",
        json: {
          customerPrincipalId: buyer,
          items: [],
          appliedVoucherCode: null,
          subtotal: 0,
          updatedAt: "2026-10-22T03:15:07.4829137Z"
        },
        source: restSource("order", "Infrastructure/Redis/RedisCartStore.cs", 36, 41)
      },
      {
        status: 503,
        when: "rest.order.getCart.case.cartUnavailable",
        json: cartUnavailable,
        source: restSource("order", "Controllers/CartController.cs", 157, 166)
      }
    ],
    source: restSource("order", "Controllers/CartController.cs", 22, 29)
  },
  {
    id: "order.addCartItem",
    service: "order",
    method: "POST",
    path: "/api/v1/cart/items",
    summary: "rest.order.addCartItem.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.order.addCartItem.who"
    },
    request: {
      target: "/api/v1/cart/items",
      fields: [
        {
          name: "productId",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.order.addCartItem.field.productId"
        },
        {
          name: "quantity",
          in: "body",
          type: "integer",
          required: true,
          rule: "rest.order.addCartItem.field.quantity"
        }
      ],
      json: {
        productId: "KOPI-ARABIKA-250",
        quantity: 2
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.order.addCartItem.case.added",
        json: cart,
        source: restSource("order", "Application/Services/CartService.cs", 22, 62)
      },
      {
        status: 400,
        when: "rest.order.addCartItem.case.invalid",
        contentType: "application/problem+json",
        json: {
          type: "https://tools.ietf.org/html/rfc9110#section-15.5.1",
          title: "One or more validation errors occurred.",
          status: 400,
          errors: {
            ProductId: ["The ProductId field is required."]
          },
          traceId: traceContext
        },
        source: restSource("order", "DTOs/Requests/AddCartItemRequest.cs", 3, 6)
      },
      {
        status: 400,
        when: "rest.order.addCartItem.case.quantityOutOfRange",
        json: {
          error: "QUANTITY_OUT_OF_RANGE",
          productId: "KOPI-ARABIKA-250",
          quantity: 0,
          minQuantity: 1,
          maxQuantity: 999,
          message: "a quantity of 0 for 'KOPI-ARABIKA-250' is outside 1 to 999"
        },
        source: restSource("order", "Controllers/CartController.cs", 124, 132)
      },
      {
        status: 404,
        when: "rest.order.addCartItem.case.notInCatalog",
        json: {
          error: "PRODUCT_NOT_IN_CATALOG",
          productId: "KOPI-ARABIKA-250",
          message: "catalog has no product 'KOPI-ARABIKA-250', so there is no price to charge for it"
        },
        source: restSource("order", "Controllers/CartController.cs", 104, 105)
      },
      {
        status: 409,
        when: "rest.order.addCartItem.case.cartBusy",
        json: cartBusy,
        source: restSource("order", "Controllers/CartController.cs", 149, 150)
      },
      {
        status: 422,
        when: "rest.order.addCartItem.case.noUsablePrice",
        json: {
          error: "PRODUCT_HAS_NO_USABLE_PRICE",
          productId: "KOPI-ARABIKA-250",
          message: "catalog states no chargeable price for 'KOPI-ARABIKA-250': the product carries no price"
        },
        source: restSource("order", "Controllers/CartController.cs", 106, 111)
      },
      {
        status: 422,
        when: "rest.order.addCartItem.case.noMerchant",
        json: {
          error: "PRODUCT_HAS_NO_MERCHANT",
          productId: "KOPI-ARABIKA-250",
          message: "catalog names no merchant for 'KOPI-ARABIKA-250', so there is nobody to pay or to ship from"
        },
        source: restSource("order", "Controllers/CartController.cs", 112, 117)
      },
      {
        status: 422,
        when: "rest.order.addCartItem.case.ownProduct",
        json: {
          error: "OWN_PRODUCT_NOT_PURCHASABLE",
          productId: "KOPI-ARABIKA-250",
          message: "this product is sold by your own account, and a seller cannot buy its own product"
        },
        source: restSource("order", "Controllers/CartController.cs", 118, 123)
      },
      {
        status: 422,
        when: "rest.order.addCartItem.case.lineQuantityOutOfRange",
        json: {
          error: "CART_LINE_QUANTITY_OUT_OF_RANGE",
          productId: "KOPI-ARABIKA-250",
          quantity: 1001,
          minQuantity: 1,
          maxQuantity: 999,
          message: "the cart would hold 1001 of 'KOPI-ARABIKA-250', and a line holds 1 to 999"
        },
        source: restSource("order", "Controllers/CartController.cs", 133, 141)
      },
      {
        status: 503,
        when: "rest.order.addCartItem.case.catalogUnavailable",
        json: {
          error: "CATALOG_UNAVAILABLE",
          productId: "KOPI-ARABIKA-250",
          message: "catalog did not answer for 'KOPI-ARABIKA-250', so its price cannot be established"
        },
        source: restSource("order", "Controllers/CartController.cs", 151, 156)
      },
      {
        status: 503,
        when: "rest.order.addCartItem.case.cartUnavailable",
        json: cartUnavailable,
        source: restSource("order", "Controllers/CartController.cs", 157, 166)
      }
    ],
    source: restSource("order", "Controllers/CartController.cs", 31, 38)
  },
  {
    id: "order.updateCartItem",
    service: "order",
    method: "PUT",
    path: "/api/v1/cart/items/{productId}",
    summary: "rest.order.updateCartItem.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.order.updateCartItem.who"
    },
    request: {
      target: "/api/v1/cart/items/KOPI-ARABIKA-250",
      fields: [
        {
          name: "productId",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.order.updateCartItem.field.productId"
        },
        {
          name: "quantity",
          in: "body",
          type: "integer",
          required: true,
          rule: "rest.order.updateCartItem.field.quantity"
        }
      ],
      json: {
        quantity: 3
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.order.updateCartItem.case.updated",
        json: {
          ...cart,
          items: [
            {
              ...coffeeLine,
              quantity: 3,
              lineTotal: 255000
            },
            palmSugarLine
          ],
          subtotal: 287000,
          updatedAt: "2026-10-22T03:18:42.1093355Z"
        },
        source: restSource("order", "Application/Services/CartService.cs", 64, 85)
      },
      {
        status: 400,
        when: "rest.order.updateCartItem.case.quantityOutOfRange",
        json: {
          error: "QUANTITY_OUT_OF_RANGE",
          productId: "KOPI-ARABIKA-250",
          quantity: 1200,
          minQuantity: 0,
          maxQuantity: 999,
          message: "a quantity of 1200 for 'KOPI-ARABIKA-250' is outside 0 to 999"
        },
        source: restSource("order", "Controllers/CartController.cs", 124, 132)
      },
      {
        status: 409,
        when: "rest.order.updateCartItem.case.cartBusy",
        json: cartBusy,
        source: restSource("order", "Controllers/CartController.cs", 149, 150)
      },
      {
        status: 503,
        when: "rest.order.updateCartItem.case.cartUnavailable",
        json: cartUnavailable,
        source: restSource("order", "Controllers/CartController.cs", 157, 166)
      }
    ],
    source: restSource("order", "Controllers/CartController.cs", 40, 49)
  },
  {
    id: "order.removeCartItem",
    service: "order",
    method: "DELETE",
    path: "/api/v1/cart/items/{productId}",
    summary: "rest.order.removeCartItem.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.order.removeCartItem.who"
    },
    request: {
      target: "/api/v1/cart/items/GULA-AREN-500",
      fields: [
        {
          name: "productId",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.order.removeCartItem.field.productId"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.order.removeCartItem.case.removed",
        json: {
          ...cart,
          items: [coffeeLine],
          subtotal: 170000,
          updatedAt: "2026-10-22T03:19:05.7710248Z"
        },
        source: restSource("order", "Application/Services/CartService.cs", 87, 88)
      },
      {
        status: 409,
        when: "rest.order.removeCartItem.case.cartBusy",
        json: cartBusy,
        source: restSource("order", "Controllers/CartController.cs", 149, 150)
      },
      {
        status: 503,
        when: "rest.order.removeCartItem.case.cartUnavailable",
        json: cartUnavailable,
        source: restSource("order", "Controllers/CartController.cs", 157, 166)
      }
    ],
    source: restSource("order", "Controllers/CartController.cs", 51, 58)
  },
  {
    id: "order.applyCartVoucher",
    service: "order",
    method: "POST",
    path: "/api/v1/cart/voucher",
    summary: "rest.order.applyCartVoucher.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.order.applyCartVoucher.who"
    },
    request: {
      target: "/api/v1/cart/voucher",
      fields: [
        {
          name: "voucherCode",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.order.applyCartVoucher.field.voucherCode"
        }
      ],
      json: {
        voucherCode: "HEMAT10"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.order.applyCartVoucher.case.applied",
        json: cart,
        source: restSource("order", "Application/Services/CartService.cs", 90, 99)
      },
      {
        status: 400,
        when: "rest.order.applyCartVoucher.case.codeRequired",
        json: {
          error: "VOUCHER_CODE_REQUIRED",
          message: "name the voucher to apply; DELETE /api/v1/cart/voucher takes one off"
        },
        source: restSource("order", "Controllers/CartController.cs", 66, 71)
      },
      {
        status: 400,
        when: "rest.order.applyCartVoucher.case.tooLong",
        json: {
          error: "FIELD_TOO_LONG",
          field: "voucherCode",
          maxLength: 50,
          message: "voucherCode is longer than the 50 characters an order can record"
        },
        source: restSource("order", "Controllers/CartController.cs", 142, 148)
      },
      {
        status: 409,
        when: "rest.order.applyCartVoucher.case.cartBusy",
        json: cartBusy,
        source: restSource("order", "Controllers/CartController.cs", 149, 150)
      },
      {
        status: 503,
        when: "rest.order.applyCartVoucher.case.cartUnavailable",
        json: cartUnavailable,
        source: restSource("order", "Controllers/CartController.cs", 157, 166)
      }
    ],
    source: restSource("order", "Controllers/CartController.cs", 60, 75)
  },
  {
    id: "order.removeCartVoucher",
    service: "order",
    method: "DELETE",
    path: "/api/v1/cart/voucher",
    summary: "rest.order.removeCartVoucher.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.order.removeCartVoucher.who"
    },
    request: {
      target: "/api/v1/cart/voucher",
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.order.removeCartVoucher.case.removed",
        json: {
          ...cart,
          appliedVoucherCode: null,
          updatedAt: "2026-10-22T03:20:11.3048817Z"
        },
        source: restSource("order", "Application/Services/CartService.cs", 101, 109)
      },
      {
        status: 409,
        when: "rest.order.removeCartVoucher.case.cartBusy",
        json: cartBusy,
        source: restSource("order", "Controllers/CartController.cs", 149, 150)
      },
      {
        status: 503,
        when: "rest.order.removeCartVoucher.case.cartUnavailable",
        json: cartUnavailable,
        source: restSource("order", "Controllers/CartController.cs", 157, 166)
      }
    ],
    source: restSource("order", "Controllers/CartController.cs", 77, 84)
  },
  {
    id: "order.clearCart",
    service: "order",
    method: "DELETE",
    path: "/api/v1/cart",
    summary: "rest.order.clearCart.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.order.clearCart.who"
    },
    request: {
      target: "/api/v1/cart",
      fields: []
    },
    cases: [
      {
        status: 204,
        when: "rest.order.clearCart.case.cleared",
        source: restSource("order", "Controllers/CartController.cs", 92, 98)
      },
      {
        status: 503,
        when: "rest.order.clearCart.case.cartUnavailable",
        json: cartUnavailable,
        source: restSource("order", "Controllers/CartController.cs", 94, 95)
      }
    ],
    source: restSource("order", "Controllers/CartController.cs", 86, 99)
  },
  {
    id: "order.checkout",
    service: "order",
    method: "POST",
    path: "/api/v1/orders/checkout",
    summary: "rest.order.checkout.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.order.checkout.who"
    },
    request: {
      target: "/api/v1/orders/checkout",
      fields: [
        {
          name: "Idempotency-Key",
          in: "header",
          type: "string",
          required: false,
          rule: "rest.order.checkout.field.idempotencyKey"
        },
        {
          name: "shippingAddress",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.order.checkout.field.shippingAddress"
        },
        {
          name: "recipientName",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.order.checkout.field.recipientName"
        },
        {
          name: "recipientPhone",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.order.checkout.field.recipientPhone"
        },
        {
          name: "shippingServiceTier",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.order.checkout.field.shippingServiceTier"
        },
        {
          name: "voucherCode",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.order.checkout.field.voucherCode"
        }
      ],
      headers: ["Idempotency-Key: 7d4b1f0e-3c1a-4c55-9a7b-0f8e2b1d9c11"],
      json: {
        shippingAddress,
        recipientName: "Siti Rahmawati",
        recipientPhone: "081200001234",
        shippingServiceTier: "KINETIX_REGULAR",
        voucherCode: "HEMAT10"
      }
    },
    cases: [
      {
        status: 201,
        when: "rest.order.checkout.case.placed",
        headers: [`Location: /api/v1/orders/${orderId}`],
        json: placedOrder,
        source: restSource("order", "Application/Services/OrderService.cs", 226, 231)
      },
      {
        status: 201,
        when: "rest.order.checkout.case.replayed",
        headers: [`Location: /api/v1/orders/${orderId}`],
        json: fulfillingOrder,
        source: restSource("order", "Application/Services/OrderService.cs", 246, 278)
      },
      {
        status: 400,
        when: "rest.order.checkout.case.recipientRequired",
        json: {
          error: "RECIPIENT_REQUIRED",
          field: "recipientPhone",
          message: "recipientPhone is required: a parcel needs an address and a person to hand it to"
        },
        source: restSource("order", "Controllers/OrderController.cs", 38, 39)
      },
      {
        status: 400,
        when: "rest.order.checkout.case.tooLong",
        json: {
          error: "FIELD_TOO_LONG",
          field: "shippingAddress",
          maxLength: 500,
          message: "shippingAddress is longer than the 500 characters an order can record"
        },
        source: restSource("order", "Controllers/OrderController.cs", 40, 46)
      },
      {
        status: 400,
        when: "rest.order.checkout.case.cartEmpty",
        json: {
          error: "CART_EMPTY",
          message: "this cart has no items, so there is nothing to check out"
        },
        source: restSource("order", "Controllers/OrderController.cs", 149, 150)
      },
      {
        status: 400,
        when: "rest.order.checkout.case.twoMerchants",
        json: {
          error: "CART_SPANS_TWO_MERCHANTS",
          merchantCount: 2,
          message:
            "this cart holds items from 2 merchants, and an order belongs to one; check out each merchant's items separately"
        },
        source: restSource("order", "Controllers/OrderController.cs", 164, 169)
      },
      {
        status: 400,
        when: "rest.order.checkout.case.tierUnknown",
        json: {
          error: "SHIPPING_TIER_UNKNOWN",
          message: "'KINETIX_EXPRESS' is not a service tier the courier service offers.",
          requestedTier: "KINETIX_EXPRESS",
          availableTiers: ["KINETIX_INSTANT", "KINETIX_SAMEDAY", "KINETIX_REGULAR"]
        },
        source: restSource("order", "Controllers/OrderController.cs", 126, 132)
      },
      {
        status: 404,
        when: "rest.order.checkout.case.notInCatalog",
        json: {
          error: "PRODUCT_NOT_IN_CATALOG",
          productId: "GULA-AREN-500",
          message: "catalog has no product 'GULA-AREN-500', so there is no price to charge for it"
        },
        source: restSource("order", "Controllers/OrderController.cs", 170, 171)
      },
      {
        status: 409,
        when: "rest.order.checkout.case.inProgress",
        json: {
          error: "CHECKOUT_IN_PROGRESS",
          orderNumber,
          message:
            "the checkout this Idempotency-Key started has not finished yet. Repeat the same request with the same key shortly to learn how it ended."
        },
        source: restSource("order", "Controllers/OrderController.cs", 54, 60)
      },
      {
        status: 409,
        when: "rest.order.checkout.case.merchantNotTrading",
        json: {
          error: "MERCHANT_NOT_TRADING",
          message: `identity does not permit merchant ${merchant} to sell, so this cart cannot be bought now`
        },
        source: restSource("order", "Controllers/OrderController.cs", 157, 158)
      },
      {
        status: 409,
        when: "rest.order.checkout.case.rolledBack",
        json: {
          error: "CHECKOUT_ROLLED_BACK",
          orderNumber,
          rolledBack: true,
          reason:
            "stock for KOPI-ARABIKA-250: no single bin can cover 2 units of KOPI-ARABIKA-250; the largest single bin holds 1",
          message:
            "this checkout was refused, so it was not placed. Everything it had reserved or charged has been given back."
        },
        source: restSource("order", "Controllers/OrderController.cs", 258, 264)
      },
      {
        status: 409,
        when: "rest.order.checkout.case.rollbackPending",
        json: {
          error: "CHECKOUT_ROLLBACK_PENDING",
          orderNumber,
          rolledBack: false,
          reason: "this checkout was taken over and is being unwound",
          message:
            "this checkout was refused, so it was not placed. Some of what it had reserved or charged is still being given back; that is retried automatically, and staff are alerted if it cannot be."
        },
        source: restSource("order", "Controllers/OrderController.cs", 228, 264)
      },
      {
        status: 409,
        when: "rest.order.checkout.case.replayedNotPlaced",
        json: {
          error: "CHECKOUT_ROLLED_BACK",
          orderNumber,
          rolledBack: true,
          replayed: true,
          reason:
            "stock for KOPI-ARABIKA-250: no single bin can cover 2 units of KOPI-ARABIKA-250; the largest single bin holds 1",
          message:
            "the checkout this Idempotency-Key started was not placed. Everything it had reserved or charged has been given back. A new attempt needs a new Idempotency-Key."
        },
        source: restSource("order", "Controllers/OrderController.cs", 235, 245)
      },
      {
        status: 422,
        when: "rest.order.checkout.case.keyReused",
        json: {
          error: "IDEMPOTENCY_KEY_REUSED",
          orderNumber,
          message:
            "this Idempotency-Key was already used for a checkout with a different request. Send a new key for a new checkout, or repeat the original request exactly."
        },
        source: restSource("order", "Controllers/OrderController.cs", 47, 53)
      },
      {
        status: 422,
        when: "rest.order.checkout.case.pricingRefused",
        json: {
          error: "PRICING_REFUSED",
          reason: "the lines of this cart add up to more than an amount of money can carry",
          message:
            "this order cannot be priced as it stands, so it was not placed. Nothing has been charged or reserved."
        },
        source: restSource("order", "Controllers/OrderController.cs", 61, 67)
      },
      {
        status: 422,
        when: "rest.order.checkout.case.totalZero",
        json: {
          error: "ORDER_TOTAL_NOT_CHARGEABLE",
          message:
            "this order comes to nothing, and an amount of zero cannot be charged or held, so it was not placed. Nothing has been charged or reserved."
        },
        source: restSource("order", "Controllers/OrderController.cs", 68, 73)
      },
      {
        status: 422,
        when: "rest.order.checkout.case.ownProduct",
        json: {
          error: "OWN_PRODUCT_NOT_PURCHASABLE",
          productId: "KOPI-ARABIKA-250",
          message:
            "this cart holds a product you sell yourself, and a seller cannot buy its own product. Remove it from the cart and check out again."
        },
        source: restSource("order", "Controllers/OrderController.cs", 74, 80)
      },
      {
        status: 422,
        when: "rest.order.checkout.case.lineQuantityOutOfRange",
        json: {
          error: "CART_LINE_QUANTITY_OUT_OF_RANGE",
          productId: "KOPI-ARABIKA-250",
          quantity: 0,
          minQuantity: 1,
          maxQuantity: 999,
          message:
            "the cart would hold 0 of 'KOPI-ARABIKA-250', and a line holds 1 to 999. Change the quantity in the cart and check out again."
        },
        source: restSource("order", "Controllers/OrderController.cs", 81, 89)
      },
      {
        status: 422,
        when: "rest.order.checkout.case.noMerchant",
        json: {
          error: "PRODUCT_HAS_NO_MERCHANT",
          productId: "GULA-AREN-500",
          message: "catalog names no merchant for 'GULA-AREN-500', so there is nobody to pay or to ship from"
        },
        source: restSource("order", "Controllers/OrderController.cs", 151, 156)
      },
      {
        status: 422,
        when: "rest.order.checkout.case.noUsablePrice",
        json: {
          error: "PRODUCT_HAS_NO_USABLE_PRICE",
          productId: "GULA-AREN-500",
          message: "catalog states no chargeable price for 'GULA-AREN-500': the product carries no price"
        },
        source: restSource("order", "Controllers/OrderController.cs", 172, 177)
      },
      {
        status: 422,
        when: "rest.order.checkout.case.weightUnknown",
        json: {
          error: "PRODUCT_WEIGHT_UNKNOWN",
          productIds: ["GULA-AREN-500"],
          message:
            "a product in this cart has no weight, so its shipping cannot be priced and this order was not placed. Nothing has been charged or reserved. The merchant has to set the product's weight."
        },
        source: restSource("order", "Controllers/OrderController.cs", 184, 191)
      },
      {
        status: 422,
        when: "rest.order.checkout.case.storeNotOnMap",
        json: {
          error: "MERCHANT_STORE_NOT_ON_MAP",
          message:
            "the merchant's store address has no point on the map, so the distance to you cannot be measured and this order was not placed. Nothing has been charged or reserved."
        },
        source: restSource("order", "Controllers/OrderController.cs", 192, 198)
      },
      {
        status: 422,
        when: "rest.order.checkout.case.addressNotPlaced",
        json: {
          error: "SHIPPING_ADDRESS_NOT_PLACED",
          reason: "AMBIGUOUS",
          message:
            "Your shipping address matches more than one place; add the area or postal code. This order was not placed, and nothing has been charged or reserved."
        },
        source: restSource("order", "Controllers/OrderController.cs", 199, 205)
      },
      {
        status: 422,
        when: "rest.order.checkout.case.tierNotEstablished",
        json: {
          error: "SHIPPING_TIER_NOT_ESTABLISHED",
          message:
            "'KINETIX_INSTANT' could not be confirmed for this order, so it was not placed. Nothing has been charged or reserved. Choose one of the tiers listed, or leave the tier out to take the cheapest available.",
          requestedTier: "KINETIX_INSTANT",
          availableTiers: ["KINETIX_SAMEDAY", "KINETIX_REGULAR"],
          rateCardReason: "Distance exceeds 15km limit"
        },
        source: restSource("order", "Controllers/OrderController.cs", 116, 125)
      },
      {
        status: 422,
        when: "rest.order.checkout.case.notServiceable",
        json: {
          error: "SHIPPING_NOT_SERVICEABLE",
          reasons: [
            "KINETIX_INSTANT: Distance exceeds 15km limit",
            "KINETIX_SAMEDAY: Distance exceeds 30km limit",
            "KINETIX_REGULAR: Distance exceeds 500km limit",
            "KINETIX_CARGO: Cargo is reserved for packages >= 10kg"
          ],
          message:
            "no courier service can carry this parcel to this address, so this order was not placed. Nothing has been charged or reserved."
        },
        source: restSource("order", "Controllers/OrderController.cs", 218, 224)
      },
      {
        status: 502,
        when: "rest.order.checkout.case.quoteMalformed",
        json: {
          error: "SHIPPING_QUOTE_MALFORMED",
          message:
            "shipping could not be quoted for this order — the courier service answered with something this service cannot read — so this order was not placed. Nothing has been charged or reserved. This is a fault on our side and it has been logged; trying again is unlikely to help."
        },
        source: restSource("order", "Controllers/OrderController.cs", 108, 115)
      },
      {
        status: 502,
        when: "rest.order.checkout.case.feeContradicted",
        json: {
          error: "SHIPPING_FEE_CONTRADICTED",
          message:
            "the shipping fee could not be confirmed against the courier quote, so this order was not placed. Nothing has been charged or reserved."
        },
        source: restSource("order", "Controllers/OrderController.cs", 133, 138)
      },
      {
        status: 502,
        when: "rest.order.checkout.case.amountsUnchargeable",
        json: {
          error: "ORDER_AMOUNTS_UNCHARGEABLE",
          message:
            "the amounts on this order do not add up to something that can be charged, so it was not placed. Nothing has been charged or reserved. This is a fault on our side and it has been logged; trying again is unlikely to help."
        },
        source: restSource("order", "Controllers/OrderController.cs", 139, 146)
      },
      {
        status: 503,
        when: "rest.order.checkout.case.cartUnavailable",
        json: {
          error: "CART_UNAVAILABLE",
          message:
            "your cart cannot be read right now, so this order was not placed. Nothing has been charged or reserved — please try again shortly."
        },
        source: restSource("order", "Controllers/OrderController.cs", 90, 95)
      },
      {
        status: 503,
        when: "rest.order.checkout.case.catalogUnavailable",
        json: {
          error: "CATALOG_UNAVAILABLE",
          productId: "KOPI-ARABIKA-250",
          message: "catalog did not answer for 'KOPI-ARABIKA-250', so its price cannot be established"
        },
        source: restSource("order", "Controllers/OrderController.cs", 178, 183)
      },
      {
        status: 503,
        when: "rest.order.checkout.case.standingUnknown",
        json: {
          error: "IDENTITY_UNAVAILABLE",
          message:
            `identity did not answer whether merchant ${merchant} may sell. Nothing has been charged or reserved; try again shortly.`
        },
        source: restSource("order", "Controllers/OrderController.cs", 159, 163)
      },
      {
        status: 503,
        when: "rest.order.checkout.case.storeAddressUnavailable",
        json: {
          error: "IDENTITY_UNAVAILABLE",
          message:
            "the merchant's store address cannot be looked up right now, so this order was not placed. Nothing has been charged or reserved — please try again shortly."
        },
        source: restSource("order", "Controllers/OrderController.cs", 212, 217)
      },
      {
        status: 503,
        when: "rest.order.checkout.case.addressLookupUnavailable",
        json: {
          error: "ADDRESS_LOOKUP_UNAVAILABLE",
          message:
            "your address cannot be looked up right now, so this order was not placed. Nothing has been charged or reserved — please try again shortly."
        },
        source: restSource("order", "Controllers/OrderController.cs", 206, 211)
      },
      {
        status: 503,
        when: "rest.order.checkout.case.shippingUnavailable",
        json: {
          error: "SHIPPING_UNAVAILABLE",
          message:
            "shipping cannot be quoted right now, so this order was not placed. Nothing has been charged or reserved — please try again shortly."
        },
        source: restSource("order", "Controllers/OrderController.cs", 102, 107)
      },
      {
        status: 503,
        when: "rest.order.checkout.case.pricingUnavailable",
        json: {
          error: "PRICING_UNAVAILABLE",
          message:
            "prices cannot be confirmed right now, so this order was not placed. Nothing has been charged or reserved — please try again shortly."
        },
        source: restSource("order", "Controllers/OrderController.cs", 96, 101)
      },
      {
        status: 503,
        when: "rest.order.checkout.case.dependencyUnavailable",
        json: {
          error: "CHECKOUT_DEPENDENCY_UNAVAILABLE",
          orderNumber,
          rolledBack: true,
          reason: "a service this checkout depends on did not answer",
          message:
            "a service this checkout depends on did not answer, so it was not placed. Everything it had reserved or charged has been given back. Try again shortly with a new Idempotency-Key."
        },
        source: restSource("order", "Controllers/OrderController.cs", 247, 256)
      }
    ],
    source: restSource("order", "Controllers/OrderController.cs", 27, 37)
  },
  {
    id: "order.listMyOrders",
    service: "order",
    method: "GET",
    path: "/api/v1/orders/my-orders",
    summary: "rest.order.listMyOrders.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.order.listMyOrders.who"
    },
    request: {
      target: "/api/v1/orders/my-orders?status=DELIVERED&page=1&pageSize=10",
      fields: [
        {
          name: "status",
          in: "query",
          type: "string",
          required: false,
          rule: "rest.order.listMyOrders.field.status"
        },
        {
          name: "page",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.order.listMyOrders.field.page"
        },
        {
          name: "pageSize",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.order.listMyOrders.field.pageSize"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.order.listMyOrders.case.page",
        json: {
          items: [deliveredOrder],
          page: 1,
          pageSize: 10,
          totalCount: 1
        },
        source: restSource("order", "Controllers/OrderController.cs", 328, 334)
      },
      {
        status: 400,
        when: "rest.order.listMyOrders.case.invalid",
        contentType: "application/problem+json",
        json: queryInvalid("page", "two"),
        source: restSource("order", "Controllers/OrderController.cs", 290, 295)
      },
      {
        status: 400,
        when: "rest.order.listMyOrders.case.pageOutOfRange",
        json: {
          error: "PAGE_OUT_OF_RANGE",
          message: "page counts from 1"
        },
        source: restSource("order", "Controllers/OrderController.cs", 300, 302)
      },
      {
        status: 400,
        when: "rest.order.listMyOrders.case.pageSizeOutOfRange",
        json: {
          error: "PAGE_SIZE_OUT_OF_RANGE",
          maxPageSize: 100,
          message: "pageSize is from 1 to 100"
        },
        source: restSource("order", "Controllers/OrderController.cs", 304, 310)
      },
      {
        status: 400,
        when: "rest.order.listMyOrders.case.statusUnknown",
        json: {
          error: "STATUS_UNKNOWN",
          allowedStatuses: allStatuses,
          message: "'SENT' is not an order status"
        },
        source: restSource("order", "Controllers/OrderController.cs", 312, 323)
      }
    ],
    source: restSource("order", "Controllers/OrderController.cs", 290, 335)
  },
  {
    id: "order.getOrder",
    service: "order",
    method: "GET",
    path: "/api/v1/orders/{orderId}",
    summary: "rest.order.getOrder.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.order.getOrder.who"
    },
    request: {
      target: `/api/v1/orders/${orderId}`,
      fields: [
        {
          name: "orderId",
          in: "path",
          type: "string (uuid)",
          required: true,
          rule: "rest.order.getOrder.field.orderId"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.order.getOrder.case.found",
        json: deliveredOrder,
        source: restSource("order", "Application/Services/OrderService.cs", 609, 619)
      },
      {
        status: 404,
        when: "rest.order.getOrder.case.notFound",
        json: {
          error: "ORDER_NOT_FOUND",
          message: `Order '${orderId}' not found`
        },
        source: restSource("order", "Controllers/OrderController.cs", 339, 348)
      }
    ],
    source: restSource("order", "Controllers/OrderController.cs", 337, 345)
  },
  {
    id: "order.completeOrder",
    service: "order",
    method: "POST",
    path: "/api/v1/orders/{orderNumber}/complete",
    summary: "rest.order.completeOrder.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.order.completeOrder.who"
    },
    request: {
      target: `/api/v1/orders/${orderNumber}/complete`,
      fields: [
        {
          name: "orderNumber",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.order.completeOrder.field.orderNumber"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.order.completeOrder.case.released",
        json: {
          orderNumber,
          escrowReleased: true,
          detail: null
        },
        source: restSource("order", "Application/Completion/OrderCompletion.cs", 44, 66)
      },
      {
        status: 200,
        when: "rest.order.completeOrder.case.releasePending",
        json: {
          orderNumber,
          escrowReleased: false,
          detail: "payment held nothing to release for this order"
        },
        source: restSource("order", "Application/Completion/OrderCompletion.cs", 69, 91)
      },
      {
        status: 403,
        when: "rest.order.completeOrder.case.notAdmin",
        source: restSource("order", "Security/OrderPolicies.cs", 14, 16)
      },
      {
        status: 404,
        when: "rest.order.completeOrder.case.notFound",
        json: {
          error: "ORDER_NOT_FOUND",
          message: "no order carries that number"
        },
        source: restSource("order", "Controllers/OrderCompletionController.cs", 41, 41)
      },
      {
        status: 409,
        when: "rest.order.completeOrder.case.alreadyCompleted",
        json: {
          error: "ORDER_ALREADY_COMPLETED",
          message: "the order is already complete; its escrow release is retried until payment accepts it"
        },
        source: restSource("order", "Controllers/OrderCompletionController.cs", 37, 40)
      },
      {
        status: 409,
        when: "rest.order.completeOrder.case.returnUnresolved",
        json: {
          error: "RETURN_UNRESOLVED",
          message: "a return against this order is not resolved, so the buyer may still be owed a refund"
        },
        source: restSource("order", "Controllers/OrderCompletionController.cs", 42, 45)
      },
      {
        status: 409,
        when: "rest.order.completeOrder.case.notDelivered",
        json: {
          error: "ORDER_NOT_DELIVERED",
          message: "the order is PROCESSING_FULFILLMENT; only a delivered order can be completed"
        },
        source: restSource("order", "Controllers/OrderCompletionController.cs", 46, 46)
      }
    ],
    source: restSource("order", "Controllers/OrderCompletionController.cs", 17, 48)
  },
  {
    id: "order.listReturnsNeedingAttention",
    service: "order",
    method: "GET",
    path: "/api/v1/orders/returns/needs-attention",
    summary: "rest.order.listReturnsNeedingAttention.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.order.listReturnsNeedingAttention.who"
    },
    request: {
      target: "/api/v1/orders/returns/needs-attention?limit=50",
      fields: [
        {
          name: "limit",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.order.listReturnsNeedingAttention.field.limit"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.order.listReturnsNeedingAttention.case.list",
        json: [
          {
            returnNumber: "RMA-20261019-4B8D2E6A",
            orderNumber: "ORD-20261015-2C9E7A41",
            merchantPrincipalId: merchant,
            status: "OPEN",
            reason: "Kemasan bocor saat diterima",
            openedAt: "2026-10-19T08:42:11.204517Z",
            goodsReceivedAt: null,
            refundAmount: null,
            lastRefundError: null
          },
          {
            returnNumber: "RMA-20261020-9A1C3E5F",
            orderNumber: "ORD-20261016-6D2B8F03",
            merchantPrincipalId: merchant,
            status: "GOODS_RECEIVED",
            reason: "Barang tidak sesuai pesanan",
            openedAt: "2026-10-20T02:10:45.918362Z",
            goodsReceivedAt: "2026-10-21T06:30:00Z",
            refundAmount: 85000.00,
            lastRefundError: "payment held nothing to refund goods from"
          }
        ],
        source: restSource("order", "Controllers/ReturnAdminController.cs", 29, 49)
      },
      {
        status: 400,
        when: "rest.order.listReturnsNeedingAttention.case.invalid",
        contentType: "application/problem+json",
        json: queryInvalid("limit", "all"),
        source: restSource("order", "Controllers/ReturnAdminController.cs", 23, 28)
      },
      {
        status: 403,
        when: "rest.order.listReturnsNeedingAttention.case.notAdmin",
        source: restSource("order", "Security/OrderPolicies.cs", 11, 13)
      }
    ],
    source: restSource("order", "Controllers/ReturnAdminController.cs", 23, 50)
  },
  {
    id: "order.rejectReturn",
    service: "order",
    method: "POST",
    path: "/api/v1/orders/returns/{returnNumber}/reject",
    summary: "rest.order.rejectReturn.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.order.rejectReturn.who"
    },
    request: {
      target: "/api/v1/orders/returns/RMA-20261019-4B8D2E6A/reject",
      fields: [
        {
          name: "returnNumber",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.order.rejectReturn.field.returnNumber"
        },
        {
          name: "reason",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.order.rejectReturn.field.reason"
        }
      ],
      json: {
        reason: "Foto dari pembeli menunjukkan segel kemasan masih utuh"
      }
    },
    cases: [
      {
        status: 204,
        when: "rest.order.rejectReturn.case.rejected",
        source: restSource("order", "Application/Returns/ReturnRejection.cs", 54, 69)
      },
      {
        status: 400,
        when: "rest.order.rejectReturn.case.reasonRequired",
        json: {
          error: "REASON_REQUIRED",
          message: "a rejection pays the merchant instead of refunding the buyer, so it must say why"
        },
        source: restSource("order", "Controllers/ReturnAdminController.cs", 80, 83)
      },
      {
        status: 403,
        when: "rest.order.rejectReturn.case.notAdmin",
        source: restSource("order", "Security/OrderPolicies.cs", 14, 16)
      },
      {
        status: 404,
        when: "rest.order.rejectReturn.case.notFound",
        json: {
          error: "RETURN_NOT_FOUND",
          message: "no return carries that number"
        },
        source: restSource("order", "Controllers/ReturnAdminController.cs", 76, 79)
      },
      {
        status: 409,
        when: "rest.order.rejectReturn.case.alreadyRejected",
        json: {
          error: "RETURN_ALREADY_REJECTED",
          message: "that return was already rejected"
        },
        source: restSource("order", "Controllers/ReturnAdminController.cs", 84, 87)
      },
      {
        status: 409,
        when: "rest.order.rejectReturn.case.goodsReceived",
        json: {
          error: "GOODS_ALREADY_RECEIVED",
          message: "the goods came back, so the buyer is owed a refund and the return cannot be rejected"
        },
        source: restSource("order", "Controllers/ReturnAdminController.cs", 88, 91)
      }
    ],
    source: restSource("order", "Controllers/ReturnAdminController.cs", 52, 93)
  },
  {
    id: "order.listSagasNeedingAttention",
    service: "order",
    method: "GET",
    path: "/api/v1/orders/sagas/needs-attention",
    summary: "rest.order.listSagasNeedingAttention.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.order.listSagasNeedingAttention.who"
    },
    request: {
      target: "/api/v1/orders/sagas/needs-attention?limit=50",
      fields: [
        {
          name: "limit",
          in: "query",
          type: "integer",
          required: false,
          rule: "rest.order.listSagasNeedingAttention.field.limit"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.order.listSagasNeedingAttention.case.list",
        json: [
          {
            sagaId: "2f4a6c8e-0b1d-4f3a-8c5e-7a9b1c3d5e70",
            orderNumber: "ORD-20261021-3E5A7C9B",
            customerPrincipalId: buyer,
            state: "Abandoned",
            orderStatus: "CANCELLED",
            compensationAttempts: 6,
            lastFailureCode: "ESCROW_REFUND_UNCONFIRMED",
            failureReason: "a service this checkout depends on did not answer",
            correlationId: "8a2d4f6b-1c3e-4a5b-9d7f-0e2c4a6b8d91",
            abandonedAt: "2026-10-21T09:47:30.551204Z",
            needsAttentionAt: "2026-10-21T09:47:30.551204Z",
            updatedAt: "2026-10-21T09:47:30.551204Z",
            unreleasedSteps: [
              {
                name: "CreateEscrowHold",
                reference: "ORD-20261021-3E5A7C9B",
                quantity: 1,
                merchantPrincipalId: merchant,
                productId: null,
                state: "Attempting",
                compensationAttempts: 6,
                lastFailureCode: "ESCROW_REFUND_UNCONFIRMED",
                detail:
                  "a refund was dispatched and did not answer, and payment still reports the hold as HELD; it is sent again next round under the same idempotency key",
                remedy:
                  "payment.v1.PaymentService/RefundEscrow with idempotency_key 'order:<order number>' — payment dedupes on that key and answers already_applied, so repeating it cannot credit twice. Read GetEscrowStatus first to see what it will do: RELEASED means the merchant has been paid and no refund can undo it from here"
              }
            ]
          }
        ],
        source: restSource("order", "Controllers/SagaAdminController.cs", 26, 72)
      },
      {
        status: 400,
        when: "rest.order.listSagasNeedingAttention.case.invalid",
        contentType: "application/problem+json",
        json: queryInvalid("limit", "all"),
        source: restSource("order", "Controllers/SagaAdminController.cs", 21, 25)
      },
      {
        status: 403,
        when: "rest.order.listSagasNeedingAttention.case.notAdmin",
        source: restSource("order", "Security/OrderPolicies.cs", 11, 13)
      }
    ],
    source: restSource("order", "Controllers/SagaAdminController.cs", 21, 73)
  },
  {
    id: "order.countSagasNeedingAttention",
    service: "order",
    method: "GET",
    path: "/api/v1/orders/sagas/needs-attention/count",
    summary: "rest.order.countSagasNeedingAttention.summary",
    access: {
      token: "required",
      gatewayVerifies: false,
      who: "rest.order.countSagasNeedingAttention.who"
    },
    request: {
      target: "/api/v1/orders/sagas/needs-attention/count",
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.order.countSagasNeedingAttention.case.count",
        json: 3,
        source: restSource("order", "Controllers/SagaAdminController.cs", 75, 80)
      },
      {
        status: 403,
        when: "rest.order.countSagasNeedingAttention.case.notAdmin",
        source: restSource("order", "Security/OrderPolicies.cs", 11, 13)
      }
    ],
    source: restSource("order", "Controllers/SagaAdminController.cs", 75, 80)
  }
];
