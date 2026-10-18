import type { EvidenceVerdictName } from "./types/evidence_verdict_name.type";

export const evidenceVerdictNames: readonly EvidenceVerdictName[] = [
  "included",
  "rejected",
  "not_anchored",
  "not_final",
  "unknown",
  "wrong_ledger",
  "disagreement",
  "malformed_proof"
];

export function isEvidenceVerdictName(value: string): value is EvidenceVerdictName {
  return (evidenceVerdictNames as readonly string[]).includes(value);
}
