import type { TrustAmountKind } from "./trust_amount_kind.type";
import type { TrustEra } from "./trust_era.type";
import type { TrustOutcome } from "./trust_outcome.type";
import type { TrustVerdict } from "./trust_verdict.type";

export type TrustLabels = {
  readonly eras: Readonly<Record<TrustEra, string>>;
  readonly request: string;
  readonly path: string;
  readonly outcome: string;
  readonly verdicts: Readonly<Record<TrustVerdict, string>>;
  readonly outcomes: Readonly<Record<TrustOutcome["verdict"], string>>;
  readonly amounts: Readonly<Record<TrustAmountKind, string>>;
};
