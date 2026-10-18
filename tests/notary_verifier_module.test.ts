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
  directory: notaryVerifier.network.directory,
  evidenceRegistry: notaryVerifier.network.evidenceRegistry
});

const evidenceProof = {
  format: "kinetix.notary.evidence.v1",
  scheme: 1,
  chainId: notaryVerifier.network.chainId,
  registry: notaryVerifier.network.evidenceRegistry,
  batch: {
    stream: "review",
    number: "0",
    previousDigest: `0x${"00".repeat(32)}`,
    root: `0x${"11".repeat(32)}`,
    leafCount: "1",
    throughTransaction: "1",
    throughSequence: "1",
    closedAt: "1792000000",
    digest: `0x${"22".repeat(32)}`
  },
  record: {
    transaction: "1",
    sequence: "1",
    review: {
      reviewId: "00000000-0000-4000-8000-000000000001",
      kind: 1,
      orderId: "ORD-EXAMPLE-1",
      subjectId: "example-product",
      authorPrincipalId: "00000000-0000-4000-8000-000000000002",
      merchantPrincipalId: "00000000-0000-4000-8000-000000000003",
      rating: 4,
      createdAt: "2026-10-18T00:00:00Z"
    }
  },
  salt: `0x${"33".repeat(32)}`,
  index: "0",
  siblings: []
};

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

  test("routes an evidence document to the evidence verifier, which needs the registry", async () => {
    const verify = await loadVerifier(sources, { fetch: fromPublic, progress: () => {} });
    const answer = JSON.stringify({ proofs: [evidenceProof], pending: 0 });

    const unconfigured = parseAnswer(
      await verify(answer, { ...settings, KINETIX_NOTARY_EVIDENCE_REGISTRY_ADDRESS: "" })
    );
    expect(unconfigured.exit).toBe(78);
    expect(unconfigured.stderr).toContain("KINETIX_NOTARY_EVIDENCE_REGISTRY_ADDRESS");

    const malformed = parseAnswer(await verify(JSON.stringify({ ...evidenceProof, siblings: "none" }), settings));
    expect(malformed.exit).toBe(65);
    expect(malformed.reports.map((report) => report.verdict)).toEqual(["malformed_proof"]);
  });

  test("an evidence proof whose endpoint does not answer is unknown, never a verdict about the record", async () => {
    const verify = await loadVerifier(sources, { fetch: fromPublic, progress: () => {} });
    const answer = parseAnswer(
      await verify(JSON.stringify(evidenceProof), { ...settings, KINETIX_NOTARY_RPC_URL: "http://127.0.0.1:1" })
    );

    expect(answer.exit).toBe(4);
    expect(answer.reports.map((report) => report.verdict)).toEqual(["unknown"]);
  });
});
