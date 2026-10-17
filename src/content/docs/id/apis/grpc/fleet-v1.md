---
title: "fleet.v1"
description: "Paket gRPC fleet.v1 di kinetix-contracts 1.3.0: service, message, dan enum-nya."
editUrl: false
sourceHash: "a8e538155d79"
---

<div class="grpc-reference">

Dibuat otomatis dari rilis [1.3.0](https://www.npmjs.com/package/kinetix-contracts/v/1.3.0) kinetix-contracts: [`fleet/v1/fleet.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fleet/v1/fleet.proto), [`fleet/v1/registry.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fleet/v1/registry.proto). Server dan pemanggil diambil dari [peta sistem](/id/architecture/system-map/); tanda pisah berarti peta tidak mencatat apa pun.

## Service

### CourierTelemetryService

[`fleet/v1/fleet.proto:8`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fleet/v1/fleet.proto#L8)

| RPC | Request → response | Dilayani oleh | Dipanggil oleh |
| --- | --- | --- | --- |
| [`DispatchCourier`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fleet/v1/fleet.proto#L9) | [`DispatchCourierRequest`](#dispatchcourierrequest) → [`DispatchCourierResponse`](#dispatchcourierresponse) | [matching](/id/services/matching/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/bf6483a1e8c5c21de00425bbdaa3ce30dec29450/Application/Fulfillment/CourierDispatcher.cs#L74) |
| [`StreamDriverLocation`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fleet/v1/fleet.proto#L10) | `stream` [`DriverLocationPing`](#driverlocationping) → `stream` [`DriverLocationAck`](#driverlocationack) | — | — |

### FleetRegistryService

[`fleet/v1/registry.proto:7`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fleet/v1/registry.proto#L7)

| RPC | Request → response | Dilayani oleh | Dipanggil oleh |
| --- | --- | --- | --- |
| [`RegisterDriver`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fleet/v1/registry.proto#L8) | [`RegisterDriverRequest`](#registerdriverrequest) → [`RegisterDriverResponse`](#registerdriverresponse) | [matching](/id/services/matching/) | [identity](https://github.com/WildanFrananda/kinetix-identity-service/blob/16fba71e46c89d6032b5ccc94a040af2fe97b1f1/src/infrastructure/mesh/fleet_registry_grpc.adapter.ts#L38) |
| [`ActivateDriver`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fleet/v1/registry.proto#L9) | [`ActivateDriverRequest`](#activatedriverrequest) → [`ActivateDriverResponse`](#activatedriverresponse) | [matching](/id/services/matching/) | [identity](https://github.com/WildanFrananda/kinetix-identity-service/blob/16fba71e46c89d6032b5ccc94a040af2fe97b1f1/src/infrastructure/mesh/fleet_registry_grpc.adapter.ts#L55) |

## Message

### DispatchCourierRequest

[`fleet/v1/fleet.proto:13`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fleet/v1/fleet.proto#L13)

| Field | Nomor | Tipe | Catatan |
| --- | --- | --- | --- |
| `merchant_principal_id` | 1 | `string` |  |
| `order_id` | 2 | `string` |  |
| `order_number` | 3 | `string` |  |
| `pickup_address` | 4 | [`common.v1.Address`](/id/apis/grpc/common-v1/#address) | deprecated |
| `delivery_address` | 5 | [`common.v1.Address`](/id/apis/grpc/common-v1/#address) | deprecated |
| `idempotency_key` | 6 | [`common.v1.IdempotencyKey`](/id/apis/grpc/common-v1/#idempotencykey) |  |
| `pickup_point` | 7 | [`common.v1.GeoPoint`](/id/apis/grpc/common-v1/#geopoint) |  |
| `delivery_point` | 8 | [`common.v1.GeoPoint`](/id/apis/grpc/common-v1/#geopoint) |  |

### DispatchCourierResponse

[`fleet/v1/fleet.proto:24`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fleet/v1/fleet.proto#L24)

| Field | Nomor | Tipe | Catatan |
| --- | --- | --- | --- |
| `success` | 1 | `bool` |  |
| `dispatch_ref` | 2 | `string` |  |
| `assigned_driver_principal_id` | 3 | `string` |  |
| `assigned_driver_name` | 4 | `string` | deprecated |
| `assigned_driver_phone` | 5 | `string` | deprecated |
| `vehicle` | 6 | `string` |  |
| `eta_minutes` | 7 | `int32` |  |
| `error` | 8 | [`common.v1.ErrorDetail`](/id/apis/grpc/common-v1/#errordetail) |  |
| `awb_number` | 9 | `string` |  |

### DriverLocationPing

[`fleet/v1/fleet.proto:36`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fleet/v1/fleet.proto#L36)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `driver_principal_id` | 1 | `string` |
| `order_number` | 2 | `string` |
| `location` | 3 | [`common.v1.GeoPoint`](/id/apis/grpc/common-v1/#geopoint) |
| `speed_kmh` | 4 | `double` |
| `status` | 5 | [`common.v1.CourierStatus`](/id/apis/grpc/common-v1/#courierstatus) |
| `observed_at` | 6 | `google.protobuf.Timestamp` |

### DriverLocationAck

[`fleet/v1/fleet.proto:45`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fleet/v1/fleet.proto#L45)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `driver_principal_id` | 1 | `string` |
| `received` | 2 | `bool` |
| `server_time` | 3 | `google.protobuf.Timestamp` |

### RegisterDriverRequest

[`fleet/v1/registry.proto:12`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fleet/v1/registry.proto#L12)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `principal_id` | 1 | `string` |
| `vehicle_plate` | 2 | `string` |
| `capacity_kg` | 3 | `int32` |

### RegisterDriverResponse

[`fleet/v1/registry.proto:18`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fleet/v1/registry.proto#L18)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `driver_id` | 2 | `int64` |
| `already_registered` | 3 | `bool` |
| `error` | 4 | [`common.v1.ErrorDetail`](/id/apis/grpc/common-v1/#errordetail) |

### ActivateDriverRequest

[`fleet/v1/registry.proto:25`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fleet/v1/registry.proto#L25)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `principal_id` | 1 | `string` |

### ActivateDriverResponse

[`fleet/v1/registry.proto:29`](https://github.com/WildanFrananda/kinetix-contracts/blob/edc6c266cdd62d3635f96a14c796289f98447197/proto/fleet/v1/registry.proto#L29)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `success` | 1 | `bool` |
| `driver_id` | 2 | `int64` |
| `already_active` | 3 | `bool` |
| `error` | 4 | [`common.v1.ErrorDetail`](/id/apis/grpc/common-v1/#errordetail) |

</div>
