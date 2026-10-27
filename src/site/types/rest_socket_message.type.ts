import type { SourceLink } from "../../diagrams/types/source_link.type";
import type { RestCatalogueKey } from "./rest_catalogue_key.type";
import type { RestSocketDirection } from "./rest_socket_direction.type";
import type { RestSocketFrame } from "./rest_socket_frame.type";
import type { RestSocketReply } from "./rest_socket_reply.type";

export type RestSocketMessage = {
  readonly id: string;
  readonly socket: string;
  readonly direction: RestSocketDirection;
  readonly topic: string;
  readonly summary: RestCatalogueKey;
  readonly frame: RestSocketFrame;
  readonly replies: readonly RestSocketReply[];
  readonly source: SourceLink;
};
