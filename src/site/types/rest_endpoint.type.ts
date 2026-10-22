import type { SourceLink } from "../../diagrams/types/source_link.type";
import type { RestAccess } from "./rest_access.type";
import type { RestCase } from "./rest_case.type";
import type { RestCatalogueKey } from "./rest_catalogue_key.type";
import type { RestHost } from "./rest_host.type";
import type { RestMethod } from "./rest_method.type";
import type { RestRequest } from "./rest_request.type";
import type { RestService } from "./rest_service.type";

export type RestEndpoint = {
  readonly id: string;
  readonly service: RestService;
  readonly method: RestMethod;
  readonly host?: RestHost;
  readonly path: string;
  readonly summary: RestCatalogueKey;
  readonly access: RestAccess;
  readonly request: RestRequest;
  readonly cases: readonly RestCase[];
  readonly source: SourceLink;
};
