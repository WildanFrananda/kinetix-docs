import type { DescFile } from "@bufbuild/protobuf";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { ContractFile } from "../types/contract_file.type";
import { declarationLines } from "./declaration_lines";
import { isDescFile } from "./is_desc_file";
import { listFiles } from "./list_files";

export async function contractFiles(packageRoot: string): Promise<readonly ContractFile[]> {
  const paths = listFiles(join(packageRoot, "proto")).filter((path) => path.endsWith(".proto"));

  if (paths.length === 0) {
    throw new Error(`${packageRoot} ships no .proto files`);
  }

  return Promise.all(
    paths.map(async (path) => ({
      path,
      descriptor: await fileDescriptor(packageRoot, path),
      lines: declarationLines(readFileSync(join(packageRoot, "proto", path), "utf8"))
    }))
  );
}

async function fileDescriptor(packageRoot: string, path: string): Promise<DescFile> {
  const stem = path.replace(/\.proto$/, "");
  const module: Record<string, unknown> = await import(pathToFileURL(join(packageRoot, "src", `${stem}_pb.js`)).href);
  const descriptor = module[`file_${stem.replaceAll(/[/.]/g, "_")}`];

  if (!isDescFile(descriptor) || descriptor.name !== stem) {
    throw new Error(`${path} has no generated file descriptor in ${packageRoot}`);
  }

  return descriptor;
}
