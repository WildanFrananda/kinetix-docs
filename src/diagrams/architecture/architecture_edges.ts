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
    from: "edge",
    to: "identity",
    kind: "http",
    calls: [
      { operation: "POST /api/v1/auth/login", source: { label: "identity_client.tl:39", href: "https://github.com/WildanFrananda/kinetix-edge-service/blob/eb13db007a21ca985ca33eca49e44dacf43e6354/src/adapters/identity_client.tl#L39" } },
      { operation: "POST /api/v1/auth/register", source: { label: "identity_client.tl:45", href: "https://github.com/WildanFrananda/kinetix-edge-service/blob/eb13db007a21ca985ca33eca49e44dacf43e6354/src/adapters/identity_client.tl#L45" }, note: "map.note.signUp" },
      { operation: "POST /api/v1/auth/2fa/verify", source: { label: "identity_client.tl:51", href: "https://github.com/WildanFrananda/kinetix-edge-service/blob/eb13db007a21ca985ca33eca49e44dacf43e6354/src/adapters/identity_client.tl#L51" } },
      { operation: "POST /api/v1/auth/2fa/setup/{userId}", source: { label: "identity_client.tl:55", href: "https://github.com/WildanFrananda/kinetix-edge-service/blob/eb13db007a21ca985ca33eca49e44dacf43e6354/src/adapters/identity_client.tl#L55" } },
      { operation: "POST /api/v1/auth/2fa/enable/{userId}", source: { label: "identity_client.tl:66", href: "https://github.com/WildanFrananda/kinetix-edge-service/blob/eb13db007a21ca985ca33eca49e44dacf43e6354/src/adapters/identity_client.tl#L66" } },
      { operation: "POST /api/v1/auth/refresh", source: { label: "identity_client.tl:72", href: "https://github.com/WildanFrananda/kinetix-edge-service/blob/eb13db007a21ca985ca33eca49e44dacf43e6354/src/adapters/identity_client.tl#L72" } },
      { operation: "POST /api/v1/auth/logout", source: { label: "identity_client.tl:78", href: "https://github.com/WildanFrananda/kinetix-edge-service/blob/eb13db007a21ca985ca33eca49e44dacf43e6354/src/adapters/identity_client.tl#L78" } },
      { operation: "{method} /api/v1/auth/{path}", source: { label: "forward.tl:41", href: "https://github.com/WildanFrananda/kinetix-edge-service/blob/eb13db007a21ca985ca33eca49e44dacf43e6354/src/http/forward.tl#L41" }, note: "map.note.forwarded" },
      { operation: "{method} /api/v1/couriers/{path}", source: { label: "forward.tl:41", href: "https://github.com/WildanFrananda/kinetix-edge-service/blob/eb13db007a21ca985ca33eca49e44dacf43e6354/src/http/forward.tl#L41" }, note: "map.note.forwarded" }
    ]
  },
  {
    from: "edge",
    to: "gateway",
    kind: "http",
    calls: [
      { operation: "{method} /api/{path}", source: { label: "forward.tl:37", href: "https://github.com/WildanFrananda/kinetix-edge-service/blob/eb13db007a21ca985ca33eca49e44dacf43e6354/src/http/forward.tl#L37" }, note: "map.note.internalListener" },
      { operation: "GET /ws/v1/matching/merchant/websocket", source: { label: "merchant_socket.tl:36", href: "https://github.com/WildanFrananda/kinetix-edge-service/blob/eb13db007a21ca985ca33eca49e44dacf43e6354/src/http/merchant_socket.tl#L36" }, note: "map.note.merchantSocket" }
    ]
  },
  {
    from: "payment",
    to: "midtrans",
    kind: "external",
    calls: [
      { operation: "POST /v2/charge", source: { label: "MidtransPaymentGatewayAdapter.java:85", href: "https://github.com/WildanFrananda/kinetix-payment-service/blob/146892d5305fcafe0e59f1230b6e1c7b5fe7cd27/modules/infrastructure/src/main/java/com/kinetix/payment/infrastructure/gateway/MidtransPaymentGatewayAdapter.java#L85" } },
      { operation: "GET /v2/{reference}/status", source: { label: "MidtransPaymentGatewayAdapter.java:116", href: "https://github.com/WildanFrananda/kinetix-payment-service/blob/146892d5305fcafe0e59f1230b6e1c7b5fe7cd27/modules/infrastructure/src/main/java/com/kinetix/payment/infrastructure/gateway/MidtransPaymentGatewayAdapter.java#L116" } }
    ]
  },
  {
    from: "notification",
    to: "fcm",
    kind: "external",
    calls: [
      { operation: "POST /token", source: { label: "GoogleAccessTokens.scala:47", href: "https://github.com/WildanFrananda/kinetix-notification-service/blob/510a1ecf16006e28913c30d9861c95af3af226b9/src/main/scala/com/kinetix/notification/infrastructure/http/GoogleAccessTokens.scala#L47" } },
      { operation: "POST /v1/projects/{project}/messages:send", source: { label: "HttpPushSender.scala:68", href: "https://github.com/WildanFrananda/kinetix-notification-service/blob/510a1ecf16006e28913c30d9861c95af3af226b9/src/main/scala/com/kinetix/notification/infrastructure/http/HttpPushSender.scala#L68" } }
    ]
  },
  {
    from: "notification",
    to: "resend",
    kind: "external",
    calls: [
      { operation: "POST /emails", source: { label: "HttpEmailSender.scala:35", href: "https://github.com/WildanFrananda/kinetix-notification-service/blob/510a1ecf16006e28913c30d9861c95af3af226b9/src/main/scala/com/kinetix/notification/infrastructure/http/HttpEmailSender.scala#L35" } }
    ]
  },
  {
    from: "identity",
    to: "nominatim",
    kind: "external",
    calls: [
      { operation: "GET /search", source: { label: "nominatim_geocoding.adapter.ts:33", href: "https://github.com/WildanFrananda/kinetix-identity-service/blob/4193caf69b2ebea67534e619ebf3a2ccc384e857/src/infrastructure/geocoding/nominatim_geocoding.adapter.ts#L33" } }
    ]
  },
  {
    from: "identity",
    to: "matching",
    kind: "grpc",
    calls: [
      { operation: "fleet.v1.FleetRegistryService/RegisterDriver", source: { label: "fleet_registry_grpc.adapter.ts:45", href: "https://github.com/WildanFrananda/kinetix-identity-service/blob/4193caf69b2ebea67534e619ebf3a2ccc384e857/src/infrastructure/mesh/fleet_registry_grpc.adapter.ts#L45" } },
      { operation: "fleet.v1.FleetRegistryService/ActivateDriver", source: { label: "fleet_registry_grpc.adapter.ts:62", href: "https://github.com/WildanFrananda/kinetix-identity-service/blob/4193caf69b2ebea67534e619ebf3a2ccc384e857/src/infrastructure/mesh/fleet_registry_grpc.adapter.ts#L62" } }
    ]
  },
  {
    from: "catalog",
    to: "warehouse",
    kind: "grpc",
    calls: [
      { operation: "fulfillment.v1.BinStockService/CheckBinStock", source: { label: "bin_stock_client.py:44", href: "https://github.com/WildanFrananda/kinetix-catalog-service/blob/ab557c90cb3230221c5a504def11fa7df26a6f7a/core/infrastructure/grpc/bin_stock_client.py#L44" } },
      { operation: "fulfillment.v1.BinStockService/CheckBinStockBatch", source: { label: "bin_stock_client.py:83", href: "https://github.com/WildanFrananda/kinetix-catalog-service/blob/ab557c90cb3230221c5a504def11fa7df26a6f7a/core/infrastructure/grpc/bin_stock_client.py#L83" } }
    ]
  },
  {
    from: "catalog",
    to: "identity",
    kind: "grpc",
    calls: [
      { operation: "identity.v1.IdentityService/GetMerchantInfo", source: { label: "identity_client.py:54", href: "https://github.com/WildanFrananda/kinetix-catalog-service/blob/ab557c90cb3230221c5a504def11fa7df26a6f7a/core/infrastructure/grpc/identity_client.py#L54" } }
    ]
  },
  {
    from: "pricing",
    to: "identity",
    kind: "grpc",
    calls: [
      { operation: "identity.v1.IdentityService/GetMerchantInfo", source: { label: "identity_merchant_directory.rs:35", href: "https://github.com/WildanFrananda/kinetix-pricing-service/blob/0ed7db4cd6fb8d40375cab26dd7ac56ebce16a8a/src/clients/identity_merchant_directory.rs#L35" } }
    ]
  },
  {
    from: "pricing",
    to: "catalog",
    kind: "grpc",
    calls: [
      { operation: "catalog.v1.CatalogService/GetProduct", source: { label: "catalog_product_directory.rs:34", href: "https://github.com/WildanFrananda/kinetix-pricing-service/blob/0ed7db4cd6fb8d40375cab26dd7ac56ebce16a8a/src/clients/catalog_product_directory.rs#L34" } }
    ]
  },
  {
    from: "order",
    to: "pricing",
    kind: "grpc",
    calls: [
      { operation: "pricing.v1.PricingService/CalculatePrice", source: { label: "PricingGrpcClient.cs:101", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/PricingGrpcClient.cs#L101" } },
      { operation: "pricing.v1.PricingService/QuoteShipping", source: { label: "PricingGrpcClient.cs:33", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/PricingGrpcClient.cs#L33" } },
      { operation: "pricing.v1.PricingService/RedeemVoucher", source: { label: "VoucherQuotaGrpcClient.cs:22", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/VoucherQuotaGrpcClient.cs#L22" } },
      { operation: "pricing.v1.PricingService/ReleaseVoucherRedemption", source: { label: "VoucherQuotaGrpcClient.cs:40", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/VoucherQuotaGrpcClient.cs#L40" } },
      { operation: "pricing.v1.PricingService/AllocateFlashSaleStock", source: { label: "FlashSaleGrpcClient.cs:22", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/FlashSaleGrpcClient.cs#L22" } },
      { operation: "pricing.v1.PricingService/ReleaseFlashSaleAllocation", source: { label: "FlashSaleGrpcClient.cs:40", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/FlashSaleGrpcClient.cs#L40" } }
    ]
  },
  {
    from: "order",
    to: "matching",
    kind: "grpc",
    calls: [
      { operation: "shipping.v1.ShippingService/EstimateShippingOptions", source: { label: "ShippingGrpcClient.cs:34", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/ShippingGrpcClient.cs#L34" } },
      { operation: "fleet.v1.CourierTelemetryService/DispatchCourier", source: { label: "CourierDispatcher.cs:75", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Application/Fulfillment/CourierDispatcher.cs#L75" } }
    ]
  },
  {
    from: "order",
    to: "catalog",
    kind: "grpc",
    calls: [
      { operation: "catalog.v1.CatalogService/GetProduct", source: { label: "CatalogProductDirectory.cs:22", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/CatalogProductDirectory.cs#L22" } }
    ]
  },
  {
    from: "order",
    to: "warehouse",
    kind: "grpc",
    calls: [
      { operation: "fulfillment.v1.BinStockService/ReserveStock", source: { label: "StockGrpcClient.cs:22", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/StockGrpcClient.cs#L22" } },
      { operation: "fulfillment.v1.BinStockService/ReleaseStock", source: { label: "StockGrpcClient.cs:44", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/StockGrpcClient.cs#L44" } },
      { operation: "fulfillment.v1.FulfillmentTaskService/CreateFulfillmentTask", source: { label: "FulfillmentGrpcClient.cs:34", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/FulfillmentGrpcClient.cs#L34" } },
      { operation: "fulfillment.v1.FulfillmentTaskService/CancelFulfillmentTask", source: { label: "FulfillmentGrpcClient.cs:62", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/FulfillmentGrpcClient.cs#L62" } },
      { operation: "fulfillment.v1.FulfillmentTaskService/RecordCourierAwb", source: { label: "FulfillmentGrpcClient.cs:90", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/FulfillmentGrpcClient.cs#L90" } }
    ]
  },
  {
    from: "order",
    to: "payment",
    kind: "grpc",
    calls: [
      { operation: "payment.v1.PaymentService/CreateEscrowHold", source: { label: "EscrowGrpcClient.cs:49", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/EscrowGrpcClient.cs#L49" } },
      { operation: "payment.v1.PaymentService/RefundEscrow", source: { label: "EscrowGrpcClient.cs:73", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/EscrowGrpcClient.cs#L73" } },
      { operation: "payment.v1.PaymentService/ReleaseEscrow", source: { label: "EscrowGrpcClient.cs:95", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/EscrowGrpcClient.cs#L95" } },
      { operation: "payment.v1.PaymentService/RefundGoods", source: { label: "EscrowGrpcClient.cs:110", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/EscrowGrpcClient.cs#L110" } },
      { operation: "payment.v1.PaymentService/SettleShippingFee", source: { label: "EscrowGrpcClient.cs:137", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/EscrowGrpcClient.cs#L137" } },
      { operation: "payment.v1.PaymentService/GetEscrowStatus", source: { label: "EscrowGrpcClient.cs:158", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/EscrowGrpcClient.cs#L158" } }
    ]
  },
  {
    from: "order",
    to: "identity",
    kind: "grpc",
    calls: [
      { operation: "identity.v1.IdentityService/GetMerchantInfo", source: { label: "IdentityAddressDirectory.cs:20", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/IdentityAddressDirectory.cs#L20" } },
      { operation: "identity.v1.IdentityService/GetUserProfile", source: { label: "IdentityAddressDirectory.cs:55", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/IdentityAddressDirectory.cs#L55" } },
      { operation: "geo.v1.GeocodingService/GeocodeAddress", source: { label: "IdentityAddressGeocoder.cs:22", href: "https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/IdentityAddressGeocoder.cs#L22" } }
    ]
  },
  {
    from: "warehouse",
    to: "order",
    kind: "grpc",
    calls: [
      { operation: "order.v1.OrderService/FulfillmentPacked", source: { label: "grpc_client.rb:60", href: "https://github.com/WildanFrananda/kinetix-warehouse-service/blob/07fc2707413de029830bd1364e722a41b8285d81/app/clients/order/grpc_client.rb#L60" } },
      { operation: "order.v1.OrderService/OpenReturn", source: { label: "grpc_client.rb:86", href: "https://github.com/WildanFrananda/kinetix-warehouse-service/blob/07fc2707413de029830bd1364e722a41b8285d81/app/clients/order/grpc_client.rb#L86" } },
      { operation: "order.v1.OrderService/ReturnGoodsReceived", source: { label: "grpc_client.rb:119", href: "https://github.com/WildanFrananda/kinetix-warehouse-service/blob/07fc2707413de029830bd1364e722a41b8285d81/app/clients/order/grpc_client.rb#L119" } }
    ]
  },
  {
    from: "warehouse",
    to: "identity",
    kind: "grpc",
    calls: [
      { operation: "identity.v1.IdentityService/GetMerchantInfo", source: { label: "grpc_client.rb:41", href: "https://github.com/WildanFrananda/kinetix-warehouse-service/blob/07fc2707413de029830bd1364e722a41b8285d81/app/clients/identity/grpc_client.rb#L41" } }
    ]
  },
  {
    from: "matching",
    to: "order",
    kind: "grpc",
    calls: [
      { operation: "order.v1.OrderService/OrderDelivered", source: { label: "order_grpc.ex:58", href: "https://github.com/WildanFrananda/kinetix-matching-service/blob/7ef67a0ca1d0e8945f638de8a2f9684e84d06886/lib/fleet_pulse/clients/order_grpc.ex#L58" } }
    ]
  },
  {
    from: "review",
    to: "order",
    kind: "grpc",
    calls: [
      { operation: "order.v1.OrderService/GetOrderDetails", source: { label: "GrpcOrderClient.php:79", href: "https://github.com/WildanFrananda/kinetix-review-service/blob/e3ca897c68947dd7ba4a47f04355e5e91da9afa8/app/Clients/GrpcOrderClient.php#L79" } }
    ]
  },
  {
    from: "notification",
    to: "identity",
    kind: "grpc",
    calls: [
      { operation: "identity.v1.IdentityService/GetUserProfile", source: { label: "GrpcIdentityRecipientDirectory.scala:20", href: "https://github.com/WildanFrananda/kinetix-notification-service/blob/510a1ecf16006e28913c30d9861c95af3af226b9/src/main/scala/com/kinetix/notification/infrastructure/grpc/GrpcIdentityRecipientDirectory.scala#L20" } }
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
      { operation: "catalog.v1.CatalogService/ChangedSince", source: { label: "client.go:54", href: "https://github.com/WildanFrananda/kinetix-search-service/blob/ba054100e0e91fd9640842c0035b514d923f674e/internal/catalogclient/client.go#L54" } },
      { operation: "catalog.v1.CatalogService/CountProducts", source: { label: "client.go:83", href: "https://github.com/WildanFrananda/kinetix-search-service/blob/ba054100e0e91fd9640842c0035b514d923f674e/internal/catalogclient/client.go#L83" }, note: "map.note.reindex" }
    ]
  },
  {
    from: "search",
    to: "identity",
    kind: "grpc",
    calls: [
      { operation: "identity.v1.IdentityService/MerchantsChangedSince", source: { label: "client.go:54", href: "https://github.com/WildanFrananda/kinetix-search-service/blob/ba054100e0e91fd9640842c0035b514d923f674e/internal/identityclient/client.go#L54" } }
    ]
  },
  {
    from: "search",
    to: "order",
    kind: "grpc",
    calls: [
      { operation: "order.v1.OrderService/OrdersChangedSince", source: { label: "client.go:54", href: "https://github.com/WildanFrananda/kinetix-search-service/blob/ba054100e0e91fd9640842c0035b514d923f674e/internal/orderclient/client.go#L54" } }
    ]
  },
  {
    from: "notary",
    to: "payment",
    kind: "grpc",
    calls: [
      { operation: "payment.v1.LiabilityService/StreamLiabilitySnapshot", source: { label: "source.go:61", href: "https://github.com/WildanFrananda/kinetix-notary-service/blob/8446176813c354716d77ca6591038633871bcda5/internal/payment/source.go#L61" } },
      { operation: "payment.v1.LiabilityRecordService/GetLiabilitySnapshotRecord", source: { label: "records.go:56", href: "https://github.com/WildanFrananda/kinetix-notary-service/blob/8446176813c354716d77ca6591038633871bcda5/internal/payment/records.go#L56" } }
    ]
  },
  {
    from: "notary",
    to: "order",
    kind: "grpc",
    calls: [
      { operation: "order.v1.OrderLifecycleService/LifecycleEventsSince", source: { label: "lifecycle_feed.go:50", href: "https://github.com/WildanFrananda/kinetix-notary-service/blob/8446176813c354716d77ca6591038633871bcda5/internal/feeds/lifecycle_feed.go#L50" } }
    ]
  },
  {
    from: "notary",
    to: "matching",
    kind: "grpc",
    calls: [
      { operation: "fulfillment.v1.DeliveryEvidenceService/DeliveriesSince", source: { label: "delivery_feed.go:50", href: "https://github.com/WildanFrananda/kinetix-notary-service/blob/8446176813c354716d77ca6591038633871bcda5/internal/feeds/delivery_feed.go#L50" } }
    ]
  },
  {
    from: "notary",
    to: "review",
    kind: "grpc",
    calls: [
      { operation: "review.v1.ReviewEvidenceService/ReviewsSince", source: { label: "review_feed.go:50", href: "https://github.com/WildanFrananda/kinetix-notary-service/blob/8446176813c354716d77ca6591038633871bcda5/internal/feeds/review_feed.go#L50" } }
    ]
  },
  {
    from: "notary",
    to: "notification",
    kind: "grpc",
    calls: [
      { operation: "notification.v1.NotificationService/Notify", source: { label: "notifier.go:75", href: "https://github.com/WildanFrananda/kinetix-notary-service/blob/8446176813c354716d77ca6591038633871bcda5/internal/notification/notifier.go#L75" } }
    ]
  },
  {
    from: "notary",
    to: "chain",
    kind: "external",
    calls: [
      { operation: "eth_sendRawTransaction", source: { label: "transactor.go:189", href: "https://github.com/WildanFrananda/kinetix-notary-service/blob/8446176813c354716d77ca6591038633871bcda5/internal/ethereum/transactor.go#L189" } },
      { operation: "eth_getLogs", source: { label: "withholding_court.go:184", href: "https://github.com/WildanFrananda/kinetix-notary-service/blob/8446176813c354716d77ca6591038633871bcda5/internal/ethereum/withholding_court.go#L184" } },
      { operation: "eth_call", source: { label: "ledger.go:281", href: "https://github.com/WildanFrananda/kinetix-notary-service/blob/8446176813c354716d77ca6591038633871bcda5/internal/ethereum/ledger.go#L281" } }
    ]
  }
];
