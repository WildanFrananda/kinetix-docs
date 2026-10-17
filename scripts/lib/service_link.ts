import type { GrpcPageContext } from "../types/grpc_page_context.type";
import { localePrefix } from "./locale_prefix";

export function serviceLink(service: string, context: GrpcPageContext): string {
  return context.servicePages.has(service) ? `[${service}](${localePrefix(context.locale)}/services/${service}/)` : service;
}
