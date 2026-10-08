import { describe, expect, test } from "bun:test";
import english from "../src/catalogue/en.json";
import indonesian from "../src/catalogue/id.json";

describe("catalogues", () => {
  test("English and Indonesian carry exactly the same keys", () => {
    expect(Object.keys(indonesian).sort()).toEqual(Object.keys(english).sort());
  });

  test("no entry is blank in either language", () => {
    const blank = [...Object.entries(english), ...Object.entries(indonesian)]
      .filter(([, text]) => text.trim().length === 0)
      .map(([key]) => key);

    expect(blank).toEqual([]);
  });
});
