---
title: "review.v1"
description: "The review.v1 gRPC package in kinetix-contracts 1.3.0: its services, messages and enums."
editUrl: false
---

<div class="grpc-reference">

Generated from release [1.3.0](https://www.npmjs.com/package/kinetix-contracts/v/1.3.0) of kinetix-contracts: [`review/v1/review.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/review/v1/review.proto). Servers and callers are those on the [system map](/architecture/system-map/); a dash means the map records none.

## Services

### ReviewEvidenceService

[`review/v1/review.proto:8`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/review/v1/review.proto#L8)

| RPC | Request → response | Served by | Called by |
| --- | --- | --- | --- |
| [`ReviewsSince`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/review/v1/review.proto#L9) | [`ReviewsSinceRequest`](#reviewssincerequest) → [`ReviewsSinceResponse`](#reviewssinceresponse) | [review](/services/review/) | [notary](https://github.com/WildanFrananda/kinetix-notary-service/blob/b5d5e1138dcde472ee90c48c8ed3fc315e9c8a2c/internal/feeds/review_feed.go#L50) |

## Messages

### ReviewEvidence

[`review/v1/review.proto:18`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/review/v1/review.proto#L18)

| Field | Number | Type |
| --- | --- | --- |
| `position` | 1 | [`common.v1.LogCursor`](/apis/grpc/common-v1/#logcursor) |
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

| Field | Number | Type |
| --- | --- | --- |
| `after` | 1 | [`common.v1.LogCursor`](/apis/grpc/common-v1/#logcursor) |
| `limit` | 2 | `int32` |

### ReviewsSinceResponse

[`review/v1/review.proto:36`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/review/v1/review.proto#L36)

| Field | Number | Type |
| --- | --- | --- |
| `reviews` | 1 | `repeated` [`ReviewEvidence`](#reviewevidence) |
| `next` | 2 | [`common.v1.LogCursor`](/apis/grpc/common-v1/#logcursor) |
| `has_more` | 3 | `bool` |

## Enums

### ReviewKind

[`review/v1/review.proto:12`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/review/v1/review.proto#L12)

| Name | Number |
| --- | --- |
| `REVIEW_KIND_UNSPECIFIED` | 0 |
| `REVIEW_KIND_PRODUCT` | 1 |
| `REVIEW_KIND_DRIVER` | 2 |

</div>
