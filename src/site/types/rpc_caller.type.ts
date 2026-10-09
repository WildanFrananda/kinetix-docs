import type { SourceLink } from "../../diagrams/types/source_link.type";

export type RpcCaller = {
  readonly service: string;
  readonly source: SourceLink;
};
