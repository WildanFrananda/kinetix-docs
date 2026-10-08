import type { LaneStatus } from "./lane_status.type";

export type LaneState = {
  readonly status: LaneStatus;
  readonly read: number | null;
  readonly holds: number;
};
