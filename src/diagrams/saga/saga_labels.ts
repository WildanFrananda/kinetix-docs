import type { Catalogue } from "../types/catalogue.type";
import type { SagaLabels } from "../types/saga_labels.type";

export function sagaLabels(catalogue: Catalogue): SagaLabels {
  return {
    saga: catalogue["saga.label.saga"],
    order: catalogue["saga.label.order"],
    http: catalogue["saga.label.http"],
    nextRound: catalogue["saga.label.nextRound"],
    log: catalogue["saga.label.log"],
    step: catalogue["saga.label.step"],
    holds: catalogue["saga.label.holds"],
    state: catalogue["saga.label.state"],
    empty: catalogue["saga.label.empty"],
    compensation: catalogue["saga.label.compensation"],
    replies: {
      ok: catalogue["saga.reply.ok"],
      refused: catalogue["saga.reply.refused"],
      silent: catalogue["saga.reply.silent"],
      unavailable: catalogue["saga.reply.unavailable"]
    }
  };
}
