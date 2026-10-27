import type { SourceLink } from "../../diagrams/types/source_link.type";
import type { RestAccess } from "./rest_access.type";
import type { RestCase } from "./rest_case.type";
import type { RestCatalogueKey } from "./rest_catalogue_key.type";
import type { RestHost } from "./rest_host.type";
import type { RestRequest } from "./rest_request.type";
import type { RestService } from "./rest_service.type";
import type { RestWebApp } from "./rest_web_app.type";

export type RestSocket = {
  readonly id: string;
  readonly service: RestService;
  readonly host?: RestHost;
  readonly via?: RestWebApp;
  readonly path: string;
  readonly query: string;
  readonly summary: RestCatalogueKey;
  readonly access: RestAccess;
  readonly request: RestRequest;
  readonly cases: readonly RestCase[];
  readonly source: SourceLink;
};
