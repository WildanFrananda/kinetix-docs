import type { MapNodeKind } from "./map_node_kind.type";

export type LocalizedMapNode = {
  readonly id: string;
  readonly kind: MapNodeKind;
  readonly label: string;
  readonly summary: string;
  readonly x: number;
  readonly y: number;
  readonly logoUrl?: string;
  readonly repository?: string;
  readonly serves: readonly string[];
  readonly routes: readonly string[];
  readonly stores: readonly string[];
  readonly deployed: boolean;
};
