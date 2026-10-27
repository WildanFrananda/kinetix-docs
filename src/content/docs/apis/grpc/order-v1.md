---
title: "order.v1"
description: "The order.v1 gRPC package in kinetix-contracts 1.7.0: its services, messages and enums."
editUrl: false
---

<div class="grpc-reference">

Generated from release [1.7.0](https://www.npmjs.com/package/kinetix-contracts/v/1.7.0) of kinetix-contracts: [`order/v1/lifecycle.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/lifecycle.proto), [`order/v1/order.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto). Servers and callers are those on the [system map](/architecture/system-map/); a dash means the map records none.

## Services

### OrderLifecycleService

[`order/v1/lifecycle.proto:9`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/lifecycle.proto#L9)

| RPC | Request → response | Served by | Called by |
| --- | --- | --- | --- |
| [`LifecycleEventsSince`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/lifecycle.proto#L10) | [`LifecycleEventsSinceRequest`](#lifecycleeventssincerequest) → [`LifecycleEventsSinceResponse`](#lifecycleeventssinceresponse) | [order](/services/order/) | [notary](https://github.com/WildanFrananda/kinetix-notary-service/blob/8446176813c354716d77ca6591038633871bcda5/internal/feeds/lifecycle_feed.go#L50) |

### OrderService

[`order/v1/order.proto:8`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L8)

| RPC | Request → response | Served by | Called by |
| --- | --- | --- | --- |
| [`GetOrderDetails`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L9) | [`GetOrderDetailsRequest`](#getorderdetailsrequest) → [`GetOrderDetailsResponse`](#getorderdetailsresponse) | [order](/services/order/) | [review](https://github.com/WildanFrananda/kinetix-review-service/blob/e3ca897c68947dd7ba4a47f04355e5e91da9afa8/app/Clients/GrpcOrderClient.php#L79) |
| [`ListOrdersForPrincipal`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L10) | [`ListOrdersForPrincipalRequest`](#listordersforprincipalrequest) → [`ListOrdersForPrincipalResponse`](#listordersforprincipalresponse) | [order](/services/order/) | — |
| [`FulfillmentPacked`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L11) | [`FulfillmentPackedRequest`](#fulfillmentpackedrequest) → [`FulfillmentPackedResponse`](#fulfillmentpackedresponse) | [order](/services/order/) | [warehouse](https://github.com/WildanFrananda/kinetix-warehouse-service/blob/ec17794d7551b0ccacc0ada5c31747f8d44526e3/app/clients/order/grpc_client.rb#L60) |
| [`OrderDelivered`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L12) | [`OrderDeliveredRequest`](#orderdeliveredrequest) → [`OrderDeliveredResponse`](#orderdeliveredresponse) | [order](/services/order/) | [matching](https://github.com/WildanFrananda/kinetix-matching-service/blob/7ef67a0ca1d0e8945f638de8a2f9684e84d06886/lib/fleet_pulse/clients/order_grpc.ex#L58) |
| [`OpenReturn`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L13) | [`OpenReturnRequest`](#openreturnrequest) → [`OpenReturnResponse`](#openreturnresponse) | [order](/services/order/) | [warehouse](https://github.com/WildanFrananda/kinetix-warehouse-service/blob/ec17794d7551b0ccacc0ada5c31747f8d44526e3/app/clients/order/grpc_client.rb#L86) |
| [`ReturnGoodsReceived`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L14) | [`ReturnGoodsReceivedRequest`](#returngoodsreceivedrequest) → [`ReturnGoodsReceivedResponse`](#returngoodsreceivedresponse) | [order](/services/order/) | [warehouse](https://github.com/WildanFrananda/kinetix-warehouse-service/blob/ec17794d7551b0ccacc0ada5c31747f8d44526e3/app/clients/order/grpc_client.rb#L119) |
| [`OrdersChangedSince`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L15) | [`OrdersChangedSinceRequest`](#orderschangedsincerequest) → [`OrdersChangedSinceResponse`](#orderschangedsinceresponse) | [order](/services/order/) | [search](https://github.com/WildanFrananda/kinetix-search-service/blob/ba054100e0e91fd9640842c0035b514d923f674e/internal/orderclient/client.go#L54) |

## Messages

### LifecycleEvent

[`order/v1/lifecycle.proto:32`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/lifecycle.proto#L32)

| Field | Number | Type |
| --- | --- | --- |
| `position` | 1 | [`common.v1.LogCursor`](/apis/grpc/common-v1/#logcursor) |
| `order_number` | 2 | `string` |
| `kind` | 3 | [`LifecycleEventKind`](#lifecycleeventkind) |
| `from_status` | 4 | [`common.v1.OrderStatus`](/apis/grpc/common-v1/#orderstatus) |
| `to_status` | 5 | [`common.v1.OrderStatus`](/apis/grpc/common-v1/#orderstatus) |
| `return_number` | 6 | `string` |
| `return_status` | 7 | [`ReturnStatus`](#returnstatus) |
| `actor_kind` | 8 | [`LifecycleActorKind`](#lifecycleactorkind) |
| `actor_principal_id` | 9 | `string` |
| `buyer_principal_id` | 10 | `string` |
| `merchant_principal_id` | 11 | `string` |
| `occurred_at` | 12 | `google.protobuf.Timestamp` |

### LifecycleEventsSinceRequest

[`order/v1/lifecycle.proto:47`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/lifecycle.proto#L47)

| Field | Number | Type |
| --- | --- | --- |
| `after` | 1 | [`common.v1.LogCursor`](/apis/grpc/common-v1/#logcursor) |
| `limit` | 2 | `int32` |

### LifecycleEventsSinceResponse

[`order/v1/lifecycle.proto:52`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/lifecycle.proto#L52)

| Field | Number | Type |
| --- | --- | --- |
| `events` | 1 | `repeated` [`LifecycleEvent`](#lifecycleevent) |
| `next` | 2 | [`common.v1.LogCursor`](/apis/grpc/common-v1/#logcursor) |
| `has_more` | 3 | `bool` |

### OpenReturnRequest

[`order/v1/order.proto:26`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L26)

| Field | Number | Type |
| --- | --- | --- |
| `order_number` | 1 | `string` |
| `merchant_principal_id` | 2 | `string` |
| `reason` | 3 | `string` |
| `idempotency_key` | 4 | [`common.v1.IdempotencyKey`](/apis/grpc/common-v1/#idempotencykey) |

### OpenReturnResponse

[`order/v1/order.proto:33`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L33)

| Field | Number | Type |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `return_number` | 2 | `string` |
| `status` | 3 | [`ReturnStatus`](#returnstatus) |
| `already_open` | 4 | `bool` |
| `error` | 5 | [`common.v1.ErrorDetail`](/apis/grpc/common-v1/#errordetail) |

### ReturnedLine

[`order/v1/order.proto:41`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L41)

| Field | Number | Type |
| --- | --- | --- |
| `sku` | 1 | `string` |
| `quantity` | 2 | `int32` |

### ReturnGoodsReceivedRequest

[`order/v1/order.proto:46`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L46)

| Field | Number | Type |
| --- | --- | --- |
| `return_number` | 1 | `string` |
| `merchant_principal_id` | 2 | `string` |
| `lines` | 3 | `repeated` [`ReturnedLine`](#returnedline) |
| `bin_code` | 4 | `string` |
| `received_at` | 5 | `string` |
| `idempotency_key` | 6 | [`common.v1.IdempotencyKey`](/apis/grpc/common-v1/#idempotencykey) |

### ReturnGoodsReceivedResponse

[`order/v1/order.proto:55`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L55)

| Field | Number | Type |
| --- | --- | --- |
| `accepted` | 1 | `bool` |
| `already_recorded` | 2 | `bool` |
| `status` | 3 | [`ReturnStatus`](#returnstatus) |
| `error` | 4 | [`common.v1.ErrorDetail`](/apis/grpc/common-v1/#errordetail) |

### OrderDeliveredRequest

[`order/v1/order.proto:62`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L62)

| Field | Number | Type |
| --- | --- | --- |
| `order_number` | 1 | `string` |
| `driver_principal_id` | 2 | `string` |
| `delivered_at` | 3 | `string` |

### OrderDeliveredResponse

[`order/v1/order.proto:68`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L68)

| Field | Number | Type |
| --- | --- | --- |
| `accepted` | 1 | `bool` |
| `already_delivered` | 2 | `bool` |
| `error` | 3 | [`common.v1.ErrorDetail`](/apis/grpc/common-v1/#errordetail) |

### FulfillmentPackedRequest

[`order/v1/order.proto:74`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L74)

| Field | Number | Type |
| --- | --- | --- |
| `merchant_principal_id` | 1 | `string` |
| `order_number` | 2 | `string` |
| `fulfillment_task_id` | 3 | `string` |

### FulfillmentPackedResponse

[`order/v1/order.proto:80`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L80)

| Field | Number | Type |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `already_packed` | 2 | `bool` |
| `dispatch_ref` | 3 | `string` |
| `error` | 4 | [`common.v1.ErrorDetail`](/apis/grpc/common-v1/#errordetail) |

### GetOrderDetailsRequest

[`order/v1/order.proto:87`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L87)

| Field | Number | Type |
| --- | --- | --- |
| `order_id` | 1 | `string` |

### OrderLine

[`order/v1/order.proto:91`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L91)

| Field | Number | Type |
| --- | --- | --- |
| `product_id` | 1 | `string` |
| `product_title` | 2 | `string` |
| `unit_price` | 3 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `quantity` | 4 | `int32` |
| `line_subtotal` | 5 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |

### GetOrderDetailsResponse

[`order/v1/order.proto:99`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L99)

| Field | Number | Type |
| --- | --- | --- |
| `found` | 1 | `bool` |
| `order_id` | 2 | `string` |
| `order_number` | 3 | `string` |
| `customer_principal_id` | 4 | `string` |
| `status` | 5 | [`common.v1.OrderStatus`](/apis/grpc/common-v1/#orderstatus) |
| `subtotal` | 6 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `discount_amount` | 7 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `shipping_fee` | 8 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `final_total` | 9 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `lines` | 10 | `repeated` [`OrderLine`](#orderline) |
| `shipping_address` | 11 | [`common.v1.Address`](/apis/grpc/common-v1/#address) |
| `merchant_principal_id` | 12 | `string` |
| `driver_principal_id` | 13 | `string` |

### ListOrdersForPrincipalRequest

[`order/v1/order.proto:115`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L115)

| Field | Number | Type |
| --- | --- | --- |
| `principal_id` | 1 | `string` |
| `status` | 2 | [`common.v1.OrderStatus`](/apis/grpc/common-v1/#orderstatus) |
| `page` | 3 | `int32` |
| `page_size` | 4 | `int32` |

### ListOrdersForPrincipalResponse

[`order/v1/order.proto:122`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L122)

| Field | Number | Type |
| --- | --- | --- |
| `orders` | 1 | `repeated` [`GetOrderDetailsResponse`](#getorderdetailsresponse) |
| `total_count` | 2 | `int32` |

### OrderCursor

[`order/v1/order.proto:127`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L127)

| Field | Number | Type |
| --- | --- | --- |
| `updated_through` | 1 | `google.protobuf.Timestamp` |
| `last_order_number` | 2 | `string` |
| `transaction_id` | 3 | `optional uint64` |

### OrderRecord

[`order/v1/order.proto:133`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L133)

| Field | Number | Type |
| --- | --- | --- |
| `order_number` | 1 | `string` |
| `buyer_principal_id` | 2 | `string` |
| `merchant_principal_id` | 3 | `string` |
| `status` | 4 | [`common.v1.OrderStatus`](/apis/grpc/common-v1/#orderstatus) |
| `line_titles` | 5 | `repeated string` |
| `placed_at` | 6 | `google.protobuf.Timestamp` |
| `updated_at` | 7 | `google.protobuf.Timestamp` |

### OrdersChangedSinceRequest

[`order/v1/order.proto:143`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L143)

| Field | Number | Type |
| --- | --- | --- |
| `cursor` | 1 | [`OrderCursor`](#ordercursor) |
| `limit` | 2 | `int32` |

### OrdersChangedSinceResponse

[`order/v1/order.proto:148`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L148)

| Field | Number | Type |
| --- | --- | --- |
| `upserted` | 1 | `repeated` [`OrderRecord`](#orderrecord) |
| `next` | 2 | [`OrderCursor`](#ordercursor) |
| `has_more` | 3 | `bool` |

## Enums

### LifecycleEventKind

[`order/v1/lifecycle.proto:13`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/lifecycle.proto#L13)

| Name | Number |
| --- | --- |
| `LIFECYCLE_EVENT_KIND_UNSPECIFIED` | 0 |
| `LIFECYCLE_EVENT_KIND_STATUS_CHANGED` | 1 |
| `LIFECYCLE_EVENT_KIND_RETURN_OPENED` | 2 |
| `LIFECYCLE_EVENT_KIND_RETURN_GOODS_RECEIVED` | 3 |
| `LIFECYCLE_EVENT_KIND_RETURN_RESOLVED` | 4 |
| `LIFECYCLE_EVENT_KIND_RETURN_REJECTED` | 5 |
| `LIFECYCLE_EVENT_KIND_BASELINE` | 6 |

### LifecycleActorKind

[`order/v1/lifecycle.proto:23`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/lifecycle.proto#L23)

| Name | Number |
| --- | --- |
| `LIFECYCLE_ACTOR_KIND_UNSPECIFIED` | 0 |
| `LIFECYCLE_ACTOR_KIND_BUYER` | 1 |
| `LIFECYCLE_ACTOR_KIND_MERCHANT` | 2 |
| `LIFECYCLE_ACTOR_KIND_DRIVER` | 3 |
| `LIFECYCLE_ACTOR_KIND_ADMIN` | 4 |
| `LIFECYCLE_ACTOR_KIND_SYSTEM` | 5 |

### ReturnStatus

[`order/v1/order.proto:18`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/order/v1/order.proto#L18)

| Name | Number |
| --- | --- |
| `RETURN_STATUS_UNSPECIFIED` | 0 |
| `RETURN_STATUS_OPEN` | 1 |
| `RETURN_STATUS_GOODS_RECEIVED` | 2 |
| `RETURN_STATUS_RESOLVED` | 3 |
| `RETURN_STATUS_REJECTED` | 4 |

</div>
