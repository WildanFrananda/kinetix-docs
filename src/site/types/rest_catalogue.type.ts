import type { RestCatalogueKey } from "./rest_catalogue_key.type";

export type RestCatalogue = Readonly<Record<RestCatalogueKey, string>>;
