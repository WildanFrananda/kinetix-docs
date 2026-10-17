import { catalogueFor } from "../../src/diagrams/engine/catalogue_for";
import type { GrpcPageContext } from "../types/grpc_page_context.type";
import type { ReferenceLinks } from "../types/reference_links.type";
import { localePrefix } from "./locale_prefix";

export function referenceLinks(context: GrpcPageContext): ReferenceLinks {
  const { repository, version, commit } = context.release;

  return {
    contracts: `[kinetix-contracts](${repository})`,
    release: `[${version}](https://www.npmjs.com/package/kinetix-contracts/v/${version})`,
    commit: `[\`${commit.slice(0, 7)}\`](${repository}/tree/${commit})`,
    map: `[${catalogueFor(context.locale)["grpc.map"]}](${localePrefix(context.locale)}/architecture/system-map/)`
  };
}
