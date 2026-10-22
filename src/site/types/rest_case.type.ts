import type { SourceLink } from "../../diagrams/types/source_link.type";
import type { RestCatalogueKey } from "./rest_catalogue_key.type";
import type { RestMessage } from "./rest_message.type";

export type RestCase = RestMessage & {
  readonly status: number;
  readonly when: RestCatalogueKey;
  readonly source: SourceLink;
};
