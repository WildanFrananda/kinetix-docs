---
title: "catalog.v1"
description: "Paket gRPC catalog.v1 di kinetix-contracts 1.3.0: service, message, dan enum-nya."
editUrl: false
sourceHash: "94dab041f023"
---

<div class="grpc-reference">

Dibuat otomatis dari rilis [1.3.0](https://www.npmjs.com/package/kinetix-contracts/v/1.3.0) kinetix-contracts: [`catalog/v1/catalog.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto). Server dan pemanggil diambil dari [peta sistem](/id/architecture/system-map/); tanda pisah berarti peta tidak mencatat apa pun.

## Service

### CatalogService

[`catalog/v1/catalog.proto:8`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L8)

| RPC | Request → response | Dilayani oleh | Dipanggil oleh |
| --- | --- | --- | --- |
| [`ChangedSince`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L9) | [`ChangedSinceRequest`](#changedsincerequest) → [`ChangedSinceResponse`](#changedsinceresponse) | [catalog](/id/services/catalog/) | [search](https://github.com/WildanFrananda/kinetix-search-service/blob/1316183858b32d1123bc5aa5c7502b74d3e5ceee/internal/catalogclient/client.go#L62) |
| [`GetProduct`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L10) | [`GetProductRequest`](#getproductrequest) → [`GetProductResponse`](#getproductresponse) | [catalog](/id/services/catalog/) | [pricing](https://github.com/WildanFrananda/kinetix-pricing-service/blob/76e134d02c6bffba658eede7db7553d5b108bc80/src/clients/catalog_product_directory.rs#L36), [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/CatalogProductDirectory.cs#L22) |
| [`CountProducts`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L11) | [`CountProductsRequest`](#countproductsrequest) → [`CountProductsResponse`](#countproductsresponse) | [catalog](/id/services/catalog/) | [search](https://github.com/WildanFrananda/kinetix-search-service/blob/1316183858b32d1123bc5aa5c7502b74d3e5ceee/internal/catalogclient/client.go#L82) |

## Message

### Cursor

[`catalog/v1/catalog.proto:14`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L14)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `updated_through` | 1 | `google.protobuf.Timestamp` |
| `last_sku` | 2 | `string` |

### Product

[`catalog/v1/catalog.proto:19`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L19)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `sku` | 1 | `string` |
| `merchant_principal_id` | 2 | `string` |
| `title` | 3 | `string` |
| `description` | 4 | `string` |
| `price` | 5 | [`common.v1.Money`](/id/apis/grpc/common-v1/#money) |
| `image_url` | 6 | `string` |
| `category_slug` | 7 | `string` |
| `category_name` | 8 | `string` |
| `updated_at` | 9 | `google.protobuf.Timestamp` |

### ChangedSinceRequest

[`catalog/v1/catalog.proto:31`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L31)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `cursor` | 1 | [`Cursor`](#cursor) |
| `limit` | 2 | `int32` |

### ChangedSinceResponse

[`catalog/v1/catalog.proto:36`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L36)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `upserted` | 1 | `repeated` [`Product`](#product) |
| `removed_skus` | 2 | `repeated string` |
| `next` | 3 | [`Cursor`](#cursor) |
| `has_more` | 4 | `bool` |

### GetProductRequest

[`catalog/v1/catalog.proto:43`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L43)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `sku` | 1 | `string` |

### GetProductResponse

[`catalog/v1/catalog.proto:47`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L47)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `found` | 1 | `bool` |
| `product` | 2 | [`Product`](#product) |

### CountProductsRequest

[`catalog/v1/catalog.proto:52`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L52)

Tidak ada field.

### CountProductsResponse

[`catalog/v1/catalog.proto:54`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/catalog/v1/catalog.proto#L54)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `total` | 1 | `int64` |

</div>
