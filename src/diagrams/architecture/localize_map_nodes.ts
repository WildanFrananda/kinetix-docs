import { logos } from "../../site/logos";
import type { Catalogue } from "../types/catalogue.type";
import type { LocalizedMapNode } from "../types/localized_map_node.type";
import type { MapNode } from "../types/map_node.type";

export function localizeMapNodes(nodes: readonly MapNode[], catalogue: Catalogue): LocalizedMapNode[] {
  return nodes.map((node) => ({
    id: node.id,
    kind: node.kind,
    label: node.title === undefined ? node.name : catalogue[node.title],
    summary: catalogue[node.summary],
    x: node.x,
    y: node.y,
    ...(node.logo === undefined ? {} : { logoUrl: logos[node.logo] }),
    ...(node.repository === undefined ? {} : { repository: node.repository }),
    serves: node.serves,
    routes: node.routes,
    stores: node.stores,
    deployed: node.deployed
  }));
}
