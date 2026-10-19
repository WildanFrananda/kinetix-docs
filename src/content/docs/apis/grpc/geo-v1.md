---
title: "geo.v1"
description: "The geo.v1 gRPC package in kinetix-contracts 1.5.0: its services, messages and enums."
editUrl: false
---

<div class="grpc-reference">

Generated from release [1.5.0](https://www.npmjs.com/package/kinetix-contracts/v/1.5.0) of kinetix-contracts: [`geo/v1/geo.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto). Servers and callers are those on the [system map](/architecture/system-map/); a dash means the map records none.

## Services

### GeocodingService

[`geo/v1/geo.proto:7`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto#L7)

| RPC | Request → response | Served by | Called by |
| --- | --- | --- | --- |
| [`GeocodeAddress`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto#L8) | [`GeocodeAddressRequest`](#geocodeaddressrequest) → [`GeocodeAddressResponse`](#geocodeaddressresponse) | [identity](/services/identity/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/0c3698ed729ac161bef54c469f46cebf89acb6c6/Infrastructure/Grpc/IdentityAddressGeocoder.cs#L23) |
| [`GeocodeAddresses`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto#L9) | [`GeocodeAddressesRequest`](#geocodeaddressesrequest) → [`GeocodeAddressesResponse`](#geocodeaddressesresponse) | [identity](/services/identity/) | — |

## Messages

### GeocodeAddressRequest

[`geo/v1/geo.proto:21`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto#L21)

| Field | Number | Type |
| --- | --- | --- |
| `address` | 1 | [`common.v1.Address`](/apis/grpc/common-v1/#address) |

### GeocodeAddressResponse

[`geo/v1/geo.proto:25`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto#L25)

| Field | Number | Type |
| --- | --- | --- |
| `geocoded` | 1 | `bool` |
| `location` | 2 | [`common.v1.GeoPoint`](/apis/grpc/common-v1/#geopoint) |
| `failure` | 3 | [`GeocodeFailure`](#geocodefailure) |
| `failure_detail` | 4 | `string` |
| `precision` | 5 | [`GeocodePrecision`](#geocodeprecision) |

### GeocodeAddressesRequest

[`geo/v1/geo.proto:41`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto#L41)

| Field | Number | Type |
| --- | --- | --- |
| `addresses` | 1 | `repeated` [`common.v1.Address`](/apis/grpc/common-v1/#address) |

### GeocodeAddressesResponse

[`geo/v1/geo.proto:45`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto#L45)

| Field | Number | Type |
| --- | --- | --- |
| `results` | 1 | `repeated` [`GeocodeAddressResponse`](#geocodeaddressresponse) |

## Enums

### GeocodeFailure

[`geo/v1/geo.proto:12`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto#L12)

| Name | Number |
| --- | --- |
| `GEOCODE_FAILURE_UNSPECIFIED` | 0 |
| `GEOCODE_FAILURE_NOT_FOUND` | 1 |
| `GEOCODE_FAILURE_AMBIGUOUS` | 2 |
| `GEOCODE_FAILURE_PROVIDER_UNAVAILABLE` | 3 |
| `GEOCODE_FAILURE_OUT_OF_SERVICE_AREA` | 4 |
| `GEOCODE_FAILURE_INSUFFICIENT_ADDRESS` | 5 |

### GeocodePrecision

[`geo/v1/geo.proto:33`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/geo/v1/geo.proto#L33)

| Name | Number |
| --- | --- |
| `GEOCODE_PRECISION_UNSPECIFIED` | 0 |
| `GEOCODE_PRECISION_ROOFTOP` | 1 |
| `GEOCODE_PRECISION_STREET` | 2 |
| `GEOCODE_PRECISION_SUBURB` | 3 |
| `GEOCODE_PRECISION_CITY` | 4 |

</div>
