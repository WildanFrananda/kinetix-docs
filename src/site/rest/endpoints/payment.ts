import type { RestCase } from "../../types/rest_case.type";
import type { RestEndpoint } from "../../types/rest_endpoint.type";
import { restSource } from "../rest_source";

const customerWalletFound: string = `{
  "id": 4821,
  "ownerPrincipalId": "0f8b6c1e-5a2d-4c3b-9e7f-1a2b3c4d5e6f",
  "ownerType": "CUSTOMER",
  "exists": true,
  "availableBalance": 1650000.00,
  "heldOrPendingBalance": 0.00,
  "currency": "IDR"
}`;

const customerWalletNotYet: string = `{
  "id": null,
  "ownerPrincipalId": "0f8b6c1e-5a2d-4c3b-9e7f-1a2b3c4d5e6f",
  "ownerType": "CUSTOMER",
  "exists": false,
  "availableBalance": 0.00,
  "heldOrPendingBalance": 0.00,
  "currency": "IDR"
}`;

const merchantWalletFound: string = `{
  "id": 1307,
  "ownerPrincipalId": "5d2e8a41-9c3f-4b7e-a1d6-3f8b2c9e7a10",
  "ownerType": "MERCHANT",
  "exists": true,
  "availableBalance": 12450000.00,
  "heldOrPendingBalance": 3180000.00,
  "currency": "IDR"
}`;

const merchantWalletNotYet: string = `{
  "id": null,
  "ownerPrincipalId": "5d2e8a41-9c3f-4b7e-a1d6-3f8b2c9e7a10",
  "ownerType": "MERCHANT",
  "exists": false,
  "availableBalance": 0.00,
  "heldOrPendingBalance": 0.00,
  "currency": "IDR"
}`;

const driverWalletFound: string = `{
  "id": 692,
  "ownerPrincipalId": "8a6f3c2d-1e9b-4d7a-b5c4-2e1f9a8b7c6d",
  "ownerType": "DRIVER",
  "exists": true,
  "availableBalance": 845000.00,
  "heldOrPendingBalance": 64000.00,
  "currency": "IDR"
}`;

const driverWalletNotYet: string = `{
  "id": null,
  "ownerPrincipalId": "8a6f3c2d-1e9b-4d7a-b5c4-2e1f9a8b7c6d",
  "ownerType": "DRIVER",
  "exists": false,
  "availableBalance": 0.00,
  "heldOrPendingBalance": 0.00,
  "currency": "IDR"
}`;

const topUpCharged: string = `{
  "referenceNumber": "TOPUP-7c1e2f0a-3b4d-4e5f-9a8b-1c2d3e4f5a6b",
  "status": "PENDING",
  "amount": 150000.00,
  "paymentMethod": "MIDTRANS_VA",
  "instructions": {
    "bank": "BCA",
    "virtualAccountNumber": "70012845561937",
    "qrCodeUrl": null,
    "expiresAt": "2026-10-23 10:15:00"
  }
}`;

const topUpReplayed: string = `{
  "referenceNumber": "TOPUP-7c1e2f0a-3b4d-4e5f-9a8b-1c2d3e4f5a6b",
  "status": "SUCCESS",
  "amount": 150000.00,
  "paymentMethod": "MIDTRANS_VA",
  "instructions": null
}`;

const topUpPending: string = `{
  "referenceNumber": "TOPUP-3c1f9a2e-7b4d-4e8a-9f60-2d5b8c7a1e43",
  "status": "PENDING",
  "amount": 250000.00,
  "paymentMethod": "MIDTRANS_QRIS",
  "instructions": {
    "bank": null,
    "virtualAccountNumber": null,
    "qrCodeUrl": "https://payments.example.com/v2/qris/2f4c6e8a-0b1d-4f3a-8c5e-7a9b1d3f5e60/qr-code",
    "expiresAt": "2026-10-22 10:30:00"
  }
}`;

const topUpConcluded: string = `{
  "referenceNumber": "TOPUP-3c1f9a2e-7b4d-4e8a-9f60-2d5b8c7a1e43",
  "status": "EXPIRED",
  "amount": 250000.00,
  "paymentMethod": "MIDTRANS_QRIS",
  "instructions": null
}`;

export const paymentAnswers: readonly RestCase[] = [
  {
    status: 400,
    when: "rest.payment.answers.bodyUnreadable",
    json: {
      error: "the request body is not JSON this endpoint can read"
    },
    source: restSource(
      "payment",
      "modules/api/src/main/java/com/kinetix/payment/api/config/GlobalExceptionHandler.java",
      139,
      153
    )
  },
  {
    status: 401,
    when: "rest.payment.answers.tokenMissing",
    headers: ["WWW-Authenticate: Bearer"],
    json: {
      error: "a valid access token from identity is required"
    },
    source: restSource(
      "payment",
      "modules/api/src/main/java/com/kinetix/payment/api/security/AuthenticationRefusals.java",
      37,
      46
    )
  },
  {
    status: 401,
    when: "rest.payment.answers.tokenRefused",
    headers: ['WWW-Authenticate: Bearer error="invalid_token"'],
    json: {
      error: "a valid access token from identity is required"
    },
    source: restSource(
      "payment",
      "modules/api/src/main/java/com/kinetix/payment/api/security/AuthenticationRefusals.java",
      67,
      85
    )
  },
  {
    status: 401,
    when: "rest.payment.answers.claimMissing",
    json: {
      error: "claim 'role' is missing or not a string"
    },
    source: restSource(
      "payment",
      "modules/api/src/main/java/com/kinetix/payment/api/security/AccessClaims.java",
      23,
      30
    )
  },
  {
    status: 404,
    when: "rest.payment.answers.noRoute",
    json: {
      error: "No static resource api/v1/payment/wallet."
    },
    source: restSource(
      "payment",
      "modules/api/src/main/java/com/kinetix/payment/api/config/GlobalExceptionHandler.java",
      155,
      172
    )
  },
  {
    status: 405,
    when: "rest.payment.answers.methodNotAllowed",
    headers: ["Allow: GET"],
    json: {
      error: "Method 'DELETE' is not supported."
    },
    source: restSource(
      "payment",
      "modules/api/src/main/java/com/kinetix/payment/api/config/GlobalExceptionHandler.java",
      155,
      172
    )
  },
  {
    status: 415,
    when: "rest.payment.answers.mediaType",
    headers: ["Accept: application/json, application/*+json"],
    json: {
      error: "Content-Type 'text/plain' is not supported."
    },
    source: restSource(
      "payment",
      "modules/api/src/main/java/com/kinetix/payment/api/config/GlobalExceptionHandler.java",
      155,
      172
    )
  },
  {
    status: 500,
    when: "rest.payment.answers.internal",
    json: {
      error: "the payment service failed to handle this request"
    },
    source: restSource(
      "payment",
      "modules/api/src/main/java/com/kinetix/payment/api/controller/ErrorResponseController.java",
      14,
      26
    )
  },
  {
    status: 503,
    when: "rest.payment.answers.database",
    json: {
      error: "the payment ledger could not be reached; try again"
    },
    source: restSource(
      "payment",
      "modules/api/src/main/java/com/kinetix/payment/api/config/GlobalExceptionHandler.java",
      109,
      120
    )
  },
  {
    status: 503,
    when: "rest.payment.answers.signingKeys",
    json: {
      error: "identity's signing keys could not be read, so the token could not be checked; try again"
    },
    source: restSource(
      "payment",
      "modules/api/src/main/java/com/kinetix/payment/api/security/AuthenticationRefusals.java",
      48,
      65
    )
  }
];

export const paymentEndpoints: readonly RestEndpoint[] = [
  {
    id: "payment.customerBalance",
    service: "payment",
    method: "GET",
    path: "/api/v1/payment/wallet/customer/balance",
    summary: "rest.payment.customerBalance.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.payment.customerBalance.who"
    },
    request: {
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.payment.customerBalance.case.found",
        contentType: "application/json",
        raw: customerWalletFound,
        source: restSource(
          "payment",
          "modules/api/src/main/java/com/kinetix/payment/api/dto/WalletResponse.java",
          20,
          30
        )
      },
      {
        status: 200,
        when: "rest.payment.customerBalance.case.notYet",
        contentType: "application/json",
        raw: customerWalletNotYet,
        source: restSource(
          "payment",
          "modules/api/src/main/java/com/kinetix/payment/api/controller/WalletController.java",
          35,
          37
        )
      },
      {
        status: 403,
        when: "rest.payment.customerBalance.case.wrongRole",
        json: {
          error: "an account whose role is seller holds no customer wallet"
        },
        source: restSource(
          "payment",
          "modules/api/src/main/java/com/kinetix/payment/api/controller/WalletController.java",
          86,
          95
        )
      }
    ],
    source: restSource(
      "payment",
      "modules/api/src/main/java/com/kinetix/payment/api/controller/WalletController.java",
      32,
      38
    )
  },
  {
    id: "payment.customerTopUp",
    service: "payment",
    method: "POST",
    path: "/api/v1/payment/wallet/customer/topup",
    summary: "rest.payment.customerTopUp.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.payment.customerTopUp.who"
    },
    request: {
      fields: [
        {
          name: "Idempotency-Key",
          in: "header",
          type: "string",
          required: true,
          rule: "rest.payment.customerTopUp.field.idempotencyKey"
        },
        {
          name: "amount",
          in: "body",
          type: "number",
          required: true,
          rule: "rest.payment.customerTopUp.field.amount"
        },
        {
          name: "paymentMethod",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.payment.customerTopUp.field.paymentMethod"
        },
        {
          name: "bank",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.payment.customerTopUp.field.bank"
        }
      ],
      headers: ["Idempotency-Key: topup-22222222-3333-4444-8555-666666666666"],
      json: {
        amount: 150000,
        paymentMethod: "MIDTRANS_VA",
        bank: "BCA"
      }
    },
    cases: [
      {
        status: 202,
        when: "rest.payment.customerTopUp.case.charged",
        contentType: "application/json",
        raw: topUpCharged,
        source: restSource(
          "payment",
          "modules/application/src/main/java/com/kinetix/payment/application/TopUpService.java",
          347,
          365
        )
      },
      {
        status: 202,
        when: "rest.payment.customerTopUp.case.replayed",
        contentType: "application/json",
        raw: topUpReplayed,
        source: restSource(
          "payment",
          "modules/application/src/main/java/com/kinetix/payment/application/TopUpService.java",
          435,
          444
        )
      },
      {
        status: 400,
        when: "rest.payment.customerTopUp.case.missingKey",
        json: {
          error: "Required header 'Idempotency-Key' is not present."
        },
        source: restSource(
          "payment",
          "modules/api/src/main/java/com/kinetix/payment/api/config/GlobalExceptionHandler.java",
          155,
          172
        )
      },
      {
        status: 400,
        when: "rest.payment.customerTopUp.case.invalid",
        json: {
          error: "A payment method is required: MIDTRANS_VA or MIDTRANS_QRIS; Minimum top-up amount is IDR 1,000"
        },
        source: restSource(
          "payment",
          "modules/api/src/main/java/com/kinetix/payment/api/config/GlobalExceptionHandler.java",
          122,
          137
        )
      },
      {
        status: 400,
        when: "rest.payment.customerTopUp.case.ruleBroken",
        json: {
          error: "a virtual-account top-up needs a bank"
        },
        source: restSource(
          "payment",
          "modules/application/src/main/java/com/kinetix/payment/application/TopUpService.java",
          472,
          516
        )
      },
      {
        status: 403,
        when: "rest.payment.customerTopUp.case.wrongRole",
        json: {
          error: "an account whose role is courier holds no customer wallet"
        },
        source: restSource(
          "payment",
          "modules/api/src/main/java/com/kinetix/payment/api/controller/WalletController.java",
          86,
          95
        )
      },
      {
        status: 409,
        when: "rest.payment.customerTopUp.case.keyReused",
        json: {
          error: "this Idempotency-Key was already used for a different top-up; a key names one request"
        },
        source: restSource(
          "payment",
          "modules/application/src/main/java/com/kinetix/payment/application/TopUpService.java",
          409,
          418
        )
      },
      {
        status: 422,
        when: "rest.payment.customerTopUp.case.amountAboveLimit",
        json: {
          error: "a single top-up is at most IDR 2,000,000",
          code: "TOP_UP_AMOUNT_ABOVE_LIMIT",
          limit: "2000000"
        },
        source: restSource(
          "payment",
          "modules/application/src/main/java/com/kinetix/payment/application/TopUpService.java",
          487,
          493
        )
      },
      {
        status: 422,
        when: "rest.payment.customerTopUp.case.walletFull",
        json: {
          error:
            "this top-up would bring the wallet to IDR 2,150,000, above the IDR 2,000,000 a customer wallet may hold",
          code: "WALLET_BALANCE_LIMIT_EXCEEDED",
          limit: "2000000"
        },
        source: restSource(
          "payment",
          "modules/application/src/main/java/com/kinetix/payment/application/TopUpService.java",
          446,
          465
        )
      },
      {
        status: 422,
        when: "rest.payment.customerTopUp.case.walletFullAwaitingPayment",
        json: {
          error:
            "with IDR 250,000 in top-ups still awaiting payment, this top-up would bring the wallet to IDR 2,150,000, above the IDR 2,000,000 a customer wallet may hold; a top-up that expires or fails stops counting",
          code: "WALLET_BALANCE_LIMIT_EXCEEDED",
          limit: "2000000"
        },
        source: restSource(
          "payment",
          "modules/application/src/main/java/com/kinetix/payment/application/TopUpService.java",
          446,
          470
        )
      },
      {
        status: 502,
        when: "rest.payment.customerTopUp.case.gatewayRefused",
        json: {
          error: "the payment gateway refused this top-up; no charge was created and no balance changed",
          referenceNumber: "TOPUP-7c1e2f0a-3b4d-4e5f-9a8b-1c2d3e4f5a6b"
        },
        source: restSource(
          "payment",
          "modules/application/src/main/java/com/kinetix/payment/application/TopUpService.java",
          366,
          387
        )
      },
      {
        status: 503,
        when: "rest.payment.customerTopUp.case.gatewayUnknown",
        json: {
          error:
            "the payment gateway gave no definite answer; this top-up stays pending, so ask for its status rather than starting another",
          referenceNumber: "TOPUP-7c1e2f0a-3b4d-4e5f-9a8b-1c2d3e4f5a6b"
        },
        source: restSource(
          "payment",
          "modules/application/src/main/java/com/kinetix/payment/application/TopUpService.java",
          388,
          400
        )
      },
      {
        status: 503,
        when: "rest.payment.customerTopUp.case.earlierAttemptUnknown",
        json: {
          error:
            "an earlier attempt with this key got no definite answer from the payment gateway; ask for this top-up's status rather than retrying",
          referenceNumber: "TOPUP-7c1e2f0a-3b4d-4e5f-9a8b-1c2d3e4f5a6b"
        },
        source: restSource(
          "payment",
          "modules/application/src/main/java/com/kinetix/payment/application/TopUpService.java",
          420,
          426
        )
      }
    ],
    source: restSource(
      "payment",
      "modules/api/src/main/java/com/kinetix/payment/api/controller/WalletController.java",
      40,
      59
    )
  },
  {
    id: "payment.customerTopUpStatus",
    service: "payment",
    method: "GET",
    path: "/api/v1/payment/wallet/customer/topup/{referenceNumber}",
    summary: "rest.payment.customerTopUpStatus.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.payment.customerTopUpStatus.who"
    },
    request: {
      fields: [
        {
          name: "referenceNumber",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.payment.customerTopUpStatus.field.referenceNumber"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.payment.customerTopUpStatus.case.pending",
        contentType: "application/json",
        raw: topUpPending,
        source: restSource(
          "payment",
          "modules/application/src/main/java/com/kinetix/payment/application/TopUpService.java",
          121,
          131
        )
      },
      {
        status: 200,
        when: "rest.payment.customerTopUpStatus.case.concluded",
        contentType: "application/json",
        raw: topUpConcluded,
        source: restSource(
          "payment",
          "modules/application/src/main/java/com/kinetix/payment/application/TopUpService.java",
          438,
          444
        )
      },
      {
        status: 403,
        when: "rest.payment.customerTopUpStatus.case.wrongRole",
        json: {
          error: "an account whose role is seller holds no customer wallet"
        },
        source: restSource(
          "payment",
          "modules/api/src/main/java/com/kinetix/payment/api/controller/WalletController.java",
          86,
          95
        )
      },
      {
        status: 404,
        when: "rest.payment.customerTopUpStatus.case.notFound",
        json: {
          error: "no top-up TOPUP-3c1f9a2e-7b4d-4e8a-9f60-2d5b8c7a1e43 belongs to this account"
        },
        source: restSource(
          "payment",
          "modules/application/src/main/java/com/kinetix/payment/application/TopUpService.java",
          121,
          129
        )
      }
    ],
    source: restSource(
      "payment",
      "modules/api/src/main/java/com/kinetix/payment/api/controller/WalletController.java",
      61,
      68
    )
  },
  {
    id: "payment.merchantBalance",
    service: "payment",
    method: "GET",
    path: "/api/v1/payment/wallet/merchant/balance",
    summary: "rest.payment.merchantBalance.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.payment.merchantBalance.who"
    },
    request: {
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.payment.merchantBalance.case.found",
        contentType: "application/json",
        raw: merchantWalletFound,
        source: restSource(
          "payment",
          "modules/api/src/main/java/com/kinetix/payment/api/dto/WalletResponse.java",
          32,
          42
        )
      },
      {
        status: 200,
        when: "rest.payment.merchantBalance.case.notYet",
        contentType: "application/json",
        raw: merchantWalletNotYet,
        source: restSource(
          "payment",
          "modules/api/src/main/java/com/kinetix/payment/api/controller/WalletController.java",
          73,
          75
        )
      },
      {
        status: 403,
        when: "rest.payment.merchantBalance.case.wrongRole",
        json: {
          error: "an account whose role is customer holds no seller wallet"
        },
        source: restSource(
          "payment",
          "modules/api/src/main/java/com/kinetix/payment/api/controller/WalletController.java",
          86,
          95
        )
      }
    ],
    source: restSource(
      "payment",
      "modules/api/src/main/java/com/kinetix/payment/api/controller/WalletController.java",
      70,
      76
    )
  },
  {
    id: "payment.driverBalance",
    service: "payment",
    method: "GET",
    path: "/api/v1/payment/wallet/driver/balance",
    summary: "rest.payment.driverBalance.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.payment.driverBalance.who"
    },
    request: {
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.payment.driverBalance.case.found",
        contentType: "application/json",
        raw: driverWalletFound,
        source: restSource(
          "payment",
          "modules/api/src/main/java/com/kinetix/payment/api/dto/WalletResponse.java",
          44,
          54
        )
      },
      {
        status: 200,
        when: "rest.payment.driverBalance.case.notYet",
        contentType: "application/json",
        raw: driverWalletNotYet,
        source: restSource(
          "payment",
          "modules/api/src/main/java/com/kinetix/payment/api/controller/WalletController.java",
          81,
          83
        )
      },
      {
        status: 403,
        when: "rest.payment.driverBalance.case.wrongRole",
        json: {
          error: "an account whose role is customer holds no courier wallet"
        },
        source: restSource(
          "payment",
          "modules/api/src/main/java/com/kinetix/payment/api/controller/WalletController.java",
          86,
          95
        )
      }
    ],
    source: restSource(
      "payment",
      "modules/api/src/main/java/com/kinetix/payment/api/controller/WalletController.java",
      78,
      84
    )
  },
  {
    id: "payment.midtransNotification",
    service: "payment",
    method: "POST",
    path: "/api/v1/payment/gateway/midtrans/notifications",
    summary: "rest.payment.midtransNotification.summary",
    access: {
      token: "none",
      gatewayVerifies: false,
      who: "rest.payment.midtransNotification.who"
    },
    request: {
      fields: [
        {
          name: "order_id",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.payment.midtransNotification.field.orderId"
        },
        {
          name: "status_code",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.payment.midtransNotification.field.statusCode"
        },
        {
          name: "gross_amount",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.payment.midtransNotification.field.grossAmount"
        },
        {
          name: "signature_key",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.payment.midtransNotification.field.signatureKey"
        },
        {
          name: "transaction_status",
          in: "body",
          type: "string",
          required: false,
          rule: "rest.payment.midtransNotification.field.transactionStatus"
        }
      ],
      json: {
        order_id: "TOPUP-7c1e2f0a-3b4d-4e5f-9a8b-1c2d3e4f5a6b",
        status_code: "200",
        gross_amount: "150000.00",
        signature_key: "<sha-512 hex digest>",
        transaction_status: "settlement"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.payment.midtransNotification.case.processed",
        json: {
          referenceNumber: "TOPUP-7c1e2f0a-3b4d-4e5f-9a8b-1c2d3e4f5a6b",
          status: "SUCCESS"
        },
        source: restSource(
          "payment",
          "modules/api/src/main/java/com/kinetix/payment/api/controller/MidtransNotificationController.java",
          48,
          54
        )
      },
      {
        status: 401,
        when: "rest.payment.midtransNotification.case.signatureRejected",
        json: {
          error: "the notification signature does not verify"
        },
        source: restSource(
          "payment",
          "modules/api/src/main/java/com/kinetix/payment/api/controller/MidtransNotificationController.java",
          32,
          46
        )
      },
      {
        status: 404,
        when: "rest.payment.midtransNotification.case.unknownOrder",
        json: {
          error: "no top-up is recorded under TOPUP-9e8d7c6b-5a4f-4e3d-8c2b-1a0f9e8d7c6b"
        },
        source: restSource(
          "payment",
          "modules/application/src/main/java/com/kinetix/payment/application/TopUpService.java",
          174,
          177
        )
      },
      {
        status: 503,
        when: "rest.payment.midtransNotification.case.gatewayUnknown",
        json: {
          error:
            "the payment gateway could not be asked whether TOPUP-7c1e2f0a-3b4d-4e5f-9a8b-1c2d3e4f5a6b was paid, so nothing was decided",
          referenceNumber: "TOPUP-7c1e2f0a-3b4d-4e5f-9a8b-1c2d3e4f5a6b"
        },
        source: restSource(
          "payment",
          "modules/application/src/main/java/com/kinetix/payment/application/TopUpService.java",
          182,
          200
        )
      }
    ],
    source: restSource(
      "payment",
      "modules/api/src/main/java/com/kinetix/payment/api/controller/MidtransNotificationController.java",
      30,
      55
    )
  }
];
