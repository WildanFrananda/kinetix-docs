import type { DescEnum, DescField, DescMessage, DescMethod, DescService } from "@bufbuild/protobuf";
import { catalogueFor } from "../../src/diagrams/engine/catalogue_for";
import type { Catalogue } from "../../src/diagrams/types/catalogue.type";
import type { SourceLink } from "../../src/diagrams/types/source_link.type";
import type { ContractFile } from "../types/contract_file.type";
import type { GrpcPackage } from "../types/grpc_package.type";
import type { GrpcPageContext } from "../types/grpc_page_context.type";
import { emptyCell } from "./empty_cell";
import { fillTemplate } from "./fill_template";
import { grpcFieldType } from "./grpc_field_type";
import { grpcTypeLink } from "./grpc_type_link";
import { markdownTable } from "./markdown_table";
import { pageFrontmatter } from "./page_frontmatter";
import { protoSource } from "./proto_source";
import { referenceBody } from "./reference_body";
import { referenceLinks } from "./reference_links";
import { serviceLink } from "./service_link";
import { uniqueAnchors } from "./unique_anchors";

export function grpcPackagePage(pkg: GrpcPackage, context: GrpcPageContext, sourceHash?: string): string {
  const text = catalogueFor(context.locale);
  const links = referenceLinks(context);
  const services = pkg.files.flatMap((file) => file.descriptor.services.map((service) => ({ file, service })));
  const messages = pkg.files.flatMap((file) => file.descriptor.messages.map((message) => ({ file, message })));
  const enums = pkg.files.flatMap((file) => file.descriptor.enums.map((type) => ({ file, type })));

  uniqueAnchors(pkg.name, [
    text["grpc.heading.services"],
    text["grpc.heading.messages"],
    text["grpc.heading.enums"],
    ...services.map((entry) => entry.service.name),
    ...messages.map((entry) => entry.message.name),
    ...enums.map((entry) => entry.type.name)
  ]);

  const description = fillTemplate(text["grpc.package.description"], {
    package: pkg.name,
    version: context.release.version
  });

  const intro = fillTemplate(text["grpc.package.intro"], {
    release: links.release,
    files: pkg.files.map((file) => fileLink(file, context)).join(", "),
    map: links.map
  });

  const blocks = [
    pageFrontmatter({ title: pkg.name, description, sourceHash }),
    ...referenceBody([
      intro,
      ...section(
        text["grpc.heading.services"],
        services.map((entry) => serviceSection(entry.file, entry.service, pkg.name, context, text))
      ),
      ...section(
        text["grpc.heading.messages"],
        messages.map((entry) => messageSection(entry.file, entry.message, pkg.name, context, text))
      ),
      ...section(
        text["grpc.heading.enums"],
        enums.map((entry) => enumSection(entry.file, entry.type, context, text))
      )
    ])
  ];

  return `${blocks.join("\n\n")}\n`;
}

function section(heading: string, bodies: readonly string[]): readonly string[] {
  return bodies.length === 0 ? [] : [`## ${heading}`, ...bodies];
}

function fileLink(file: ContractFile, context: GrpcPageContext): string {
  const { repository, commit } = context.release;

  return `[\`${file.path}\`](${repository}/blob/${commit}/proto/${file.path})`;
}

function sourceLine(source: SourceLink, deprecated: boolean, text: Catalogue): string {
  const link = `[\`${source.label}\`](${source.href})`;

  return deprecated ? `${link} · *${text["grpc.deprecated"]}*` : link;
}

function serviceSection(
  file: ContractFile,
  service: DescService,
  here: string,
  context: GrpcPageContext,
  text: Catalogue
): string {
  const headers = [
    text["grpc.column.rpc"],
    text["grpc.column.exchange"],
    text["grpc.column.servedBy"],
    text["grpc.column.calledBy"]
  ];

  const rows = service.methods.map((method) => {
    const operation = `${service.typeName}/${method.name}`;
    const source = protoSource(file, `rpc ${service.name}/${method.name}`, context.release);
    const servers = context.connections.servers.get(operation) ?? [];
    const callers = context.connections.callers.get(operation) ?? [];
    const name = `[\`${method.name}\`](${source.href})`;

    return [
      method.deprecated ? `${name} · *${text["grpc.deprecated"]}*` : name,
      exchange(method, here, context),
      servers.length === 0 ? emptyCell : servers.map((server) => serviceLink(server, context)).join(", "),
      callers.length === 0 ? emptyCell : callers.map((caller) => `[${caller.service}](${caller.source.href})`).join(", ")
    ];
  });

  return [
    `### ${service.name}`,
    sourceLine(protoSource(file, `service ${service.name}`, context.release), service.deprecated, text),
    markdownTable(headers, rows)
  ].join("\n\n");
}

function exchange(method: DescMethod, here: string, context: GrpcPageContext): string {
  const streamsIn = method.methodKind === "client_streaming" || method.methodKind === "bidi_streaming";
  const streamsOut = method.methodKind === "server_streaming" || method.methodKind === "bidi_streaming";
  const input = grpcTypeLink(method.input, here, context.locale);
  const output = grpcTypeLink(method.output, here, context.locale);

  return `${streamsIn ? "`stream` " : ""}${input} → ${streamsOut ? "`stream` " : ""}${output}`;
}

function messageSection(
  file: ContractFile,
  message: DescMessage,
  here: string,
  context: GrpcPageContext,
  text: Catalogue
): string {
  const notes = message.fields.map((field) => fieldNotes(field, text));
  const noted = notes.some((note) => note.length > 0);

  const headers = [
    text["grpc.column.field"],
    text["grpc.column.number"],
    text["grpc.column.type"],
    ...(noted ? [text["grpc.column.notes"]] : [])
  ];

  const rows = message.fields.map((field, index) => [
    `\`${field.name}\``,
    String(field.number),
    grpcFieldType(field, here, context.locale),
    ...(noted ? [notes[index] ?? ""] : [])
  ]);

  return [
    `### ${message.name}`,
    sourceLine(protoSource(file, `message ${message.name}`, context.release), message.deprecated, text),
    message.fields.length === 0 ? text["grpc.noFields"] : markdownTable(headers, rows)
  ].join("\n\n");
}

function fieldNotes(field: DescField, text: Catalogue): string {
  return [
    ...(field.oneof === undefined ? [] : [`\`oneof ${field.oneof.name}\``]),
    ...(field.deprecated ? [text["grpc.deprecated"]] : [])
  ].join(", ");
}

function enumSection(file: ContractFile, type: DescEnum, context: GrpcPageContext, text: Catalogue): string {
  const noted = type.values.some((value) => value.deprecated);

  const headers = [
    text["grpc.column.name"],
    text["grpc.column.number"],
    ...(noted ? [text["grpc.column.notes"]] : [])
  ];

  const rows = type.values.map((value) => [
    `\`${value.name}\``,
    String(value.number),
    ...(noted ? [value.deprecated ? text["grpc.deprecated"] : ""] : [])
  ]);

  return [
    `### ${type.name}`,
    sourceLine(protoSource(file, `enum ${type.name}`, context.release), type.deprecated, text),
    markdownTable(headers, rows)
  ].join("\n\n");
}
