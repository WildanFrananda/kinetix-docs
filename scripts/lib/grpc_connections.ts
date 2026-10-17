import type { MapEdge } from "../../src/diagrams/types/map_edge.type";
import type { MapNode } from "../../src/diagrams/types/map_node.type";
import type { RpcCaller } from "../../src/site/types/rpc_caller.type";
import type { GrpcConnections } from "../types/grpc_connections.type";

export function grpcConnections(nodes: readonly MapNode[], edges: readonly MapEdge[]): GrpcConnections {
  const servers = new Map<string, string[]>();
  const callers = new Map<string, RpcCaller[]>();

  for (const node of nodes) {
    for (const operation of node.serves) {
      servers.set(operation, [...(servers.get(operation) ?? []), node.id]);
    }
  }

  for (const edge of edges.filter((candidate) => candidate.kind === "grpc")) {
    for (const call of edge.calls) {
      callers.set(call.operation, [...(callers.get(call.operation) ?? []), { service: edge.from, source: call.source }]);
    }
  }

  return { servers, callers };
}
