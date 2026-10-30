---
title: "fleet.v1"
description: "The fleet.v1 gRPC package in kinetix-contracts 1.7.0: its services, messages and enums."
editUrl: false
---

<div class="grpc-reference">

Generated from release [1.7.0](https://www.npmjs.com/package/kinetix-contracts/v/1.7.0) of kinetix-contracts: [`fleet/v1/fleet.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/fleet/v1/fleet.proto), [`fleet/v1/registry.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/fleet/v1/registry.proto). Servers and callers are those on the [system map](/architecture/system-map/); a dash means the map records none.

## Services

### CourierTelemetryService

[`fleet/v1/fleet.proto:8`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/fleet/v1/fleet.proto#L8)

| RPC | Request → response | Served by | Called by |
| --- | --- | --- | --- |
| [`DispatchCourier`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/fleet/v1/fleet.proto#L9) | [`DispatchCourierRequest`](#dispatchcourierrequest) → [`DispatchCourierResponse`](#dispatchcourierresponse) | [matching](/services/matching/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Application/Fulfillment/CourierDispatcher.cs#L75) |
| [`StreamDriverLocation`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/fleet/v1/fleet.proto#L10) | `stream` [`DriverLocationPing`](#driverlocationping) → `stream` [`DriverLocationAck`](#driverlocationack) | — | — |

### FleetRegistryService

[`fleet/v1/registry.proto:7`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/fleet/v1/registry.proto#L7)

| RPC | Request → response | Served by | Called by |
| --- | --- | --- | --- |
| [`RegisterDriver`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/fleet/v1/registry.proto#L8) | [`RegisterDriverRequest`](#registerdriverrequest) → [`RegisterDriverResponse`](#registerdriverresponse) | [matching](/services/matching/) | [identity](https://github.com/WildanFrananda/kinetix-identity-service/blob/14a5d4291f2e4987e2ef774f68dc3888c509617c/src/infrastructure/mesh/fleet_registry_grpc.adapter.ts#L45) |
| [`ActivateDriver`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/fleet/v1/registry.proto#L9) | [`ActivateDriverRequest`](#activatedriverrequest) → [`ActivateDriverResponse`](#activatedriverresponse) | [matching](/services/matching/) | [identity](https://github.com/WildanFrananda/kinetix-identity-service/blob/14a5d4291f2e4987e2ef774f68dc3888c509617c/src/infrastructure/mesh/fleet_registry_grpc.adapter.ts#L62) |

## Messages

### DispatchCourierRequest

[`fleet/v1/fleet.proto:13`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/fleet/v1/fleet.proto#L13)

| Field | Number | Type | Notes |
| --- | --- | --- | --- |
| `merchant_principal_id` | 1 | `string` |  |
| `order_id` | 2 | `string` |  |
| `order_number` | 3 | `string` |  |
| `pickup_address` | 4 | [`common.v1.Address`](/apis/grpc/common-v1/#address) | deprecated |
| `delivery_address` | 5 | [`common.v1.Address`](/apis/grpc/common-v1/#address) | deprecated |
| `idempotency_key` | 6 | [`common.v1.IdempotencyKey`](/apis/grpc/common-v1/#idempotencykey) |  |
| `pickup_point` | 7 | [`common.v1.GeoPoint`](/apis/grpc/common-v1/#geopoint) |  |
| `delivery_point` | 8 | [`common.v1.GeoPoint`](/apis/grpc/common-v1/#geopoint) |  |
| `parcel_weight_grams` | 9 | `int64` |  |

### DispatchCourierResponse

[`fleet/v1/fleet.proto:25`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/fleet/v1/fleet.proto#L25)

| Field | Number | Type | Notes |
| --- | --- | --- | --- |
| `success` | 1 | `bool` |  |
| `dispatch_ref` | 2 | `string` |  |
| `assigned_driver_principal_id` | 3 | `string` |  |
| `assigned_driver_name` | 4 | `string` | deprecated |
| `assigned_driver_phone` | 5 | `string` | deprecated |
| `vehicle` | 6 | `string` |  |
| `eta_minutes` | 7 | `int32` |  |
| `error` | 8 | [`common.v1.ErrorDetail`](/apis/grpc/common-v1/#errordetail) |  |
| `awb_number` | 9 | `string` |  |

### DriverLocationPing

[`fleet/v1/fleet.proto:37`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/fleet/v1/fleet.proto#L37)

| Field | Number | Type |
| --- | --- | --- |
| `driver_principal_id` | 1 | `string` |
| `order_number` | 2 | `string` |
| `location` | 3 | [`common.v1.GeoPoint`](/apis/grpc/common-v1/#geopoint) |
| `speed_kmh` | 4 | `double` |
| `status` | 5 | [`common.v1.CourierStatus`](/apis/grpc/common-v1/#courierstatus) |
| `observed_at` | 6 | `google.protobuf.Timestamp` |

### DriverLocationAck

[`fleet/v1/fleet.proto:46`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/fleet/v1/fleet.proto#L46)

| Field | Number | Type |
| --- | --- | --- |
| `driver_principal_id` | 1 | `string` |
| `received` | 2 | `bool` |
| `server_time` | 3 | `google.protobuf.Timestamp` |

### RegisterDriverRequest

[`fleet/v1/registry.proto:12`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/fleet/v1/registry.proto#L12)

| Field | Number | Type |
| --- | --- | --- |
| `principal_id` | 1 | `string` |
| `vehicle_plate` | 2 | `string` |
| `capacity_kg` | 3 | `int32` |

### RegisterDriverResponse

[`fleet/v1/registry.proto:18`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/fleet/v1/registry.proto#L18)

| Field | Number | Type |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `driver_id` | 2 | `int64` |
| `already_registered` | 3 | `bool` |
| `error` | 4 | [`common.v1.ErrorDetail`](/apis/grpc/common-v1/#errordetail) |

### ActivateDriverRequest

[`fleet/v1/registry.proto:25`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/fleet/v1/registry.proto#L25)

| Field | Number | Type |
| --- | --- | --- |
| `principal_id` | 1 | `string` |

### ActivateDriverResponse

[`fleet/v1/registry.proto:29`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/fleet/v1/registry.proto#L29)

| Field | Number | Type |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `driver_id` | 2 | `int64` |
| `already_active` | 3 | `bool` |
| `error` | 4 | [`common.v1.ErrorDetail`](/apis/grpc/common-v1/#errordetail) |

</div>
