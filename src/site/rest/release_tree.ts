import type { RestService } from "../types/rest_service.type";
import { restReleases } from "./rest_releases";

export function releaseTree(service: RestService): string {
  const release = restReleases[service];

  return `https://github.com/WildanFrananda/${release.repository}/tree/${release.commit}`;
}
