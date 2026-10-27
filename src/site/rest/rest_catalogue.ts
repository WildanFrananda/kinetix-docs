import commonEnglish from "../../catalogue/rest/en/common.json";
import gatewayEnglish from "../../catalogue/rest/en/gateway.json";
import edgeEnglish from "../../catalogue/rest/en/edge.json";
import identityEnglish from "../../catalogue/rest/en/identity.json";
import catalogEnglish from "../../catalogue/rest/en/catalog.json";
import searchEnglish from "../../catalogue/rest/en/search.json";
import pricingEnglish from "../../catalogue/rest/en/pricing.json";
import orderEnglish from "../../catalogue/rest/en/order.json";
import reviewEnglish from "../../catalogue/rest/en/review.json";
import warehouseEnglish from "../../catalogue/rest/en/warehouse.json";
import matchingEnglish from "../../catalogue/rest/en/matching.json";
import paymentEnglish from "../../catalogue/rest/en/payment.json";
import notaryEnglish from "../../catalogue/rest/en/notary.json";
import notificationEnglish from "../../catalogue/rest/en/notification.json";
import commonIndonesian from "../../catalogue/rest/id/common.json";
import gatewayIndonesian from "../../catalogue/rest/id/gateway.json";
import edgeIndonesian from "../../catalogue/rest/id/edge.json";
import identityIndonesian from "../../catalogue/rest/id/identity.json";
import catalogIndonesian from "../../catalogue/rest/id/catalog.json";
import searchIndonesian from "../../catalogue/rest/id/search.json";
import pricingIndonesian from "../../catalogue/rest/id/pricing.json";
import orderIndonesian from "../../catalogue/rest/id/order.json";
import reviewIndonesian from "../../catalogue/rest/id/review.json";
import warehouseIndonesian from "../../catalogue/rest/id/warehouse.json";
import matchingIndonesian from "../../catalogue/rest/id/matching.json";
import paymentIndonesian from "../../catalogue/rest/id/payment.json";
import notaryIndonesian from "../../catalogue/rest/id/notary.json";
import notificationIndonesian from "../../catalogue/rest/id/notification.json";
import type { Locale } from "../../diagrams/types/locale.type";
import type { RestCatalogue } from "../types/rest_catalogue.type";

export const restEnglish = {
  ...commonEnglish,
  ...gatewayEnglish,
  ...edgeEnglish,
  ...identityEnglish,
  ...catalogEnglish,
  ...searchEnglish,
  ...pricingEnglish,
  ...orderEnglish,
  ...reviewEnglish,
  ...warehouseEnglish,
  ...matchingEnglish,
  ...paymentEnglish,
  ...notaryEnglish,
  ...notificationEnglish
};

const restIndonesian = {
  ...commonIndonesian,
  ...gatewayIndonesian,
  ...edgeIndonesian,
  ...identityIndonesian,
  ...catalogIndonesian,
  ...searchIndonesian,
  ...pricingIndonesian,
  ...orderIndonesian,
  ...reviewIndonesian,
  ...warehouseIndonesian,
  ...matchingIndonesian,
  ...paymentIndonesian,
  ...notaryIndonesian,
  ...notificationIndonesian
};

const catalogues = {
  en: restEnglish,
  id: restIndonesian
} satisfies Record<Locale, RestCatalogue>;

export function restCatalogueFor(locale: Locale): RestCatalogue {
  return catalogues[locale];
}
