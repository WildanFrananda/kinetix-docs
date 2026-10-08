import type { ContractStage } from "./contract_stage.type";
import type { DiffLine } from "./diff_line.type";

export type ContractState = {
  readonly file: string;
  readonly diff: readonly DiffLine[];
  readonly stages: readonly ContractStage[];
  readonly output: readonly string[];
  readonly release: string | null;
};
