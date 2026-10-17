import type { DescFile } from "@bufbuild/protobuf";

export type ContractFile = {
  readonly path: string;
  readonly descriptor: DescFile;
  readonly lines: ReadonlyMap<string, number>;
};
