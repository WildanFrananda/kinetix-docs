import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { contractsRelease } from "../src/site/contracts_release";
import { grpcReferencePages } from "./lib/grpc_reference_pages";
import { listFiles } from "./lib/list_files";

const contentRoot = join("src", "content", "docs");
const directories = ["apis/grpc", "id/apis/grpc"];
const pages = await grpcReferencePages();
const expected = new Set(pages.map((page) => page.path));

for (const directory of directories) {
  for (const file of listFiles(join(contentRoot, directory))) {
    const path = `${directory}/${file}`;

    if (!expected.has(path)) {
      rmSync(join(contentRoot, path));
      console.log(`removed ${path}`);
    }
  }
}

const changed = pages.filter((page) => {
  const target = join(contentRoot, page.path);

  return !existsSync(target) || readFileSync(target, "utf8") !== page.content;
});

for (const page of changed) {
  const target = join(contentRoot, page.path);

  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, page.content);
}

console.log(`${pages.length} gRPC reference pages from kinetix-contracts ${contractsRelease.version}, ${changed.length} written`);
