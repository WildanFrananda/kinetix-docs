import type { RestCatalogueKey } from "./rest_catalogue_key.type";
import type { RestFieldLocation } from "./rest_field_location.type";

export type RestField = {
  readonly name: string;
  readonly in: RestFieldLocation;
  readonly type: string;
  readonly required: boolean;
  readonly rule: RestCatalogueKey;
};
