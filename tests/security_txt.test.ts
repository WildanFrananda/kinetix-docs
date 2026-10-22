import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { securityContact } from "../src/site/security_contact";
import { securityTxt } from "../src/site/security_txt";

const day = 24 * 60 * 60 * 1000;
const docs = join(import.meta.dir, "../src/content/docs");

describe("security.txt", () => {
  test("Expires is at most a year away, and is renewed a month before it passes", () => {
    const left = Date.parse(securityContact.expires) - Date.now();

    expect(left).toBeGreaterThan(30 * day);
    expect(left).toBeLessThanOrEqual(366 * day);
  });

  test("it carries the fields RFC 9116 requires, and names its own address", () => {
    const text = securityTxt(new URL("https://docs.example/"));

    expect(text).toContain(`Contact: ${securityContact.report}`);
    expect(text).toContain(`Expires: ${securityContact.expires}`);
    expect(text).toContain("Canonical: https://docs.example/.well-known/security.txt");
    expect(text).toContain(`Policy: https://docs.example${securityContact.policyPath}`);
    expect(securityContact.report.startsWith("https://")).toBe(true);
  });

  test("the policy page it points to exists in both languages", () => {
    const page = securityContact.policyPath.replace(/^\/|\/$/g, "");

    expect(existsSync(join(docs, `${page}.mdx`))).toBe(true);
    expect(existsSync(join(docs, "id", `${page}.mdx`))).toBe(true);
  });
});
