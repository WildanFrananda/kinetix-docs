import { describe, expect, test } from "bun:test";
import { sourceHash } from "../scripts/lib/source_hash";
import { translationReport } from "../scripts/lib/translation_report";

const source = "---\ntitle: Checkout saga\n---\n\nSix RPCs, three ledgers.\n";

function translatedFrom(original: string): string {
  return `---\ntitle: Saga checkout\nsourceHash: ${sourceHash(original)}\n---\n\nEnam RPC, tiga ledger.\n`;
}

describe("translationReport", () => {
  test("a translation stamped with the current source hash is current", () => {
    const report = translationReport(
      new Map([["saga", source]]),
      new Map([["saga", translatedFrom(source)]])
    );

    expect(report).toEqual([{ slug: "saga", status: "current" }]);
  });

  test("a translation of an older revision of the source is stale and names the hash to stamp", () => {
    const revised = `${source}\nA counter cannot be compensated.\n`;
    const report = translationReport(
      new Map([["saga", revised]]),
      new Map([["saga", translatedFrom(source)]])
    );

    expect(report).toEqual([{ slug: "saga", status: "stale", expectedHash: sourceHash(revised) }]);
  });

  test("a source page without a translation is missing, not an error", () => {
    const report = translationReport(
      new Map([["saga", source]]),
      new Map()
    );

    expect(report).toEqual([{ slug: "saga", status: "missing", expectedHash: sourceHash(source) }]);
  });

  test("a translation that records no source hash cannot be judged current", () => {
    const unstamped = "---\ntitle: Saga checkout\n---\n\nEnam RPC.\n";
    const report = translationReport(
      new Map([["saga", source]]),
      new Map([["saga", unstamped]])
    );

    expect(report).toEqual([{ slug: "saga", status: "unstamped", expectedHash: sourceHash(source) }]);
  });

  test("a translation whose source page was removed is an orphan", () => {
    const report = translationReport(
      new Map(),
      new Map([["saga", translatedFrom(source)]])
    );

    expect(report).toEqual([{ slug: "saga", status: "orphan" }]);
  });

  test("a sourceHash outside the frontmatter is not read as a stamp", () => {
    const bodyOnly = `---\ntitle: Saga checkout\n---\n\nsourceHash: ${sourceHash(source)}\n`;
    const report = translationReport(
      new Map([["saga", source]]),
      new Map([["saga", bodyOnly]])
    );

    expect(report[0]?.status).toBe("unstamped");
  });
});
