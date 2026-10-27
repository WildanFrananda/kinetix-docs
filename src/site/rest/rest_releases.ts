import type { RestRelease } from "../types/rest_release.type";
import type { RestService } from "../types/rest_service.type";

export const restReleases: Readonly<Record<RestService, RestRelease>> = {
  gateway: {
    repository: "kinetix-api-gateway",
    tag: "v1.6.0",
    commit: "45fea5cd0e07d5bdbe372b63fb0bdac773f64c5d"
  },
  edge: {
    repository: "kinetix-edge-service",
    tag: "v1.1.0",
    commit: "cddf1d4069472c90eb5ccc9f22b287be98417d12"
  },
  identity: {
    repository: "kinetix-identity-service",
    tag: "v1.4.0",
    commit: "e1540249863f47b42f5409abdc396c06aadbb1e7"
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
    tag: "v1.3.0",
    commit: "ec17794d7551b0ccacc0ada5c31747f8d44526e3"
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
