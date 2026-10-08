import type { CatalogueKey } from "./catalogue_key.type";

export type Catalogue = Readonly<Record<CatalogueKey, string>>;
