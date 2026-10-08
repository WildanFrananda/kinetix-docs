import type { ArchitectureMapLabels } from "../types/architecture_map_labels.type";
import type { Catalogue } from "../types/catalogue.type";

export function architectureMapLabels(catalogue: Catalogue): ArchitectureMapLabels {
  return {
    hint: catalogue["map.hint"],
    clear: catalogue["map.clear"],
    kinds: {
      client: catalogue["map.kind.client"],
      gateway: catalogue["map.kind.gateway"],
      service: catalogue["map.kind.service"],
      external: catalogue["map.kind.external"]
    },
    legend: {
      grpc: catalogue["map.legend.grpc"],
      http: catalogue["map.legend.http"],
      external: catalogue["map.legend.external"],
      routed: catalogue["map.legend.routed"]
    },
    serves: catalogue["map.serves"],
    calls: catalogue["map.calls"],
    calledBy: catalogue["map.calledBy"],
    routes: catalogue["map.routes"],
    data: catalogue["map.data"],
    nothingCalls: catalogue["map.nothingCalls"],
    notDeployed: catalogue["map.notDeployed"],
    repository: catalogue["map.repository"]
  };
}
