import { describe, expect, test } from "bun:test";
import { boxBoundaryPoint } from "../src/diagrams/architecture/box_boundary_point";
import { edgeSegment } from "../src/diagrams/architecture/edge_segment";
import type { Point } from "../src/diagrams/types/point.type";

function expectPoint(actual: Point, expected: Point): void {
  expect(actual.x).toBeCloseTo(expected.x, 9);
  expect(actual.y).toBeCloseTo(expected.y, 9);
}

describe("boxBoundaryPoint", () => {
  test("a horizontal line leaves the box through its side", () => {
    expectPoint(boxBoundaryPoint({ x: 0, y: 0 }, { x: 100, y: 0 }, 75, 28), { x: 75, y: 0 });
  });

  test("a vertical line leaves the box through its top", () => {
    expectPoint(boxBoundaryPoint({ x: 0, y: 0 }, { x: 0, y: -100 }, 75, 28), { x: 0, y: -28 });
  });

  test("a steep diagonal leaves through the top or bottom, not the side", () => {
    expectPoint(boxBoundaryPoint({ x: 0, y: 0 }, { x: 50, y: 100 }, 75, 28), { x: 14, y: 28 });
  });

  test("a point on top of the centre is returned unchanged", () => {
    expectPoint(boxBoundaryPoint({ x: 5, y: 5 }, { x: 5, y: 5 }, 75, 28), { x: 5, y: 5 });
  });
});

describe("edgeSegment", () => {
  test("ends at both box borders plus the gap", () => {
    const segment = edgeSegment({ x: 0, y: 0 }, { x: 300, y: 0 }, 75, 28, 0, 4);

    expectPoint(segment.start, { x: 79, y: 0 });
    expectPoint(segment.end, { x: 221, y: 0 });
  });

  test("the two directions of a pair are offset to opposite sides", () => {
    const there = edgeSegment({ x: 0, y: 0 }, { x: 300, y: 0 }, 75, 28, 6, 4);
    const back = edgeSegment({ x: 300, y: 0 }, { x: 0, y: 0 }, 75, 28, 6, 4);

    expect(there.start.y).toBeCloseTo(6, 9);
    expect(back.start.y).toBeCloseTo(-6, 9);
  });
});
