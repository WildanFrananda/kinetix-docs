import { readFileSync } from "node:fs";
import { join } from "node:path";
import { architectureEdges } from "../../src/diagrams/architecture/architecture_edges";
import { architectureNodes } from "../../src/diagrams/architecture/architecture_nodes";
import type { Locale } from "../../src/diagrams/types/locale.type";
import { contractsRelease } from "../../src/site/contracts_release";
import type { ContractFile } from "../types/contract_file.type";
import type { GeneratedPage } from "../types/generated_page.type";
import type { GrpcConnections } from "../types/grpc_connections.type";
import type { GrpcPageContext } from "../types/grpc_page_context.type";
import type { PageRenderer } from "../types/page_renderer.type";
import { contractFiles } from "./contract_files";
import { grpcConnections } from "./grpc_connections";
import { grpcIndexPage } from "./grpc_index_page";
import { grpcPackagePage } from "./grpc_package_page";
import { grpcPackages } from "./grpc_packages";
import { listFiles } from "./list_files";
import { pageSlug } from "./page_slug";
import { sourceHash } from "./source_hash";

const contentRoot = join("src", "content", "docs");
const packageRoot = join("node_modules", "kinetix-contracts");

export async function grpcReferencePages(): Promise<readonly GeneratedPage[]> {
  const installed = installedVersion();

  if (installed !== contractsRelease.version) {
    throw new Error(`node_modules holds kinetix-contracts ${installed}; src/site/contracts_release.ts pins ${contractsRelease.version}`);
  }

  const files = await contractFiles(packageRoot);
  const packages = grpcPackages(files);
  const connections = grpcConnections(architectureNodes, architectureEdges);
  const servicePages = new Set(listFiles(join(contentRoot, "services")).flatMap((path) => pageSlug(path) ?? []));

  mapMatchesContract(files, connections);

  const context = (locale: Locale): GrpcPageContext => ({
    locale,
    release: contractsRelease,
    connections,
    servicePages
  });

  const renderers: readonly PageRenderer[] = [
    {
      path: "apis/grpc/index.md",
      render: (locale, hash) => grpcIndexPage(packages, context(locale), hash)
    },
    ...packages.map((pkg) => ({
      path: `apis/grpc/${pkg.slug}.md`,
      render: (locale: Locale, hash?: string) => grpcPackagePage(pkg, context(locale), hash)
    }))
  ];

  return renderers.flatMap((renderer) => {
    const english = renderer.render("en");

    return [
      { path: renderer.path, content: english },
      { path: `id/${renderer.path}`, content: renderer.render("id", sourceHash(english)) }
    ];
  });
}

function installedVersion(): string {
  const manifest: unknown = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));

  if (typeof manifest === "object" && manifest !== null && "version" in manifest && typeof manifest.version === "string") {
    return manifest.version;
  }

  throw new Error(`${packageRoot}/package.json names no version`);
}

function mapMatchesContract(files: readonly ContractFile[], connections: GrpcConnections): void {
  const defined = new Set(
    files.flatMap((file) =>
      file.descriptor.services.flatMap((service) => service.methods.map((method) => `${service.typeName}/${method.name}`))
    )
  );

  const unknown = [...new Set([...connections.servers.keys(), ...connections.callers.keys()])].filter(
    (operation) => !defined.has(operation)
  );

  if (unknown.length > 0) {
    throw new Error(`the system map names ${unknown.join(", ")}, which kinetix-contracts ${contractsRelease.version} does not define`);
  }
}
