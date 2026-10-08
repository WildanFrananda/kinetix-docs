import type { TrustAmountKind } from "./trust_amount_kind.type";

export type TrustAmount = {
  readonly kind: TrustAmountKind;
  readonly value: string;
};
