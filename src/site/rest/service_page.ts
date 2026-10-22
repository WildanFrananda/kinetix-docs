import type { RestService } from "../types/rest_service.type";

export function servicePage(service: RestService): string {
  return service === "gateway" ? "/architecture/gateway/" : `/services/${service}/`;
}
