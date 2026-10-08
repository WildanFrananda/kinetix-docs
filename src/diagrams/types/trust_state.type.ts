import type { TrustCall } from "./trust_call.type";
import type { TrustEra } from "./trust_era.type";
import type { TrustField } from "./trust_field.type";
import type { TrustOutcome } from "./trust_outcome.type";

export type TrustState = {
  readonly era: TrustEra;
  readonly endpoint: string;
  readonly fields: readonly TrustField[];
  readonly calls: readonly TrustCall[];
  readonly outcome: TrustOutcome | null;
};
