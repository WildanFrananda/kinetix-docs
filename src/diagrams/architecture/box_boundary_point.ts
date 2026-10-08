import type { Point } from "../types/point.type";

export function boxBoundaryPoint(center: Point, toward: Point, halfWidth: number, halfHeight: number): Point {
  const dx = toward.x - center.x;
  const dy = toward.y - center.y;

  if (dx === 0 && dy === 0) {
    return center;
  }

  const scale = Math.min(
    dx === 0 ? Number.POSITIVE_INFINITY : halfWidth / Math.abs(dx),
    dy === 0 ? Number.POSITIVE_INFINITY : halfHeight / Math.abs(dy)
  );

  return { x: center.x + dx * scale, y: center.y + dy * scale };
}
