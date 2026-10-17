---
title: "pricing.v1"
description: "Paket gRPC pricing.v1 di kinetix-contracts 1.3.0: service, message, dan enum-nya."
editUrl: false
sourceHash: "0ad33c85c4e0"
---

<div class="grpc-reference">

Dibuat otomatis dari rilis [1.3.0](https://www.npmjs.com/package/kinetix-contracts/v/1.3.0) kinetix-contracts: [`pricing/v1/pricing.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto). Server dan pemanggil diambil dari [peta sistem](/id/architecture/system-map/); tanda pisah berarti peta tidak mencatat apa pun.

## Service

### PricingService

[`pricing/v1/pricing.proto:7`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L7)

| RPC | Request → response | Dilayani oleh | Dipanggil oleh |
| --- | --- | --- | --- |
| [`CalculatePrice`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L8) | [`CalculatePriceRequest`](#calculatepricerequest) → [`CalculatePriceResponse`](#calculatepriceresponse) | [pricing](/id/services/pricing/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/PricingGrpcClient.cs#L87) |
| [`QuoteShipping`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L9) | [`QuoteShippingRequest`](#quoteshippingrequest) → [`QuoteShippingResponse`](#quoteshippingresponse) | [pricing](/id/services/pricing/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/PricingGrpcClient.cs#L33) |
| [`RedeemVoucher`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L11) | [`RedeemVoucherRequest`](#redeemvoucherrequest) → [`RedeemVoucherResponse`](#redeemvoucherresponse) | [pricing](/id/services/pricing/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/VoucherQuotaGrpcClient.cs#L22) |
| [`ReleaseVoucherRedemption`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L12) | [`ReleaseVoucherRedemptionRequest`](#releasevoucherredemptionrequest) → [`ReleaseVoucherRedemptionResponse`](#releasevoucherredemptionresponse) | [pricing](/id/services/pricing/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/VoucherQuotaGrpcClient.cs#L40) |
| [`AllocateFlashSaleStock`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L14) | [`AllocateFlashSaleStockRequest`](#allocateflashsalestockrequest) → [`AllocateFlashSaleStockResponse`](#allocateflashsalestockresponse) | [pricing](/id/services/pricing/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/FlashSaleGrpcClient.cs#L17) |
| [`ReleaseFlashSaleAllocation`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L15) | [`ReleaseFlashSaleAllocationRequest`](#releaseflashsaleallocationrequest) → [`ReleaseFlashSaleAllocationResponse`](#releaseflashsaleallocationresponse) | [pricing](/id/services/pricing/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/FlashSaleGrpcClient.cs#L35) |

## Message

### PriceItemRequest

[`pricing/v1/pricing.proto:30`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L30)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `product_id` | 1 | `string` |
| `category_id` | 2 | `optional string` |
| `base_price` | 3 | [`common.v1.Money`](/id/apis/grpc/common-v1/#money) |
| `quantity` | 4 | `int32` |

### ShippingQuoteRequest

[`pricing/v1/pricing.proto:37`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L37)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `service_tier` | 1 | `string` |
| `distance_km` | 2 | `double` |
| `total_weight_grams` | 3 | `int64` |

### QuoteShippingRequest

[`pricing/v1/pricing.proto:43`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L43)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `journeys` | 1 | `repeated` [`ShippingQuoteRequest`](#shippingquoterequest) |

### QuotedShipping

[`pricing/v1/pricing.proto:47`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L47)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `service_tier` | 1 | `string` |
| `base_shipping_fee` | 2 | [`common.v1.Money`](/id/apis/grpc/common-v1/#money) |
| `priced` | 3 | `bool` |

### QuoteShippingResponse

[`pricing/v1/pricing.proto:53`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L53)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `quotes` | 1 | `repeated` [`QuotedShipping`](#quotedshipping) |

### CalculatePriceRequest

[`pricing/v1/pricing.proto:57`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L57)

| Field | Nomor | Tipe | Catatan |
| --- | --- | --- | --- |
| `items` | 1 | `repeated` [`PriceItemRequest`](#priceitemrequest) |  |
| `voucher_code` | 2 | `optional string` |  |
| `base_shipping_fee` | 3 | `optional` [`common.v1.Money`](/id/apis/grpc/common-v1/#money) | deprecated |
| `payment_method` | 4 | `optional string` |  |
| `shipping` | 5 | `optional` [`ShippingQuoteRequest`](#shippingquoterequest) |  |
| `merchant_principal_id` | 6 | `optional string` |  |

### PriceItemResponse

[`pricing/v1/pricing.proto:66`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L66)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `product_id` | 1 | `string` |
| `base_price` | 2 | [`common.v1.Money`](/id/apis/grpc/common-v1/#money) |
| `final_unit_price` | 3 | [`common.v1.Money`](/id/apis/grpc/common-v1/#money) |
| `quantity` | 4 | `int32` |
| `line_total` | 5 | [`common.v1.Money`](/id/apis/grpc/common-v1/#money) |
| `applied_flash_sale` | 6 | `optional string` |
| `applied_discount` | 7 | `optional string` |

### CalculatePriceResponse

[`pricing/v1/pricing.proto:76`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L76)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `subtotal` | 1 | [`common.v1.Money`](/id/apis/grpc/common-v1/#money) |
| `total_discount` | 2 | [`common.v1.Money`](/id/apis/grpc/common-v1/#money) |
| `voucher_discount` | 3 | [`common.v1.Money`](/id/apis/grpc/common-v1/#money) |
| `final_total` | 4 | [`common.v1.Money`](/id/apis/grpc/common-v1/#money) |
| `applied_voucher` | 5 | `optional string` |
| `items` | 6 | `repeated` [`PriceItemResponse`](#priceitemresponse) |
| `base_shipping_fee` | 7 | [`common.v1.Money`](/id/apis/grpc/common-v1/#money) |
| `shipping_discount` | 8 | [`common.v1.Money`](/id/apis/grpc/common-v1/#money) |
| `final_shipping_fee` | 9 | [`common.v1.Money`](/id/apis/grpc/common-v1/#money) |
| `payment_discount` | 10 | [`common.v1.Money`](/id/apis/grpc/common-v1/#money) |

### RedeemVoucherRequest

[`pricing/v1/pricing.proto:89`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L89)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `voucher_code` | 1 | `string` |
| `order_number` | 2 | `string` |
| `customer_principal_id` | 3 | `string` |
| `idempotency_key` | 4 | [`common.v1.IdempotencyKey`](/id/apis/grpc/common-v1/#idempotencykey) |
| `merchant_principal_id` | 5 | `optional string` |

### RedeemVoucherResponse

[`pricing/v1/pricing.proto:97`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L97)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `already_redeemed` | 2 | `bool` |
| `remaining_quota` | 3 | `int32` |
| `error` | 4 | [`common.v1.ErrorDetail`](/id/apis/grpc/common-v1/#errordetail) |

### ReleaseVoucherRedemptionRequest

[`pricing/v1/pricing.proto:104`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L104)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `voucher_code` | 1 | `string` |
| `order_number` | 2 | `string` |
| `idempotency_key` | 3 | [`common.v1.IdempotencyKey`](/id/apis/grpc/common-v1/#idempotencykey) |

### ReleaseVoucherRedemptionResponse

[`pricing/v1/pricing.proto:110`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L110)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `already_released` | 2 | `bool` |
| `remaining_quota` | 3 | `int32` |
| `error` | 4 | [`common.v1.ErrorDetail`](/id/apis/grpc/common-v1/#errordetail) |

### AllocateFlashSaleStockRequest

[`pricing/v1/pricing.proto:117`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L117)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `flash_sale_id` | 1 | `string` |
| `product_id` | 2 | `string` |
| `quantity` | 3 | `int32` |
| `order_number` | 4 | `string` |
| `idempotency_key` | 5 | [`common.v1.IdempotencyKey`](/id/apis/grpc/common-v1/#idempotencykey) |

### AllocateFlashSaleStockResponse

[`pricing/v1/pricing.proto:125`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L125)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `already_allocated` | 2 | `bool` |
| `remaining_stock` | 3 | `int32` |
| `error` | 4 | [`common.v1.ErrorDetail`](/id/apis/grpc/common-v1/#errordetail) |

### ReleaseFlashSaleAllocationRequest

[`pricing/v1/pricing.proto:132`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L132)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `flash_sale_id` | 1 | `string` |
| `product_id` | 2 | `string` |
| `quantity` | 3 | `int32` |
| `order_number` | 4 | `string` |
| `idempotency_key` | 5 | [`common.v1.IdempotencyKey`](/id/apis/grpc/common-v1/#idempotencykey) |

### ReleaseFlashSaleAllocationResponse

[`pricing/v1/pricing.proto:140`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L140)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `already_released` | 2 | `bool` |
| `remaining_stock` | 3 | `int32` |
| `error` | 4 | [`common.v1.ErrorDetail`](/id/apis/grpc/common-v1/#errordetail) |

## Enum

### DiscountType

[`pricing/v1/pricing.proto:18`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L18)

| Nama | Nomor |
| --- | --- |
| `DISCOUNT_TYPE_UNSPECIFIED` | 0 |
| `DISCOUNT_TYPE_PERCENTAGE` | 1 |
| `DISCOUNT_TYPE_FIXED` | 2 |

### DiscountScope

[`pricing/v1/pricing.proto:24`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/pricing/v1/pricing.proto#L24)

| Nama | Nomor |
| --- | --- |
| `DISCOUNT_SCOPE_UNSPECIFIED` | 0 |
| `DISCOUNT_SCOPE_PER_UNIT` | 1 |
| `DISCOUNT_SCOPE_PER_CART` | 2 |

</div>
