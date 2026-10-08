import { readFileSync } from "node:fs";
import { join } from "node:path";
import { listFiles } from "./list_files";
import { pageSlug } from "./page_slug";

export function readPages(root: string, excludedDirectories: readonly string[]): Map<string, string> {
  const pages = new Map<string, string>();

  for (const relativePath of listFiles(root)) {
    const slug = pageSlug(relativePath);
    const excluded = excludedDirectories.some((directory) => relativePath.startsWith(`${directory}/`));

    if (slug !== undefined && !excluded) {
      pages.set(slug, readFileSync(join(root, relativePath), "utf8"));
    }
  }

  return pages;
}
