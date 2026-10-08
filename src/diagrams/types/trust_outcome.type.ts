import type { TrustAmount } from "./trust_amount.type";

export type TrustOutcome = {
  readonly amounts: readonly TrustAmount[];
  readonly verdict: "forged" | "owned";
};
