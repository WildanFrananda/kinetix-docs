---
title: "search.v1"
description: "The search.v1 gRPC package in kinetix-contracts 1.7.0: its services, messages and enums."
editUrl: false
---

<div class="grpc-reference">

Generated from release [1.7.0](https://www.npmjs.com/package/kinetix-contracts/v/1.7.0) of kinetix-contracts: [`search/v1/search.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/search/v1/search.proto). Servers and callers are those on the [system map](/architecture/system-map/); a dash means the map records none.

## Services

### SearchService

[`search/v1/search.proto:8`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/search/v1/search.proto#L8)

| RPC | Request → response | Served by | Called by |
| --- | --- | --- | --- |
| [`SearchProducts`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/search/v1/search.proto#L9) | [`SearchProductsRequest`](#searchproductsrequest) → [`SearchProductsResponse`](#searchproductsresponse) | [search](/services/search/) | — |
| [`SuggestProducts`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/search/v1/search.proto#L10) | [`SuggestProductsRequest`](#suggestproductsrequest) → [`SuggestProductsResponse`](#suggestproductsresponse) | [search](/services/search/) | — |

## Messages

### Page

[`search/v1/search.proto:20`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/search/v1/search.proto#L20)

| Field | Number | Type |
| --- | --- | --- |
| `offset` | 1 | `int32` |
| `limit` | 2 | `int32` |

### IndexFreshness

[`search/v1/search.proto:25`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/search/v1/search.proto#L25)

| Field | Number | Type |
| --- | --- | --- |
| `indexed_through` | 1 | `google.protobuf.Timestamp` |
| `age_seconds` | 2 | `int64` |
| `stale` | 3 | `bool` |

### ProductHit

[`search/v1/search.proto:31`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/search/v1/search.proto#L31)

| Field | Number | Type |
| --- | --- | --- |
| `sku` | 1 | `string` |
| `merchant_principal_id` | 2 | `string` |
| `title` | 3 | `string` |
| `description` | 4 | `string` |
| `price` | 5 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `categories` | 6 | `repeated string` |
| `updated_at` | 7 | `google.protobuf.Timestamp` |
| `score` | 8 | `double` |

### FacetValue

[`search/v1/search.proto:42`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/search/v1/search.proto#L42)

| Field | Number | Type |
| --- | --- | --- |
| `value` | 1 | `string` |
| `count` | 2 | `int64` |

### Facet

[`search/v1/search.proto:47`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/search/v1/search.proto#L47)

| Field | Number | Type |
| --- | --- | --- |
| `field` | 1 | `string` |
| `values` | 2 | `repeated` [`FacetValue`](#facetvalue) |

### SearchProductsRequest

[`search/v1/search.proto:52`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/search/v1/search.proto#L52)

| Field | Number | Type |
| --- | --- | --- |
| `text` | 1 | `string` |
| `categories` | 2 | `repeated string` |
| `merchant_principal_id` | 3 | `string` |
| `page` | 4 | [`Page`](#page) |
| `ranking` | 5 | [`RankingProfile`](#rankingprofile) |

### SearchProductsResponse

[`search/v1/search.proto:60`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/search/v1/search.proto#L60)

| Field | Number | Type |
| --- | --- | --- |
| `hits` | 1 | `repeated` [`ProductHit`](#producthit) |
| `total` | 2 | `int64` |
| `facets` | 3 | `repeated` [`Facet`](#facet) |
| `freshness` | 4 | [`IndexFreshness`](#indexfreshness) |

### SuggestProductsRequest

[`search/v1/search.proto:67`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/search/v1/search.proto#L67)

| Field | Number | Type |
| --- | --- | --- |
| `prefix` | 1 | `string` |
| `limit` | 2 | `int32` |

### SuggestProductsResponse

[`search/v1/search.proto:72`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/search/v1/search.proto#L72)

| Field | Number | Type |
| --- | --- | --- |
| `suggestions` | 1 | `repeated string` |

## Enums

### RankingProfile

[`search/v1/search.proto:13`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/search/v1/search.proto#L13)

| Name | Number |
| --- | --- |
| `RANKING_PROFILE_UNSPECIFIED` | 0 |
| `RANKING_PROFILE_RELEVANCE` | 1 |
| `RANKING_PROFILE_NEWEST` | 2 |
| `RANKING_PROFILE_PRICE_ASC` | 3 |

</div>
