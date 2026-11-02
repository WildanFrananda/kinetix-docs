import type { InlineBlocks } from "../types/inline_blocks.type";

export function inlineBlocks(html: string): InlineBlocks {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => !/\ssrc\s*=/i.test(match[1]))
    .map((match) => match[2]);
  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => match[1]);

  return { scripts, styles };
}
