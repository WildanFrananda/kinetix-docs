<script lang="ts">
  import StepPlayer from "../engine/StepPlayer.svelte";
  import type { IdemLabels } from "../types/idem_labels.type";
  import type { IdemState } from "../types/idem_state.type";
  import type { LocalizedScenario } from "../types/localized_scenario.type";
  import type { NonEmpty } from "../types/non_empty.type";
  import type { PlayerLabels } from "../types/player_labels.type";
  import IdempotencyScene from "./IdempotencyScene.svelte";

  type Props = {
    variants: NonEmpty<LocalizedScenario<IdemState>>;
    labels: PlayerLabels;
    sceneLabels: IdemLabels;
  };

  let { variants, labels, sceneLabels }: Props = $props();
</script>

<StepPlayer {variants} {labels}>
  {#snippet scene(state: IdemState, step)}
    <IdempotencyScene {state} {step} labels={sceneLabels} />
  {/snippet}
</StepPlayer>
