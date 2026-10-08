import type { TranslationEntry } from "../types/translation_entry.type";
import { frontmatterValue } from "./frontmatter_value";
import { sourceHash } from "./source_hash";

export function translationReport(
  sources: ReadonlyMap<string, string>,
  translations: ReadonlyMap<string, string>
): TranslationEntry[] {
  const entries: TranslationEntry[] = [];

  for (const [slug, source] of sources) {
    const expectedHash = sourceHash(source);
    const translation = translations.get(slug);
    const recordedHash = translation === undefined ? undefined : frontmatterValue(translation, "sourceHash");

    if (translation === undefined) {
      entries.push({ slug, status: "missing", expectedHash });
    } else if (recordedHash === undefined) {
      entries.push({ slug, status: "unstamped", expectedHash });
    } else if (recordedHash !== expectedHash) {
      entries.push({ slug, status: "stale", expectedHash });
    } else {
      entries.push({ slug, status: "current" });
    }
  }

  for (const slug of translations.keys()) {
    if (!sources.has(slug)) {
      entries.push({ slug, status: "orphan" });
    }
  }

  return entries.sort((left, right) => left.slug.localeCompare(right.slug));
}
