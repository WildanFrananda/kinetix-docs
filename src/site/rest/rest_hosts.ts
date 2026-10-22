import type { RestHost } from "../types/rest_host.type";

export const restHosts: Readonly<Record<RestHost, string>> = {
  api: "api.kinetix.example",
  storage: "storage.kinetix.example"
};
