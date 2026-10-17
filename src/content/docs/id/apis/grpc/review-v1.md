---
title: "review.v1"
description: "Paket gRPC review.v1 di kinetix-contracts 1.3.0: service, message, dan enum-nya."
editUrl: false
sourceHash: "af4ae31daa18"
---

<div class="grpc-reference">

Dibuat otomatis dari rilis [1.3.0](https://www.npmjs.com/package/kinetix-contracts/v/1.3.0) kinetix-contracts: [`review/v1/review.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/review/v1/review.proto). Server dan pemanggil diambil dari [peta sistem](/id/architecture/system-map/); tanda pisah berarti peta tidak mencatat apa pun.

## Service

### ReviewEvidenceService

[`review/v1/review.proto:8`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/review/v1/review.proto#L8)

| RPC | Request → response | Dilayani oleh | Dipanggil oleh |
| --- | --- | --- | --- |
| [`ReviewsSince`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/review/v1/review.proto#L9) | [`ReviewsSinceRequest`](#reviewssincerequest) → [`ReviewsSinceResponse`](#reviewssinceresponse) | — | — |

## Message

### ReviewEvidence

[`review/v1/review.proto:18`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/review/v1/review.proto#L18)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `position` | 1 | [`common.v1.LogCursor`](/id/apis/grpc/common-v1/#logcursor) |
| `review_id` | 2 | `string` |
| `kind` | 3 | [`ReviewKind`](#reviewkind) |
| `order_id` | 4 | `string` |
| `subject_id` | 5 | `string` |
| `author_principal_id` | 6 | `string` |
| `merchant_principal_id` | 7 | `string` |
| `rating` | 8 | `int32` |
| `comment_sha256` | 9 | `bytes` |
| `created_at` | 10 | `google.protobuf.Timestamp` |

### ReviewsSinceRequest

[`review/v1/review.proto:31`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/review/v1/review.proto#L31)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `after` | 1 | [`common.v1.LogCursor`](/id/apis/grpc/common-v1/#logcursor) |
| `limit` | 2 | `int32` |

### ReviewsSinceResponse

[`review/v1/review.proto:36`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/review/v1/review.proto#L36)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `reviews` | 1 | `repeated` [`ReviewEvidence`](#reviewevidence) |
| `next` | 2 | [`common.v1.LogCursor`](/id/apis/grpc/common-v1/#logcursor) |
| `has_more` | 3 | `bool` |

## Enum

### ReviewKind

[`review/v1/review.proto:12`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/review/v1/review.proto#L12)

| Nama | Nomor |
| --- | --- |
| `REVIEW_KIND_UNSPECIFIED` | 0 |
| `REVIEW_KIND_PRODUCT` | 1 |
| `REVIEW_KIND_DRIVER` | 2 |

</div>
