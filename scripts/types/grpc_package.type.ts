import type { ContractFile } from "./contract_file.type";

export type GrpcPackage = {
  readonly name: string;
  readonly slug: string;
  readonly files: readonly ContractFile[];
};
