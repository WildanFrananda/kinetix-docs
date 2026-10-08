import type { LaneState } from "./lane_state.type";
import type { StockRaceLane } from "./stock_race_lane.type";

export type StockRaceState = {
  readonly quantity: number;
  readonly reserved: number;
  readonly pending: number | null;
  readonly lockHolder: StockRaceLane | null;
  readonly lanes: Readonly<Record<StockRaceLane, LaneState>>;
};
