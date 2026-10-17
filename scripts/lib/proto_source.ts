import type { SourceLink } from "../../src/diagrams/types/source_link.type";
import type { ContractsRelease } from "../../src/site/types/contracts_release.type";
import type { ContractFile } from "../types/contract_file.type";

export function protoSource(file: ContractFile, declaration: string, release: ContractsRelease): SourceLink {
  const line = file.lines.get(declaration);

  if (line === undefined) {
    throw new Error(`${declaration} is not declared in ${file.path}`);
  }

  return {
    label: `${file.path}:${line}`,
    href: `${release.repository}/blob/${release.commit}/proto/${file.path}#L${line}`
  };
}
