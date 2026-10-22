import type { RestCatalogueKey } from "./rest_catalogue_key.type";
import type { RestToken } from "./rest_token.type";

export type RestAccess = {
  readonly token: RestToken;
  readonly gatewayVerifies: boolean;
  readonly who: RestCatalogueKey;
};
