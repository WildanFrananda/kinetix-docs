import { type DescField, ScalarType } from "@bufbuild/protobuf";
import type { Locale } from "../../src/diagrams/types/locale.type";
import { grpcTypeLink } from "./grpc_type_link";

export function grpcFieldType(field: DescField, here: string, locale: Locale): string {
  const optional = field.proto.proto3Optional ? "optional" : undefined;

  switch (field.fieldKind) {
    case "scalar":
      return scalar(optional, field.scalar);
    case "enum":
      return linked(optional, grpcTypeLink(field.enum, here, locale));
    case "message":
      return linked(optional, grpcTypeLink(field.message, here, locale));
    case "list":
      switch (field.listKind) {
        case "scalar":
          return scalar("repeated", field.scalar);
        case "enum":
          return linked("repeated", grpcTypeLink(field.enum, here, locale));
        case "message":
          return linked("repeated", grpcTypeLink(field.message, here, locale));
      }
    case "map":
      switch (field.mapKind) {
        case "scalar":
          return `\`map<${scalarName(field.mapKey)}, ${scalarName(field.scalar)}>\``;
        case "enum":
          return `\`map<${scalarName(field.mapKey)}, ${field.enum.typeName}>\``;
        case "message":
          return `\`map<${scalarName(field.mapKey)}, ${field.message.typeName}>\``;
      }
  }
}

function scalar(modifier: string | undefined, type: ScalarType): string {
  return modifier === undefined ? `\`${scalarName(type)}\`` : `\`${modifier} ${scalarName(type)}\``;
}

function linked(modifier: string | undefined, link: string): string {
  return modifier === undefined ? link : `\`${modifier}\` ${link}`;
}

function scalarName(type: ScalarType): string {
  return ScalarType[type].toLowerCase();
}
