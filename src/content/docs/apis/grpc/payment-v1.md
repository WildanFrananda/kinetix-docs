---
title: "payment.v1"
description: "The payment.v1 gRPC package in kinetix-contracts 1.5.0: its services, messages and enums."
editUrl: false
---

<div class="grpc-reference">

Generated from release [1.5.0](https://www.npmjs.com/package/kinetix-contracts/v/1.5.0) of kinetix-contracts: [`payment/v1/liability_record.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/liability_record.proto), [`payment/v1/liability.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/liability.proto), [`payment/v1/payment.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/payment.proto). Servers and callers are those on the [system map](/architecture/system-map/); a dash means the map records none.

## Services

### LiabilityRecordService

[`payment/v1/liability_record.proto:8`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/liability_record.proto#L8)

| RPC | Request → response | Served by | Called by |
| --- | --- | --- | --- |
| [`GetLiabilitySnapshotRecord`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/liability_record.proto#L9) | [`GetLiabilitySnapshotRecordRequest`](#getliabilitysnapshotrecordrequest) → [`GetLiabilitySnapshotRecordResponse`](#getliabilitysnapshotrecordresponse) | [payment](/services/payment/) | [notary](https://github.com/WildanFrananda/kinetix-notary-service/blob/b5d5e1138dcde472ee90c48c8ed3fc315e9c8a2c/internal/payment/records.go#L56) |

### LiabilityService

[`payment/v1/liability.proto:8`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/liability.proto#L8)

| RPC | Request → response | Served by | Called by |
| --- | --- | --- | --- |
| [`StreamLiabilitySnapshot`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/liability.proto#L9) | [`StreamLiabilitySnapshotRequest`](#streamliabilitysnapshotrequest) → `stream` [`StreamLiabilitySnapshotResponse`](#streamliabilitysnapshotresponse) | [payment](/services/payment/) | [notary](https://github.com/WildanFrananda/kinetix-notary-service/blob/b5d5e1138dcde472ee90c48c8ed3fc315e9c8a2c/internal/payment/source.go#L61) |

### PaymentService

[`payment/v1/payment.proto:8`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/payment.proto#L8)

| RPC | Request → response | Served by | Called by |
| --- | --- | --- | --- |
| [`CreateEscrowHold`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/payment.proto#L9) | [`CreateEscrowHoldRequest`](#createescrowholdrequest) → [`EscrowHoldResponse`](#escrowholdresponse) | [payment](/services/payment/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/EscrowGrpcClient.cs#L49) |
| [`ReleaseEscrow`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/payment.proto#L10) | [`ReleaseEscrowRequest`](#releaseescrowrequest) → [`EscrowHoldResponse`](#escrowholdresponse) | [payment](/services/payment/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/EscrowGrpcClient.cs#L95) |
| [`RefundEscrow`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/payment.proto#L11) | [`RefundEscrowRequest`](#refundescrowrequest) → [`EscrowHoldResponse`](#escrowholdresponse) | [payment](/services/payment/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/EscrowGrpcClient.cs#L73) |
| [`GetEscrowStatus`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/payment.proto#L12) | [`GetEscrowStatusRequest`](#getescrowstatusrequest) → [`EscrowHoldResponse`](#escrowholdresponse) | [payment](/services/payment/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/EscrowGrpcClient.cs#L158) |
| [`SettleShippingFee`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/payment.proto#L13) | [`SettleShippingFeeRequest`](#settleshippingfeerequest) → [`EscrowHoldResponse`](#escrowholdresponse) | [payment](/services/payment/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/EscrowGrpcClient.cs#L137) |
| [`RefundGoods`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/payment.proto#L14) | [`RefundGoodsRequest`](#refundgoodsrequest) → [`EscrowHoldResponse`](#escrowholdresponse) | [payment](/services/payment/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/EscrowGrpcClient.cs#L110) |

## Messages

### GetLiabilitySnapshotRecordRequest

[`payment/v1/liability_record.proto:12`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/liability_record.proto#L12)

| Field | Number | Type |
| --- | --- | --- |
| `snapshot_id` | 1 | `string` |

### GetLiabilitySnapshotRecordResponse

[`payment/v1/liability_record.proto:16`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/liability_record.proto#L16)

| Field | Number | Type |
| --- | --- | --- |
| `snapshot_id` | 1 | `string` |
| `as_of` | 2 | `google.protobuf.Timestamp` |
| `currency` | 3 | `string` |
| `account_count` | 4 | `int64` |
| `total` | 5 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `digest` | 6 | `bytes` |

### StreamLiabilitySnapshotRequest

[`payment/v1/liability.proto:23`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/liability.proto#L23)

| Field | Number | Type |
| --- | --- | --- |
| `currency` | 1 | `string` |

### StreamLiabilitySnapshotResponse

[`payment/v1/liability.proto:27`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/liability.proto#L27)

| Field | Number | Type | Notes |
| --- | --- | --- | --- |
| `header` | 1 | [`LiabilitySnapshotHeader`](#liabilitysnapshotheader) | `oneof part` |
| `accounts` | 2 | [`LiabilityAccountBatch`](#liabilityaccountbatch) | `oneof part` |
| `trailer` | 3 | [`LiabilitySnapshotTrailer`](#liabilitysnapshottrailer) | `oneof part` |

### LiabilitySnapshotHeader

[`payment/v1/liability.proto:35`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/liability.proto#L35)

| Field | Number | Type |
| --- | --- | --- |
| `as_of` | 1 | `google.protobuf.Timestamp` |
| `currency` | 2 | `string` |
| `snapshot_id` | 3 | `string` |

### LiabilityAccountBatch

[`payment/v1/liability.proto:41`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/liability.proto#L41)

| Field | Number | Type |
| --- | --- | --- |
| `accounts` | 1 | `repeated` [`LiabilityAccount`](#liabilityaccount) |

### LiabilityAccount

[`payment/v1/liability.proto:45`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/liability.proto#L45)

| Field | Number | Type | Notes |
| --- | --- | --- | --- |
| `kind` | 1 | [`LiabilityKind`](#liabilitykind) |  |
| `principal_id` | 2 | `string` | `oneof holder` |
| `suspense_purpose` | 3 | `string` | `oneof holder` |
| `balance` | 4 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |  |

### LiabilitySnapshotTrailer

[`payment/v1/liability.proto:54`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/liability.proto#L54)

| Field | Number | Type |
| --- | --- | --- |
| `account_count` | 1 | `int64` |
| `total` | 2 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `digest` | 3 | `bytes` |

### CreateEscrowHoldRequest

[`payment/v1/payment.proto:26`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/payment.proto#L26)

| Field | Number | Type |
| --- | --- | --- |
| `order_number` | 1 | `string` |
| `customer_principal_id` | 2 | `string` |
| `merchant_principal_id` | 3 | `string` |
| `driver_principal_id` | 4 | `string` |
| `total_order_amount` | 5 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `merchant_amount` | 6 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `shipping_fee_amount` | 7 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `idempotency_key` | 8 | [`common.v1.IdempotencyKey`](/apis/grpc/common-v1/#idempotencykey) |

### ReleaseEscrowRequest

[`payment/v1/payment.proto:37`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/payment.proto#L37)

| Field | Number | Type |
| --- | --- | --- |
| `order_number` | 1 | `string` |
| `idempotency_key` | 2 | [`common.v1.IdempotencyKey`](/apis/grpc/common-v1/#idempotencykey) |

### RefundEscrowRequest

[`payment/v1/payment.proto:42`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/payment.proto#L42)

| Field | Number | Type |
| --- | --- | --- |
| `order_number` | 1 | `string` |
| `reason` | 2 | `string` |
| `idempotency_key` | 3 | [`common.v1.IdempotencyKey`](/apis/grpc/common-v1/#idempotencykey) |

### RefundGoodsRequest

[`payment/v1/payment.proto:48`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/payment.proto#L48)

| Field | Number | Type |
| --- | --- | --- |
| `order_number` | 1 | `string` |
| `amount` | 2 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `reason` | 3 | `string` |
| `idempotency_key` | 4 | [`common.v1.IdempotencyKey`](/apis/grpc/common-v1/#idempotencykey) |

### GetEscrowStatusRequest

[`payment/v1/payment.proto:55`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/payment.proto#L55)

| Field | Number | Type |
| --- | --- | --- |
| `order_number` | 1 | `string` |

### SettleShippingFeeRequest

[`payment/v1/payment.proto:59`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/payment.proto#L59)

| Field | Number | Type |
| --- | --- | --- |
| `order_number` | 1 | `string` |
| `driver_principal_id` | 2 | `string` |
| `idempotency_key` | 3 | [`common.v1.IdempotencyKey`](/apis/grpc/common-v1/#idempotencykey) |

### EscrowHoldResponse

[`payment/v1/payment.proto:65`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/payment.proto#L65)

| Field | Number | Type |
| --- | --- | --- |
| `found` | 1 | `bool` |
| `escrow_id` | 2 | `string` |
| `order_number` | 3 | `string` |
| `customer_principal_id` | 4 | `string` |
| `merchant_principal_id` | 5 | `string` |
| `driver_principal_id` | 6 | `string` |
| `total_order_amount` | 7 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `merchant_amount` | 8 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `shipping_fee_amount` | 9 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `status` | 10 | [`EscrowStatus`](#escrowstatus) |
| `auto_release_at` | 11 | `google.protobuf.Timestamp` |
| `created_at` | 12 | `google.protobuf.Timestamp` |
| `released_at` | 13 | `google.protobuf.Timestamp` |
| `already_applied` | 14 | `bool` |
| `error` | 15 | [`common.v1.ErrorDetail`](/apis/grpc/common-v1/#errordetail) |
| `shipping_fee_settled_at` | 16 | `google.protobuf.Timestamp` |
| `goods_refunded_amount` | 17 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |

## Enums

### LiabilityKind

[`payment/v1/liability.proto:12`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/liability.proto#L12)

| Name | Number |
| --- | --- |
| `LIABILITY_KIND_UNSPECIFIED` | 0 |
| `LIABILITY_KIND_CUSTOMER_BALANCE` | 1 |
| `LIABILITY_KIND_MERCHANT_AVAILABLE` | 2 |
| `LIABILITY_KIND_MERCHANT_PENDING_ESCROW` | 3 |
| `LIABILITY_KIND_DRIVER_AVAILABLE` | 4 |
| `LIABILITY_KIND_DRIVER_PENDING_ESCROW` | 5 |
| `LIABILITY_KIND_SUSPENSE_AVAILABLE` | 6 |
| `LIABILITY_KIND_SUSPENSE_PENDING_ESCROW` | 7 |

### EscrowStatus

[`payment/v1/payment.proto:17`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/payment/v1/payment.proto#L17)

| Name | Number |
| --- | --- |
| `ESCROW_STATUS_UNSPECIFIED` | 0 |
| `ESCROW_STATUS_HELD` | 1 |
| `ESCROW_STATUS_RELEASED` | 2 |
| `ESCROW_STATUS_REFUNDED` | 3 |
| `ESCROW_STATUS_EXPIRED` | 4 |
| `ESCROW_STATUS_FAILED` | 5 |

</div>
