import type { CatalogueKey } from "./catalogue_key.type";
import type { SourceLink } from "./source_link.type";

export type MapCall = {
  readonly operation: string;
  readonly source: SourceLink;
  readonly note?: CatalogueKey;
};
