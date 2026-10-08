import type { LogoName } from "../../site/types/logo_name.type";
import type { CatalogueKey } from "./catalogue_key.type";
import type { MapNodeKind } from "./map_node_kind.type";

export type MapNode = {
  readonly id: string;
  readonly kind: MapNodeKind;
  readonly name: string;
  readonly title?: CatalogueKey;
  readonly summary: CatalogueKey;
  readonly x: number;
  readonly y: number;
  readonly logo?: LogoName;
  readonly repository?: string;
  readonly serves: readonly string[];
  readonly routes: readonly string[];
  readonly stores: readonly string[];
  readonly deployed: boolean;
};
