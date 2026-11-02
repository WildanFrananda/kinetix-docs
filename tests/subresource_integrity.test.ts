import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { notaryVerifier, verifierPath } from "../src/site/notary_verifier";
import { subresourceIntegrity } from "../src/verifier/subresource_integrity";

describe("subresourceIntegrity", () => {
  test("is the integrity a browser checks the pinned wasm_exec.js against", () => {
    const path = join("public", verifierPath(notaryVerifier.runtime.file));

    if (!existsSync(path)) {
      throw new Error(`${path} is missing: run bun run fetch:verifier`);
    }

    const expected = `sha256-${createHash("sha256").update(readFileSync(path)).digest("base64")}`;

    expect(subresourceIntegrity(notaryVerifier.runtime.sha256)).toBe(expected);
  });

  test("refuses anything but a lowercase hex SHA-256", () => {
    expect(() => subresourceIntegrity(notaryVerifier.runtime.sha256.toUpperCase())).toThrow("lowercase hex");
    expect(() => subresourceIntegrity(notaryVerifier.runtime.sha256.slice(2))).toThrow("lowercase hex");
  });
});
