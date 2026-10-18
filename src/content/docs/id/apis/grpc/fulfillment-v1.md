---
title: "fulfillment.v1"
description: "Paket gRPC fulfillment.v1 di kinetix-contracts 1.3.0: service, message, dan enum-nya."
editUrl: false
sourceHash: "472905cb4eec"
---

<div class="grpc-reference">

Dibuat otomatis dari rilis [1.3.0](https://www.npmjs.com/package/kinetix-contracts/v/1.3.0) kinetix-contracts: [`fulfillment/v1/delivery_evidence.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/delivery_evidence.proto), [`fulfillment/v1/fulfillment.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto), [`fulfillment/v1/task.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/task.proto). Server dan pemanggil diambil dari [peta sistem](/id/architecture/system-map/); tanda pisah berarti peta tidak mencatat apa pun.

## Service

### DeliveryEvidenceService

[`fulfillment/v1/delivery_evidence.proto:8`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/delivery_evidence.proto#L8)

| RPC | Request → response | Dilayani oleh | Dipanggil oleh |
| --- | --- | --- | --- |
| [`DeliveriesSince`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/delivery_evidence.proto#L9) | [`DeliveriesSinceRequest`](#deliveriessincerequest) → [`DeliveriesSinceResponse`](#deliveriessinceresponse) | [matching](/id/services/matching/) | [notary](https://github.com/WildanFrananda/kinetix-notary-service/blob/b5d5e1138dcde472ee90c48c8ed3fc315e9c8a2c/internal/feeds/delivery_feed.go#L50) |

### BinStockService

[`fulfillment/v1/fulfillment.proto:8`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L8)

| RPC | Request → response | Dilayani oleh | Dipanggil oleh |
| --- | --- | --- | --- |
| [`CheckBinStock`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L9) | [`CheckBinStockRequest`](#checkbinstockrequest) → [`CheckBinStockResponse`](#checkbinstockresponse) | [warehouse](/id/services/warehouse/) | [catalog](https://github.com/WildanFrananda/kinetix-catalog-service/blob/776bc6acb74c48b45fa9b30a98a2a12609b104ab/core/infrastructure/grpc/bin_stock_client.py#L44) |
| [`CheckBinStockBatch`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L10) | [`CheckBinStockBatchRequest`](#checkbinstockbatchrequest) → [`CheckBinStockBatchResponse`](#checkbinstockbatchresponse) | [warehouse](/id/services/warehouse/) | [catalog](https://github.com/WildanFrananda/kinetix-catalog-service/blob/776bc6acb74c48b45fa9b30a98a2a12609b104ab/core/infrastructure/grpc/bin_stock_client.py#L83) |
| [`ReserveStock`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L11) | [`ReserveStockRequest`](#reservestockrequest) → [`ReserveStockResponse`](#reservestockresponse) | [warehouse](/id/services/warehouse/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/StockGrpcClient.cs#L17) |
| [`ReleaseStock`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L12) | [`ReleaseStockRequest`](#releasestockrequest) → [`ReleaseStockResponse`](#releasestockresponse) | [warehouse](/id/services/warehouse/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/StockGrpcClient.cs#L34) |

### FulfillmentService

[`fulfillment/v1/fulfillment.proto:70`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L70)

| RPC | Request → response | Dilayani oleh | Dipanggil oleh |
| --- | --- | --- | --- |
| [`CreateOrder`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L71) | [`CreateOrderRequest`](#createorderrequest) → [`CreateOrderResponse`](#createorderresponse) | — | — |
| [`GetOrderStatus`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L72) | [`GetOrderStatusRequest`](#getorderstatusrequest) → [`GetOrderStatusResponse`](#getorderstatusresponse) | — | — |
| [`CancelOrder`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L73) | [`CancelOrderRequest`](#cancelorderrequest) → [`CancelOrderResponse`](#cancelorderresponse) | — | — |

### FulfillmentTaskService

[`fulfillment/v1/task.proto:7`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/task.proto#L7)

| RPC | Request → response | Dilayani oleh | Dipanggil oleh |
| --- | --- | --- | --- |
| [`CreateFulfillmentTask`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/task.proto#L8) | [`CreateFulfillmentTaskRequest`](#createfulfillmenttaskrequest) → [`CreateFulfillmentTaskResponse`](#createfulfillmenttaskresponse) | [warehouse](/id/services/warehouse/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/FulfillmentGrpcClient.cs#L34) |
| [`CancelFulfillmentTask`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/task.proto#L9) | [`CancelFulfillmentTaskRequest`](#cancelfulfillmenttaskrequest) → [`CancelFulfillmentTaskResponse`](#cancelfulfillmenttaskresponse) | [warehouse](/id/services/warehouse/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/FulfillmentGrpcClient.cs#L62) |
| [`RecordCourierAwb`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/task.proto#L10) | [`RecordCourierAwbRequest`](#recordcourierawbrequest) → [`RecordCourierAwbResponse`](#recordcourierawbresponse) | [warehouse](/id/services/warehouse/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/FulfillmentGrpcClient.cs#L90) |

## Message

### DeliveryEvidence

[`fulfillment/v1/delivery_evidence.proto:12`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/delivery_evidence.proto#L12)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `position` | 1 | [`common.v1.LogCursor`](/id/apis/grpc/common-v1/#logcursor) |
| `order_number` | 2 | `string` |
| `driver_principal_id` | 3 | `string` |
| `photo_sha256` | 4 | `bytes` |
| `signature_sha256` | 5 | `bytes` |
| `delivered_at` | 6 | `google.protobuf.Timestamp` |

### DeliveriesSinceRequest

[`fulfillment/v1/delivery_evidence.proto:21`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/delivery_evidence.proto#L21)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `after` | 1 | [`common.v1.LogCursor`](/id/apis/grpc/common-v1/#logcursor) |
| `limit` | 2 | `int32` |

### DeliveriesSinceResponse

[`fulfillment/v1/delivery_evidence.proto:26`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/delivery_evidence.proto#L26)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `deliveries` | 1 | `repeated` [`DeliveryEvidence`](#deliveryevidence) |
| `next` | 2 | [`common.v1.LogCursor`](/id/apis/grpc/common-v1/#logcursor) |
| `has_more` | 3 | `bool` |

### CheckBinStockBatchRequest

[`fulfillment/v1/fulfillment.proto:15`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L15)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `merchant_principal_id` | 1 | `string` |
| `skus` | 2 | `repeated string` |

### CheckBinStockBatchResponse

[`fulfillment/v1/fulfillment.proto:20`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L20)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `items` | 1 | `repeated` [`CheckBinStockResponse`](#checkbinstockresponse) |

### CheckBinStockRequest

[`fulfillment/v1/fulfillment.proto:24`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L24)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `merchant_principal_id` | 1 | `string` |
| `sku` | 2 | `string` |

### CheckBinStockResponse

[`fulfillment/v1/fulfillment.proto:29`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L29)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `found` | 1 | `bool` |
| `sku` | 2 | `string` |
| `product_name` | 3 | `string` |
| `physical_stock` | 4 | `int32` |
| `allocated_stock` | 5 | `int32` |
| `available_stock` | 6 | `int32` |
| `bin_location` | 7 | `string` |
| `low_stock_warning` | 8 | `bool` |

### ReserveStockRequest

[`fulfillment/v1/fulfillment.proto:40`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L40)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `merchant_principal_id` | 1 | `string` |
| `sku` | 2 | `string` |
| `quantity` | 3 | `int32` |
| `order_number` | 4 | `string` |
| `idempotency_key` | 5 | [`common.v1.IdempotencyKey`](/id/apis/grpc/common-v1/#idempotencykey) |

### ReserveStockResponse

[`fulfillment/v1/fulfillment.proto:48`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L48)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `bin_location` | 2 | `string` |
| `remaining_available` | 3 | `int32` |
| `error` | 4 | [`common.v1.ErrorDetail`](/id/apis/grpc/common-v1/#errordetail) |

### ReleaseStockRequest

[`fulfillment/v1/fulfillment.proto:55`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L55)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `merchant_principal_id` | 1 | `string` |
| `sku` | 2 | `string` |
| `quantity` | 3 | `int32` |
| `order_number` | 4 | `string` |
| `idempotency_key` | 5 | [`common.v1.IdempotencyKey`](/id/apis/grpc/common-v1/#idempotencykey) |

### ReleaseStockResponse

[`fulfillment/v1/fulfillment.proto:63`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L63)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `already_released` | 2 | `bool` |
| `remaining_available` | 3 | `int32` |
| `error` | 4 | [`common.v1.ErrorDetail`](/id/apis/grpc/common-v1/#errordetail) |

### CreateOrderRequest

[`fulfillment/v1/fulfillment.proto:76`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L76)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `merchant_principal_id` | 1 | `string` |
| `order_number` | 2 | `string` |
| `pickup_address` | 3 | [`common.v1.Address`](/id/apis/grpc/common-v1/#address) |
| `shipping_address` | 4 | [`common.v1.Address`](/id/apis/grpc/common-v1/#address) |
| `total_amount` | 5 | [`common.v1.Money`](/id/apis/grpc/common-v1/#money) |
| `items` | 6 | `repeated` [`common.v1.OrderItem`](/id/apis/grpc/common-v1/#orderitem) |
| `idempotency_key` | 7 | [`common.v1.IdempotencyKey`](/id/apis/grpc/common-v1/#idempotencykey) |
| `pickup_location` | 8 | [`common.v1.GeoPoint`](/id/apis/grpc/common-v1/#geopoint) |
| `dropoff_location` | 9 | [`common.v1.GeoPoint`](/id/apis/grpc/common-v1/#geopoint) |

### CreateOrderResponse

[`fulfillment/v1/fulfillment.proto:88`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L88)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `order_id` | 2 | `string` |
| `order_number` | 3 | `string` |
| `status` | 4 | [`common.v1.OrderStatus`](/id/apis/grpc/common-v1/#orderstatus) |
| `merchant_principal_id` | 5 | `string` |
| `created_at` | 6 | `google.protobuf.Timestamp` |
| `error` | 7 | [`common.v1.ErrorDetail`](/id/apis/grpc/common-v1/#errordetail) |

### GetOrderStatusRequest

[`fulfillment/v1/fulfillment.proto:98`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L98)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `merchant_principal_id` | 1 | `string` |
| `order_id` | 2 | `string` |
| `order_number` | 3 | `string` |

### GetOrderStatusResponse

[`fulfillment/v1/fulfillment.proto:104`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L104)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `found` | 1 | `bool` |
| `order_id` | 2 | `string` |
| `order_number` | 3 | `string` |
| `status` | 4 | [`common.v1.OrderStatus`](/id/apis/grpc/common-v1/#orderstatus) |
| `awb_number` | 5 | `string` |
| `pod_photo_url` | 6 | `string` |
| `driver_location` | 7 | [`common.v1.GeoPoint`](/id/apis/grpc/common-v1/#geopoint) |
| `updated_at` | 8 | `google.protobuf.Timestamp` |

### CancelOrderRequest

[`fulfillment/v1/fulfillment.proto:115`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L115)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `merchant_principal_id` | 1 | `string` |
| `order_id` | 2 | `string` |
| `reason` | 3 | `string` |
| `idempotency_key` | 4 | [`common.v1.IdempotencyKey`](/id/apis/grpc/common-v1/#idempotencykey) |

### CancelOrderResponse

[`fulfillment/v1/fulfillment.proto:122`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/fulfillment.proto#L122)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `message` | 2 | `string` |
| `current_status` | 3 | [`common.v1.OrderStatus`](/id/apis/grpc/common-v1/#orderstatus) |

### RecordCourierAwbRequest

[`fulfillment/v1/task.proto:13`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/task.proto#L13)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `merchant_principal_id` | 1 | `string` |
| `fulfillment_task_id` | 2 | `string` |
| `order_number` | 3 | `string` |
| `awb_number` | 4 | `string` |
| `idempotency_key` | 5 | [`common.v1.IdempotencyKey`](/id/apis/grpc/common-v1/#idempotencykey) |

### RecordCourierAwbResponse

[`fulfillment/v1/task.proto:21`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/task.proto#L21)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `accepted` | 1 | `bool` |
| `already_recorded` | 2 | `bool` |
| `error` | 3 | [`common.v1.ErrorDetail`](/id/apis/grpc/common-v1/#errordetail) |

### FulfillmentTaskLine

[`fulfillment/v1/task.proto:27`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/task.proto#L27)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `sku` | 1 | `string` |
| `quantity` | 2 | `int32` |

### CreateFulfillmentTaskRequest

[`fulfillment/v1/task.proto:32`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/task.proto#L32)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `merchant_principal_id` | 1 | `string` |
| `order_number` | 2 | `string` |
| `lines` | 3 | `repeated` [`FulfillmentTaskLine`](#fulfillmenttaskline) |
| `idempotency_key` | 4 | [`common.v1.IdempotencyKey`](/id/apis/grpc/common-v1/#idempotencykey) |

### CreateFulfillmentTaskResponse

[`fulfillment/v1/task.proto:39`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/task.proto#L39)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `task_id` | 2 | `string` |
| `already_created` | 3 | `bool` |
| `error` | 4 | [`common.v1.ErrorDetail`](/id/apis/grpc/common-v1/#errordetail) |

### CancelFulfillmentTaskRequest

[`fulfillment/v1/task.proto:46`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/task.proto#L46)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `merchant_principal_id` | 1 | `string` |
| `task_id` | 2 | `string` |
| `reason` | 3 | `string` |

### CancelFulfillmentTaskResponse

[`fulfillment/v1/task.proto:52`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fulfillment/v1/task.proto#L52)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `already_cancelled` | 2 | `bool` |
| `error` | 3 | [`common.v1.ErrorDetail`](/id/apis/grpc/common-v1/#errordetail) |

</div>
