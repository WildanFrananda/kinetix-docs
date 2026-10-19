---
title: "returns.v1"
description: "Paket gRPC returns.v1 di kinetix-contracts 1.5.0: service, message, dan enum-nya."
editUrl: false
sourceHash: "14b22932f8e8"
---

<div class="grpc-reference">

Dibuat otomatis dari rilis [1.5.0](https://www.npmjs.com/package/kinetix-contracts/v/1.5.0) kinetix-contracts: [`returns/v1/returns.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/returns/v1/returns.proto). Server dan pemanggil diambil dari [peta sistem](/id/architecture/system-map/); tanda pisah berarti peta tidak mencatat apa pun.

## Service

### ReturnService

[`returns/v1/returns.proto:8`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/returns/v1/returns.proto#L8)

| RPC | Request → response | Dilayani oleh | Dipanggil oleh |
| --- | --- | --- | --- |
| [`SubmitReturnClaim`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/returns/v1/returns.proto#L9) | [`SubmitReturnClaimRequest`](#submitreturnclaimrequest) → [`SubmitReturnClaimResponse`](#submitreturnclaimresponse) | — | — |
| [`GetReturnStatus`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/returns/v1/returns.proto#L10) | [`GetReturnStatusRequest`](#getreturnstatusrequest) → [`GetReturnStatusResponse`](#getreturnstatusresponse) | — | — |

## Message

### SubmitReturnClaimRequest

[`returns/v1/returns.proto:13`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/returns/v1/returns.proto#L13)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `merchant_principal_id` | 1 | `string` |
| `order_id` | 2 | `string` |
| `order_number` | 3 | `string` |
| `reason` | 4 | `string` |
| `photo_urls` | 5 | `repeated string` |
| `idempotency_key` | 6 | [`common.v1.IdempotencyKey`](/id/apis/grpc/common-v1/#idempotencykey) |

### SubmitReturnClaimResponse

[`returns/v1/returns.proto:22`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/returns/v1/returns.proto#L22)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `return_id` | 2 | `string` |
| `status` | 3 | [`common.v1.ReturnStatus`](/id/apis/grpc/common-v1/#returnstatus) |
| `created_at` | 4 | `google.protobuf.Timestamp` |
| `error` | 5 | [`common.v1.ErrorDetail`](/id/apis/grpc/common-v1/#errordetail) |

### GetReturnStatusRequest

[`returns/v1/returns.proto:30`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/returns/v1/returns.proto#L30)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `merchant_principal_id` | 1 | `string` |
| `return_id` | 2 | `string` |

### GetReturnStatusResponse

[`returns/v1/returns.proto:35`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/returns/v1/returns.proto#L35)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `found` | 1 | `bool` |
| `return_id` | 2 | `string` |
| `order_id` | 3 | `string` |
| `status` | 4 | [`common.v1.ReturnStatus`](/id/apis/grpc/common-v1/#returnstatus) |
| `reason` | 5 | `string` |
| `resolved_at` | 6 | `google.protobuf.Timestamp` |

</div>
