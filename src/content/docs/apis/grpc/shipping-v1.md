---
title: "shipping.v1"
description: "The shipping.v1 gRPC package in kinetix-contracts 1.3.0: its services, messages and enums."
editUrl: false
---

<div class="grpc-reference">

Generated from release [1.3.0](https://www.npmjs.com/package/kinetix-contracts/v/1.3.0) of kinetix-contracts: [`shipping/v1/shipping.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/shipping/v1/shipping.proto). Servers and callers are those on the [system map](/architecture/system-map/); a dash means the map records none.

## Services

### ShippingService

[`shipping/v1/shipping.proto:7`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/shipping/v1/shipping.proto#L7)

| RPC | Request → response | Served by | Called by |
| --- | --- | --- | --- |
| [`EstimateShippingOptions`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/shipping/v1/shipping.proto#L8) | [`EstimateShippingOptionsRequest`](#estimateshippingoptionsrequest) → [`EstimateShippingOptionsResponse`](#estimateshippingoptionsresponse) | [matching](/services/matching/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Infrastructure/Grpc/ShippingGrpcClient.cs#L34) |

## Messages

### EstimateShippingOptionsRequest

[`shipping/v1/shipping.proto:11`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/shipping/v1/shipping.proto#L11)

| Field | Number | Type |
| --- | --- | --- |
| `origin` | 1 | [`common.v1.GeoPoint`](/apis/grpc/common-v1/#geopoint) |
| `destination` | 2 | [`common.v1.GeoPoint`](/apis/grpc/common-v1/#geopoint) |
| `total_weight_grams` | 3 | `int64` |
| `merchant_principal_id` | 4 | `string` |

### CourierOption

[`shipping/v1/shipping.proto:18`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/shipping/v1/shipping.proto#L18)

| Field | Number | Type | Notes |
| --- | --- | --- | --- |
| `service_tier` | 1 | `string` |  |
| `service_name` | 2 | `string` |  |
| `distance_km` | 3 | `double` |  |
| `base_shipping_fee` | 4 | [`common.v1.Money`](/apis/grpc/common-v1/#money) | deprecated |
| `estimated_delivery_time` | 5 | `string` |  |
| `is_available` | 6 | `bool` |  |
| `unavailable_reason` | 7 | `string` |  |

### EstimateShippingOptionsResponse

[`shipping/v1/shipping.proto:28`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/shipping/v1/shipping.proto#L28)

| Field | Number | Type |
| --- | --- | --- |
| `distance_km` | 1 | `double` |
| `options` | 2 | `repeated` [`CourierOption`](#courieroption) |

</div>
