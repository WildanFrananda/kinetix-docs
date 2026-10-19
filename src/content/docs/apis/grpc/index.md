---
title: "gRPC packages"
description: "Every gRPC package in kinetix-contracts 1.5.0, with the services that serve it on the system map."
editUrl: false
sidebar:
  label: "Overview"
  order: 0
---

<div class="grpc-reference">

Every gRPC service and message in Kinetix is defined once, in [kinetix-contracts](https://github.com/WildanFrananda/kinetix-contracts); no service repository keeps a .proto file of its own. These pages are generated from release [1.5.0](https://www.npmjs.com/package/kinetix-contracts/v/1.5.0) of its npm package, whose .proto files are those of commit [`2617561`](https://github.com/WildanFrananda/kinetix-contracts/tree/261756184a30a73cfaa9daf5b0206262fa4896ef), so nothing below is written by hand. Who serves an RPC and who calls it come from the [system map](/architecture/system-map/): each caller links to the line of code that makes the call, and a dash means the map records none.

| Package | Served by | Services | RPCs | Messages | Enums |
| --- | --- | --- | --- | --- | --- |
| [`catalog.v1`](/apis/grpc/catalog-v1/) | [catalog](/services/catalog/) | 1 | 3 | 8 | 0 |
| [`common.v1`](/apis/grpc/common-v1/) | — | 0 | 0 | 7 | 3 |
| [`fleet.v1`](/apis/grpc/fleet-v1/) | [matching](/services/matching/) | 2 | 4 | 8 | 0 |
| [`fulfillment.v1`](/apis/grpc/fulfillment-v1/) | [matching](/services/matching/), [warehouse](/services/warehouse/) | 4 | 11 | 24 | 0 |
| [`geo.v1`](/apis/grpc/geo-v1/) | [identity](/services/identity/) | 1 | 2 | 4 | 2 |
| [`identity.v1`](/apis/grpc/identity-v1/) | [identity](/services/identity/) | 1 | 6 | 15 | 2 |
| [`notary.v1`](/apis/grpc/notary-v1/) | — | 1 | 1 | 5 | 0 |
| [`notification.v1`](/apis/grpc/notification-v1/) | [notification](/services/notification/) | 1 | 4 | 9 | 4 |
| [`order.v1`](/apis/grpc/order-v1/) | [order](/services/order/) | 2 | 8 | 21 | 3 |
| [`payment.v1`](/apis/grpc/payment-v1/) | [payment](/services/payment/) | 3 | 8 | 15 | 2 |
| [`pricing.v1`](/apis/grpc/pricing-v1/) | [pricing](/services/pricing/) | 1 | 6 | 16 | 2 |
| [`returns.v1`](/apis/grpc/returns-v1/) | — | 1 | 2 | 4 | 0 |
| [`review.v1`](/apis/grpc/review-v1/) | [review](/services/review/) | 1 | 1 | 3 | 1 |
| [`search.v1`](/apis/grpc/search-v1/) | [search](/services/search/) | 1 | 2 | 9 | 1 |
| [`shipping.v1`](/apis/grpc/shipping-v1/) | [matching](/services/matching/) | 1 | 1 | 3 | 0 |

</div>
