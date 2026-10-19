import { repositorySource } from "../engine/repository_source";
import type { SourceLink } from "../types/source_link.type";

export const catalogBeforeTheFix = "2c14b3ad9d7f8de5df3e6eb584dd4e25a8eca564";

export const catalogWithTheFix = "2a395740eb832a69bfd72c82be54779d421ddef3";

export function catalogSource(commit: string, path: string, from: number, to: number): SourceLink {
  return repositorySource("kinetix-catalog-service", commit, path, from, to);
}
