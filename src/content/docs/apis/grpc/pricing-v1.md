---
title: "pricing.v1"
description: "The pricing.v1 gRPC package in kinetix-contracts 1.3.0: its services, messages and enums."
editUrl: false
---

<div class="grpc-reference">

Generated from release [1.3.0](https://www.npmjs.com/package/kinetix-contracts/v/1.3.0) of kinetix-contracts: [`pricing/v1/pricing.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto). Servers and callers are those on the [system map](/architecture/system-map/); a dash means the map records none.

## Services

### PricingService

[`pricing/v1/pricing.proto:7`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L7)

| RPC | Request → response | Served by | Called by |
| --- | --- | --- | --- |
| [`CalculatePrice`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L8) | [`CalculatePriceRequest`](#calculatepricerequest) → [`CalculatePriceResponse`](#calculatepriceresponse) | [pricing](/services/pricing/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/PricingGrpcClient.cs#L87) |
| [`QuoteShipping`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L9) | [`QuoteShippingRequest`](#quoteshippingrequest) → [`QuoteShippingResponse`](#quoteshippingresponse) | [pricing](/services/pricing/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/PricingGrpcClient.cs#L33) |
| [`RedeemVoucher`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L11) | [`RedeemVoucherRequest`](#redeemvoucherrequest) → [`RedeemVoucherResponse`](#redeemvoucherresponse) | [pricing](/services/pricing/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/VoucherQuotaGrpcClient.cs#L22) |
| [`ReleaseVoucherRedemption`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L12) | [`ReleaseVoucherRedemptionRequest`](#releasevoucherredemptionrequest) → [`ReleaseVoucherRedemptionResponse`](#releasevoucherredemptionresponse) | [pricing](/services/pricing/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/VoucherQuotaGrpcClient.cs#L40) |
| [`AllocateFlashSaleStock`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L14) | [`AllocateFlashSaleStockRequest`](#allocateflashsalestockrequest) → [`AllocateFlashSaleStockResponse`](#allocateflashsalestockresponse) | [pricing](/services/pricing/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/FlashSaleGrpcClient.cs#L17) |
| [`ReleaseFlashSaleAllocation`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L15) | [`ReleaseFlashSaleAllocationRequest`](#releaseflashsaleallocationrequest) → [`ReleaseFlashSaleAllocationResponse`](#releaseflashsaleallocationresponse) | [pricing](/services/pricing/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/FlashSaleGrpcClient.cs#L35) |

## Messages

### PriceItemRequest

[`pricing/v1/pricing.proto:30`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L30)

| Field | Number | Type |
| --- | --- | --- |
| `product_id` | 1 | `string` |
| `category_id` | 2 | `optional string` |
| `base_price` | 3 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `quantity` | 4 | `int32` |

### ShippingQuoteRequest

[`pricing/v1/pricing.proto:37`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L37)

| Field | Number | Type |
| --- | --- | --- |
| `service_tier` | 1 | `string` |
| `distance_km` | 2 | `double` |
| `total_weight_grams` | 3 | `int64` |

### QuoteShippingRequest

[`pricing/v1/pricing.proto:43`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L43)

| Field | Number | Type |
| --- | --- | --- |
| `journeys` | 1 | `repeated` [`ShippingQuoteRequest`](#shippingquoterequest) |

### QuotedShipping

[`pricing/v1/pricing.proto:47`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L47)

| Field | Number | Type |
| --- | --- | --- |
| `service_tier` | 1 | `string` |
| `base_shipping_fee` | 2 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `priced` | 3 | `bool` |

### QuoteShippingResponse

[`pricing/v1/pricing.proto:53`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L53)

| Field | Number | Type |
| --- | --- | --- |
| `quotes` | 1 | `repeated` [`QuotedShipping`](#quotedshipping) |

### CalculatePriceRequest

[`pricing/v1/pricing.proto:57`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L57)

| Field | Number | Type | Notes |
| --- | --- | --- | --- |
| `items` | 1 | `repeated` [`PriceItemRequest`](#priceitemrequest) |  |
| `voucher_code` | 2 | `optional string` |  |
| `base_shipping_fee` | 3 | `optional` [`common.v1.Money`](/apis/grpc/common-v1/#money) | deprecated |
| `payment_method` | 4 | `optional string` |  |
| `shipping` | 5 | `optional` [`ShippingQuoteRequest`](#shippingquoterequest) |  |
| `merchant_principal_id` | 6 | `optional string` |  |

### PriceItemResponse

[`pricing/v1/pricing.proto:66`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L66)

| Field | Number | Type |
| --- | --- | --- |
| `product_id` | 1 | `string` |
| `base_price` | 2 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `final_unit_price` | 3 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `quantity` | 4 | `int32` |
| `line_total` | 5 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `applied_flash_sale` | 6 | `optional string` |
| `applied_discount` | 7 | `optional string` |

### CalculatePriceResponse

[`pricing/v1/pricing.proto:76`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L76)

| Field | Number | Type |
| --- | --- | --- |
| `subtotal` | 1 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `total_discount` | 2 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `voucher_discount` | 3 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `final_total` | 4 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `applied_voucher` | 5 | `optional string` |
| `items` | 6 | `repeated` [`PriceItemResponse`](#priceitemresponse) |
| `base_shipping_fee` | 7 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `shipping_discount` | 8 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `final_shipping_fee` | 9 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `payment_discount` | 10 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |

### RedeemVoucherRequest

[`pricing/v1/pricing.proto:89`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L89)

| Field | Number | Type |
| --- | --- | --- |
| `voucher_code` | 1 | `string` |
| `order_number` | 2 | `string` |
| `customer_principal_id` | 3 | `string` |
| `idempotency_key` | 4 | [`common.v1.IdempotencyKey`](/apis/grpc/common-v1/#idempotencykey) |
| `merchant_principal_id` | 5 | `optional string` |

### RedeemVoucherResponse

[`pricing/v1/pricing.proto:97`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L97)

| Field | Number | Type |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `already_redeemed` | 2 | `bool` |
| `remaining_quota` | 3 | `int32` |
| `error` | 4 | [`common.v1.ErrorDetail`](/apis/grpc/common-v1/#errordetail) |

### ReleaseVoucherRedemptionRequest

[`pricing/v1/pricing.proto:104`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L104)

| Field | Number | Type |
| --- | --- | --- |
| `voucher_code` | 1 | `string` |
| `order_number` | 2 | `string` |
| `idempotency_key` | 3 | [`common.v1.IdempotencyKey`](/apis/grpc/common-v1/#idempotencykey) |

### ReleaseVoucherRedemptionResponse

[`pricing/v1/pricing.proto:110`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L110)

| Field | Number | Type |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `already_released` | 2 | `bool` |
| `remaining_quota` | 3 | `int32` |
| `error` | 4 | [`common.v1.ErrorDetail`](/apis/grpc/common-v1/#errordetail) |

### AllocateFlashSaleStockRequest

[`pricing/v1/pricing.proto:117`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L117)

| Field | Number | Type |
| --- | --- | --- |
| `flash_sale_id` | 1 | `string` |
| `product_id` | 2 | `string` |
| `quantity` | 3 | `int32` |
| `order_number` | 4 | `string` |
| `idempotency_key` | 5 | [`common.v1.IdempotencyKey`](/apis/grpc/common-v1/#idempotencykey) |

### AllocateFlashSaleStockResponse

[`pricing/v1/pricing.proto:125`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L125)

| Field | Number | Type |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `already_allocated` | 2 | `bool` |
| `remaining_stock` | 3 | `int32` |
| `error` | 4 | [`common.v1.ErrorDetail`](/apis/grpc/common-v1/#errordetail) |

### ReleaseFlashSaleAllocationRequest

[`pricing/v1/pricing.proto:132`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L132)

| Field | Number | Type |
| --- | --- | --- |
| `flash_sale_id` | 1 | `string` |
| `product_id` | 2 | `string` |
| `quantity` | 3 | `int32` |
| `order_number` | 4 | `string` |
| `idempotency_key` | 5 | [`common.v1.IdempotencyKey`](/apis/grpc/common-v1/#idempotencykey) |

### ReleaseFlashSaleAllocationResponse

[`pricing/v1/pricing.proto:140`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L140)

| Field | Number | Type |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `already_released` | 2 | `bool` |
| `remaining_stock` | 3 | `int32` |
| `error` | 4 | [`common.v1.ErrorDetail`](/apis/grpc/common-v1/#errordetail) |

## Enums

### DiscountType

[`pricing/v1/pricing.proto:18`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L18)

| Name | Number |
| --- | --- |
| `DISCOUNT_TYPE_UNSPECIFIED` | 0 |
| `DISCOUNT_TYPE_PERCENTAGE` | 1 |
| `DISCOUNT_TYPE_FIXED` | 2 |

### DiscountScope

[`pricing/v1/pricing.proto:24`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L24)

| Name | Number |
| --- | --- |
| `DISCOUNT_SCOPE_UNSPECIFIED` | 0 |
| `DISCOUNT_SCOPE_PER_UNIT` | 1 |
| `DISCOUNT_SCOPE_PER_CART` | 2 |

</div>
