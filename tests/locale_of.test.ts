import { describe, expect, test } from "bun:test";
import { localeOf } from "../src/diagrams/engine/locale_of";

describe("localeOf", () => {
  test("maps the two configured languages to their catalogues", () => {
    expect(localeOf("en")).toBe("en");
    expect(localeOf("id")).toBe("id");
  });

  test("refuses a language that has no catalogue rather than falling back silently", () => {
    expect(() => localeOf("fr")).toThrow('no diagram catalogue for language "fr"');
  });
});
