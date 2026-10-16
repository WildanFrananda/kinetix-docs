import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { notaryVerifier, verifierPath } from "../src/site/notary_verifier";
import { loadVerifier } from "../src/verifier/load_verifier";
import { parseAnswer } from "../src/verifier/parse_answer";
import { verifierEnvironment } from "../src/verifier/verifier_environment";

const sources = {
  module: {
    url: verifierPath(notaryVerifier.module.file),
    sha256: notaryVerifier.module.sha256,
    bytes: notaryVerifier.module.bytes
  },
  runtime: {
    url: verifierPath(notaryVerifier.runtime.file),
    sha256: notaryVerifier.runtime.sha256,
    bytes: notaryVerifier.runtime.bytes
  }
};

const fromPublic = (async (url: string | URL | Request) => {
  const path = join("public", String(url));

  if (!existsSync(path)) {
    throw new Error(`${path} is missing: run bun run fetch:verifier`);
  }

  return new Response(readFileSync(path));
}) as unknown as typeof fetch;

const settings = verifierEnvironment({
  rpcUrl: notaryVerifier.network.rpcUrl,
  chainId: notaryVerifier.network.chainId,
  directory: notaryVerifier.network.directory
});

describe("the pinned WebAssembly verifier", () => {
  test("loads from the release's path and answers as notary-verify does, without a chain", async () => {
    const verify = await loadVerifier(sources, { fetch: fromPublic, progress: () => {} });

    const malformed = parseAnswer(await verify('{"format":', settings));
    expect(malformed.exit).toBe(65);
    expect(malformed.reports.map((report) => report.verdict)).toEqual(["malformed_proof"]);

    const unconfigured = parseAnswer(await verify("{}", { ...settings, KINETIX_NOTARY_RPC_TIMEOUT: "" }));
    expect(unconfigured.exit).toBe(78);
    expect(unconfigured.reports).toEqual([]);
    expect(unconfigured.stderr).toContain("KINETIX_NOTARY_RPC_TIMEOUT");
  });

  test("an endpoint that does not answer is unknown, never a verdict about the proof", async () => {
    const verify = await loadVerifier(sources, { fetch: fromPublic, progress: () => {} });
    const proof = JSON.stringify({
      format: "kinetix.notary.inclusion.v1",
      scheme: 1,
      chainId: notaryVerifier.network.chainId,
      ledger: "0x4E869A55031DE3B0d030AEBECc66E523686761a2",
      epoch: "81",
      commitment: `0x${"11".repeat(32)}`,
      amount: "0",
      index: "0",
      siblings: []
    });

    const answer = parseAnswer(await verify(proof, { ...settings, KINETIX_NOTARY_RPC_URL: "http://127.0.0.1:1" }));

    expect(answer.exit).toBe(4);
    expect(answer.reports.map((report) => report.verdict)).toEqual(["unknown"]);
  });
});
