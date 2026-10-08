import type { LocalizedStep } from "./localized_step.type";
import type { NonEmpty } from "./non_empty.type";

export type LocalizedScenario<State> = {
  readonly id: string;
  readonly title: string;
  readonly introduction: string;
  readonly outcome: string;
  readonly initial: State;
  readonly steps: NonEmpty<LocalizedStep<State>>;
};
