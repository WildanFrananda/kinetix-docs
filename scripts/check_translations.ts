import { join } from "node:path";
import { readPages } from "./lib/read_pages";
import { translationReport } from "./lib/translation_report";
import type { TranslationStatus } from "./types/translation_status.type";

const contentRoot = join("src", "content", "docs");
const translationLocale = "id";
const statusOrder: readonly TranslationStatus[] = ["current", "missing", "stale", "unstamped", "orphan"];
const blockingStatuses: ReadonlySet<TranslationStatus> = new Set(["stale", "unstamped", "orphan"]);

const sources = readPages(contentRoot, [translationLocale]);
const translations = readPages(join(contentRoot, translationLocale), []);
const report = translationReport(sources, translations);

for (const entry of report.filter((candidate) => candidate.status !== "current")) {
  const hint = entry.expectedHash === undefined ? "" : `  sourceHash: "${entry.expectedHash}"`;

  console.log(`${entry.status.padEnd(10)}${entry.slug}${hint}`);
}

const counts = Object.groupBy(report, (entry) => entry.status);
const summary = statusOrder.map((status) => `${counts[status]?.length ?? 0} ${status}`).join(", ");

console.log(`translations (${translationLocale}): ${summary}`);

if (report.some((entry) => blockingStatuses.has(entry.status))) {
  process.exit(1);
}
