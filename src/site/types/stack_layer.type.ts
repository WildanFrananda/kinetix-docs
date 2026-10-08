import type { CatalogueKey } from "../../diagrams/types/catalogue_key.type";
import type { Tech } from "./tech.type";

export type StackLayer = {
  readonly role: CatalogueKey;
  readonly techs: readonly Tech[];
};
