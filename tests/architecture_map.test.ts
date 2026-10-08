import { describe, expect, test } from "bun:test";
import { architectureEdges } from "../src/diagrams/architecture/architecture_edges";
import { architectureNodes } from "../src/diagrams/architecture/architecture_nodes";
import { edgeSegment } from "../src/diagrams/architecture/edge_segment";
import { nodeHalfHeight, nodeHalfWidth } from "../src/diagrams/architecture/map_dimensions";
import { catalogueFor } from "../src/diagrams/engine/catalogue_for";
import { localizeMapEdges } from "../src/diagrams/architecture/localize_map_edges";
import { localizeMapNodes } from "../src/diagrams/architecture/localize_map_nodes";
import type { Point } from "../src/diagrams/types/point.type";

const halfWidth = nodeHalfWidth;
const halfHeight = nodeHalfHeight;
const nodeById = new Map(architectureNodes.map((node) => [node.id, node]));

function segmentCrossesBox(start: Point, end: Point, center: Point, padding: number): boolean {
  const minX = center.x - halfWidth - padding;
  const maxX = center.x + halfWidth + padding;
  const minY = center.y - halfHeight - padding;
  const maxY = center.y + halfHeight + padding;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  let enter = 0;
  let leave = 1;

  for (const [p, q] of [
    [-dx, start.x - minX],
    [dx, maxX - start.x],
    [-dy, start.y - minY],
    [dy, maxY - start.y]
  ] as const) {
    if (p === 0) {
      if (q < 0) {
        return false;
      }
    } else {
      const t = q / p;

      if (p < 0) {
        enter = Math.max(enter, t);
      } else {
        leave = Math.min(leave, t);
      }
    }
  }

  return enter <= leave;
}

describe("architecture map data", () => {
  test("every edge connects two nodes that are on the map", () => {
    const dangling = architectureEdges.filter((edge) => !nodeById.has(edge.from) || !nodeById.has(edge.to));

    expect(dangling).toEqual([]);
  });

  test("every gRPC call is served by the service it is drawn to", () => {
    const unserved = architectureEdges
      .filter((edge) => edge.kind === "grpc")
      .flatMap((edge) => edge.calls.map((call) => ({ edge, call })))
      .filter(({ edge, call }) => !nodeById.get(edge.to)?.serves.includes(call.operation))
      .map(({ edge, call }) => `${edge.from} -> ${edge.to} ${call.operation}`);

    expect(unserved).toEqual([]);
  });

  test("every gRPC call links into the caller's own repository at a full commit", () => {
    const misplaced = architectureEdges
      .filter((edge) => edge.kind === "grpc")
      .flatMap((edge) =>
        edge.calls
          .filter((call) => !new RegExp(`/kinetix-${edge.from}-service/blob/[0-9a-f]{40}/`).test(call.source.href))
          .map((call) => `${edge.from} ${call.operation}`)
      );

    expect(misplaced).toEqual([]);
  });

  test("no two boxes overlap", () => {
    const overlapping: string[] = [];

    for (const [index, a] of architectureNodes.entries()) {
      for (const b of architectureNodes.slice(index + 1)) {
        if (Math.abs(a.x - b.x) < halfWidth * 2 + 8 && Math.abs(a.y - b.y) < halfHeight * 2 + 8) {
          overlapping.push(`${a.id} / ${b.id}`);
        }
      }
    }

    expect(overlapping).toEqual([]);
  });

  test("no line passes behind a box it does not connect", () => {
    const crossings: string[] = [];

    for (const edge of architectureEdges) {
      const from = nodeById.get(edge.from);
      const to = nodeById.get(edge.to);

      if (from === undefined || to === undefined) {
        continue;
      }

      const segment = edgeSegment(from, to, halfWidth, halfHeight, 7, 5);

      for (const node of architectureNodes) {
        if (node.id !== edge.from && node.id !== edge.to && segmentCrossesBox(segment.start, segment.end, node, 4)) {
          crossings.push(`${edge.from} -> ${edge.to} crosses ${node.id}`);
        }
      }
    }

    expect(crossings).toEqual([]);
  });

  test("the map localises in both languages without a missing string", () => {
    for (const locale of ["en", "id"] as const) {
      const catalogue = catalogueFor(locale);
      const nodes = localizeMapNodes(architectureNodes, catalogue);
      const edges = localizeMapEdges(architectureEdges, catalogue);

      expect(nodes.every((node) => node.label.length > 0 && node.summary.length > 0)).toBe(true);
      expect(edges.flatMap((edge) => edge.calls).every((call) => call.note === undefined || call.note.length > 0)).toBe(true);
    }
  });
});
