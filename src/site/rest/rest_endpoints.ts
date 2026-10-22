import { gatewayEndpoints } from "./endpoints/gateway";
import { identityEndpoints } from "./endpoints/identity";
import { catalogEndpoints } from "./endpoints/catalog";
import { searchEndpoints } from "./endpoints/search";
import { pricingEndpoints } from "./endpoints/pricing";
import { orderEndpoints } from "./endpoints/order";
import { reviewEndpoints } from "./endpoints/review";
import { warehouseEndpoints } from "./endpoints/warehouse";
import { matchingEndpoints } from "./endpoints/matching";
import { paymentEndpoints } from "./endpoints/payment";
import { notaryEndpoints } from "./endpoints/notary";
import { notificationEndpoints } from "./endpoints/notification";
import type { RestEndpoint } from "../types/rest_endpoint.type";

export const restEndpoints: readonly RestEndpoint[] = [
  ...gatewayEndpoints,
  ...identityEndpoints,
  ...catalogEndpoints,
  ...searchEndpoints,
  ...pricingEndpoints,
  ...orderEndpoints,
  ...reviewEndpoints,
  ...warehouseEndpoints,
  ...matchingEndpoints,
  ...paymentEndpoints,
  ...notaryEndpoints,
  ...notificationEndpoints
];

export function restEndpoint(id: string): RestEndpoint {
  const endpoint = restEndpoints.find((candidate) => candidate.id === id);

  if (endpoint === undefined) {
    throw new Error(`no REST endpoint "${id}"`);
  }

  return endpoint;
}
