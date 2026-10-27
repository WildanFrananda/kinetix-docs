import type { SourceLink } from "../../diagrams/types/source_link.type";
import type { JsonValue } from "./json_value.type";
import type { RestCatalogueKey } from "./rest_catalogue_key.type";

export type RestSocketReply = {
  readonly status: "ok" | "error";
  readonly response: JsonValue;
  readonly when: RestCatalogueKey;
  readonly source: SourceLink;
};
