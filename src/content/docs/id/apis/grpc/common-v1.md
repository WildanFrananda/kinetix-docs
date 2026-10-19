---
title: "common.v1"
description: "Paket gRPC common.v1 di kinetix-contracts 1.5.0: service, message, dan enum-nya."
editUrl: false
sourceHash: "466d2c4fd64a"
---

<div class="grpc-reference">

Dibuat otomatis dari rilis [1.5.0](https://www.npmjs.com/package/kinetix-contracts/v/1.5.0) kinetix-contracts: [`common/v1/common.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/common/v1/common.proto). Server dan pemanggil diambil dari [peta sistem](/id/architecture/system-map/); tanda pisah berarti peta tidak mencatat apa pun.

## Message

### Money

[`common/v1/common.proto:5`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/common/v1/common.proto#L5)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `amount_minor` | 1 | `int64` |
| `currency` | 2 | `string` |

### GeoPoint

[`common/v1/common.proto:46`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/common/v1/common.proto#L46)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `latitude` | 1 | `double` |
| `longitude` | 2 | `double` |

### Address

[`common/v1/common.proto:51`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/common/v1/common.proto#L51)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `recipient_name` | 1 | `string` |
| `phone_number` | 2 | `string` |
| `street_address` | 3 | `string` |
| `city` | 4 | `string` |
| `postal_code` | 5 | `string` |
| `location` | 6 | [`GeoPoint`](#geopoint) |

### OrderItem

[`common/v1/common.proto:60`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/common/v1/common.proto#L60)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `sku` | 1 | `string` |
| `product_name` | 2 | `string` |
| `quantity` | 3 | `int32` |
| `unit_price` | 4 | [`Money`](#money) |
| `bin_location` | 5 | `string` |

### ErrorDetail

[`common/v1/common.proto:68`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/common/v1/common.proto#L68)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `error_code` | 1 | `string` |
| `message` | 2 | `string` |
| `field_violations` | 3 | `repeated string` |

### IdempotencyKey

[`common/v1/common.proto:74`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/common/v1/common.proto#L74)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `key` | 1 | `string` |

### LogCursor

[`common/v1/common.proto:78`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/common/v1/common.proto#L78)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `transaction_id` | 1 | `uint64` |
| `sequence` | 2 | `uint64` |

## Enum

### OrderStatus

[`common/v1/common.proto:10`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/common/v1/common.proto#L10)

| Nama | Nomor |
| --- | --- |
| `ORDER_STATUS_UNSPECIFIED` | 0 |
| `ORDER_STATUS_PENDING_PAYMENT` | 1 |
| `ORDER_STATUS_PAID` | 2 |
| `ORDER_STATUS_RECEIVED` | 3 |
| `ORDER_STATUS_PACKING` | 4 |
| `ORDER_STATUS_PACKED` | 5 |
| `ORDER_STATUS_ASSIGNED` | 6 |
| `ORDER_STATUS_DISPATCHED` | 7 |
| `ORDER_STATUS_IN_TRANSIT` | 8 |
| `ORDER_STATUS_DELIVERED` | 9 |
| `ORDER_STATUS_COMPLETED` | 10 |
| `ORDER_STATUS_CANCELLED` | 11 |
| `ORDER_STATUS_REFUNDED` | 12 |

### CourierStatus

[`common/v1/common.proto:26`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/common/v1/common.proto#L26)

| Nama | Nomor |
| --- | --- |
| `COURIER_STATUS_UNSPECIFIED` | 0 |
| `COURIER_STATUS_IDLE` | 1 |
| `COURIER_STATUS_ASSIGNED` | 2 |
| `COURIER_STATUS_EN_ROUTE_PICKUP` | 3 |
| `COURIER_STATUS_PICKED_UP` | 4 |
| `COURIER_STATUS_EN_ROUTE_DELIVERY` | 5 |
| `COURIER_STATUS_COMPLETED` | 6 |

### ReturnStatus

[`common/v1/common.proto:36`](https://github.com/WildanFrananda/kinetix-contracts/blob/261756184a30a73cfaa9daf5b0206262fa4896ef/proto/common/v1/common.proto#L36)

| Nama | Nomor |
| --- | --- |
| `RETURN_STATUS_UNSPECIFIED` | 0 |
| `RETURN_STATUS_REQUESTED` | 1 |
| `RETURN_STATUS_PICKED_UP_FROM_BUYER` | 2 |
| `RETURN_STATUS_RECEIVED_AT_WAREHOUSE` | 3 |
| `RETURN_STATUS_INSPECTED` | 4 |
| `RETURN_STATUS_RESOLVED` | 5 |
| `RETURN_STATUS_REJECTED` | 6 |

</div>
