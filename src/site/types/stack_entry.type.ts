import type { CatalogueKey } from "../../diagrams/types/catalogue_key.type";
import type { StackLayer } from "./stack_layer.type";

export type StackEntry = {
  readonly name: string;
  readonly summary: CatalogueKey;
  readonly repository?: string;
  readonly layers: readonly StackLayer[];
};
