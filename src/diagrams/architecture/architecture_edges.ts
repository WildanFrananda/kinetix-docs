import type { MapEdge } from "../types/map_edge.type";

export const architectureEdges: readonly MapEdge[] = [
  {
    from: "clients",
    to: "gateway",
    kind: "http",
    calls: []
  },
  {
    from: "courier",
    to: "gateway",
    kind: "http",
    calls: [
      { operation: "POST /api/v1/couriers/register", source: { label: "driver_api.dart:12", href: "https://github.com/WildanFrananda/kinetix-courier-mobile/blob/5a6dd4ff5c0424c5d2ec4df95999a30f3e5f603d/lib/services/auth/driver_api.dart#L12" } },
      { operation: "POST /api/v1/auth/login", source: { label: "driver_api.dart:17", href: "https://github.com/WildanFrananda/kinetix-courier-mobile/blob/5a6dd4ff5c0424c5d2ec4df95999a30f3e5f603d/lib/services/auth/driver_api.dart#L17" } },
      { operation: "GET /api/v1/matching/driver/me", source: { label: "driver_api.dart:20", href: "https://github.com/WildanFrananda/kinetix-courier-mobile/blob/5a6dd4ff5c0424c5d2ec4df95999a30f3e5f603d/lib/services/auth/driver_api.dart#L20" } }
    ]
  },
  {
    from: "payment",
    to: "midtrans",
    kind: "external",
    calls: [
      { operation: "POST /v2/charge", source: { label: "MidtransPaymentGatewayAdapter.java:82", href: "https://github.com/WildanFrananda/kinetix-payment-service/blob/c08f8cb6298e76495f6b259b239e20b1cd3231de/modules/infrastructure/src/main/java/com/kinetix/payment/infrastructure/gateway/MidtransPaymentGatewayAdapter.java#L82" } },
      { operation: "GET /v2/{reference}/status", source: { label: "MidtransPaymentGatewayAdapter.java:108", href: "https://github.com/WildanFrananda/kinetix-payment-service/blob/c08f8cb6298e76495f6b259b239e20b1cd3231de/modules/infrastructure/src/main/java/com/kinetix/payment/infrastructure/gateway/MidtransPaymentGatewayAdapter.java#L108" } }
    ]
  },
  {
    from: "identity",
    to: "nominatim",
    kind: "external",
    calls: [
      { operation: "GET /search", source: { label: "nominatim_geocoding.adapter.ts:21", href: "https://github.com/WildanFrananda/kinetix-identity-service/blob/6b185b723ba48fd69a8b47a18f3be286694d54e2/src/infrastructure/geocoding/nominatim_geocoding.adapter.ts#L21" } }
    ]
  },
  {
    from: "identity",
    to: "matching",
    kind: "grpc",
    calls: [
      { operation: "fleet.v1.FleetRegistryService/RegisterDriver", source: { label: "fleet_registry_grpc.adapter.ts:38", href: "https://github.com/WildanFrananda/kinetix-identity-service/blob/6b185b723ba48fd69a8b47a18f3be286694d54e2/src/infrastructure/mesh/fleet_registry_grpc.adapter.ts#L38" } },
      { operation: "fleet.v1.FleetRegistryService/ActivateDriver", source: { label: "fleet_registry_grpc.adapter.ts:55", href: "https://github.com/WildanFrananda/kinetix-identity-service/blob/6b185b723ba48fd69a8b47a18f3be286694d54e2/src/infrastructure/mesh/fleet_registry_grpc.adapter.ts#L55" } }
    ]
  },
  {
    from: "catalog",
    to: "warehouse",
    kind: "grpc",
    calls: [
      { operation: "fulfillment.v1.BinStockService/CheckBinStock", source: { label: "bin_stock_client.py:44", href: "https://github.com/WildanFrananda/kinetix-catalog-service/blob/776bc6acb74c48b45fa9b30a98a2a12609b104ab/core/infrastructure/grpc/bin_stock_client.py#L44" } },
      { operation: "fulfillment.v1.BinStockService/CheckBinStockBatch", source: { label: "bin_stock_client.py:83", href: "https://github.com/WildanFrananda/kinetix-catalog-service/blob/776bc6acb74c48b45fa9b30a98a2a12609b104ab/core/infrastructure/grpc/bin_stock_client.py#L83" } }
    ]
  },
  {
    from: "catalog",
    to: "identity",
    kind: "grpc",
    calls: [
      { operation: "identity.v1.IdentityService/GetMerchantInfo", source: { label: "identity_client.py:54", href: "https://github.com/WildanFrananda/kinetix-catalog-service/blob/776bc6acb74c48b45fa9b30a98a2a12609b104ab/core/infrastructure/grpc/identity_client.py#L54" } }
    ]
  },
  {
    from: "pricing",
    to: "identity",
    kind: "grpc",
    calls: [
      { operation: "identity.v1.IdentityService/GetMerchantInfo", source: { label: "identity_merchant_directory.rs:39", href: "https://github.com/WildanFrananda/kinetix-pricing-service/blob/76e134d02c6bffba658eede7db7553d5b108bc80/src/clients/identity_merchant_directory.rs#L39" } }
    ]
  },
  {
    from: "pricing",
    to: "catalog",
    kind: "grpc",
    calls: [
      { operation: "catalog.v1.CatalogService/GetProduct", source: { label: "catalog_product_directory.rs:36", href: "https://github.com/WildanFrananda/kinetix-pricing-service/blob/76e134d02c6bffba658eede7db7553d5b108bc80/src/clients/catalog_product_directory.rs#L36" } }
    ]
  },
  {
    from: "order",
    to: "pricing",
    kind: "grpc",
    calls: [
      { operation: "pricing.v1.PricingService/CalculatePrice", source: { label: "PricingGrpcClient.cs:83", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/82834065c34981f1c69a88b3d3317d20396358d9/Infrastructure/Grpc/PricingGrpcClient.cs#L83" } },
      { operation: "pricing.v1.PricingService/QuoteShipping", source: { label: "PricingGrpcClient.cs:33", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/82834065c34981f1c69a88b3d3317d20396358d9/Infrastructure/Grpc/PricingGrpcClient.cs#L33" } },
      { operation: "pricing.v1.PricingService/RedeemVoucher", source: { label: "VoucherQuotaGrpcClient.cs:17", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/82834065c34981f1c69a88b3d3317d20396358d9/Infrastructure/Grpc/VoucherQuotaGrpcClient.cs#L17" } },
      { operation: "pricing.v1.PricingService/ReleaseVoucherRedemption", source: { label: "VoucherQuotaGrpcClient.cs:34", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/82834065c34981f1c69a88b3d3317d20396358d9/Infrastructure/Grpc/VoucherQuotaGrpcClient.cs#L34" } },
      { operation: "pricing.v1.PricingService/AllocateFlashSaleStock", source: { label: "FlashSaleGrpcClient.cs:17", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/82834065c34981f1c69a88b3d3317d20396358d9/Infrastructure/Grpc/FlashSaleGrpcClient.cs#L17" } },
      { operation: "pricing.v1.PricingService/ReleaseFlashSaleAllocation", source: { label: "FlashSaleGrpcClient.cs:35", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/82834065c34981f1c69a88b3d3317d20396358d9/Infrastructure/Grpc/FlashSaleGrpcClient.cs#L35" } }
    ]
  },
  {
    from: "order",
    to: "matching",
    kind: "grpc",
    calls: [
      { operation: "shipping.v1.ShippingService/EstimateShippingOptions", source: { label: "ShippingGrpcClient.cs:34", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/82834065c34981f1c69a88b3d3317d20396358d9/Infrastructure/Grpc/ShippingGrpcClient.cs#L34" } },
      { operation: "fleet.v1.CourierTelemetryService/DispatchCourier", source: { label: "FulfillmentPackedHandler.cs:71", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/82834065c34981f1c69a88b3d3317d20396358d9/Application/Fulfillment/FulfillmentPackedHandler.cs#L71" } }
    ]
  },
  {
    from: "order",
    to: "catalog",
    kind: "grpc",
    calls: [
      { operation: "catalog.v1.CatalogService/GetProduct", source: { label: "CatalogProductDirectory.cs:22", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/82834065c34981f1c69a88b3d3317d20396358d9/Infrastructure/Grpc/CatalogProductDirectory.cs#L22" } }
    ]
  },
  {
    from: "order",
    to: "warehouse",
    kind: "grpc",
    calls: [
      { operation: "fulfillment.v1.BinStockService/ReserveStock", source: { label: "StockGrpcClient.cs:17", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/82834065c34981f1c69a88b3d3317d20396358d9/Infrastructure/Grpc/StockGrpcClient.cs#L17" } },
      { operation: "fulfillment.v1.BinStockService/ReleaseStock", source: { label: "StockGrpcClient.cs:34", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/82834065c34981f1c69a88b3d3317d20396358d9/Infrastructure/Grpc/StockGrpcClient.cs#L34" } },
      { operation: "fulfillment.v1.FulfillmentTaskService/CreateFulfillmentTask", source: { label: "FulfillmentGrpcClient.cs:34", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/82834065c34981f1c69a88b3d3317d20396358d9/Infrastructure/Grpc/FulfillmentGrpcClient.cs#L34" } },
      { operation: "fulfillment.v1.FulfillmentTaskService/CancelFulfillmentTask", source: { label: "FulfillmentGrpcClient.cs:62", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/82834065c34981f1c69a88b3d3317d20396358d9/Infrastructure/Grpc/FulfillmentGrpcClient.cs#L62" } },
      { operation: "fulfillment.v1.FulfillmentTaskService/RecordCourierAwb", source: { label: "FulfillmentGrpcClient.cs:90", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/82834065c34981f1c69a88b3d3317d20396358d9/Infrastructure/Grpc/FulfillmentGrpcClient.cs#L90" } }
    ]
  },
  {
    from: "order",
    to: "payment",
    kind: "grpc",
    calls: [
      { operation: "payment.v1.PaymentService/CreateEscrowHold", source: { label: "EscrowGrpcClient.cs:49", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/47f3a62482646bb5e43957fd44000eed39f608ed/Infrastructure/Grpc/EscrowGrpcClient.cs#L49" } },
      { operation: "payment.v1.PaymentService/RefundEscrow", source: { label: "EscrowGrpcClient.cs:73", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/47f3a62482646bb5e43957fd44000eed39f608ed/Infrastructure/Grpc/EscrowGrpcClient.cs#L73" } },
      { operation: "payment.v1.PaymentService/ReleaseEscrow", source: { label: "EscrowGrpcClient.cs:95", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/47f3a62482646bb5e43957fd44000eed39f608ed/Infrastructure/Grpc/EscrowGrpcClient.cs#L95" } },
      { operation: "payment.v1.PaymentService/RefundGoods", source: { label: "EscrowGrpcClient.cs:110", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/47f3a62482646bb5e43957fd44000eed39f608ed/Infrastructure/Grpc/EscrowGrpcClient.cs#L110" } },
      { operation: "payment.v1.PaymentService/SettleShippingFee", source: { label: "EscrowGrpcClient.cs:137", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/47f3a62482646bb5e43957fd44000eed39f608ed/Infrastructure/Grpc/EscrowGrpcClient.cs#L137" } },
      { operation: "payment.v1.PaymentService/GetEscrowStatus", source: { label: "EscrowGrpcClient.cs:158", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/47f3a62482646bb5e43957fd44000eed39f608ed/Infrastructure/Grpc/EscrowGrpcClient.cs#L158" } }
    ]
  },
  {
    from: "order",
    to: "identity",
    kind: "grpc",
    calls: [
      { operation: "identity.v1.IdentityService/GetMerchantInfo", source: { label: "IdentityAddressDirectory.cs:20", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/82834065c34981f1c69a88b3d3317d20396358d9/Infrastructure/Grpc/IdentityAddressDirectory.cs#L20" } },
      { operation: "identity.v1.IdentityService/GetUserProfile", source: { label: "IdentityAddressDirectory.cs:57", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/82834065c34981f1c69a88b3d3317d20396358d9/Infrastructure/Grpc/IdentityAddressDirectory.cs#L57" } }
    ]
  },
  {
    from: "warehouse",
    to: "order",
    kind: "grpc",
    calls: [
      { operation: "order.v1.OrderService/FulfillmentPacked", source: { label: "grpc_client.rb:51", href: "https://github.com/WildanFrananda/kinetix-warehouse-service/blob/377490ff62a3a0d3393c15fb7f55995fef21a2a9/app/clients/order/grpc_client.rb#L51" } },
      { operation: "order.v1.OrderService/OpenReturn", source: { label: "grpc_client.rb:80", href: "https://github.com/WildanFrananda/kinetix-warehouse-service/blob/377490ff62a3a0d3393c15fb7f55995fef21a2a9/app/clients/order/grpc_client.rb#L80" } },
      { operation: "order.v1.OrderService/ReturnGoodsReceived", source: { label: "grpc_client.rb:113", href: "https://github.com/WildanFrananda/kinetix-warehouse-service/blob/377490ff62a3a0d3393c15fb7f55995fef21a2a9/app/clients/order/grpc_client.rb#L113" } }
    ]
  },
  {
    from: "warehouse",
    to: "identity",
    kind: "grpc",
    calls: [
      { operation: "identity.v1.IdentityService/GetMerchantInfo", source: { label: "grpc_client.rb:41", href: "https://github.com/WildanFrananda/kinetix-warehouse-service/blob/377490ff62a3a0d3393c15fb7f55995fef21a2a9/app/clients/identity/grpc_client.rb#L41" } }
    ]
  },
  {
    from: "matching",
    to: "order",
    kind: "grpc",
    calls: [
      { operation: "order.v1.OrderService/OrderDelivered", source: { label: "order_grpc.ex:66", href: "https://github.com/WildanFrananda/kinetix-matching-service/blob/3af0339159cc5481bdde8c5186cc0cbcd6774161/lib/fleet_pulse/clients/order_grpc.ex#L66" } }
    ]
  },
  {
    from: "review",
    to: "order",
    kind: "grpc",
    calls: [
      { operation: "order.v1.OrderService/GetOrderDetails", source: { label: "GrpcOrderClient.php:64", href: "https://github.com/WildanFrananda/kinetix-review-service/blob/70802b6957d655e27dc2b5d4e8b2c41204ed759f/app/Clients/GrpcOrderClient.php#L64" } }
    ]
  },
  {
    from: "notification",
    to: "identity",
    kind: "grpc",
    calls: [
      { operation: "identity.v1.IdentityService/GetUserProfile", source: { label: "GrpcIdentityRecipientDirectory.scala:17", href: "https://github.com/WildanFrananda/kinetix-notification-service/blob/cb82e677a25fe9eb8a72cfcd115dccfd392f39f2/src/main/scala/com/kinetix/notification/infrastructure/grpc/GrpcIdentityRecipientDirectory.scala#L17" } }
    ]
  },
  {
    from: "communication",
    to: "identity",
    kind: "grpc",
    calls: [
      { operation: "identity.v1.IdentityService/GetPrincipal", source: { label: "GrpcPrincipalDirectory.cpp:28", href: "https://github.com/WildanFrananda/kinetix-communication-service/blob/db206dce65e189ad9463cf44c6b66ff36a9193bc/src/adapters/grpc/GrpcPrincipalDirectory.cpp#L28" } },
      { operation: "identity.v1.IdentityService/ValidateToken", source: { label: "GrpcPrincipalAuthenticator.cpp:33", href: "https://github.com/WildanFrananda/kinetix-communication-service/blob/db206dce65e189ad9463cf44c6b66ff36a9193bc/src/adapters/grpc/GrpcPrincipalAuthenticator.cpp#L33" } }
    ]
  },
  {
    from: "search",
    to: "catalog",
    kind: "grpc",
    calls: [
      { operation: "catalog.v1.CatalogService/ChangedSince", source: { label: "client.go:62", href: "https://github.com/WildanFrananda/kinetix-search-service/blob/dbe038ee4360a389fc0c9ca3543f9bbf3731c3cf/internal/catalogclient/client.go#L62" } },
      { operation: "catalog.v1.CatalogService/CountProducts", source: { label: "client.go:96", href: "https://github.com/WildanFrananda/kinetix-search-service/blob/dbe038ee4360a389fc0c9ca3543f9bbf3731c3cf/internal/catalogclient/client.go#L96" }, note: "map.note.reindex" }
    ]
  },
  {
    from: "search",
    to: "identity",
    kind: "grpc",
    calls: [
      { operation: "identity.v1.IdentityService/MerchantsChangedSince", source: { label: "client.go:62", href: "https://github.com/WildanFrananda/kinetix-search-service/blob/dbe038ee4360a389fc0c9ca3543f9bbf3731c3cf/internal/identityclient/client.go#L62" } }
    ]
  },
  {
    from: "search",
    to: "order",
    kind: "grpc",
    calls: [
      { operation: "order.v1.OrderService/OrdersChangedSince", source: { label: "client.go:62", href: "https://github.com/WildanFrananda/kinetix-search-service/blob/dbe038ee4360a389fc0c9ca3543f9bbf3731c3cf/internal/orderclient/client.go#L62" } }
    ]
  }
];
