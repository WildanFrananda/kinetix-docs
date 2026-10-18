import { describe, expect, test } from "bun:test";
import { checkAsset } from "../scripts/lib/check_asset";
import { sha256Hex } from "../scripts/lib/sha256_hex";
import { catalogueFor } from "../src/diagrams/engine/catalogue_for";
import { notaryVerifier, verifierDownload, verifierPath } from "../src/site/notary_verifier";
import { documentKind } from "../src/verifier/document_kind";
import { evidenceVerdictNames } from "../src/verifier/evidence_verdict_names";
import { fillTemplate } from "../src/verifier/fill_template";
import { parseAnswer } from "../src/verifier/parse_answer";
import { readAsset } from "../src/verifier/read_asset";
import { reportFields } from "../src/verifier/report_fields";
import { verdictNames } from "../src/verifier/verdict_names";
import { verifierEnvironment } from "../src/verifier/verifier_environment";
import { verifierLabels } from "../src/verifier/verifier_labels";

const bytesOf = (text: string): Uint8Array<ArrayBuffer> => new Uint8Array(new TextEncoder().encode(text));

function serving(body: Uint8Array<ArrayBuffer>, status = 200): typeof fetch {
  return (async () => new Response(body, { status })) as unknown as typeof fetch;
}

describe("the pinned verifier", () => {
  test("names a release, two hashed assets and the network the notary anchors on", () => {
    expect(notaryVerifier.release).toMatch(/^v\d+\.\d+\.\d+$/);

    for (const asset of [notaryVerifier.module, notaryVerifier.runtime]) {
      expect(asset.sha256).toMatch(/^[0-9a-f]{64}$/);
      expect(asset.bytes).toBeGreaterThan(0);
    }

    expect(notaryVerifier.network.chainId).toBe("84532");
    expect(notaryVerifier.network.directory).toMatch(/^0x[0-9a-fA-F]{40}$/);
    expect(notaryVerifier.network.evidenceRegistry).toMatch(/^0x[0-9a-fA-F]{40}$/);
    expect(notaryVerifier.network.rpcUrl).toStartWith("https://");
  });

  test("is served from the release's own path and downloaded from its GitHub release", () => {
    expect(verifierPath("notary-verify.wasm")).toBe(`/notary/${notaryVerifier.release}/notary-verify.wasm`);
    expect(verifierDownload("wasm_exec.js")).toBe(
      `${notaryVerifier.repository}/releases/download/${notaryVerifier.release}/wasm_exec.js`
    );
  });
});

describe("checkAsset", () => {
  test("accepts the bytes it was pinned to and refuses any others, naming both hashes", () => {
    const bytes = bytesOf("verifier");
    const pinned = sha256Hex(bytes);

    expect(() => checkAsset(bytes, pinned, "notary-verify.wasm")).not.toThrow();
    expect(() => checkAsset(bytesOf("verifiers"), pinned, "notary-verify.wasm")).toThrow(pinned);
  });
});

describe("readAsset", () => {
  const body = bytesOf("the module");
  const source = { url: "/notary/v0.0.0/notary-verify.wasm", sha256: sha256Hex(body), bytes: body.byteLength };

  test("hands back exactly the pinned bytes and reports progress against the pinned size", async () => {
    const seen: number[] = [];
    const read = await readAsset(source, { fetch: serving(body), progress: (received) => seen.push(received) });

    expect(new TextDecoder().decode(read)).toBe("the module");
    expect(seen.at(-1)).toBe(body.byteLength);
  });

  test("refuses bytes of another size, another hash, or no answer at all", async () => {
    const refusal = (fetch: typeof globalThis.fetch): Promise<string> =>
      readAsset(source, { fetch, progress: () => {} }).then(
        () => "",
        (error: Error) => error.message
      );

    expect(await refusal(serving(bytesOf("the modules")))).toContain("bytes");
    expect(await refusal(serving(bytesOf("THE MODULE")))).toContain("SHA-256");
    expect(await refusal(serving(body, 404))).toContain("404");
  });
});

describe("parseAnswer", () => {
  test("reads one report per line of the verifier's output", () => {
    const answer = parseAnswer({
      exit: 1,
      stdout: '{"verdict":"included","epoch":"7"}\n{"verdict":"rejected","provable":"bad_proof"}\n',
      stderr: ""
    });

    expect(answer.exit).toBe(1);
    expect(answer.reports.map((report) => report.verdict)).toEqual(["included", "rejected"]);
    expect(answer.reports[1]?.provable).toBe("bad_proof");
  });

  test("an answer with nothing on stdout has no reports and keeps what stderr said", () => {
    expect(parseAnswer({ exit: 78, stdout: "", stderr: "KINETIX_NOTARY_RPC_URL is not set\n" })).toEqual({
      exit: 78,
      reports: [],
      stderr: "KINETIX_NOTARY_RPC_URL is not set\n"
    });
  });

  test("refuses anything that is not the verifier's answer", () => {
    expect(() => parseAnswer({ exit: "0", stdout: "", stderr: "" })).toThrow();
    expect(() => parseAnswer({ exit: 0, stdout: '{"epoch":"7"}', stderr: "" })).toThrow("no verdict");
    expect(() => parseAnswer({ exit: 0, stdout: '{"verdict":0}', stderr: "" })).toThrow("not text");
    expect(() => parseAnswer({ exit: 0, stdout: "[]", stderr: "" })).toThrow("not a report");
  });
});

describe("the verifier's settings", () => {
  test("are the five variables notary-verify reads, trimmed", () => {
    expect(
      verifierEnvironment({
        rpcUrl: " https://sepolia.base.org ",
        chainId: "84532",
        directory: "0xabc ",
        evidenceRegistry: " 0xdef"
      })
    ).toEqual({
      KINETIX_NOTARY_RPC_URL: "https://sepolia.base.org",
      KINETIX_NOTARY_CHAIN_ID: "84532",
      KINETIX_NOTARY_DIRECTORY_ADDRESS: "0xabc",
      KINETIX_NOTARY_EVIDENCE_REGISTRY_ADDRESS: "0xdef",
      KINETIX_NOTARY_RPC_TIMEOUT: "30s"
    });
  });
});

describe("documentKind", () => {
  const evidence = { format: "kinetix.notary.evidence.v1" };

  test("reads evidence from a document's format, or from the first proof of the notary's answer", () => {
    expect(documentKind(JSON.stringify(evidence))).toBe("evidence");
    expect(documentKind(JSON.stringify({ proofs: [evidence], pending: 0 }))).toBe("evidence");
  });

  test("reads everything else as liabilities, which is what notary-verify does with it", () => {
    expect(documentKind(JSON.stringify({ format: "kinetix.notary.inclusion.v1" }))).toBe("liabilities");
    expect(documentKind(JSON.stringify({ proofs: [] }))).toBe("liabilities");
    expect(documentKind(JSON.stringify({ proofs: [{ format: "kinetix.notary.inclusion.v1" }, evidence] }))).toBe(
      "liabilities"
    );
    expect(documentKind("[]")).toBe("liabilities");
    expect(documentKind('{"format":')).toBe("liabilities");
  });
});

describe("the verifier's labels", () => {
  test("fill every named placeholder and leave an unknown one as it is", () => {
    expect(fillTemplate("{received} of {total} MB, {other}", { received: "1.0", total: "44.2" })).toBe(
      "1.0 of 44.2 MB, {other}"
    );
  });

  for (const locale of ["en", "id"] as const) {
    test(`exist in ${locale} for every verdict, statement and field`, () => {
      const labels = verifierLabels(catalogueFor(locale));

      for (const name of verdictNames) {
        expect(labels.verdicts[name].length).toBeGreaterThan(0);
      }

      for (const name of evidenceVerdictNames) {
        expect(labels.evidenceVerdicts[name].length).toBeGreaterThan(0);
      }

      for (const field of reportFields) {
        expect(labels.fields[field].length).toBeGreaterThan(0);
      }

      expect(Object.values(labels.statements).every((text) => text.length > 0)).toBe(true);
    });

    test(`give the evidence page its own hints in ${locale}, and the liabilities page its own`, () => {
      const catalogue = catalogueFor(locale);
      const liabilities = verifierLabels(catalogue);
      const evidence = verifierLabels(catalogue, "evidence");

      expect(liabilities.documentHint).toBe(catalogue["verifier.documentHint"]);
      expect(evidence.documentHint).toBe(catalogue["verifier.evidence.documentHint"]);
      expect(evidence.endpointHint).toBe(catalogue["verifier.evidence.endpointHint"]);
      expect(evidence.endpointHint).not.toBe(liabilities.endpointHint);
    });
  }
});
