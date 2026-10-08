import type { SourceLink } from "./source_link.type";

export type LocalizedMapCall = {
  readonly operation: string;
  readonly source: SourceLink;
  readonly note?: string;
};
