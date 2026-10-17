import type { DescEnum, DescMessage } from "@bufbuild/protobuf";
import type { Locale } from "../../src/diagrams/types/locale.type";
import { grpcSlug } from "./grpc_slug";
import { localePrefix } from "./locale_prefix";

export function grpcTypeLink(type: DescMessage | DescEnum, here: string, locale: Locale): string {
  const owner = type.file.proto.package;

  if (owner.startsWith("google.")) {
    return `\`${type.typeName}\``;
  }

  const page = owner === here ? "" : `${localePrefix(locale)}/apis/grpc/${grpcSlug(owner)}/`;
  const label = owner === here ? type.name : type.typeName;

  return `[\`${label}\`](${page}#${type.name.toLowerCase()})`;
}
