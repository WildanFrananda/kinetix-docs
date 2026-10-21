---
title: "notary.v1"
description: "Paket gRPC notary.v1 di kinetix-contracts 1.7.0: service, message, dan enum-nya."
editUrl: false
sourceHash: "f125379191e2"
---

<div class="grpc-reference">

Dibuat otomatis dari rilis [1.7.0](https://www.npmjs.com/package/kinetix-contracts/v/1.7.0) kinetix-contracts: [`notary/v1/watch.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notary/v1/watch.proto). Server dan pemanggil diambil dari [peta sistem](/id/architecture/system-map/); tanda pisah berarti peta tidak mencatat apa pun.

## Service

### EpochWatchService

[`notary/v1/watch.proto:9`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notary/v1/watch.proto#L9)

| RPC | Request → response | Dilayani oleh | Dipanggil oleh |
| --- | --- | --- | --- |
| [`ApproveEpoch`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notary/v1/watch.proto#L10) | `stream` [`ApproveEpochRequest`](#approveepochrequest) → [`ApproveEpochResponse`](#approveepochresponse) | — | — |

## Message

### ApproveEpochRequest

[`notary/v1/watch.proto:13`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notary/v1/watch.proto#L13)

| Field | Nomor | Tipe | Catatan |
| --- | --- | --- | --- |
| `proposal` | 1 | [`EpochProposal`](#epochproposal) | `oneof part` |
| `accounts` | 2 | [`ProposedAccountBatch`](#proposedaccountbatch) | `oneof part` |

### EpochProposal

[`notary/v1/watch.proto:20`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notary/v1/watch.proto#L20)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `snapshot_id` | 1 | `string` |
| `number` | 2 | `uint64` |
| `previous_digest` | 3 | `bytes` |
| `root` | 4 | `bytes` |
| `total` | 5 | [`common.v1.Money`](/id/apis/grpc/common-v1/#money) |
| `leaf_count` | 6 | `uint64` |
| `as_of` | 7 | `google.protobuf.Timestamp` |
| `confidential` | 8 | [`ConfidentialProposal`](#confidentialproposal) |

### ConfidentialProposal

[`notary/v1/watch.proto:31`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notary/v1/watch.proto#L31)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `scheme` | 1 | `uint32` |
| `depth` | 2 | `uint32` |
| `tree_root` | 3 | `bytes` |
| `total_commitment` | 4 | `bytes` |
| `blinding` | 5 | `bytes` |

### ProposedAccountBatch

[`notary/v1/watch.proto:39`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notary/v1/watch.proto#L39)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `accounts` | 1 | `repeated` [`ProposedAccount`](#proposedaccount) |

### ProposedAccount

[`notary/v1/watch.proto:43`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notary/v1/watch.proto#L43)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `kind` | 1 | [`payment.v1.LiabilityKind`](/id/apis/grpc/payment-v1/#liabilitykind) |
| `holder` | 2 | `string` |
| `balance` | 3 | [`common.v1.Money`](/id/apis/grpc/common-v1/#money) |
| `secret` | 4 | `bytes` |
| `salt` | 5 | `bytes` |

### ApproveEpochResponse

[`notary/v1/watch.proto:51`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notary/v1/watch.proto#L51)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `member` | 1 | `bytes` |
| `signature` | 2 | `bytes` |

</div>
