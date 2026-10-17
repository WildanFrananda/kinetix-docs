import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { declarationLines } from "../scripts/lib/declaration_lines";
import { fillTemplate } from "../scripts/lib/fill_template";
import { frontmatterValue } from "../scripts/lib/frontmatter_value";
import { grpcReferencePages } from "../scripts/lib/grpc_reference_pages";
import { listFiles } from "../scripts/lib/list_files";
import { markdownTable } from "../scripts/lib/markdown_table";
import { sourceHash } from "../scripts/lib/source_hash";
import { contractsRelease } from "../src/site/contracts_release";

const contentRoot = join("src", "content", "docs");
const pages = await grpcReferencePages();

function page(path: string): string {
  const found = pages.find((candidate) => candidate.path === path);

  if (found === undefined) {
    throw new Error(`no generated page ${path}`);
  }

  return found.content;
}

describe("gRPC reference", () => {
  test("the installed contracts package is the pinned release", () => {
    const manifest = JSON.parse(readFileSync(join("node_modules", "kinetix-contracts", "package.json"), "utf8"));

    expect(manifest.version).toBe(contractsRelease.version);
  });

  test("the committed pages are exactly the generated ones: run bun run generate:grpc after a change", () => {
    const committed = ["apis/grpc", "id/apis/grpc"].flatMap((directory) =>
      listFiles(join(contentRoot, directory)).map((file) => `${directory}/${file}`)
    );

    const stale = pages
      .filter((generated) => {
        const target = join(contentRoot, generated.path);

        return !existsSync(target) || readFileSync(target, "utf8") !== generated.content;
      })
      .map((generated) => generated.path);

    expect(committed.toSorted()).toEqual(pages.map((generated) => generated.path).toSorted());
    expect(stale).toEqual([]);
  });

  test("every Indonesian page is stamped with the hash of the English page it translates", () => {
    const unstamped = pages
      .filter((generated) => generated.path.startsWith("id/"))
      .filter((generated) => frontmatterValue(generated.content, "sourceHash") !== sourceHash(page(generated.path.slice(3))))
      .map((generated) => generated.path);

    expect(unstamped).toEqual([]);
  });

  test("a type from another package links to that package's page in the reader's language", () => {
    expect(page("apis/grpc/pricing-v1.md")).toContain("[`common.v1.Money`](/apis/grpc/common-v1/#money)");
    expect(page("id/apis/grpc/pricing-v1.md")).toContain("[`common.v1.Money`](/id/apis/grpc/common-v1/#money)");
  });

  test("a type from the same package links to its heading on the page", () => {
    expect(page("apis/grpc/pricing-v1.md")).toContain("`repeated` [`PriceItemRequest`](#priceitemrequest)");
  });

  test("a well-known type is named, never linked", () => {
    expect(page("apis/grpc/order-v1.md")).toContain("| [`common.v1.OrderStatus`](/apis/grpc/common-v1/#orderstatus) |");
    expect(page("apis/grpc/order-v1.md")).toContain("| `google.protobuf.Timestamp` |");
  });

  test("proto3 optional is a modifier, not a oneof", () => {
    expect(page("apis/grpc/pricing-v1.md")).toContain("| `voucher_code` | 2 | `optional string` |  |");
  });

  test("oneof members, maps, deprecations and streams are marked", () => {
    expect(page("apis/grpc/payment-v1.md")).toContain("| `principal_id` | 2 | `string` | `oneof holder` |");
    expect(page("apis/grpc/notification-v1.md")).toContain("| `params` | 3 | `map<string, string>` |");
    expect(page("apis/grpc/fleet-v1.md")).toContain("| `assigned_driver_phone` | 5 | `string` | deprecated |");
    expect(page("apis/grpc/fleet-v1.md")).toContain(
      "`stream` [`DriverLocationPing`](#driverlocationping) → `stream` [`DriverLocationAck`](#driverlocationack)"
    );
  });

  test("servers and callers come from the system map, and a dash marks none", () => {
    const row = (path: string, rpc: string): string =>
      page(path)
        .split("\n")
        .find((line) => line.startsWith(`| [\`${rpc}\`](`)) ?? "";

    expect(row("apis/grpc/order-v1.md", "GetOrderDetails")).toContain(
      "| [order](/services/order/) | [review](https://github.com/WildanFrananda/kinetix-review-service/blob/"
    );
    expect(row("apis/grpc/notary-v1.md", "ApproveEpoch")).toEndWith("| — | — |");
  });
});

describe("declaration lines", () => {
  test("services, their RPCs, messages and enums are found by line", () => {
    const lines = declarationLines(
      ["syntax = \"proto3\";", "service Ledger {", "  rpc Seal(SealRequest) returns (SealResponse);", "}", "message SealRequest {", "}", "enum Kind {", "}"].join("\n")
    );

    expect([...lines]).toEqual([
      ["service Ledger", 2],
      ["rpc Ledger/Seal", 3],
      ["message SealRequest", 5],
      ["enum Kind", 7]
    ]);
  });

  test("a name declared twice is refused", () => {
    expect(() => declarationLines(["message A {", "}", "message A {", "}"].join("\n"))).toThrow("message A is declared twice");
  });
});

describe("markdown helpers", () => {
  test("a row with the wrong number of cells is refused", () => {
    expect(() => markdownTable(["a", "b"], [["1"]])).toThrow("a row of 1 cells under 2 headers");
  });

  test("a placeholder with no value is refused", () => {
    expect(() => fillTemplate("from {release}", {})).toThrow("no value for {release}");
  });
});
