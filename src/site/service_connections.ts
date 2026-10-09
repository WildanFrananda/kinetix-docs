import { architectureEdges } from "../diagrams/architecture/architecture_edges";
import { architectureNodes } from "../diagrams/architecture/architecture_nodes";
import type { MapNode } from "../diagrams/types/map_node.type";
import type { OutgoingCall } from "./types/outgoing_call.type";
import type { ServedOperation } from "./types/served_operation.type";

export function serviceNode(id: string): MapNode {
  const node = architectureNodes.find((candidate) => candidate.id === id && candidate.kind === "service");

  if (node === undefined) {
    throw new Error(`no service ${id} on the architecture map`);
  }

  return node;
}

export function servedOperations(id: string): readonly ServedOperation[] {
  return serviceNode(id).serves.map((operation) => ({
    operation,
    callers: architectureEdges
      .filter((edge) => edge.to === id)
      .flatMap((edge) =>
        edge.calls
          .filter((call) => call.operation === operation)
          .map((call) => ({ service: edge.from, source: call.source }))
      )
  }));
}

export function outgoingCalls(id: string): readonly OutgoingCall[] {
  return architectureEdges
    .filter((edge) => edge.from === id)
    .flatMap((edge) =>
      edge.calls.map((call) => ({ target: edge.to, kind: edge.kind, operation: call.operation, source: call.source }))
    );
}
