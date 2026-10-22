import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { restAnswers } from "../src/site/rest/rest_answers";
import { restEndpoints } from "../src/site/rest/rest_endpoints";

const root = join(import.meta.dir, "../src/catalogue/rest");
const files = readdirSync(join(root, "en")).filter((name) => name.endsWith(".json"));

function load(locale: string, file: string): Record<string, string> {
  return JSON.parse(readFileSync(join(root, locale, file), "utf8"));
}

function spans(text: string): string[] {
  return text
    .split("`")
    .filter((_, index) => index % 2 === 1)
    .sort();
}

function usedKeys(): Set<string> {
  const keys = new Set<string>();

  for (const endpoint of restEndpoints) {
    keys.add(endpoint.summary);
    keys.add(endpoint.access.who);
    endpoint.request.fields.forEach((field) => keys.add(field.rule));
    endpoint.cases.forEach((entry) => keys.add(entry.when));
  }

  Object.values(restAnswers).forEach((cases) => cases.forEach((entry) => keys.add(entry.when)));

  return keys;
}

describe("REST catalogues", () => {
  test("both languages have the same files", () => {
    expect(readdirSync(join(root, "id")).sort()).toEqual(readdirSync(join(root, "en")).sort());
  });

  for (const file of files) {
    const prefix = `rest.${file.replace(/\.json$/, "")}.`;
    const english = load("en", file);
    const indonesian = load("id", file);

    test(`${file}: English and Indonesian carry exactly the same keys`, () => {
      expect(Object.keys(indonesian).sort()).toEqual(Object.keys(english).sort());
    });

    test(`${file}: every key starts with ${prefix}`, () => {
      expect(Object.keys(english).filter((key) => !key.startsWith(prefix))).toEqual([]);
    });

    test(`${file}: no entry is blank`, () => {
      const blank = [...Object.entries(english), ...Object.entries(indonesian)]
        .filter(([, text]) => text.trim().length === 0)
        .map(([key]) => key);

      expect(blank).toEqual([]);
    });

    test(`${file}: backticks are balanced`, () => {
      const unbalanced = [...Object.entries(english), ...Object.entries(indonesian)]
        .filter(([, text]) => text.split("`").length % 2 === 0)
        .map(([key]) => key);

      expect(unbalanced).toEqual([]);
    });

    test(`${file}: Indonesian keeps every code span of the English`, () => {
      const differing = Object.keys(english).filter(
        (key) => JSON.stringify(spans(english[key]!)) !== JSON.stringify(spans(indonesian[key] ?? ""))
      );

      expect(differing).toEqual([]);
    });
  }

  test("every endpoint text is in the English catalogue", () => {
    const english = Object.assign({}, ...files.map((file) => load("en", file)));
    const missing = [...usedKeys()].filter((key) => english[key] === undefined);

    expect(missing).toEqual([]);
  });

  test("no service text is left unused", () => {
    const used = usedKeys();
    const unused = files
      .filter((file) => file !== "common.json")
      .flatMap((file) => Object.keys(load("en", file)))
      .filter((key) => !used.has(key));

    expect(unused).toEqual([]);
  });
});
