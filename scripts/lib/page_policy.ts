import type { ContentSecurityPolicy } from "../types/content_security_policy.type";
import type { InlineBlocks } from "../types/inline_blocks.type";
import { cspHash } from "./csp_hash";

export function pagePolicy(policy: ContentSecurityPolicy, blocks: InlineBlocks): string {
  const scriptHashes = [...new Set(blocks.scripts.map(cspHash))];
  const styleHashes = [...new Set(blocks.styles.map(cspHash))];

  return [
    ...policy.directives,
    ["script-src", ...policy.scriptSources, ...scriptHashes].join(" "),
    ["style-src", ...policy.styleElementSources, ...policy.styleAttributeSources].join(" "),
    ["style-src-elem", ...policy.styleElementSources, ...styleHashes].join(" "),
    ["style-src-attr", ...policy.styleAttributeSources].join(" ")
  ].join("; ");
}
