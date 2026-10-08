import { describe, expect, test } from "bun:test";
import { builtinLeakRules } from "../scripts/lib/builtin_leak_rules";
import { denylistRules } from "../scripts/lib/denylist_rules";
import { findLeaks } from "../scripts/lib/find_leaks";

describe("findLeaks", () => {
  test("reports the rule, line and column of a private key header", () => {
    const text = "intro\n  -----BEGIN EC PRIVATE KEY-----\n";

    expect(findLeaks(text, builtinLeakRules)).toEqual([{ rule: "private-key", line: 2, column: 3 }]);
  });

  test("documentation, loopback and unspecified addresses may be published", () => {
    const text = "Point the client at 192.0.2.10, 198.51.100.7, 203.0.113.1, 127.0.0.1 or 0.0.0.0.";

    expect(findLeaks(text, builtinLeakRules)).toEqual([]);
  });

  test("private and public addresses may not be published", () => {
    const text = "db at 10.20.0.5\nedge at 8.8.4.4\n";
    const rules = findLeaks(text, builtinLeakRules).map((finding) => `${finding.line}:${finding.rule}`);

    expect(rules).toEqual(["1:ipv4-address", "2:ipv4-address"]);
  });

  test("a dotted quad that cannot be an address is not flagged", () => {
    expect(findLeaks("schema 300.12.1.9", builtinLeakRules)).toEqual([]);
  });

  test("a four-part version is permitted only where it is written as a version", () => {
    const text = [
      'framework: { name: "Rails", version: "8.1.3.1" }',
      'techs: [tech("Rails", "8.1.3.1", "rails")]',
      "The server answers on 8.1.3.1 today.",
      'note: "8.1.3.1"'
    ].join("\n");
    const lines = findLeaks(text, builtinLeakRules).map((finding) => finding.line);

    expect(lines).toEqual([3, 4]);
  });

  test("a sandbox payment key is flagged", () => {
    const findings = findLeaks("key: SB-Mid-server-AbCdEf123456", builtinLeakRules);

    expect(findings.map((finding) => finding.rule)).toEqual(["midtrans-key"]);
  });

  test("denylist entries match literally and ignore case", () => {
    const rules = denylistRules("\nbackups.Example-Bucket\n\nhost(1).internal\n");
    const text = "restore from BACKUPS.example-bucket\nnot backupsXexample-bucket\nssh host(1).internal\n";

    expect(findLeaks(text, rules)).toEqual([
      { rule: "denylist entry 1", line: 1, column: 14 },
      { rule: "denylist entry 2", line: 3, column: 5 }
    ]);
  });

  test("an empty denylist adds no rules", () => {
    expect(denylistRules("\n  \n")).toEqual([]);
  });
});
