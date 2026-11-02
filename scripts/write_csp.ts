import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { contentSecurityPolicy } from "./lib/content_security_policy";
import { inlineBlocks } from "./lib/inline_blocks";
import { insertPolicy } from "./lib/insert_policy";
import { listFiles } from "./lib/list_files";
import { pagePolicy } from "./lib/page_policy";

const outputRoot = "dist";
const pages = listFiles(outputRoot).filter((path) => path.endsWith(".html"));

if (pages.length === 0) {
  throw new Error(`${outputRoot} holds no page: run astro build first`);
}

for (const relativePath of pages) {
  const path = join(outputRoot, relativePath);
  const html = readFileSync(path, "utf8");

  writeFileSync(path, insertPolicy(html, pagePolicy(contentSecurityPolicy, inlineBlocks(html))));
}

console.log(`content security policy written into ${pages.length} pages`);
