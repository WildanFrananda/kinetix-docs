<script lang="ts">
  import StepPlayer from "../engine/StepPlayer.svelte";
  import type { LocalizedScenario } from "../types/localized_scenario.type";
  import type { NonEmpty } from "../types/non_empty.type";
  import type { OutageLabels } from "../types/outage_labels.type";
  import type { OutageState } from "../types/outage_state.type";
  import type { PlayerLabels } from "../types/player_labels.type";
  import OutageScene from "./OutageScene.svelte";

  type Props = {
    variants: NonEmpty<LocalizedScenario<OutageState>>;
    labels: PlayerLabels;
    sceneLabels: OutageLabels;
  };

  let { variants, labels, sceneLabels }: Props = $props();
</script>

<StepPlayer {variants} {labels}>
  {#snippet scene(state: OutageState)}
    <OutageScene {state} labels={sceneLabels} />
  {/snippet}
</StepPlayer>
