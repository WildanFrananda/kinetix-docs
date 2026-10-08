<script lang="ts">
  import StepPlayer from "../engine/StepPlayer.svelte";
  import type { LocalizedScenario } from "../types/localized_scenario.type";
  import type { NonEmpty } from "../types/non_empty.type";
  import type { PlayerLabels } from "../types/player_labels.type";
  import type { SagaDiagramState } from "../types/saga_diagram_state.type";
  import type { SagaLabels } from "../types/saga_labels.type";
  import type { SagaLaneLogos } from "../types/saga_lane_logos.type";
  import SagaScene from "./SagaScene.svelte";

  type Props = {
    variants: NonEmpty<LocalizedScenario<SagaDiagramState>>;
    labels: PlayerLabels;
    sceneLabels: SagaLabels;
    logos: SagaLaneLogos;
  };

  let { variants, labels, sceneLabels, logos }: Props = $props();
</script>

<StepPlayer {variants} {labels}>
  {#snippet scene(state: SagaDiagramState, step)}
    <SagaScene {state} {step} labels={sceneLabels} {logos} />
  {/snippet}
</StepPlayer>
