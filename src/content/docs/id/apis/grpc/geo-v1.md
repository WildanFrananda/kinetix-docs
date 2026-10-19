---
title: "geo.v1"
description: "Paket gRPC geo.v1 di kinetix-contracts 1.5.0: service, message, dan enum-nya."
editUrl: false
sourceHash: "8fe23cabebe5"
---

<div class="grpc-reference">

Dibuat otomatis dari rilis [1.5.0](https://www.npmjs.com/package/kinetix-contracts/v/1.5.0) kinetix-contracts: [`geo/v1/geo.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto). Server dan pemanggil diambil dari [peta sistem](/id/architecture/system-map/); tanda pisah berarti peta tidak mencatat apa pun.

## Service

### GeocodingService

[`geo/v1/geo.proto:7`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto#L7)

| RPC | Request → response | Dilayani oleh | Dipanggil oleh |
| --- | --- | --- | --- |
| [`GeocodeAddress`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto#L8) | [`GeocodeAddressRequest`](#geocodeaddressrequest) → [`GeocodeAddressResponse`](#geocodeaddressresponse) | [identity](/id/services/identity/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/IdentityAddressGeocoder.cs#L23) |
| [`GeocodeAddresses`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto#L9) | [`GeocodeAddressesRequest`](#geocodeaddressesrequest) → [`GeocodeAddressesResponse`](#geocodeaddressesresponse) | [identity](/id/services/identity/) | — |

## Message

### GeocodeAddressRequest

[`geo/v1/geo.proto:21`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto#L21)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `address` | 1 | [`common.v1.Address`](/id/apis/grpc/common-v1/#address) |

### GeocodeAddressResponse

[`geo/v1/geo.proto:25`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto#L25)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `geocoded` | 1 | `bool` |
| `location` | 2 | [`common.v1.GeoPoint`](/id/apis/grpc/common-v1/#geopoint) |
| `failure` | 3 | [`GeocodeFailure`](#geocodefailure) |
| `failure_detail` | 4 | `string` |
| `precision` | 5 | [`GeocodePrecision`](#geocodeprecision) |

### GeocodeAddressesRequest

[`geo/v1/geo.proto:41`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto#L41)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `addresses` | 1 | `repeated` [`common.v1.Address`](/id/apis/grpc/common-v1/#address) |

### GeocodeAddressesResponse

[`geo/v1/geo.proto:45`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto#L45)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `results` | 1 | `repeated` [`GeocodeAddressResponse`](#geocodeaddressresponse) |

## Enum

### GeocodeFailure

[`geo/v1/geo.proto:12`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto#L12)

| Nama | Nomor |
| --- | --- |
| `GEOCODE_FAILURE_UNSPECIFIED` | 0 |
| `GEOCODE_FAILURE_NOT_FOUND` | 1 |
| `GEOCODE_FAILURE_AMBIGUOUS` | 2 |
| `GEOCODE_FAILURE_PROVIDER_UNAVAILABLE` | 3 |
| `GEOCODE_FAILURE_OUT_OF_SERVICE_AREA` | 4 |
| `GEOCODE_FAILURE_INSUFFICIENT_ADDRESS` | 5 |

### GeocodePrecision

[`geo/v1/geo.proto:33`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto#L33)

| Nama | Nomor |
| --- | --- |
| `GEOCODE_PRECISION_UNSPECIFIED` | 0 |
| `GEOCODE_PRECISION_ROOFTOP` | 1 |
| `GEOCODE_PRECISION_STREET` | 2 |
| `GEOCODE_PRECISION_SUBURB` | 3 |
| `GEOCODE_PRECISION_CITY` | 4 |

</div>
