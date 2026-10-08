import type { SagaLane } from "./saga_lane.type";
import type { SagaRowState } from "./saga_row_state.type";

export type SagaLogRow = {
  readonly id: string;
  readonly step: string;
  readonly reference: string;
  readonly lane: SagaLane;
  readonly state: SagaRowState;
};
