import type { MapEdgeKind } from "../../diagrams/types/map_edge_kind.type";
import type { SourceLink } from "../../diagrams/types/source_link.type";

export type OutgoingCall = {
  readonly target: string;
  readonly kind: MapEdgeKind;
  readonly operation: string;
  readonly source: SourceLink;
};
