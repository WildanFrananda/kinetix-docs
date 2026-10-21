---
title: "returns.v1"
description: "The returns.v1 gRPC package in kinetix-contracts 1.7.0: its services, messages and enums."
editUrl: false
---

<div class="grpc-reference">

Generated from release [1.7.0](https://www.npmjs.com/package/kinetix-contracts/v/1.7.0) of kinetix-contracts: [`returns/v1/returns.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/returns/v1/returns.proto). Servers and callers are those on the [system map](/architecture/system-map/); a dash means the map records none.

## Services

### ReturnService

[`returns/v1/returns.proto:8`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/returns/v1/returns.proto#L8)

| RPC | Request → response | Served by | Called by |
| --- | --- | --- | --- |
| [`SubmitReturnClaim`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/returns/v1/returns.proto#L9) | [`SubmitReturnClaimRequest`](#submitreturnclaimrequest) → [`SubmitReturnClaimResponse`](#submitreturnclaimresponse) | — | — |
| [`GetReturnStatus`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/returns/v1/returns.proto#L10) | [`GetReturnStatusRequest`](#getreturnstatusrequest) → [`GetReturnStatusResponse`](#getreturnstatusresponse) | — | — |

## Messages

### SubmitReturnClaimRequest

[`returns/v1/returns.proto:13`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/returns/v1/returns.proto#L13)

| Field | Number | Type |
| --- | --- | --- |
| `merchant_principal_id` | 1 | `string` |
| `order_id` | 2 | `string` |
| `order_number` | 3 | `string` |
| `reason` | 4 | `string` |
| `photo_urls` | 5 | `repeated string` |
| `idempotency_key` | 6 | [`common.v1.IdempotencyKey`](/apis/grpc/common-v1/#idempotencykey) |

### SubmitReturnClaimResponse

[`returns/v1/returns.proto:22`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/returns/v1/returns.proto#L22)

| Field | Number | Type |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `return_id` | 2 | `string` |
| `status` | 3 | [`common.v1.ReturnStatus`](/apis/grpc/common-v1/#returnstatus) |
| `created_at` | 4 | `google.protobuf.Timestamp` |
| `error` | 5 | [`common.v1.ErrorDetail`](/apis/grpc/common-v1/#errordetail) |

### GetReturnStatusRequest

[`returns/v1/returns.proto:30`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/returns/v1/returns.proto#L30)

| Field | Number | Type |
| --- | --- | --- |
| `merchant_principal_id` | 1 | `string` |
| `return_id` | 2 | `string` |

### GetReturnStatusResponse

[`returns/v1/returns.proto:35`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/returns/v1/returns.proto#L35)

| Field | Number | Type |
| --- | --- | --- |
| `found` | 1 | `bool` |
| `return_id` | 2 | `string` |
| `order_id` | 3 | `string` |
| `status` | 4 | [`common.v1.ReturnStatus`](/apis/grpc/common-v1/#returnstatus) |
| `reason` | 5 | `string` |
| `resolved_at` | 6 | `google.protobuf.Timestamp` |

</div>
