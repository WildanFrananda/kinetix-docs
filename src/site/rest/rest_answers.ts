import { gatewayAnswers } from "./endpoints/gateway";
import { edgeAnswers } from "./endpoints/edge";
import { identityAnswers } from "./endpoints/identity";
import { catalogAnswers } from "./endpoints/catalog";
import { searchAnswers } from "./endpoints/search";
import { pricingAnswers } from "./endpoints/pricing";
import { orderAnswers } from "./endpoints/order";
import { reviewAnswers } from "./endpoints/review";
import { warehouseAnswers } from "./endpoints/warehouse";
import { matchingAnswers } from "./endpoints/matching";
import { paymentAnswers } from "./endpoints/payment";
import { notaryAnswers } from "./endpoints/notary";
import { notificationAnswers } from "./endpoints/notification";
import type { RestCase } from "../types/rest_case.type";
import type { RestService } from "../types/rest_service.type";

export const restAnswers: Readonly<Record<RestService, readonly RestCase[]>> = {
  gateway: gatewayAnswers,
  edge: edgeAnswers,
  identity: identityAnswers,
  catalog: catalogAnswers,
  search: searchAnswers,
  pricing: pricingAnswers,
  order: orderAnswers,
  review: reviewAnswers,
  warehouse: warehouseAnswers,
  matching: matchingAnswers,
  payment: paymentAnswers,
  notary: notaryAnswers,
  notification: notificationAnswers
};
