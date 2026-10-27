import type { RestHost } from "../types/rest_host.type";
import type { RestWebApp } from "../types/rest_web_app.type";

export const webAppHosts: Readonly<Record<RestWebApp, RestHost>> = {
  "seller-web": "seller",
  backoffice: "backoffice"
};
