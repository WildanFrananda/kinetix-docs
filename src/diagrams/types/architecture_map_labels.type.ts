import type { MapEdgeKind } from "./map_edge_kind.type";
import type { MapNodeKind } from "./map_node_kind.type";

export type ArchitectureMapLabels = {
  readonly hint: string;
  readonly clear: string;
  readonly kinds: Readonly<Record<MapNodeKind, string>>;
  readonly legend: Readonly<Record<MapEdgeKind | "routed", string>>;
  readonly serves: string;
  readonly calls: string;
  readonly calledBy: string;
  readonly routes: string;
  readonly data: string;
  readonly nothingCalls: string;
  readonly notDeployed: string;
  readonly repository: string;
};
