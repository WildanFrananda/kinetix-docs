import { repositorySource } from "../engine/repository_source";
import type { NonEmpty } from "../types/non_empty.type";
import type { Scenario } from "../types/scenario.type";
import type { TrustCall } from "../types/trust_call.type";
import type { TrustField } from "../types/trust_field.type";
import type { TrustState } from "../types/trust_state.type";
import type { TrustVerdict } from "../types/trust_verdict.type";

const order = "kinetix-order-service";
const payment = "kinetix-payment-service";

const orderNow = "82834065c34981f1c69a88b3d3317d20396358d9";
const orderBeforePrice = "c66ffe7d43ca7994e7f06c04e2a5d6649dccd34f";
const orderBeforeShipping = "496f1392a3cd11c6fb9ba55b025882d52515b90c";
const paymentNow = "c08f8cb6298e76495f6b259b239e20b1cd3231de";
const paymentBefore = "0c7dc32161471a4f0bf80632dfdd7f778990c759";

const walletController = "modules/api/src/main/java/com/kinetix/payment/api/controller/WalletController.java";
const walletService = "modules/application/src/main/java/com/kinetix/payment/application/WalletService.java";
const topUpService = "modules/application/src/main/java/com/kinetix/payment/application/TopUpService.java";
const notificationController =
  "modules/api/src/main/java/com/kinetix/payment/api/controller/MidtransNotificationController.java";

const actors = {
  client: "trust.actor.client",
  system: "trust.actor.system"
} as const;

function field(name: string, value: string, verdict: TrustVerdict): TrustField {
  return { name, value, verdict };
}

function call(from: string, to: string, label: string): TrustCall {
  return { from, to, label };
}

const cartBefore = [
  field("ProductId", "P-1", "choice"),
  field("Quantity", "1", "choice"),
  field("UnitPrice", "1", "asserted"),
  field("ProductTitle", "…", "asserted"),
  field("CategoryId", "…", "asserted"),
  field("MerchantPrincipalId", "…", "asserted")
];

const cartAfter = [field("ProductId", "P-1", "choice"), field("Quantity", "1", "choice")];

const cartResolved = [
  ...cartAfter,
  field("UnitPrice", "150.000", "resolved"),
  field("MerchantPrincipalId", "catalog", "resolved")
];

const price: Scenario<TrustState> = {
  id: "price",
  title: "trust.price.title",
  introduction: "trust.price.introduction",
  outcome: "trust.price.outcome",
  actors,
  initial: { era: "before", endpoint: "POST /api/v1/cart/items", fields: [], calls: [], outcome: null },
  steps: [
    {
      actor: "client",
      statement: "POST /api/v1/cart/items",
      narration: "trust.price.step1",
      source: repositorySource(order, orderBeforePrice, "DTOs/Requests/AddCartItemRequest.cs", 3, 10),
      state: {
        era: "before",
        endpoint: "POST /api/v1/cart/items",
        fields: cartBefore,
        calls: [call("client", "order", "POST /api/v1/cart/items")],
        outcome: null
      }
    },
    {
      actor: "system",
      statement: "pricing.CalculatePrice(base_price = 1)",
      narration: "trust.price.step2",
      source: repositorySource(order, orderBeforePrice, "Application/Services/OrderService.cs", 58, 58),
      state: {
        era: "before",
        endpoint: "POST /api/v1/orders/checkout",
        fields: cartBefore,
        calls: [
          call("client", "order", "POST /api/v1/cart/items"),
          call("order", "pricing", "CalculatePrice(base_price = 1)")
        ],
        outcome: null
      }
    },
    {
      actor: "system",
      statement: "payment.CreateEscrowHold(1)",
      narration: "trust.price.step3",
      state: {
        era: "before",
        endpoint: "POST /api/v1/orders/checkout",
        fields: cartBefore,
        calls: [
          call("client", "order", "POST /api/v1/cart/items"),
          call("order", "pricing", "CalculatePrice(base_price = 1)"),
          call("order", "payment", "CreateEscrowHold(Rp 1)")
        ],
        outcome: { amounts: [{ kind: "charged", value: "Rp 1" }], verdict: "forged" }
      }
    },
    {
      actor: "client",
      statement: "POST /api/v1/cart/items",
      narration: "trust.price.step4",
      source: repositorySource(order, orderNow, "DTOs/Requests/AddCartItemRequest.cs", 3, 6),
      state: {
        era: "after",
        endpoint: "POST /api/v1/cart/items",
        fields: cartAfter,
        calls: [call("client", "order", "POST /api/v1/cart/items")],
        outcome: null
      }
    },
    {
      actor: "system",
      statement: "catalog.GetProduct(P-1)",
      narration: "trust.price.step5",
      source: repositorySource(order, orderNow, "Application/Services/CartService.cs", 28, 48),
      state: {
        era: "after",
        endpoint: "POST /api/v1/cart/items",
        fields: cartResolved,
        calls: [call("client", "order", "POST /api/v1/cart/items"), call("order", "catalog", "GetProduct(P-1)")],
        outcome: null
      }
    },
    {
      actor: "system",
      statement: "catalog.GetProduct(P-1) → pricing.CalculatePrice(150.000)",
      narration: "trust.price.step6",
      source: repositorySource(order, orderNow, "Application/Services/OrderService.cs", 56, 73),
      state: {
        era: "after",
        endpoint: "POST /api/v1/orders/checkout",
        fields: cartResolved,
        calls: [
          call("client", "order", "POST /api/v1/orders/checkout"),
          call("order", "catalog", "GetProduct(P-1)"),
          call("order", "pricing", "CalculatePrice(base_price = 150.000)"),
          call("order", "payment", "CreateEscrowHold(Rp 150.000)")
        ],
        outcome: { amounts: [{ kind: "charged", value: "Rp 150.000" }], verdict: "owned" }
      }
    }
  ]
};

const checkoutBefore = [
  field("ShippingAddress", "…", "choice"),
  field("ShippingServiceTier", "KINETIX_REGULAR", "choice"),
  field("BaseShippingFee", "0", "asserted"),
  field("DistanceKm", "0", "asserted")
];

const checkoutAfter = [
  field("ShippingAddress", "…", "choice"),
  field("ShippingServiceTier", "KINETIX_REGULAR", "choice")
];

const checkoutResolved = [...checkoutAfter, field("BaseShippingFee", "pricing", "resolved")];

const shipping: Scenario<TrustState> = {
  id: "shipping",
  title: "trust.shipping.title",
  introduction: "trust.shipping.introduction",
  outcome: "trust.shipping.outcome",
  actors,
  initial: { era: "before", endpoint: "POST /api/v1/orders/checkout", fields: [], calls: [], outcome: null },
  steps: [
    {
      actor: "client",
      statement: "POST /api/v1/orders/checkout",
      narration: "trust.shipping.step1",
      source: repositorySource(order, orderBeforeShipping, "DTOs/Requests/CheckoutRequest.cs", 3, 9),
      state: {
        era: "before",
        endpoint: "POST /api/v1/orders/checkout",
        fields: checkoutBefore,
        calls: [call("client", "order", "POST /api/v1/orders/checkout")],
        outcome: null
      }
    },
    {
      actor: "system",
      statement: "pricing.CalculatePrice(base_shipping_fee = 0)",
      narration: "trust.shipping.step2",
      source: repositorySource(order, orderBeforeShipping, "Application/Services/OrderService.cs", 44, 44),
      state: {
        era: "before",
        endpoint: "POST /api/v1/orders/checkout",
        fields: checkoutBefore,
        calls: [call("client", "order", "POST /api/v1/orders/checkout"), call("order", "pricing", "CalculatePrice(base_shipping_fee = 0)")],
        outcome: null
      }
    },
    {
      actor: "system",
      statement: "payment.CreateEscrowHold(shipping_fee = 0)",
      narration: "trust.shipping.step3",
      source: repositorySource(order, orderBeforeShipping, "Application/Services/OrderService.cs", 97, 97),
      state: {
        era: "before",
        endpoint: "POST /api/v1/orders/checkout",
        fields: checkoutBefore,
        calls: [
          call("client", "order", "POST /api/v1/orders/checkout"),
          call("order", "pricing", "CalculatePrice(base_shipping_fee = 0)"),
          call("order", "payment", "CreateEscrowHold(shipping_fee = Rp 0)")
        ],
        outcome: { amounts: [{ kind: "charged", value: "Rp 0" }], verdict: "forged" }
      }
    },
    {
      actor: "client",
      statement: "POST /api/v1/orders/checkout",
      narration: "trust.shipping.step4",
      source: repositorySource(order, orderNow, "DTOs/Requests/CheckoutRequest.cs", 3, 9),
      state: {
        era: "after",
        endpoint: "POST /api/v1/orders/checkout",
        fields: checkoutAfter,
        calls: [call("client", "order", "POST /api/v1/orders/checkout")],
        outcome: null
      }
    },
    {
      actor: "system",
      statement: "matching.EstimateShippingOptions → pricing.QuoteShipping",
      narration: "trust.shipping.step5",
      source: repositorySource(order, orderNow, "Application/Services/OrderService.cs", 322, 404),
      state: {
        era: "after",
        endpoint: "POST /api/v1/orders/checkout",
        fields: checkoutResolved,
        calls: [
          call("client", "order", "POST /api/v1/orders/checkout"),
          call("order", "matching", "EstimateShippingOptions"),
          call("order", "pricing", "QuoteShipping")
        ],
        outcome: null
      }
    },
    {
      actor: "system",
      statement: "pricing.CalculatePrice(journey)",
      narration: "trust.shipping.step6",
      source: repositorySource(order, orderNow, "Application/Services/OrderService.cs", 71, 89),
      state: {
        era: "after",
        endpoint: "POST /api/v1/orders/checkout",
        fields: checkoutResolved,
        calls: [
          call("client", "order", "POST /api/v1/orders/checkout"),
          call("order", "matching", "EstimateShippingOptions"),
          call("order", "pricing", "QuoteShipping"),
          call("order", "pricing", "CalculatePrice(journey)"),
          call("order", "payment", "CreateEscrowHold(shipping_fee = Rp 9.000)")
        ],
        outcome: { amounts: [{ kind: "charged", value: "Rp 9.000" }], verdict: "owned" }
      }
    }
  ]
};

const topUpBefore = [field("amount", "10.000.000", "asserted"), field("paymentMethod", "—", "choice")];

const topUpAfter = [
  field("amount", "100.000", "choice"),
  field("paymentMethod", "VA / QRIS", "choice"),
  field("Idempotency-Key", "…", "choice")
];

const topUpSettled = [...topUpAfter, field("gross_amount", "Midtrans: 100.000", "resolved")];

const topUp: Scenario<TrustState> = {
  id: "top-up",
  title: "trust.topUp.title",
  introduction: "trust.topUp.introduction",
  outcome: "trust.topUp.outcome",
  actors,
  initial: { era: "before", endpoint: "POST /api/v1/payment/wallet/customer/topup", fields: [], calls: [], outcome: null },
  steps: [
    {
      actor: "client",
      statement: "POST /api/v1/payment/wallet/customer/topup",
      narration: "trust.topUp.step1",
      source: repositorySource(payment, paymentBefore, walletController, 34, 41),
      state: {
        era: "before",
        endpoint: "POST /api/v1/payment/wallet/customer/topup",
        fields: topUpBefore,
        calls: [call("client", "payment", "topup(amount = 10.000.000)")],
        outcome: null
      }
    },
    {
      actor: "system",
      statement: "wallet.topUp(amount)",
      narration: "trust.topUp.step2",
      source: repositorySource(payment, paymentBefore, walletService, 45, 51),
      state: {
        era: "before",
        endpoint: "POST /api/v1/payment/wallet/customer/topup",
        fields: topUpBefore,
        calls: [call("client", "payment", "topup(amount = 10.000.000)"), call("payment", "wallet", "credit(10.000.000)")],
        outcome: null
      }
    },
    {
      actor: "system",
      statement: "200 OK",
      narration: "trust.topUp.step3",
      state: {
        era: "before",
        endpoint: "POST /api/v1/payment/wallet/customer/topup",
        fields: topUpBefore,
        calls: [call("client", "payment", "topup(amount = 10.000.000)"), call("payment", "wallet", "credit(10.000.000)")],
        outcome: {
          amounts: [
            { kind: "credited", value: "Rp 10.000.000" },
            { kind: "paid", value: "Rp 0" }
          ],
          verdict: "forged"
        }
      }
    },
    {
      actor: "client",
      statement: "POST /api/v1/payment/wallet/customer/topup",
      narration: "trust.topUp.step4",
      source: repositorySource(payment, paymentNow, topUpService, 65, 92),
      state: {
        era: "after",
        endpoint: "POST /api/v1/payment/wallet/customer/topup",
        fields: topUpAfter,
        calls: [
          call("client", "payment", "topup(amount = 100.000)"),
          call("payment", "Midtrans", "POST /v2/charge (PENDING)"),
          call("payment", "client", "202 Accepted")
        ],
        outcome: null
      }
    },
    {
      actor: "system",
      statement: "POST /api/v1/payment/gateway/midtrans/notifications",
      narration: "trust.topUp.step5",
      source: repositorySource(payment, paymentNow, notificationController, 30, 48),
      state: {
        era: "after",
        endpoint: "POST /api/v1/payment/gateway/midtrans/notifications",
        fields: topUpAfter,
        calls: [
          call("Midtrans", "payment", "notification (SHA-512 ✓)"),
          call("payment", "Midtrans", "GET /v2/{order}/status")
        ],
        outcome: null
      }
    },
    {
      actor: "system",
      statement: "wallet.credit(100.000)",
      narration: "trust.topUp.step6",
      source: repositorySource(payment, paymentNow, topUpService, 134, 186),
      state: {
        era: "after",
        endpoint: "POST /api/v1/payment/gateway/midtrans/notifications",
        fields: topUpSettled,
        calls: [
          call("Midtrans", "payment", "notification (SHA-512 ✓)"),
          call("payment", "Midtrans", "GET /v2/{order}/status"),
          call("payment", "wallet", "credit(100.000)")
        ],
        outcome: {
          amounts: [
            { kind: "credited", value: "Rp 100.000" },
            { kind: "paid", value: "Rp 100.000" }
          ],
          verdict: "owned"
        }
      }
    }
  ]
};

export const trustScenarios: NonEmpty<Scenario<TrustState>> = [price, shipping, topUp];
