import type { RestHost } from "../types/rest_host.type";

export const restHosts: Readonly<Record<RestHost, string>> = {
  api: "api.wildanfrananda.my.id",
  storage: "storage.wildanfrananda.my.id",
  seller: "seller.wildanfrananda.my.id",
  backoffice: "backoffice.wildanfrananda.my.id"
};
