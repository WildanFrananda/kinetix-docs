---
title: "notification.v1"
description: "Paket gRPC notification.v1 di kinetix-contracts 1.7.0: service, message, dan enum-nya."
editUrl: false
sourceHash: "e441c00bafc5"
---

<div class="grpc-reference">

Dibuat otomatis dari rilis [1.7.0](https://www.npmjs.com/package/kinetix-contracts/v/1.7.0) kinetix-contracts: [`notification/v1/notification.proto`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notification/v1/notification.proto). Server dan pemanggil diambil dari [peta sistem](/id/architecture/system-map/); tanda pisah berarti peta tidak mencatat apa pun.

## Service

### NotificationService

[`notification/v1/notification.proto:7`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notification/v1/notification.proto#L7)

| RPC | Request → response | Dilayani oleh | Dipanggil oleh |
| --- | --- | --- | --- |
| [`Notify`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notification/v1/notification.proto#L8) | [`NotifyRequest`](#notifyrequest) → [`NotifyResponse`](#notifyresponse) | [notification](/id/services/notification/) | [notary](https://github.com/WildanFrananda/kinetix-notary-service/blob/9eaeb1c040e1e2518eca8417d787452ccacdaa74/internal/notification/notifier.go#L75) |
| [`GetDelivery`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notification/v1/notification.proto#L9) | [`GetDeliveryRequest`](#getdeliveryrequest) → [`GetDeliveryResponse`](#getdeliveryresponse) | [notification](/id/services/notification/) | — |
| [`RegisterDevice`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notification/v1/notification.proto#L10) | [`RegisterDeviceRequest`](#registerdevicerequest) → [`RegisterDeviceResponse`](#registerdeviceresponse) | [notification](/id/services/notification/) | — |
| [`ForgetDevice`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notification/v1/notification.proto#L11) | [`ForgetDeviceRequest`](#forgetdevicerequest) → [`ForgetDeviceResponse`](#forgetdeviceresponse) | [notification](/id/services/notification/) | — |

## Message

### RegisterDeviceRequest

[`notification/v1/notification.proto:20`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notification/v1/notification.proto#L20)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `principal_id` | 1 | `string` |
| `device_token` | 2 | `string` |
| `platform` | 3 | [`DevicePlatform`](#deviceplatform) |

### RegisterDeviceResponse

[`notification/v1/notification.proto:26`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notification/v1/notification.proto#L26)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `registered` | 1 | `bool` |
| `already_registered` | 2 | `bool` |
| `error` | 3 | [`common.v1.ErrorDetail`](/id/apis/grpc/common-v1/#errordetail) |

### ForgetDeviceRequest

[`notification/v1/notification.proto:32`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notification/v1/notification.proto#L32)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `device_token` | 1 | `string` |

### ForgetDeviceResponse

[`notification/v1/notification.proto:36`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notification/v1/notification.proto#L36)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `forgotten` | 1 | `bool` |
| `error` | 2 | [`common.v1.ErrorDetail`](/id/apis/grpc/common-v1/#errordetail) |

### NotifyRequest

[`notification/v1/notification.proto:66`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notification/v1/notification.proto#L66)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `recipient_principal_id` | 1 | `string` |
| `template` | 2 | [`Template`](#template) |
| `params` | 3 | `map<string, string>` |
| `channels` | 4 | `repeated` [`Channel`](#channel) |
| `idempotency_key` | 5 | [`common.v1.IdempotencyKey`](/id/apis/grpc/common-v1/#idempotencykey) |

### NotifyResponse

[`notification/v1/notification.proto:74`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notification/v1/notification.proto#L74)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `accepted` | 1 | `bool` |
| `notification_id` | 2 | `string` |
| `already_accepted` | 3 | `bool` |
| `error` | 4 | [`common.v1.ErrorDetail`](/id/apis/grpc/common-v1/#errordetail) |

### GetDeliveryRequest

[`notification/v1/notification.proto:81`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notification/v1/notification.proto#L81)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `notification_id` | 1 | `string` |

### DeliveryAttempt

[`notification/v1/notification.proto:85`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notification/v1/notification.proto#L85)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `channel` | 1 | [`Channel`](#channel) |
| `status` | 2 | [`DeliveryStatus`](#deliverystatus) |
| `attempts` | 3 | `int32` |
| `last_error` | 4 | `string` |
| `last_attempt_at` | 5 | `string` |

### GetDeliveryResponse

[`notification/v1/notification.proto:93`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notification/v1/notification.proto#L93)

| Field | Nomor | Tipe |
| --- | --- | --- |
| `found` | 1 | `bool` |
| `notification_id` | 2 | `string` |
| `recipient_principal_id` | 3 | `string` |
| `template` | 4 | [`Template`](#template) |
| `attempts` | 5 | `repeated` [`DeliveryAttempt`](#deliveryattempt) |

## Enum

### DevicePlatform

[`notification/v1/notification.proto:14`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notification/v1/notification.proto#L14)

| Nama | Nomor |
| --- | --- |
| `DEVICE_PLATFORM_UNSPECIFIED` | 0 |
| `DEVICE_PLATFORM_ANDROID` | 1 |
| `DEVICE_PLATFORM_IOS` | 2 |

### Channel

[`notification/v1/notification.proto:41`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notification/v1/notification.proto#L41)

| Nama | Nomor |
| --- | --- |
| `CHANNEL_UNSPECIFIED` | 0 |
| `CHANNEL_PUSH` | 1 |
| `CHANNEL_EMAIL` | 2 |

### DeliveryStatus

[`notification/v1/notification.proto:47`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notification/v1/notification.proto#L47)

| Nama | Nomor |
| --- | --- |
| `DELIVERY_STATUS_UNSPECIFIED` | 0 |
| `DELIVERY_STATUS_PENDING` | 1 |
| `DELIVERY_STATUS_SENT` | 2 |
| `DELIVERY_STATUS_FAILED` | 3 |
| `DELIVERY_STATUS_UNREACHABLE` | 4 |

### Template

[`notification/v1/notification.proto:55`](https://github.com/WildanFrananda/kinetix-contracts/blob/26984a992109936bbd3ce775a509eca4a028fe63/proto/notification/v1/notification.proto#L55)

| Nama | Nomor |
| --- | --- |
| `TEMPLATE_UNSPECIFIED` | 0 |
| `TEMPLATE_ORDER_PAID` | 1 |
| `TEMPLATE_ORDER_PACKED` | 2 |
| `TEMPLATE_COURIER_ASSIGNED` | 3 |
| `TEMPLATE_ORDER_DELIVERED` | 4 |
| `TEMPLATE_COURIER_OFFER` | 5 |
| `TEMPLATE_RETURN_OPENED` | 6 |
| `TEMPLATE_LIABILITY_STATEMENT` | 7 |

</div>
