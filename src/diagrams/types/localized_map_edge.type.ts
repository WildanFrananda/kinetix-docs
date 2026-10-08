import type { LocalizedMapCall } from "./localized_map_call.type";
import type { MapEdgeKind } from "./map_edge_kind.type";

export type LocalizedMapEdge = {
  readonly from: string;
  readonly to: string;
  readonly kind: MapEdgeKind;
  readonly calls: readonly LocalizedMapCall[];
};
