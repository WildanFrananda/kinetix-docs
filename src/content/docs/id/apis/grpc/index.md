---
title: "Paket gRPC"
description: "Setiap paket gRPC di kinetix-contracts 1.7.0, beserta service yang melayaninya menurut peta sistem."
editUrl: false
sidebar:
  label: "Ikhtisar"
  order: 0
sourceHash: "f3524d696b1e"
---

<div class="grpc-reference">

Setiap service dan message gRPC di Kinetix didefinisikan sekali, di [kinetix-contracts](https://github.com/WildanFrananda/kinetix-contracts); tidak ada repository service yang menyimpan file .proto sendiri. Halaman-halaman ini dibuat otomatis dari rilis [1.7.0](https://www.npmjs.com/package/kinetix-contracts/v/1.7.0) paket npm-nya, yang file .proto-nya adalah milik commit [`26984a9`](https://github.com/WildanFrananda/kinetix-contracts/tree/26984a992109936bbd3ce775a509eca4a028fe63), jadi tidak ada isi di bawah yang ditulis tangan. Siapa yang melayani sebuah RPC dan siapa yang memanggilnya diambil dari [peta sistem](/id/architecture/system-map/): setiap pemanggil menautkan ke baris kode yang melakukan panggilan itu, dan tanda pisah berarti peta tidak mencatat apa pun.

| Paket | Dilayani oleh | Service | RPC | Message | Enum |
| --- | --- | --- | --- | --- | --- |
| [`catalog.v1`](/id/apis/grpc/catalog-v1/) | [catalog](/id/services/catalog/) | 1 | 3 | 8 | 0 |
| [`common.v1`](/id/apis/grpc/common-v1/) | — | 0 | 0 | 7 | 3 |
| [`fleet.v1`](/id/apis/grpc/fleet-v1/) | [matching](/id/services/matching/) | 2 | 4 | 8 | 0 |
| [`fulfillment.v1`](/id/apis/grpc/fulfillment-v1/) | [matching](/id/services/matching/), [warehouse](/id/services/warehouse/) | 4 | 11 | 24 | 0 |
| [`geo.v1`](/id/apis/grpc/geo-v1/) | [identity](/id/services/identity/) | 1 | 2 | 4 | 2 |
| [`identity.v1`](/id/apis/grpc/identity-v1/) | [identity](/id/services/identity/) | 1 | 6 | 15 | 2 |
| [`notary.v1`](/id/apis/grpc/notary-v1/) | — | 1 | 1 | 6 | 0 |
| [`notification.v1`](/id/apis/grpc/notification-v1/) | [notification](/id/services/notification/) | 1 | 4 | 9 | 4 |
| [`order.v1`](/id/apis/grpc/order-v1/) | [order](/id/services/order/) | 2 | 8 | 21 | 3 |
| [`payment.v1`](/id/apis/grpc/payment-v1/) | [payment](/id/services/payment/) | 3 | 8 | 15 | 2 |
| [`pricing.v1`](/id/apis/grpc/pricing-v1/) | [pricing](/id/services/pricing/) | 1 | 6 | 16 | 2 |
| [`returns.v1`](/id/apis/grpc/returns-v1/) | — | 1 | 2 | 4 | 0 |
| [`review.v1`](/id/apis/grpc/review-v1/) | [review](/id/services/review/) | 1 | 1 | 3 | 1 |
| [`search.v1`](/id/apis/grpc/search-v1/) | [search](/id/services/search/) | 1 | 2 | 9 | 1 |
| [`shipping.v1`](/id/apis/grpc/shipping-v1/) | [matching](/id/services/matching/) | 1 | 1 | 3 | 0 |

</div>
