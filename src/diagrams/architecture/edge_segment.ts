import type { Point } from "../types/point.type";
import type { Segment } from "../types/segment.type";
import { boxBoundaryPoint } from "./box_boundary_point";

export function edgeSegment(
  from: Point,
  to: Point,
  halfWidth: number,
  halfHeight: number,
  offset: number,
  gap: number
): Segment {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  const normal = length === 0 ? { x: 0, y: 0 } : { x: -(to.y - from.y) / length, y: (to.x - from.x) / length };
  const shiftedFrom = { x: from.x + normal.x * offset, y: from.y + normal.y * offset };
  const shiftedTo = { x: to.x + normal.x * offset, y: to.y + normal.y * offset };
  const start = boxBoundaryPoint(shiftedFrom, shiftedTo, halfWidth + gap, halfHeight + gap);
  const end = boxBoundaryPoint(shiftedTo, shiftedFrom, halfWidth + gap, halfHeight + gap);

  return { start, end };
}
