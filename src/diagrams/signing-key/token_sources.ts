import { repositorySource } from "../engine/repository_source";
import type { SourceLink } from "../types/source_link.type";

export const identityCommit = "40b7e4f76a3f151100f1d48dd9253126ee16ddcb";

export const orderCommit = "0c3698ed729ac161bef54c469f46cebf89acb6c6";

export function identitySource(path: string, from: number, to: number): SourceLink {
  return repositorySource("kinetix-identity-service", identityCommit, path, from, to);
}

export function orderSource(path: string, from: number, to: number): SourceLink {
  return repositorySource("kinetix-order-service", orderCommit, path, from, to);
}
