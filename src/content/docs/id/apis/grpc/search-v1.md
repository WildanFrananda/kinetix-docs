---
title: "search.v1"
description: "Paket gRPC search.v1 di kinetix-contracts 1.5.0: service, message, dan enum-nya."
editUrl: false
sourceHash: "07363df204f4"
---

<div class="grpc-reference">

Dibuat otomatis dari rilis [1.5.0](https://www.npmjs.com/package/kinetix-contracts/v/1.5.0) kinetix-contracts: [`search/v1/search.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/search/v1/search.proto). Server dan pemanggil diambil dari [peta sistem](/id/architecture/system-map/); tanda pisah berarti peta tidak mencatat apa pun.

## Service

### SearchService

[`search/v1/search.proto:8`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/search/v1/search.proto#L8)

| RPC | Request → response | Dilayani oleh | Dipanggil oleh |
| --- | --- | --- | --- |
| [`SearchProducts`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/search/v1/search.proto#L9) | [`SearchProductsRequest`](#searchproductsrequest) → [`SearchProductsResponse`](#searchproductsresponse) | [search](/id/services/search/) | — |
| [`SuggestProducts`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/search/v1/search.proto#L10) | [`SuggestProductsRequest`](#suggestproductsrequest) → [`SuggestProductsResponse`](#suggestproductsresponse) | [search](/id/services/search/) | — |

## Message

### Page

[`search/v1/search.proto:20`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/search/v1/search.proto#L20)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `offset` | 1 | `int32` |
| `limit` | 2 | `int32` |

### IndexFreshness

[`search/v1/search.proto:25`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/search/v1/search.proto#L25)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `indexed_through` | 1 | `google.protobuf.Timestamp` |
| `age_seconds` | 2 | `int64` |
| `stale` | 3 | `bool` |

### ProductHit

[`search/v1/search.proto:31`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/search/v1/search.proto#L31)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `sku` | 1 | `string` |
| `merchant_principal_id` | 2 | `string` |
| `title` | 3 | `string` |
| `description` | 4 | `string` |
| `price` | 5 | [`common.v1.Money`](/id/apis/grpc/common-v1/#money) |
| `categories` | 6 | `repeated string` |
| `updated_at` | 7 | `google.protobuf.Timestamp` |
| `score` | 8 | `double` |

### FacetValue

[`search/v1/search.proto:42`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/search/v1/search.proto#L42)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `value` | 1 | `string` |
| `count` | 2 | `int64` |

### Facet

[`search/v1/search.proto:47`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/search/v1/search.proto#L47)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `field` | 1 | `string` |
| `values` | 2 | `repeated` [`FacetValue`](#facetvalue) |

### SearchProductsRequest

[`search/v1/search.proto:52`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/search/v1/search.proto#L52)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `text` | 1 | `string` |
| `categories` | 2 | `repeated string` |
| `merchant_principal_id` | 3 | `string` |
| `page` | 4 | [`Page`](#page) |
| `ranking` | 5 | [`RankingProfile`](#rankingprofile) |

### SearchProductsResponse

[`search/v1/search.proto:60`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/search/v1/search.proto#L60)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `hits` | 1 | `repeated` [`ProductHit`](#producthit) |
| `total` | 2 | `int64` |
| `facets` | 3 | `repeated` [`Facet`](#facet) |
| `freshness` | 4 | [`IndexFreshness`](#indexfreshness) |

### SuggestProductsRequest

[`search/v1/search.proto:67`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/search/v1/search.proto#L67)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `prefix` | 1 | `string` |
| `limit` | 2 | `int32` |

### SuggestProductsResponse

[`search/v1/search.proto:72`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/search/v1/search.proto#L72)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `suggestions` | 1 | `repeated string` |

## Enum

### RankingProfile

[`search/v1/search.proto:13`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/search/v1/search.proto#L13)

| Nama | Nomor |
| --- | --- |
| `RANKING_PROFILE_UNSPECIFIED` | 0 |
| `RANKING_PROFILE_RELEVANCE` | 1 |
| `RANKING_PROFILE_NEWEST` | 2 |
| `RANKING_PROFILE_PRICE_ASC` | 3 |

</div>
