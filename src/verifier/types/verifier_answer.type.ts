import type { VerifierReport } from "./verifier_report.type";

export type VerifierAnswer = {
  readonly exit: number;
  readonly reports: readonly VerifierReport[];
  readonly stderr: string;
};
