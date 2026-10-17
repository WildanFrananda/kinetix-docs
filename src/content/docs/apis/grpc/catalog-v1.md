---
title: "catalog.v1"
description: "The catalog.v1 gRPC package in kinetix-contracts 1.3.0: its services, messages and enums."
editUrl: false
---

<div class="grpc-reference">

Generated from release [1.3.0](https://www.npmjs.com/package/kinetix-contracts/v/1.3.0) of kinetix-contracts: [`catalog/v1/catalog.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto). Servers and callers are those on the [system map](/architecture/system-map/); a dash means the map records none.

## Services

### CatalogService

[`catalog/v1/catalog.proto:8`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L8)

| RPC | Request → response | Served by | Called by |
| --- | --- | --- | --- |
| [`ChangedSince`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L9) | [`ChangedSinceRequest`](#changedsincerequest) → [`ChangedSinceResponse`](#changedsinceresponse) | [catalog](/services/catalog/) | [search](https://github.com/WildanFrananda/kinetix-search-service/blob/1316183858b32d1123bc5aa5c7502b74d3e5ceee/internal/catalogclient/client.go#L62) |
| [`GetProduct`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L10) | [`GetProductRequest`](#getproductrequest) → [`GetProductResponse`](#getproductresponse) | [catalog](/services/catalog/) | [pricing](https://github.com/WildanFrananda/kinetix-pricing-service/blob/76e134d02c6bffba658eede7db7553d5b108bc80/src/clients/catalog_product_directory.rs#L36), [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/CatalogProductDirectory.cs#L22) |
| [`CountProducts`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L11) | [`CountProductsRequest`](#countproductsrequest) → [`CountProductsResponse`](#countproductsresponse) | [catalog](/services/catalog/) | [search](https://github.com/WildanFrananda/kinetix-search-service/blob/1316183858b32d1123bc5aa5c7502b74d3e5ceee/internal/catalogclient/client.go#L82) |

## Messages

### Cursor

[`catalog/v1/catalog.proto:14`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L14)

| Field | Number | Type |
| --- | --- | --- |
| `updated_through` | 1 | `google.protobuf.Timestamp` |
| `last_sku` | 2 | `string` |

### Product

[`catalog/v1/catalog.proto:19`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L19)

| Field | Number | Type |
| --- | --- | --- |
| `sku` | 1 | `string` |
| `merchant_principal_id` | 2 | `string` |
| `title` | 3 | `string` |
| `description` | 4 | `string` |
| `price` | 5 | [`common.v1.Money`](/apis/grpc/common-v1/#money) |
| `image_url` | 6 | `string` |
| `category_slug` | 7 | `string` |
| `category_name` | 8 | `string` |
| `updated_at` | 9 | `google.protobuf.Timestamp` |

### ChangedSinceRequest

[`catalog/v1/catalog.proto:31`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L31)

| Field | Number | Type |
| --- | --- | --- |
| `cursor` | 1 | [`Cursor`](#cursor) |
| `limit` | 2 | `int32` |

### ChangedSinceResponse

[`catalog/v1/catalog.proto:36`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L36)

| Field | Number | Type |
| --- | --- | --- |
| `upserted` | 1 | `repeated` [`Product`](#product) |
| `removed_skus` | 2 | `repeated string` |
| `next` | 3 | [`Cursor`](#cursor) |
| `has_more` | 4 | `bool` |

### GetProductRequest

[`catalog/v1/catalog.proto:43`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L43)

| Field | Number | Type |
| --- | --- | --- |
| `sku` | 1 | `string` |

### GetProductResponse

[`catalog/v1/catalog.proto:47`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L47)

| Field | Number | Type |
| --- | --- | --- |
| `found` | 1 | `bool` |
| `product` | 2 | [`Product`](#product) |

### CountProductsRequest

[`catalog/v1/catalog.proto:52`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L52)

No fields.

### CountProductsResponse

[`catalog/v1/catalog.proto:54`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L54)

| Field | Number | Type |
| --- | --- | --- |
| `total` | 1 | `int64` |

</div>
