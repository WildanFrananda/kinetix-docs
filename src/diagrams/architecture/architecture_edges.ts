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
      { operation: "POST /v2/charge", source: { label: "MidtransPaymentGatewayAdapter.java:84", href: "https://github.com/WildanFrananda/kinetix-payment-service/blob/436aade1629ee50fe3271b2f4702c2e6c0267b94/modules/infrastructure/src/main/java/com/kinetix/payment/infrastructure/gateway/MidtransPaymentGatewayAdapter.java#L84" } },
      { operation: "GET /v2/{reference}/status", source: { label: "MidtransPaymentGatewayAdapter.java:115", href: "https://github.com/WildanFrananda/kinetix-payment-service/blob/436aade1629ee50fe3271b2f4702c2e6c0267b94/modules/infrastructure/src/main/java/com/kinetix/payment/infrastructure/gateway/MidtransPaymentGatewayAdapter.java#L115" } }
    ]
  },
  {
    from: "notification",
    to: "fcm",
    kind: "external",
    calls: [
      { operation: "POST /token", source: { label: "GoogleAccessTokens.scala:44", href: "https://github.com/WildanFrananda/kinetix-notification-service/blob/f9df9569c08802be573e611540460526d6efd9b4/src/main/scala/com/kinetix/notification/infrastructure/http/GoogleAccessTokens.scala#L44" } },
      { operation: "POST /v1/projects/{project}/messages:send", source: { label: "HttpPushSender.scala:34", href: "https://github.com/WildanFrananda/kinetix-notification-service/blob/f9df9569c08802be573e611540460526d6efd9b4/src/main/scala/com/kinetix/notification/infrastructure/http/HttpPushSender.scala#L34" } }
    ]
  },
  {
    from: "notification",
    to: "resend",
    kind: "external",
    calls: [
      { operation: "POST /emails", source: { label: "HttpEmailSender.scala:33", href: "https://github.com/WildanFrananda/kinetix-notification-service/blob/f9df9569c08802be573e611540460526d6efd9b4/src/main/scala/com/kinetix/notification/infrastructure/http/HttpEmailSender.scala#L33" } }
    ]
  },
  {
    from: "identity",
    to: "nominatim",
    kind: "external",
    calls: [
      { operation: "GET /search", source: { label: "nominatim_geocoding.adapter.ts:21", href: "https://github.com/WildanFrananda/kinetix-identity-service/blob/40b7e4f76a3f151100f1d48dd9253126ee16ddcb/src/infrastructure/geocoding/nominatim_geocoding.adapter.ts#L21" } }
    ]
  },
  {
    from: "identity",
    to: "matching",
    kind: "grpc",
    calls: [
      { operation: "fleet.v1.FleetRegistryService/RegisterDriver", source: { label: "fleet_registry_grpc.adapter.ts:38", href: "https://github.com/WildanFrananda/kinetix-identity-service/blob/40b7e4f76a3f151100f1d48dd9253126ee16ddcb/src/infrastructure/mesh/fleet_registry_grpc.adapter.ts#L38" } },
      { operation: "fleet.v1.FleetRegistryService/ActivateDriver", source: { label: "fleet_registry_grpc.adapter.ts:55", href: "https://github.com/WildanFrananda/kinetix-identity-service/blob/40b7e4f76a3f151100f1d48dd9253126ee16ddcb/src/infrastructure/mesh/fleet_registry_grpc.adapter.ts#L55" } }
    ]
  },
  {
    from: "catalog",
    to: "warehouse",
    kind: "grpc",
    calls: [
      { operation: "fulfillment.v1.BinStockService/CheckBinStock", source: { label: "bin_stock_client.py:44", href: "https://github.com/WildanFrananda/kinetix-catalog-service/blob/2a395740eb832a69bfd72c82be54779d421ddef3/core/infrastructure/grpc/bin_stock_client.py#L44" } },
      { operation: "fulfillment.v1.BinStockService/CheckBinStockBatch", source: { label: "bin_stock_client.py:83", href: "https://github.com/WildanFrananda/kinetix-catalog-service/blob/2a395740eb832a69bfd72c82be54779d421ddef3/core/infrastructure/grpc/bin_stock_client.py#L83" } }
    ]
  },
  {
    from: "catalog",
    to: "identity",
    kind: "grpc",
    calls: [
      { operation: "identity.v1.IdentityService/GetMerchantInfo", source: { label: "identity_client.py:54", href: "https://github.com/WildanFrananda/kinetix-catalog-service/blob/2a395740eb832a69bfd72c82be54779d421ddef3/core/infrastructure/grpc/identity_client.py#L54" } }
    ]
  },
  {
    from: "pricing",
    to: "identity",
    kind: "grpc",
    calls: [
      { operation: "identity.v1.IdentityService/GetMerchantInfo", source: { label: "identity_merchant_directory.rs:39", href: "https://github.com/WildanFrananda/kinetix-pricing-service/blob/0b990129286ce38750cf418d54c3bd52edf31d9e/src/clients/identity_merchant_directory.rs#L39" } }
    ]
  },
  {
    from: "pricing",
    to: "catalog",
    kind: "grpc",
    calls: [
      { operation: "catalog.v1.CatalogService/GetProduct", source: { label: "catalog_product_directory.rs:36", href: "https://github.com/WildanFrananda/kinetix-pricing-service/blob/0b990129286ce38750cf418d54c3bd52edf31d9e/src/clients/catalog_product_directory.rs#L36" } }
    ]
  },
  {
    from: "order",
    to: "pricing",
    kind: "grpc",
    calls: [
      { operation: "pricing.v1.PricingService/CalculatePrice", source: { label: "PricingGrpcClient.cs:87", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/PricingGrpcClient.cs#L87" } },
      { operation: "pricing.v1.PricingService/QuoteShipping", source: { label: "PricingGrpcClient.cs:33", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/PricingGrpcClient.cs#L33" } },
      { operation: "pricing.v1.PricingService/RedeemVoucher", source: { label: "VoucherQuotaGrpcClient.cs:22", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/VoucherQuotaGrpcClient.cs#L22" } },
      { operation: "pricing.v1.PricingService/ReleaseVoucherRedemption", source: { label: "VoucherQuotaGrpcClient.cs:40", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/VoucherQuotaGrpcClient.cs#L40" } },
      { operation: "pricing.v1.PricingService/AllocateFlashSaleStock", source: { label: "FlashSaleGrpcClient.cs:22", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/FlashSaleGrpcClient.cs#L22" } },
      { operation: "pricing.v1.PricingService/ReleaseFlashSaleAllocation", source: { label: "FlashSaleGrpcClient.cs:40", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/FlashSaleGrpcClient.cs#L40" } }
    ]
  },
  {
    from: "order",
    to: "matching",
    kind: "grpc",
    calls: [
      { operation: "shipping.v1.ShippingService/EstimateShippingOptions", source: { label: "ShippingGrpcClient.cs:34", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/ShippingGrpcClient.cs#L34" } },
      { operation: "fleet.v1.CourierTelemetryService/DispatchCourier", source: { label: "CourierDispatcher.cs:74", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Application/Fulfillment/CourierDispatcher.cs#L74" } }
    ]
  },
  {
    from: "order",
    to: "catalog",
    kind: "grpc",
    calls: [
      { operation: "catalog.v1.CatalogService/GetProduct", source: { label: "CatalogProductDirectory.cs:22", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/CatalogProductDirectory.cs#L22" } }
    ]
  },
  {
    from: "order",
    to: "warehouse",
    kind: "grpc",
    calls: [
      { operation: "fulfillment.v1.BinStockService/ReserveStock", source: { label: "StockGrpcClient.cs:22", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/StockGrpcClient.cs#L22" } },
      { operation: "fulfillment.v1.BinStockService/ReleaseStock", source: { label: "StockGrpcClient.cs:44", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/StockGrpcClient.cs#L44" } },
      { operation: "fulfillment.v1.FulfillmentTaskService/CreateFulfillmentTask", source: { label: "FulfillmentGrpcClient.cs:34", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/FulfillmentGrpcClient.cs#L34" } },
      { operation: "fulfillment.v1.FulfillmentTaskService/CancelFulfillmentTask", source: { label: "FulfillmentGrpcClient.cs:62", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/FulfillmentGrpcClient.cs#L62" } },
      { operation: "fulfillment.v1.FulfillmentTaskService/RecordCourierAwb", source: { label: "FulfillmentGrpcClient.cs:90", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/FulfillmentGrpcClient.cs#L90" } }
    ]
  },
  {
    from: "order",
    to: "payment",
    kind: "grpc",
    calls: [
      { operation: "payment.v1.PaymentService/CreateEscrowHold", source: { label: "EscrowGrpcClient.cs:49", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/EscrowGrpcClient.cs#L49" } },
      { operation: "payment.v1.PaymentService/RefundEscrow", source: { label: "EscrowGrpcClient.cs:73", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/EscrowGrpcClient.cs#L73" } },
      { operation: "payment.v1.PaymentService/ReleaseEscrow", source: { label: "EscrowGrpcClient.cs:95", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/EscrowGrpcClient.cs#L95" } },
      { operation: "payment.v1.PaymentService/RefundGoods", source: { label: "EscrowGrpcClient.cs:110", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/EscrowGrpcClient.cs#L110" } },
      { operation: "payment.v1.PaymentService/SettleShippingFee", source: { label: "EscrowGrpcClient.cs:137", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/EscrowGrpcClient.cs#L137" } },
      { operation: "payment.v1.PaymentService/GetEscrowStatus", source: { label: "EscrowGrpcClient.cs:158", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/EscrowGrpcClient.cs#L158" } }
    ]
  },
  {
    from: "order",
    to: "identity",
    kind: "grpc",
    calls: [
      { operation: "identity.v1.IdentityService/GetMerchantInfo", source: { label: "IdentityAddressDirectory.cs:21", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/IdentityAddressDirectory.cs#L21" } },
      { operation: "identity.v1.IdentityService/GetUserProfile", source: { label: "IdentityAddressDirectory.cs:56", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/IdentityAddressDirectory.cs#L56" } },
      { operation: "geo.v1.GeocodingService/GeocodeAddress", source: { label: "IdentityAddressGeocoder.cs:23", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/IdentityAddressGeocoder.cs#L23" } }
    ]
  },
  {
    from: "warehouse",
    to: "order",
    kind: "grpc",
    calls: [
      { operation: "order.v1.OrderService/FulfillmentPacked", source: { label: "grpc_client.rb:51", href: "https://github.com/WildanFrananda/kinetix-warehouse-service/blob/633964cb65b5d74cc9cb525414d182d459acb687/app/clients/order/grpc_client.rb#L51" } },
      { operation: "order.v1.OrderService/OpenReturn", source: { label: "grpc_client.rb:80", href: "https://github.com/WildanFrananda/kinetix-warehouse-service/blob/633964cb65b5d74cc9cb525414d182d459acb687/app/clients/order/grpc_client.rb#L80" } },
      { operation: "order.v1.OrderService/ReturnGoodsReceived", source: { label: "grpc_client.rb:113", href: "https://github.com/WildanFrananda/kinetix-warehouse-service/blob/633964cb65b5d74cc9cb525414d182d459acb687/app/clients/order/grpc_client.rb#L113" } }
    ]
  },
  {
    from: "warehouse",
    to: "identity",
    kind: "grpc",
    calls: [
      { operation: "identity.v1.IdentityService/GetMerchantInfo", source: { label: "grpc_client.rb:41", href: "https://github.com/WildanFrananda/kinetix-warehouse-service/blob/633964cb65b5d74cc9cb525414d182d459acb687/app/clients/identity/grpc_client.rb#L41" } }
    ]
  },
  {
    from: "matching",
    to: "order",
    kind: "grpc",
    calls: [
      { operation: "order.v1.OrderService/OrderDelivered", source: { label: "order_grpc.ex:66", href: "https://github.com/WildanFrananda/kinetix-matching-service/blob/f2f99d91895f356cf85fbbdd53c8caa57e8f5798/lib/fleet_pulse/clients/order_grpc.ex#L66" } }
    ]
  },
  {
    from: "review",
    to: "order",
    kind: "grpc",
    calls: [
      { operation: "order.v1.OrderService/GetOrderDetails", source: { label: "GrpcOrderClient.php:83", href: "https://github.com/WildanFrananda/kinetix-review-service/blob/d259ba53f8ce03651eec94f8fe4e1faf1544c6b2/app/Clients/GrpcOrderClient.php#L83" } }
    ]
  },
  {
    from: "notification",
    to: "identity",
    kind: "grpc",
    calls: [
      { operation: "identity.v1.IdentityService/GetUserProfile", source: { label: "GrpcIdentityRecipientDirectory.scala:17", href: "https://github.com/WildanFrananda/kinetix-notification-service/blob/f9df9569c08802be573e611540460526d6efd9b4/src/main/scala/com/kinetix/notification/infrastructure/grpc/GrpcIdentityRecipientDirectory.scala#L17" } }
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
      { operation: "catalog.v1.CatalogService/ChangedSince", source: { label: "client.go:62", href: "https://github.com/WildanFrananda/kinetix-search-service/blob/9d0994b7a46011b4889bba4a7dc3b3e7a56028e2/internal/catalogclient/client.go#L62" } },
      { operation: "catalog.v1.CatalogService/CountProducts", source: { label: "client.go:91", href: "https://github.com/WildanFrananda/kinetix-search-service/blob/9d0994b7a46011b4889bba4a7dc3b3e7a56028e2/internal/catalogclient/client.go#L91" }, note: "map.note.reindex" }
    ]
  },
  {
    from: "search",
    to: "identity",
    kind: "grpc",
    calls: [
      { operation: "identity.v1.IdentityService/MerchantsChangedSince", source: { label: "client.go:62", href: "https://github.com/WildanFrananda/kinetix-search-service/blob/9d0994b7a46011b4889bba4a7dc3b3e7a56028e2/internal/identityclient/client.go#L62" } }
    ]
  },
  {
    from: "search",
    to: "order",
    kind: "grpc",
    calls: [
      { operation: "order.v1.OrderService/OrdersChangedSince", source: { label: "client.go:62", href: "https://github.com/WildanFrananda/kinetix-search-service/blob/9d0994b7a46011b4889bba4a7dc3b3e7a56028e2/internal/orderclient/client.go#L62" } }
    ]
  },
  {
    from: "notary",
    to: "payment",
    kind: "grpc",
    calls: [
      { operation: "payment.v1.LiabilityService/StreamLiabilitySnapshot", source: { label: "source.go:61", href: "https://github.com/WildanFrananda/kinetix-notary-service/blob/9eaeb1c040e1e2518eca8417d787452ccacdaa74/internal/payment/source.go#L61" } },
      { operation: "payment.v1.LiabilityRecordService/GetLiabilitySnapshotRecord", source: { label: "records.go:56", href: "https://github.com/WildanFrananda/kinetix-notary-service/blob/9eaeb1c040e1e2518eca8417d787452ccacdaa74/internal/payment/records.go#L56" } }
    ]
  },
  {
    from: "notary",
    to: "order",
    kind: "grpc",
    calls: [
      { operation: "order.v1.OrderLifecycleService/LifecycleEventsSince", source: { label: "lifecycle_feed.go:50", href: "https://github.com/WildanFrananda/kinetix-notary-service/blob/9eaeb1c040e1e2518eca8417d787452ccacdaa74/internal/feeds/lifecycle_feed.go#L50" } }
    ]
  },
  {
    from: "notary",
    to: "matching",
    kind: "grpc",
    calls: [
      { operation: "fulfillment.v1.DeliveryEvidenceService/DeliveriesSince", source: { label: "delivery_feed.go:50", href: "https://github.com/WildanFrananda/kinetix-notary-service/blob/9eaeb1c040e1e2518eca8417d787452ccacdaa74/internal/feeds/delivery_feed.go#L50" } }
    ]
  },
  {
    from: "notary",
    to: "review",
    kind: "grpc",
    calls: [
      { operation: "review.v1.ReviewEvidenceService/ReviewsSince", source: { label: "review_feed.go:50", href: "https://github.com/WildanFrananda/kinetix-notary-service/blob/9eaeb1c040e1e2518eca8417d787452ccacdaa74/internal/feeds/review_feed.go#L50" } }
    ]
  },
  {
    from: "notary",
    to: "notification",
    kind: "grpc",
    calls: [
      { operation: "notification.v1.NotificationService/Notify", source: { label: "notifier.go:75", href: "https://github.com/WildanFrananda/kinetix-notary-service/blob/9eaeb1c040e1e2518eca8417d787452ccacdaa74/internal/notification/notifier.go#L75" } }
    ]
  },
  {
    from: "notary",
    to: "chain",
    kind: "external",
    calls: [
      { operation: "eth_sendRawTransaction", source: { label: "transactor.go:189", href: "https://github.com/WildanFrananda/kinetix-notary-service/blob/9eaeb1c040e1e2518eca8417d787452ccacdaa74/internal/ethereum/transactor.go#L189" } },
      { operation: "eth_getLogs", source: { label: "withholding_court.go:184", href: "https://github.com/WildanFrananda/kinetix-notary-service/blob/9eaeb1c040e1e2518eca8417d787452ccacdaa74/internal/ethereum/withholding_court.go#L184" } },
      { operation: "eth_call", source: { label: "ledger.go:281", href: "https://github.com/WildanFrananda/kinetix-notary-service/blob/9eaeb1c040e1e2518eca8417d787452ccacdaa74/internal/ethereum/ledger.go#L281" } }
    ]
  }
];
