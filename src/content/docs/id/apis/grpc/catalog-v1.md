---
title: "catalog.v1"
description: "Paket gRPC catalog.v1 di kinetix-contracts 1.7.0: service, message, dan enum-nya."
editUrl: false
sourceHash: "00b9d775e344"
---

<div class="grpc-reference">

Dibuat otomatis dari rilis [1.7.0](https://www.npmjs.com/package/kinetix-contracts/v/1.7.0) kinetix-contracts: [`catalog/v1/catalog.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/catalog/v1/catalog.proto). Server dan pemanggil diambil dari [peta sistem](/id/architecture/system-map/); tanda pisah berarti peta tidak mencatat apa pun.

## Service

### CatalogService

[`catalog/v1/catalog.proto:8`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/catalog/v1/catalog.proto#L8)

| RPC | Request → response | Dilayani oleh | Dipanggil oleh |
| --- | --- | --- | --- |
| [`ChangedSince`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/catalog/v1/catalog.proto#L9) | [`ChangedSinceRequest`](#changedsincerequest) → [`ChangedSinceResponse`](#changedsinceresponse) | [catalog](/id/services/catalog/) | [search](https://github.com/WildanFrananda/kinetix-search-service/blob/9d0994b7a46011b4889bba4a7dc3b3e7a56028e2/internal/catalogclient/client.go#L62) |
| [`GetProduct`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/catalog/v1/catalog.proto#L10) | [`GetProductRequest`](#getproductrequest) → [`GetProductResponse`](#getproductresponse) | [catalog](/id/services/catalog/) | [pricing](https://github.com/WildanFrananda/kinetix-pricing-service/blob/0b990129286ce38750cf418d54c3bd52edf31d9e/src/clients/catalog_product_directory.rs#L36), [order](https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/CatalogProductDirectory.cs#L22) |
| [`CountProducts`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/catalog/v1/catalog.proto#L11) | [`CountProductsRequest`](#countproductsrequest) → [`CountProductsResponse`](#countproductsresponse) | [catalog](/id/services/catalog/) | [search](https://github.com/WildanFrananda/kinetix-search-service/blob/9d0994b7a46011b4889bba4a7dc3b3e7a56028e2/internal/catalogclient/client.go#L91) |

## Message

### Cursor

[`catalog/v1/catalog.proto:14`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/catalog/v1/catalog.proto#L14)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `updated_through` | 1 | `google.protobuf.Timestamp` |
| `last_sku` | 2 | `string` |
| `transaction_id` | 3 | `optional uint64` |

### Product

[`catalog/v1/catalog.proto:20`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/catalog/v1/catalog.proto#L20)

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
| `weight_grams` | 10 | `optional int64` |

### ChangedSinceRequest

[`catalog/v1/catalog.proto:33`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/catalog/v1/catalog.proto#L33)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `cursor` | 1 | [`Cursor`](#cursor) |
| `limit` | 2 | `int32` |

### ChangedSinceResponse

[`catalog/v1/catalog.proto:38`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/catalog/v1/catalog.proto#L38)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `upserted` | 1 | `repeated` [`Product`](#product) |
| `removed_skus` | 2 | `repeated string` |
| `next` | 3 | [`Cursor`](#cursor) |
| `has_more` | 4 | `bool` |

### GetProductRequest

[`catalog/v1/catalog.proto:45`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/catalog/v1/catalog.proto#L45)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `sku` | 1 | `string` |

### GetProductResponse

[`catalog/v1/catalog.proto:49`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/catalog/v1/catalog.proto#L49)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `found` | 1 | `bool` |
| `product` | 2 | [`Product`](#product) |

### CountProductsRequest

[`catalog/v1/catalog.proto:54`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/catalog/v1/catalog.proto#L54)

Tidak ada field.

### CountProductsResponse

[`catalog/v1/catalog.proto:56`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/catalog/v1/catalog.proto#L56)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `total` | 1 | `int64` |

</div>
