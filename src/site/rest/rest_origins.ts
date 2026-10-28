import type { RestHost } from "../types/rest_host.type";

export const restOrigins: Readonly<Record<RestHost, string>> = {
  api: "https://api.wildanfrananda.my.id",
  storage: "https://storage.wildanfrananda.my.id",
  seller: "https://seller.wildanfrananda.my.id",
  backoffice: "<backoffice origin>"
};
