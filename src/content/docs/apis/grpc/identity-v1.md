---
title: "identity.v1"
description: "The identity.v1 gRPC package in kinetix-contracts 1.8.1: its services, messages and enums."
editUrl: false
---

<div class="grpc-reference">

Generated from release [1.8.1](https://www.npmjs.com/package/kinetix-contracts/v/1.8.1) of kinetix-contracts: [`identity/v1/identity.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto). Servers and callers are those on the [system map](/architecture/system-map/); a dash means the map records none.

## Services

### IdentityService

[`identity/v1/identity.proto:8`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L8)

| RPC | Request → response | Served by | Called by |
| --- | --- | --- | --- |
| [`ResolvePrincipal`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L9) | [`ResolvePrincipalRequest`](#resolveprincipalrequest) → [`ResolvePrincipalResponse`](#resolveprincipalresponse) | [identity](/services/identity/) | — |
| [`GetPrincipal`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L10) | [`GetPrincipalRequest`](#getprincipalrequest) → [`GetPrincipalResponse`](#getprincipalresponse) | [identity](/services/identity/) | [communication](https://github.com/WildanFrananda/kinetix-communication-service/blob/db206dce65e189ad9463cf44c6b66ff36a9193bc/src/adapters/grpc/GrpcPrincipalDirectory.cpp#L28) |
| [`GetUserProfile`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L11) | [`GetUserProfileRequest`](#getuserprofilerequest) → [`GetUserProfileResponse`](#getuserprofileresponse) | [identity](/services/identity/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/a0167a3ec43e857e85401924b4bee486e596d4fd/Infrastructure/Grpc/IdentityAddressDirectory.cs#L55), [notification](https://github.com/WildanFrananda/kinetix-notification-service/blob/510a1ecf16006e28913c30d9861c95af3af226b9/src/main/scala/com/kinetix/notification/infrastructure/grpc/GrpcIdentityRecipientDirectory.scala#L20) |
| [`GetMerchantInfo`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L12) | [`GetMerchantInfoRequest`](#getmerchantinforequest) → [`GetMerchantInfoResponse`](#getmerchantinforesponse) | [identity](/services/identity/) | [catalog](https://github.com/WildanFrananda/kinetix-catalog-service/blob/ab557c90cb3230221c5a504def11fa7df26a6f7a/core/infrastructure/grpc/identity_client.py#L54), [pricing](https://github.com/WildanFrananda/kinetix-pricing-service/blob/0ed7db4cd6fb8d40375cab26dd7ac56ebce16a8a/src/clients/identity_merchant_directory.rs#L35), [order](https://github.com/WildanFrananda/kinetix-order-service/blob/a0167a3ec43e857e85401924b4bee486e596d4fd/Infrastructure/Grpc/IdentityAddressDirectory.cs#L20), [warehouse](https://github.com/WildanFrananda/kinetix-warehouse-service/blob/07fc2707413de029830bd1364e722a41b8285d81/app/clients/identity/grpc_client.rb#L41) |
| [`GetCourierStanding`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L13) | [`GetCourierStandingRequest`](#getcourierstandingrequest) → [`GetCourierStandingResponse`](#getcourierstandingresponse) | [identity](/services/identity/) | [matching](https://github.com/WildanFrananda/kinetix-matching-service/blob/461281a718a31994f8697198c469b041dd62128f/lib/kinetix_matching/clients/identity_grpc.ex#L56) |
| [`ValidateToken`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L14) | [`ValidateTokenRequest`](#validatetokenrequest) → [`ValidateTokenResponse`](#validatetokenresponse) | [identity](/services/identity/) | [communication](https://github.com/WildanFrananda/kinetix-communication-service/blob/db206dce65e189ad9463cf44c6b66ff36a9193bc/src/adapters/grpc/GrpcPrincipalAuthenticator.cpp#L33) |
| [`MerchantsChangedSince`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L15) | [`MerchantsChangedSinceRequest`](#merchantschangedsincerequest) → [`MerchantsChangedSinceResponse`](#merchantschangedsinceresponse) | [identity](/services/identity/) | [search](https://github.com/WildanFrananda/kinetix-search-service/blob/ba054100e0e91fd9640842c0035b514d923f674e/internal/identityclient/client.go#L54) |

## Messages

### ServiceLocalId

[`identity/v1/identity.proto:27`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L27)

| Field | Number | Type |
| --- | --- | --- |
| `service` | 1 | `string` |
| `local_id` | 2 | `string` |

### ResolvePrincipalRequest

[`identity/v1/identity.proto:32`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L32)

| Field | Number | Type |
| --- | --- | --- |
| `service_local_id` | 1 | [`ServiceLocalId`](#servicelocalid) |

### ResolvePrincipalResponse

[`identity/v1/identity.proto:36`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L36)

| Field | Number | Type |
| --- | --- | --- |
| `found` | 1 | `bool` |
| `principal_id` | 2 | `string` |
| `kind` | 3 | [`PrincipalKind`](#principalkind) |
| `display_name` | 4 | `string` |

### GetPrincipalRequest

[`identity/v1/identity.proto:43`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L43)

| Field | Number | Type |
| --- | --- | --- |
| `principal_id` | 1 | `string` |

### GetPrincipalResponse

[`identity/v1/identity.proto:47`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L47)

| Field | Number | Type |
| --- | --- | --- |
| `found` | 1 | `bool` |
| `principal_id` | 2 | `string` |
| `kind` | 3 | [`PrincipalKind`](#principalkind) |
| `display_name` | 4 | `string` |
| `aliases` | 5 | `repeated` [`ServiceLocalId`](#servicelocalid) |

### GetUserProfileRequest

[`identity/v1/identity.proto:55`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L55)

| Field | Number | Type |
| --- | --- | --- |
| `principal_id` | 1 | `string` |

### GetUserProfileResponse

[`identity/v1/identity.proto:59`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L59)

| Field | Number | Type |
| --- | --- | --- |
| `found` | 1 | `bool` |
| `principal_id` | 2 | `string` |
| `email` | 3 | `string` |
| `full_name` | 4 | `string` |
| `phone_number` | 5 | `string` |
| `street_address` | 6 | `string` |
| `city` | 7 | `string` |
| `postal_code` | 8 | `string` |
| `kind` | 9 | [`PrincipalKind`](#principalkind) |
| `location` | 11 | [`common.v1.GeoPoint`](/apis/grpc/common-v1/#geopoint) |

### GetMerchantInfoRequest

[`identity/v1/identity.proto:73`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L73)

| Field | Number | Type |
| --- | --- | --- |
| `principal_id` | 1 | `string` |

### GetMerchantInfoResponse

[`identity/v1/identity.proto:77`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L77)

| Field | Number | Type |
| --- | --- | --- |
| `found` | 1 | `bool` |
| `merchant_principal_id` | 2 | `string` |
| `store_name` | 3 | `string` |
| `business_registration_number` | 4 | `string` |
| `tax_id` | 5 | `string` |
| `status` | 6 | [`MerchantStatus`](#merchantstatus) |
| `pickup_address` | 7 | [`common.v1.Address`](/apis/grpc/common-v1/#address) |
| `location` | 9 | [`common.v1.GeoPoint`](/apis/grpc/common-v1/#geopoint) |
| `may_sell` | 10 | `bool` |

### ValidateTokenRequest

[`identity/v1/identity.proto:98`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L98)

| Field | Number | Type |
| --- | --- | --- |
| `access_token` | 1 | `string` |

### ValidateTokenResponse

[`identity/v1/identity.proto:102`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L102)

| Field | Number | Type |
| --- | --- | --- |
| `valid` | 1 | `bool` |
| `principal_id` | 2 | `string` |
| `kind` | 3 | [`PrincipalKind`](#principalkind) |
| `reason` | 4 | `string` |

### MerchantCursor

[`identity/v1/identity.proto:109`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L109)

| Field | Number | Type |
| --- | --- | --- |
| `updated_through` | 1 | `google.protobuf.Timestamp` |
| `last_principal_id` | 2 | `string` |
| `transaction_id` | 3 | `optional uint64` |

### MerchantRecord

[`identity/v1/identity.proto:115`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L115)

| Field | Number | Type |
| --- | --- | --- |
| `principal_id` | 1 | `string` |
| `store_name` | 2 | `string` |
| `status` | 3 | [`MerchantStatus`](#merchantstatus) |
| `may_sell` | 4 | `bool` |
| `updated_at` | 5 | `google.protobuf.Timestamp` |

### MerchantsChangedSinceRequest

[`identity/v1/identity.proto:123`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L123)

| Field | Number | Type |
| --- | --- | --- |
| `cursor` | 1 | [`MerchantCursor`](#merchantcursor) |
| `limit` | 2 | `int32` |

### MerchantsChangedSinceResponse

[`identity/v1/identity.proto:128`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L128)

| Field | Number | Type |
| --- | --- | --- |
| `upserted` | 1 | `repeated` [`MerchantRecord`](#merchantrecord) |
| `removed_principal_ids` | 2 | `repeated string` |
| `next` | 3 | [`MerchantCursor`](#merchantcursor) |
| `has_more` | 4 | `bool` |

### GetCourierStandingRequest

[`identity/v1/identity.proto:142`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L142)

| Field | Number | Type |
| --- | --- | --- |
| `principal_id` | 1 | `string` |

### GetCourierStandingResponse

[`identity/v1/identity.proto:146`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L146)

| Field | Number | Type |
| --- | --- | --- |
| `found` | 1 | `bool` |
| `courier_principal_id` | 2 | `string` |
| `vehicle_plate` | 3 | `string` |
| `capacity_kg` | 4 | `int32` |
| `status` | 5 | [`CourierStatus`](#courierstatus) |
| `may_drive` | 6 | `bool` |

## Enums

### PrincipalKind

[`identity/v1/identity.proto:18`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L18)

| Name | Number |
| --- | --- |
| `PRINCIPAL_KIND_UNSPECIFIED` | 0 |
| `PRINCIPAL_KIND_CUSTOMER` | 1 |
| `PRINCIPAL_KIND_MERCHANT` | 2 |
| `PRINCIPAL_KIND_DRIVER` | 3 |
| `PRINCIPAL_KIND_STAFF` | 4 |
| `PRINCIPAL_KIND_SERVICE` | 5 |

### MerchantStatus

[`identity/v1/identity.proto:90`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L90)

| Name | Number |
| --- | --- |
| `MERCHANT_STATUS_UNSPECIFIED` | 0 |
| `MERCHANT_STATUS_PENDING` | 1 |
| `MERCHANT_STATUS_VERIFIED` | 2 |
| `MERCHANT_STATUS_SUSPENDED` | 3 |
| `MERCHANT_STATUS_CLOSED` | 4 |

### CourierStatus

[`identity/v1/identity.proto:135`](https://github.com/WildanFrananda/kinetix-contracts/blob/fc35a273a6be4fa42887a88dbec4f51f06f86913/proto/identity/v1/identity.proto#L135)

| Name | Number |
| --- | --- |
| `COURIER_STATUS_UNSPECIFIED` | 0 |
| `COURIER_STATUS_PENDING` | 1 |
| `COURIER_STATUS_APPROVED` | 2 |
| `COURIER_STATUS_REJECTED` | 3 |

</div>
