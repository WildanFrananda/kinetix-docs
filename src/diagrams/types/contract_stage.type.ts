import type { ContractStageId } from "./contract_stage_id.type";
import type { ContractStageStatus } from "./contract_stage_status.type";

export type ContractStage = {
  readonly id: ContractStageId;
  readonly status: ContractStageStatus;
};
