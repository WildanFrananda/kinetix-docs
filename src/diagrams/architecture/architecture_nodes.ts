import type { MapNode } from "../types/map_node.type";

const github = "https://github.com/WildanFrananda";
const postgres = "PostgreSQL";

export const architectureNodes: readonly MapNode[] = [
  {
    id: "clients",
    kind: "client",
    name: "clients",
    title: "map.node.clients.title",
    summary: "map.node.clients.summary",
    x: 360,
    y: 55,
    serves: [],
    routes: [],
    stores: [],
    deployed: true
  },
  {
    id: "courier",
    kind: "client",
    name: "courier-mobile",
    title: "map.node.courier.title",
    summary: "stack.edge.courier.summary",
    x: 620,
    y: 55,
    logo: "flutter",
    repository: `${github}/kinetix-courier-mobile`,
    serves: [],
    routes: [],
    stores: [],
    deployed: true
  },
  {
    id: "gateway",
    kind: "gateway",
    name: "api-gateway",
    summary: "stack.edge.gateway.summary",
    x: 490,
    y: 155,
    repository: `${github}/kinetix-api-gateway`,
    serves: [],
    routes: [],
    stores: [],
    deployed: true
  },
  {
    id: "warehouse",
    kind: "service",
    name: "warehouse",
    summary: "service.warehouse.owns",
    x: 265,
    y: 245,
    logo: "ruby",
    repository: `${github}/kinetix-warehouse-service`,
    serves: [
      "fulfillment.v1.BinStockService/CheckBinStock",
      "fulfillment.v1.BinStockService/CheckBinStockBatch",
      "fulfillment.v1.BinStockService/ReserveStock",
      "fulfillment.v1.BinStockService/ReleaseStock",
      "fulfillment.v1.FulfillmentTaskService/CreateFulfillmentTask",
      "fulfillment.v1.FulfillmentTaskService/CancelFulfillmentTask",
      "fulfillment.v1.FulfillmentTaskService/RecordCourierAwb"
    ],
    routes: ["/api/v1/warehouse"],
    stores: ["PostgreSQL (primary, cache, queue, cable)"],
    deployed: true
  },
  {
    id: "catalog",
    kind: "service",
    name: "catalog",
    summary: "service.catalog.owns",
    x: 500,
    y: 270,
    logo: "python",
    repository: `${github}/kinetix-catalog-service`,
    serves: [
      "catalog.v1.CatalogService/ChangedSince",
      "catalog.v1.CatalogService/GetProduct",
      "catalog.v1.CatalogService/CountProducts"
    ],
    routes: ["/api/v1/products", "/api/v1/categories"],
    stores: [postgres],
    deployed: true
  },
  {
    id: "matching",
    kind: "service",
    name: "matching",
    summary: "service.matching.owns",
    x: 720,
    y: 275,
    logo: "elixir",
    repository: `${github}/kinetix-matching-service`,
    serves: [
      "fleet.v1.CourierTelemetryService/DispatchCourier",
      "fleet.v1.FleetRegistryService/RegisterDriver",
      "fleet.v1.FleetRegistryService/ActivateDriver",
      "shipping.v1.ShippingService/EstimateShippingOptions"
    ],
    routes: ["/api/v1/matching"],
    stores: [postgres],
    deployed: true
  },
  {
    id: "pricing",
    kind: "service",
    name: "pricing",
    summary: "service.pricing.owns",
    x: 95,
    y: 330,
    logo: "rust",
    repository: `${github}/kinetix-pricing-service`,
    serves: [
      "pricing.v1.PricingService/CalculatePrice",
      "pricing.v1.PricingService/QuoteShipping",
      "pricing.v1.PricingService/RedeemVoucher",
      "pricing.v1.PricingService/ReleaseVoucherRedemption",
      "pricing.v1.PricingService/AllocateFlashSaleStock",
      "pricing.v1.PricingService/ReleaseFlashSaleAllocation"
    ],
    routes: ["/api/v1/pricing"],
    stores: [postgres],
    deployed: true
  },
  {
    id: "review",
    kind: "service",
    name: "review",
    summary: "service.review.owns",
    x: 95,
    y: 420,
    logo: "php",
    repository: `${github}/kinetix-review-service`,
    serves: [],
    routes: ["/api/v1/reviews"],
    stores: [postgres],
    deployed: true
  },
  {
    id: "payment",
    kind: "service",
    name: "payment",
    summary: "service.payment.owns",
    x: 95,
    y: 510,
    logo: "java",
    repository: `${github}/kinetix-payment-service`,
    serves: [
      "payment.v1.PaymentService/CreateEscrowHold",
      "payment.v1.PaymentService/ReleaseEscrow",
      "payment.v1.PaymentService/RefundEscrow",
      "payment.v1.PaymentService/SettleShippingFee",
      "payment.v1.PaymentService/GetEscrowStatus"
    ],
    routes: ["/api/v1/payment"],
    stores: [postgres],
    deployed: true
  },
  {
    id: "order",
    kind: "service",
    name: "order",
    summary: "service.order.owns",
    x: 375,
    y: 450,
    logo: "csharp",
    repository: `${github}/kinetix-order-service`,
    serves: [
      "order.v1.OrderService/GetOrderDetails",
      "order.v1.OrderService/ListOrdersForPrincipal",
      "order.v1.OrderService/FulfillmentPacked",
      "order.v1.OrderService/OrderDelivered",
      "order.v1.OrderService/OpenReturn",
      "order.v1.OrderService/ReturnGoodsReceived",
      "order.v1.OrderService/OrdersChangedSince"
    ],
    routes: ["/api/v1/cart", "/api/v1/orders"],
    stores: [postgres, "Redis"],
    deployed: true
  },
  {
    id: "identity",
    kind: "service",
    name: "identity",
    summary: "service.identity.owns",
    x: 640,
    y: 420,
    logo: "typescript",
    repository: `${github}/kinetix-identity-service`,
    serves: [
      "identity.v1.IdentityService/ResolvePrincipal",
      "identity.v1.IdentityService/GetPrincipal",
      "identity.v1.IdentityService/GetUserProfile",
      "identity.v1.IdentityService/GetMerchantInfo",
      "identity.v1.IdentityService/MerchantsChangedSince",
      "identity.v1.IdentityService/ValidateToken",
      "geo.v1.GeocodingService/GeocodeAddress",
      "geo.v1.GeocodingService/GeocodeAddresses"
    ],
    routes: ["/api/v1/auth", "/api/v1/users", "/api/v1/sellers", "/api/v1/couriers", "/.well-known/jwks.json"],
    stores: [postgres],
    deployed: true
  },
  {
    id: "notification",
    kind: "service",
    name: "notification",
    summary: "service.notification.owns",
    x: 905,
    y: 360,
    logo: "scala",
    repository: `${github}/kinetix-notification-service`,
    serves: [
      "notification.v1.NotificationService/Notify",
      "notification.v1.NotificationService/GetDelivery",
      "notification.v1.NotificationService/RegisterDevice",
      "notification.v1.NotificationService/ForgetDevice"
    ],
    routes: [],
    stores: [postgres],
    deployed: true
  },
  {
    id: "communication",
    kind: "service",
    name: "communication",
    summary: "service.communication.owns",
    x: 905,
    y: 480,
    logo: "cplusplus",
    repository: `${github}/kinetix-communication-service`,
    serves: [],
    routes: [],
    stores: [postgres],
    deployed: false
  },
  {
    id: "search",
    kind: "service",
    name: "search",
    summary: "service.search.owns",
    x: 510,
    y: 580,
    logo: "go",
    repository: `${github}/kinetix-search-service`,
    serves: ["search.v1.SearchService/SearchProducts", "search.v1.SearchService/SuggestProducts"],
    routes: ["/api/v1/products/search", "/api/v1/products/suggest"],
    stores: ["Typesense", postgres],
    deployed: true
  },
  {
    id: "midtrans",
    kind: "external",
    name: "Midtrans",
    summary: "map.node.midtrans.summary",
    x: 95,
    y: 625,
    serves: [],
    routes: [],
    stores: [],
    deployed: true
  },
  {
    id: "nominatim",
    kind: "external",
    name: "Nominatim",
    summary: "map.node.nominatim.summary",
    x: 905,
    y: 610,
    serves: [],
    routes: [],
    stores: [],
    deployed: true
  }
];
