import type { LaneStatus } from "./lane_status.type";
import type { StockRaceLane } from "./stock_race_lane.type";

export type StockRaceLabels = {
  readonly lanes: Readonly<Record<StockRaceLane, string>>;
  readonly statuses: Readonly<Record<LaneStatus, string>>;
  readonly row: string;
  readonly onShelf: string;
  readonly reserved: string;
  readonly uncommitted: string;
  readonly available: string;
  readonly lockFree: string;
  readonly lockHeld: string;
  readonly read: string;
  readonly nothingRead: string;
  readonly holds: string;
  readonly promised: string;
  readonly oversold: string;
  readonly units: string;
};
