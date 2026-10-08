import type { SourceLink } from "./source_link.type";

export type LocalizedStep<State> = {
  readonly actor: string;
  readonly actorLabel: string;
  readonly statement: string;
  readonly narration: string;
  readonly state: State;
  readonly source?: SourceLink;
};
