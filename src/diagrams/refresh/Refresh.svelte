<script lang="ts">
  import StepPlayer from "../engine/StepPlayer.svelte";
  import type { LocalizedScenario } from "../types/localized_scenario.type";
  import type { NonEmpty } from "../types/non_empty.type";
  import type { PlayerLabels } from "../types/player_labels.type";
  import type { RefreshLabels } from "../types/refresh_labels.type";
  import type { RefreshState } from "../types/refresh_state.type";
  import RefreshScene from "./RefreshScene.svelte";

  type Props = {
    variants: NonEmpty<LocalizedScenario<RefreshState>>;
    labels: PlayerLabels;
    sceneLabels: RefreshLabels;
  };

  let { variants, labels, sceneLabels }: Props = $props();
</script>

<StepPlayer {variants} {labels}>
  {#snippet scene(state: RefreshState)}
    <RefreshScene {state} labels={sceneLabels} />
  {/snippet}
</StepPlayer>
