import { catalogueFor } from "../../src/diagrams/engine/catalogue_for";
import type { GrpcPackage } from "../types/grpc_package.type";
import type { GrpcPageContext } from "../types/grpc_page_context.type";
import { emptyCell } from "./empty_cell";
import { fillTemplate } from "./fill_template";
import { localePrefix } from "./locale_prefix";
import { markdownTable } from "./markdown_table";
import { pageFrontmatter } from "./page_frontmatter";
import { referenceBody } from "./reference_body";
import { referenceLinks } from "./reference_links";
import { serviceLink } from "./service_link";

export function grpcIndexPage(packages: readonly GrpcPackage[], context: GrpcPageContext, sourceHash?: string): string {
  const text = catalogueFor(context.locale);
  const links = referenceLinks(context);

  const headers = [
    text["grpc.column.package"],
    text["grpc.column.servedBy"],
    text["grpc.column.services"],
    text["grpc.column.rpcs"],
    text["grpc.column.messages"],
    text["grpc.column.enums"]
  ];

  const rows = packages.map((pkg) => {
    const services = pkg.files.flatMap((file) => file.descriptor.services);
    const operations = services.flatMap((service) => service.methods.map((method) => `${service.typeName}/${method.name}`));
    const servers = [...new Set(operations.flatMap((operation) => context.connections.servers.get(operation) ?? []))].toSorted();

    return [
      `[\`${pkg.name}\`](${localePrefix(context.locale)}/apis/grpc/${pkg.slug}/)`,
      servers.length === 0 ? emptyCell : servers.map((server) => serviceLink(server, context)).join(", "),
      String(services.length),
      String(operations.length),
      String(pkg.files.reduce((count, file) => count + file.descriptor.messages.length, 0)),
      String(pkg.files.reduce((count, file) => count + file.descriptor.enums.length, 0))
    ];
  });

  const frontmatter = pageFrontmatter({
    title: text["grpc.index.title"],
    description: fillTemplate(text["grpc.index.description"], { version: context.release.version }),
    sidebarLabel: text["grpc.index.label"],
    sidebarOrder: 0,
    sourceHash
  });

  const intro = fillTemplate(text["grpc.index.intro"], {
    contracts: links.contracts,
    release: links.release,
    commit: links.commit,
    map: links.map
  });

  return `${[frontmatter, ...referenceBody([intro, markdownTable(headers, rows)])].join("\n\n")}\n`;
}
