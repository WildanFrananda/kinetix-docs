import type { LocalizedScenario } from "./localized_scenario.type";
import type { NonEmpty } from "./non_empty.type";
import type { PlayerLabels } from "./player_labels.type";

export type DiagramTranscriptProps = {
  readonly variants: NonEmpty<LocalizedScenario<unknown>>;
  readonly labels: PlayerLabels;
};
