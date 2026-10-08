import type { TrustVerdict } from "./trust_verdict.type";

export type TrustField = {
  readonly name: string;
  readonly value: string;
  readonly verdict: TrustVerdict;
};
