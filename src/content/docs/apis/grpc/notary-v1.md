---
title: "notary.v1"
description: "The notary.v1 gRPC package in kinetix-contracts 1.7.0: its services, messages and enums."
editUrl: false
---

<div class="grpc-reference">

Generated from release [1.7.0](https://www.npmjs.com/package/kinetix-contracts/v/1.7.0) of kinetix-contracts: [`notary/v1/watch.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notary/v1/watch.proto). Servers and callers are those on the [system map](/architecture/system-map/); a dash means the map records none.

## Services

### EpochWatchService

[`notary/v1/watch.proto:9`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notary/v1/watch.proto#L9)

| RPC | Request → response | Served by | Called by |
| --- | --- | --- | --- |
| [`ApproveEpoch`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notary/v1/watch.proto#L10) | `stream` [`ApproveEpochRequest`](#approveepochrequest) → [`ApproveEpochResponse`](#approveepochresponse) | — | — |

## Messages

### ApproveEpochRequest

[`notary/v1/watch.proto:13`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notary/v1/watch.proto#L13)

| Field | Number | Type | Notes |
| --- | --- | --- | --- |
| `proposal` | 1 | [`EpochProposal`](#epochproposal) | `oneof part` |
| `accounts` | 2 | [`ProposedAccountBatch`](#proposedaccountbatch) | `oneof part` |

### EpochProposal

[`notary/v1/watch.proto:20`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notary/v1/watch.proto#L20)

| Field | Number | Type |
| --- | --- | --- |
| `snapshot_id` | 1 | `string` |
| `number` | 2 | `uint64` |
| `previous_digest` | 3 | `bytes` |
| `root` | 4 | `bytes` |
| `total` | 5 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `leaf_count` | 6 | `uint64` |
| `as_of` | 7 | `google.protobuf.Timestamp` |
| `confidential` | 8 | [`ConfidentialProposal`](#confidentialproposal) |

### ConfidentialProposal

[`notary/v1/watch.proto:31`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notary/v1/watch.proto#L31)

| Field | Number | Type |
| --- | --- | --- |
| `scheme` | 1 | `uint32` |
| `depth` | 2 | `uint32` |
| `tree_root` | 3 | `bytes` |
| `total_commitment` | 4 | `bytes` |
| `blinding` | 5 | `bytes` |

### ProposedAccountBatch

[`notary/v1/watch.proto:39`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notary/v1/watch.proto#L39)

| Field | Number | Type |
| --- | --- | --- |
| `accounts` | 1 | `repeated` [`ProposedAccount`](#proposedaccount) |

### ProposedAccount

[`notary/v1/watch.proto:43`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notary/v1/watch.proto#L43)

| Field | Number | Type |
| --- | --- | --- |
| `kind` | 1 | [`payment.v1.LiabilityKind`](/apis/grpc/payment-v1/#liabilitykind) |
| `holder` | 2 | `string` |
| `balance` | 3 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `secret` | 4 | `bytes` |
| `salt` | 5 | `bytes` |

### ApproveEpochResponse

[`notary/v1/watch.proto:51`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notary/v1/watch.proto#L51)

| Field | Number | Type |
| --- | --- | --- |
| `member` | 1 | `bytes` |
| `signature` | 2 | `bytes` |

</div>
