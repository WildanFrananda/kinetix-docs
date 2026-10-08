import { readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { builtinLeakRules } from "./lib/builtin_leak_rules";
import { denylistRules } from "./lib/denylist_rules";
import { findLeaks } from "./lib/find_leaks";
import { listFiles } from "./lib/list_files";

const denylist = process.env.DOCS_DENYLIST;

if (denylist === undefined) {
  throw new Error("DOCS_DENYLIST is not set");
}

const publishedRoots = ["src", "public"];
const binaryExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".avif",
  ".ico",
  ".woff",
  ".woff2"
]);
const rules = [...builtinLeakRules, ...denylistRules(denylist)];

let scanned = 0;
let flagged = 0;

for (const root of publishedRoots) {
  for (const relativePath of listFiles(root)) {
    const path = join(root, relativePath);

    if (!binaryExtensions.has(extname(path).toLowerCase())) {
      scanned += 1;

      for (const finding of findLeaks(readFileSync(path, "utf8"), rules)) {
        flagged += 1;
        console.log(`${path}:${finding.line}:${finding.column} ${finding.rule}`);
      }
    }
  }
}

if (flagged > 0) {
  console.error(`${flagged} potential leak(s) in ${scanned} files; matched text is withheld from this log`);
  process.exit(1);
}

console.log(`no leaks in ${scanned} files`);
