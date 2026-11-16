import type { SourceLink } from "../../diagrams/types/source_link.type";
import type { RestCatalogueKey } from "./rest_catalogue_key.type";
import type { RestSocketFrame } from "./rest_socket_frame.type";

export type RestSocketReply = {
  readonly status: "ok" | "error";
  readonly frame: RestSocketFrame;
  readonly when: RestCatalogueKey;
  readonly source: SourceLink;
};
