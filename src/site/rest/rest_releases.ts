import type { RestRelease } from "../types/rest_release.type";
import type { RestService } from "../types/rest_service.type";

export const restReleases: Readonly<Record<RestService, RestRelease>> = {
  gateway: {
    repository: "kinetix-api-gateway",
    tag: "v1.4.0",
    commit: "2b38bcc9a795dac8a6a3088b6d67f297fcfa9f5c"
  },
  identity: {
    repository: "kinetix-identity-service",
    tag: "v1.2.0",
    commit: "4b8eb5e5f70f05a8a5f9b6bd0d04b2bf88cc8b7f"
  },
  catalog: {
    repository: "kinetix-catalog-service",
    tag: "v1.1.0",
    commit: "95cabdb917607026a290b7d24e91b7121a0631d3"
  },
  search: {
    repository: "kinetix-search-service",
    tag: "v1.2.0",
    commit: "bb71585106395dbdcaf4dbf8dfabc62c2266498a"
  },
  pricing: {
    repository: "kinetix-pricing-service",
    tag: "v1.1.0",
    commit: "d3020a29ca7ac6fcc2d5a7e472a6b234cc783d0d"
  },
  order: {
    repository: "kinetix-order-service",
    tag: "v1.3.0",
    commit: "a9473a17c546faa7e41be843343b0bd882435964"
  },
  review: {
    repository: "kinetix-review-service",
    tag: "v1.2.2",
    commit: "173ec20a938bc56ec4df193f5e763dae9901d0a9"
  },
  warehouse: {
    repository: "kinetix-warehouse-service",
    tag: "v1.1.0",
    commit: "a0eafe367f060d4f99aec06a07017d86b8bd046f"
  },
  matching: {
    repository: "kinetix-matching-service",
    tag: "v1.4.0",
    commit: "676e43e0e37879210560fcf7a4dd2f869cae98a5"
  },
  payment: {
    repository: "kinetix-payment-service",
    tag: "v1.2.0",
    commit: "9bb08c58f0dd13d8ee3fe2a00e17239632286096"
  },
  notary: {
    repository: "kinetix-notary-service",
    tag: "v1.9.0",
    commit: "9fd693869d307376552916d84443899272f1d775"
  },
  notification: {
    repository: "kinetix-notification-service",
    tag: "v1.2.0",
    commit: "8060ed676dcd025f8e7da38dfac8d1a8bbe67cac"
  }
};
