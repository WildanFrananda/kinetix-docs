import type { CatalogueKey } from "../../diagrams/types/catalogue_key.type";
import type { Tech } from "./tech.type";

export type Service = {
  readonly name: string;
  readonly repository: string;
  readonly owns: CatalogueKey;
  readonly language: Tech;
  readonly framework: Tech;
};
