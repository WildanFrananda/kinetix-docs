import type { OrderStatusName } from "./order_status_name.type";
import type { SagaLogRow } from "./saga_log_row.type";
import type { SagaMessage } from "./saga_message.type";
import type { SagaRunState } from "./saga_run_state.type";

export type SagaDiagramState = {
  readonly saga: SagaRunState;
  readonly order: OrderStatusName;
  readonly rows: readonly SagaLogRow[];
  readonly message: SagaMessage | null;
  readonly touched: string | null;
  readonly http: string | null;
  readonly nextRound: string | null;
};
