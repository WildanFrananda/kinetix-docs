import type { CatalogueKey } from "./catalogue_key.type";
import type { SourceLink } from "./source_link.type";

export type ScenarioStep<State> = {
  readonly actor: string;
  readonly statement: string;
  readonly narration: CatalogueKey;
  readonly state: State;
  readonly source?: SourceLink;
};
