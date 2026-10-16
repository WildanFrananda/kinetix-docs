import type { VerdictName } from "./types/verdict_name.type";

export const verdictNames: readonly VerdictName[] = [
  "included",
  "rejected",
  "not_anchored",
  "not_final",
  "unknown",
  "wrong_ledger",
  "disagreement",
  "wrong_court",
  "wrong_directory",
  "moved",
  "malformed_proof"
];

export function isVerdictName(value: string): value is VerdictName {
  return (verdictNames as readonly string[]).includes(value);
}
