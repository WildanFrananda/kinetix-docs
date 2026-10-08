import type { Catalogue } from "../types/catalogue.type";
import type { LocalizedMapEdge } from "../types/localized_map_edge.type";
import type { MapEdge } from "../types/map_edge.type";

export function localizeMapEdges(edges: readonly MapEdge[], catalogue: Catalogue): LocalizedMapEdge[] {
  return edges.map((edge) => ({
    from: edge.from,
    to: edge.to,
    kind: edge.kind,
    calls: edge.calls.map((call) => ({
      operation: call.operation,
      source: call.source,
      ...(call.note === undefined ? {} : { note: catalogue[call.note] })
    }))
  }));
}
