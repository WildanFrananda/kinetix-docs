import type { Catalogue } from "../types/catalogue.type";
import type { TrustLabels } from "../types/trust_labels.type";

export function trustLabels(catalogue: Catalogue): TrustLabels {
  return {
    eras: {
      before: catalogue["trust.label.before"],
      after: catalogue["trust.label.after"]
    },
    request: catalogue["trust.label.request"],
    path: catalogue["trust.label.path"],
    outcome: catalogue["trust.label.outcome"],
    verdicts: {
      asserted: catalogue["trust.verdict.asserted"],
      choice: catalogue["trust.verdict.choice"],
      resolved: catalogue["trust.verdict.resolved"]
    },
    outcomes: {
      forged: catalogue["trust.outcome.forged"],
      owned: catalogue["trust.outcome.owned"]
    },
    amounts: {
      charged: catalogue["trust.amount.charged"],
      credited: catalogue["trust.amount.credited"],
      paid: catalogue["trust.amount.paid"]
    }
  };
}
