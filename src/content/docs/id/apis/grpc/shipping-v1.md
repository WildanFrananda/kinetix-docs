---
title: "shipping.v1"
description: "Paket gRPC shipping.v1 di kinetix-contracts 1.7.0: service, message, dan enum-nya."
editUrl: false
sourceHash: "8dc7f52a6114"
---

<div class="grpc-reference">

Dibuat otomatis dari rilis [1.7.0](https://www.npmjs.com/package/kinetix-contracts/v/1.7.0) kinetix-contracts: [`shipping/v1/shipping.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/shipping/v1/shipping.proto). Server dan pemanggil diambil dari [peta sistem](/id/architecture/system-map/); tanda pisah berarti peta tidak mencatat apa pun.

## Service

### ShippingService

[`shipping/v1/shipping.proto:7`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/shipping/v1/shipping.proto#L7)

| RPC | Request → response | Dilayani oleh | Dipanggil oleh |
| --- | --- | --- | --- |
| [`EstimateShippingOptions`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/shipping/v1/shipping.proto#L8) | [`EstimateShippingOptionsRequest`](#estimateshippingoptionsrequest) → [`EstimateShippingOptionsResponse`](#estimateshippingoptionsresponse) | [matching](/id/services/matching/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/ShippingGrpcClient.cs#L34) |

## Message

### EstimateShippingOptionsRequest

[`shipping/v1/shipping.proto:11`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/shipping/v1/shipping.proto#L11)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `origin` | 1 | [`common.v1.GeoPoint`](/id/apis/grpc/common-v1/#geopoint) |
| `destination` | 2 | [`common.v1.GeoPoint`](/id/apis/grpc/common-v1/#geopoint) |
| `total_weight_grams` | 3 | `int64` |
| `merchant_principal_id` | 4 | `string` |

### CourierOption

[`shipping/v1/shipping.proto:18`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/shipping/v1/shipping.proto#L18)

| Field | Nomor | Tipe | Catatan |
| --- | --- | --- | --- |
| `service_tier` | 1 | `string` |  |
| `service_name` | 2 | `string` |  |
| `distance_km` | 3 | `double` |  |
| `base_shipping_fee` | 4 | [`common.v1.Money`](/id/apis/grpc/common-v1/#money) | deprecated |
| `estimated_delivery_time` | 5 | `string` |  |
| `is_available` | 6 | `bool` |  |
| `unavailable_reason` | 7 | `string` |  |

### EstimateShippingOptionsResponse

[`shipping/v1/shipping.proto:28`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/shipping/v1/shipping.proto#L28)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `distance_km` | 1 | `double` |
| `options` | 2 | `repeated` [`CourierOption`](#courieroption) |

</div>
