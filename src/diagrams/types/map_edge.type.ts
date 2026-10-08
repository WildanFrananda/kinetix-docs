import type { MapCall } from "./map_call.type";
import type { MapEdgeKind } from "./map_edge_kind.type";

export type MapEdge = {
  readonly from: string;
  readonly to: string;
  readonly kind: MapEdgeKind;
  readonly calls: readonly MapCall[];
};
