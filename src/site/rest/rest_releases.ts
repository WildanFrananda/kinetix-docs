import type { RestRelease } from "../types/rest_release.type";
import type { RestService } from "../types/rest_service.type";

export const restReleases: Readonly<Record<RestService, RestRelease>> = {
  gateway: {
    repository: "kinetix-api-gateway",
    tag: "v1.8.0",
    commit: "ddea9d964f47bf42cd2bbbc5bf05ba47f0dc0349"
  },
  edge: {
    repository: "kinetix-edge-service",
    tag: "v1.3.0",
    commit: "0a52d5805b57a818b16b05848b8333d34115f682"
  },
  identity: {
    repository: "kinetix-identity-service",
    tag: "v1.7.1",
    commit: "14a5d4291f2e4987e2ef774f68dc3888c509617c"
  },
  catalog: {
    repository: "kinetix-catalog-service",
    tag: "v1.2.3",
    commit: "ab557c90cb3230221c5a504def11fa7df26a6f7a"
  },
  search: {
    repository: "kinetix-search-service",
    tag: "v1.2.2",
    commit: "ba054100e0e91fd9640842c0035b514d923f674e"
  },
  pricing: {
    repository: "kinetix-pricing-service",
    tag: "v1.2.2",
    commit: "0ed7db4cd6fb8d40375cab26dd7ac56ebce16a8a"
  },
  order: {
    repository: "kinetix-order-service",
    tag: "v1.5.1",
    commit: "1395062e2b803ead17d09bc8f50622367c7fd2ab"
  },
  review: {
    repository: "kinetix-review-service",
    tag: "v1.4.0",
    commit: "e3ca897c68947dd7ba4a47f04355e5e91da9afa8"
  },
  warehouse: {
    repository: "kinetix-warehouse-service",
    tag: "v1.4.0",
    commit: "07fc2707413de029830bd1364e722a41b8285d81"
  },
  matching: {
    repository: "kinetix-matching-service",
    tag: "v1.5.2",
    commit: "7ef67a0ca1d0e8945f638de8a2f9684e84d06886"
  },
  payment: {
    repository: "kinetix-payment-service",
    tag: "v1.3.0",
    commit: "146892d5305fcafe0e59f1230b6e1c7b5fe7cd27"
  },
  notary: {
    repository: "kinetix-notary-service",
    tag: "v1.10.1",
    commit: "8446176813c354716d77ca6591038633871bcda5"
  },
  notification: {
    repository: "kinetix-notification-service",
    tag: "v1.3.3",
    commit: "510a1ecf16006e28913c30d9861c95af3af226b9"
  }
};
