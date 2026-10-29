---
title: "identity.v1"
description: "Paket gRPC identity.v1 di kinetix-contracts 1.7.0: service, message, dan enum-nya."
editUrl: false
sourceHash: "7ba0eea0e1db"
---

<div class="grpc-reference">

Dibuat otomatis dari rilis [1.7.0](https://www.npmjs.com/package/kinetix-contracts/v/1.7.0) kinetix-contracts: [`identity/v1/identity.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto). Server dan pemanggil diambil dari [peta sistem](/id/architecture/system-map/); tanda pisah berarti peta tidak mencatat apa pun.

## Service

### IdentityService

[`identity/v1/identity.proto:8`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L8)

| RPC | Request → response | Dilayani oleh | Dipanggil oleh |
| --- | --- | --- | --- |
| [`ResolvePrincipal`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L9) | [`ResolvePrincipalRequest`](#resolveprincipalrequest) → [`ResolvePrincipalResponse`](#resolveprincipalresponse) | [identity](/id/services/identity/) | — |
| [`GetPrincipal`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L10) | [`GetPrincipalRequest`](#getprincipalrequest) → [`GetPrincipalResponse`](#getprincipalresponse) | [identity](/id/services/identity/) | [communication](https://github.com/WildanFrananda/kinetix-communication-service/blob/db206dce65e189ad9463cf44c6b66ff36a9193bc/src/adapters/grpc/GrpcPrincipalDirectory.cpp#L28) |
| [`GetUserProfile`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L11) | [`GetUserProfileRequest`](#getuserprofilerequest) → [`GetUserProfileResponse`](#getuserprofileresponse) | [identity](/id/services/identity/) | [order](https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/IdentityAddressDirectory.cs#L55), [notification](https://github.com/WildanFrananda/kinetix-notification-service/blob/510a1ecf16006e28913c30d9861c95af3af226b9/src/main/scala/com/kinetix/notification/infrastructure/grpc/GrpcIdentityRecipientDirectory.scala#L20) |
| [`GetMerchantInfo`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L12) | [`GetMerchantInfoRequest`](#getmerchantinforequest) → [`GetMerchantInfoResponse`](#getmerchantinforesponse) | [identity](/id/services/identity/) | [catalog](https://github.com/WildanFrananda/kinetix-catalog-service/blob/ab557c90cb3230221c5a504def11fa7df26a6f7a/core/infrastructure/grpc/identity_client.py#L54), [pricing](https://github.com/WildanFrananda/kinetix-pricing-service/blob/0ed7db4cd6fb8d40375cab26dd7ac56ebce16a8a/src/clients/identity_merchant_directory.rs#L35), [order](https://github.com/WildanFrananda/kinetix-order-service/blob/1395062e2b803ead17d09bc8f50622367c7fd2ab/Infrastructure/Grpc/IdentityAddressDirectory.cs#L20), [warehouse](https://github.com/WildanFrananda/kinetix-warehouse-service/blob/07fc2707413de029830bd1364e722a41b8285d81/app/clients/identity/grpc_client.rb#L41) |
| [`ValidateToken`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L13) | [`ValidateTokenRequest`](#validatetokenrequest) → [`ValidateTokenResponse`](#validatetokenresponse) | [identity](/id/services/identity/) | [communication](https://github.com/WildanFrananda/kinetix-communication-service/blob/db206dce65e189ad9463cf44c6b66ff36a9193bc/src/adapters/grpc/GrpcPrincipalAuthenticator.cpp#L33) |
| [`MerchantsChangedSince`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L14) | [`MerchantsChangedSinceRequest`](#merchantschangedsincerequest) → [`MerchantsChangedSinceResponse`](#merchantschangedsinceresponse) | [identity](/id/services/identity/) | [search](https://github.com/WildanFrananda/kinetix-search-service/blob/ba054100e0e91fd9640842c0035b514d923f674e/internal/identityclient/client.go#L54) |

## Message

### ServiceLocalId

[`identity/v1/identity.proto:26`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L26)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `service` | 1 | `string` |
| `local_id` | 2 | `string` |

### ResolvePrincipalRequest

[`identity/v1/identity.proto:31`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L31)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `service_local_id` | 1 | [`ServiceLocalId`](#servicelocalid) |

### ResolvePrincipalResponse

[`identity/v1/identity.proto:35`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L35)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `found` | 1 | `bool` |
| `principal_id` | 2 | `string` |
| `kind` | 3 | [`PrincipalKind`](#principalkind) |
| `display_name` | 4 | `string` |

### GetPrincipalRequest

[`identity/v1/identity.proto:42`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L42)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `principal_id` | 1 | `string` |

### GetPrincipalResponse

[`identity/v1/identity.proto:46`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L46)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `found` | 1 | `bool` |
| `principal_id` | 2 | `string` |
| `kind` | 3 | [`PrincipalKind`](#principalkind) |
| `display_name` | 4 | `string` |
| `aliases` | 5 | `repeated` [`ServiceLocalId`](#servicelocalid) |

### GetUserProfileRequest

[`identity/v1/identity.proto:54`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L54)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `principal_id` | 1 | `string` |

### GetUserProfileResponse

[`identity/v1/identity.proto:58`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L58)

| Field | Nomor | Tipe |
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
| `location` | 11 | [`common.v1.GeoPoint`](/id/apis/grpc/common-v1/#geopoint) |

### GetMerchantInfoRequest

[`identity/v1/identity.proto:72`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L72)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `principal_id` | 1 | `string` |

### GetMerchantInfoResponse

[`identity/v1/identity.proto:76`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L76)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `found` | 1 | `bool` |
| `merchant_principal_id` | 2 | `string` |
| `store_name` | 3 | `string` |
| `business_registration_number` | 4 | `string` |
| `tax_id` | 5 | `string` |
| `status` | 6 | [`MerchantStatus`](#merchantstatus) |
| `pickup_address` | 7 | [`common.v1.Address`](/id/apis/grpc/common-v1/#address) |
| `location` | 9 | [`common.v1.GeoPoint`](/id/apis/grpc/common-v1/#geopoint) |
| `may_sell` | 10 | `bool` |

### ValidateTokenRequest

[`identity/v1/identity.proto:97`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L97)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `access_token` | 1 | `string` |

### ValidateTokenResponse

[`identity/v1/identity.proto:101`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L101)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `valid` | 1 | `bool` |
| `principal_id` | 2 | `string` |
| `kind` | 3 | [`PrincipalKind`](#principalkind) |
| `reason` | 4 | `string` |

### MerchantCursor

[`identity/v1/identity.proto:108`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L108)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `updated_through` | 1 | `google.protobuf.Timestamp` |
| `last_principal_id` | 2 | `string` |
| `transaction_id` | 3 | `optional uint64` |

### MerchantRecord

[`identity/v1/identity.proto:114`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L114)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `principal_id` | 1 | `string` |
| `store_name` | 2 | `string` |
| `status` | 3 | [`MerchantStatus`](#merchantstatus) |
| `may_sell` | 4 | `bool` |
| `updated_at` | 5 | `google.protobuf.Timestamp` |

### MerchantsChangedSinceRequest

[`identity/v1/identity.proto:122`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L122)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `cursor` | 1 | [`MerchantCursor`](#merchantcursor) |
| `limit` | 2 | `int32` |

### MerchantsChangedSinceResponse

[`identity/v1/identity.proto:127`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L127)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `upserted` | 1 | `repeated` [`MerchantRecord`](#merchantrecord) |
| `removed_principal_ids` | 2 | `repeated string` |
| `next` | 3 | [`MerchantCursor`](#merchantcursor) |
| `has_more` | 4 | `bool` |

## Enum

### PrincipalKind

[`identity/v1/identity.proto:17`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L17)

| Nama | Nomor |
| --- | --- |
| `PRINCIPAL_KIND_UNSPECIFIED` | 0 |
| `PRINCIPAL_KIND_CUSTOMER` | 1 |
| `PRINCIPAL_KIND_MERCHANT` | 2 |
| `PRINCIPAL_KIND_DRIVER` | 3 |
| `PRINCIPAL_KIND_STAFF` | 4 |
| `PRINCIPAL_KIND_SERVICE` | 5 |

### MerchantStatus

[`identity/v1/identity.proto:89`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/identity/v1/identity.proto#L89)

| Nama | Nomor |
| --- | --- |
| `MERCHANT_STATUS_UNSPECIFIED` | 0 |
| `MERCHANT_STATUS_PENDING` | 1 |
| `MERCHANT_STATUS_VERIFIED` | 2 |
| `MERCHANT_STATUS_SUSPENDED` | 3 |
| `MERCHANT_STATUS_CLOSED` | 4 |

</div>
