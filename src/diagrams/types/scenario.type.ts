import type { CatalogueKey } from "./catalogue_key.type";
import type { NonEmpty } from "./non_empty.type";
import type { ScenarioStep } from "./scenario_step.type";

export type Scenario<State> = {
  readonly id: string;
  readonly title: CatalogueKey;
  readonly introduction: CatalogueKey;
  readonly outcome: CatalogueKey;
  readonly actors: Readonly<Record<string, CatalogueKey>>;
  readonly initial: State;
  readonly steps: NonEmpty<ScenarioStep<State>>;
};
