import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { restAnswers } from "../src/site/rest/rest_answers";
import { restEndpoints } from "../src/site/rest/rest_endpoints";

const docs = join(import.meta.dir, "../src/content/docs");
const english = join(docs, "apis/rest");

function pages(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    return entry.isDirectory() ? pages(path) : entry.name.endsWith(".mdx") ? [path] : [];
  });
}

function mentions(path: string, component: string, attribute: string): string[] {
  const pattern = new RegExp(`<${component} ${attribute}="([^"]+)"`, "g");

  return [...readFileSync(path, "utf8").matchAll(pattern)].map((match) => match[1]!);
}

const englishPages = pages(english);
const known = new Set(restEndpoints.map((endpoint) => endpoint.id));

describe("REST pages", () => {
  test("every endpoint a page names exists", () => {
    const unknown = englishPages.flatMap((page) =>
      mentions(page, "RestEndpoint", "id").filter((id) => !known.has(id))
    );

    expect(unknown).toEqual([]);
  });

  test("every endpoint is on at least one page", () => {
    const named = new Set(englishPages.flatMap((page) => mentions(page, "RestEndpoint", "id")));

    expect(restEndpoints.map((endpoint) => endpoint.id).filter((id) => !named.has(id))).toEqual([]);
  });

  test("the overview lists every service's answers", () => {
    const listed = mentions(join(english, "index.mdx"), "RestServiceAnswers", "service");

    expect(listed.sort()).toEqual(Object.keys(restAnswers).sort());
  });

  for (const page of englishPages) {
    const path = relative(docs, page);
    const twin = join(docs, "id", path);

    test(`${path}: the Indonesian page names the same endpoints in the same order`, () => {
      expect(existsSync(twin)).toBe(true);
      expect(mentions(twin, "RestEndpoint", "id")).toEqual(mentions(page, "RestEndpoint", "id"));
      expect(mentions(twin, "RestServiceAnswers", "service")).toEqual(
        mentions(page, "RestServiceAnswers", "service")
      );
    });
  }
});
