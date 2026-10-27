import type { RestRelease } from "../types/rest_release.type";
import type { RestService } from "../types/rest_service.type";

export const restReleases: Readonly<Record<RestService, RestRelease>> = {
  gateway: {
    repository: "kinetix-api-gateway",
    tag: "v1.5.1",
    commit: "6747ebc0ae2b8d5203539aab21f428f4b03784f7"
  },
  edge: {
    repository: "kinetix-edge-service",
    tag: "v1.0.0",
    commit: "89c12d3cdc0aa4aee974d4b32490128b10385656"
  },
  identity: {
    repository: "kinetix-identity-service",
    tag: "v1.3.1",
    commit: "9c54cf64d0a2b4d8315c7573be0992cb9b5d687d"
  },
  catalog: {
    repository: "kinetix-catalog-service",
    tag: "v1.2.2",
    commit: "1348c6ea4f80448bba710e83b20c5551d10fa3e0"
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
    tag: "v1.4.3",
    commit: "97118d2d78819ef98b74a21efb4ebc4c8247e4e8"
  },
  review: {
    repository: "kinetix-review-service",
    tag: "v1.3.1",
    commit: "531cdb5506d80532bf11bcbb1e84c5bab5115709"
  },
  warehouse: {
    repository: "kinetix-warehouse-service",
    tag: "v1.2.1",
    commit: "cc5ff5ff80b6342e2cafdb262f931e2e03dedf50"
  },
  matching: {
    repository: "kinetix-matching-service",
    tag: "v1.5.1",
    commit: "93ae2712c382e6dc74e7cf2501b006ccf90c7817"
  },
  payment: {
    repository: "kinetix-payment-service",
    tag: "v1.2.3",
    commit: "ae1f3e07d4849f51bbc41b8cb5dd356dcfa5d793"
  },
  notary: {
    repository: "kinetix-notary-service",
    tag: "v1.10.1",
    commit: "8446176813c354716d77ca6591038633871bcda5"
  },
  notification: {
    repository: "kinetix-notification-service",
    tag: "v1.3.2",
    commit: "4ad78ee085f9cc6b1bd055cf8e90fbefef97ff5e"
  }
};
