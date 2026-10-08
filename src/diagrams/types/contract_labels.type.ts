import type { ContractStageId } from "./contract_stage_id.type";
import type { ContractStageStatus } from "./contract_stage_status.type";

export type ContractLabels = {
  readonly change: string;
  readonly noChange: string;
  readonly pipeline: string;
  readonly output: string;
  readonly release: string;
  readonly noRelease: string;
  readonly stages: Readonly<Record<ContractStageId, string>>;
  readonly tools: Readonly<Record<ContractStageId, string>>;
  readonly statuses: Readonly<Record<ContractStageStatus, string>>;
};
