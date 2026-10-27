import type { RestService } from "../types/rest_service.type";

export function servicePage(service: RestService): string | undefined {
  if (service === "edge") {
    return undefined;
  }

  return service === "gateway" ? "/architecture/gateway/" : `/services/${service}/`;
}
