import type { DescFile } from "@bufbuild/protobuf";

export function isDescFile(value: unknown): value is DescFile {
  return typeof value === "object" && value !== null && "kind" in value && value.kind === "file";
}
