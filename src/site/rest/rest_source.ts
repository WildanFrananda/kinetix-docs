import { repositorySource } from "../../diagrams/engine/repository_source";
import type { SourceLink } from "../../diagrams/types/source_link.type";
import type { RestService } from "../types/rest_service.type";
import { restReleases } from "./rest_releases";

export function restSource(service: RestService, path: string, from: number, to: number): SourceLink {
  const release = restReleases[service];

  return repositorySource(release.repository, release.commit, path, from, to);
}
