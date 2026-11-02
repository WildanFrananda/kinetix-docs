import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { contentSecurityPolicy } from "../scripts/lib/content_security_policy";
import { cspHash } from "../scripts/lib/csp_hash";
import { inlineBlocks } from "../scripts/lib/inline_blocks";
import { insertPolicy } from "../scripts/lib/insert_policy";
import { listFiles } from "../scripts/lib/list_files";
import { pagePolicy } from "../scripts/lib/page_policy";

type HeaderRule = {
  source: string;
  headers: { key: string; value: string }[];
};

const page = [
  '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>',
  "<script>window.theme = 1;</script>",
  '<script type="module" src="/_astro/page.js"></script>',
  "<style>.a{color:red}</style>",
  "</head><body><script>window.theme = 1;</script>",
  '<svg><style>.b{fill:none}</style></svg></body></html>'
].join("");

describe("the content security policy written into every page", () => {
  test("hashes each inline script and style, and leaves scripts loaded by URL to 'self'", () => {
    const blocks = inlineBlocks(page);

    expect(blocks.scripts).toEqual(["window.theme = 1;", "window.theme = 1;"]);
    expect(blocks.styles).toEqual([".a{color:red}", ".b{fill:none}"]);
  });

  test("a hash is the one a browser computes: SHA-256 of the text, base64", () => {
    expect(cspHash("")).toBe("'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='");
  });

  test("names every inline block once, and nothing that lets a string run as code", () => {
    const policy = pagePolicy(contentSecurityPolicy, inlineBlocks(page));
    const scriptSrc = policy.split("; ").find((directive) => directive.startsWith("script-src "));

    expect(scriptSrc).toBe(`script-src 'self' 'wasm-unsafe-eval' ${cspHash("window.theme = 1;")}`);
    expect(policy).toContain(`style-src-elem 'self' ${cspHash(".a{color:red}")} ${cspHash(".b{fill:none}")}`);
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("base-uri 'self'");
    expect(policy).toContain("default-src 'self'");
    expect(policy).not.toContain("'unsafe-eval'");
    expect(contentSecurityPolicy.scriptSources).not.toContain("'unsafe-inline'");
  });

  test("goes right after the charset, before anything it governs", () => {
    const written = insertPolicy(page, "default-src 'self'");

    expect(written.startsWith('<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta http-equiv="content-security-policy" content="default-src \'self\'"><script>')).toBe(true);
  });

  test("refuses a page that has a policy already, or does not open its head with the charset", () => {
    const written = insertPolicy(page, "default-src 'self'");

    expect(() => insertPolicy(written, "default-src 'self'")).toThrow("already");
    expect(() => insertPolicy("<html><head><script>x()</script><meta charset=\"utf-8\"/>", "default-src 'self'")).toThrow("charset");
  });

  test("no source evaluates a string, since the policy has no 'unsafe-eval'", () => {
    const sources = listFiles("src").filter((path) => /\.(ts|svelte|astro)$/.test(path));
    const evaluating = sources.filter((path) => /\bnew Function\s*\(|\beval\s*\(/.test(readFileSync(join("src", path), "utf8")));

    expect(sources.length).toBeGreaterThan(0);
    expect(evaluating).toEqual([]);
  });
});

describe("the headers Vercel adds", () => {
  const config = JSON.parse(readFileSync("vercel.json", "utf8"));
  const rules: HeaderRule[] = config.headers;
  const everyPage = rules.find((rule) => rule.source === "/(.*)");
  const header = (key: string) => everyPage?.headers.find((entry) => entry.key === key)?.value;

  test("every response refuses framing, sniffing and the browser features the site never uses", () => {
    expect(header("Content-Security-Policy")).toContain("frame-ancestors 'none'");
    expect(header("X-Frame-Options")).toBe("DENY");
    expect(header("X-Content-Type-Options")).toBe("nosniff");
    expect(header("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(header("Permissions-Policy")).toContain("camera=()");
    expect(header("Cross-Origin-Opener-Policy")).toBe("same-origin");
  });

  test("only fingerprinted or release-pinned paths are cached as immutable", () => {
    const immutable = rules
      .filter((rule) => rule.headers.some((entry) => entry.key === "Cache-Control" && entry.value.includes("immutable")))
      .map((rule) => rule.source);

    expect(immutable).toEqual(["/_astro/(.*)", "/notary/(.*)"]);
  });

  test("Vercel never deploys on its own, ahead of the CI's leak checks", () => {
    expect(config.git.deploymentEnabled).toBe(false);
  });
});
