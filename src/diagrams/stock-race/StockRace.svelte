<script lang="ts">
  import StepPlayer from "../engine/StepPlayer.svelte";
  import type { LocalizedScenario } from "../types/localized_scenario.type";
  import type { NonEmpty } from "../types/non_empty.type";
  import type { PlayerLabels } from "../types/player_labels.type";
  import type { StockRaceLabels } from "../types/stock_race_labels.type";
  import type { StockRaceState } from "../types/stock_race_state.type";
  import StockRaceScene from "./StockRaceScene.svelte";

  type Props = {
    variants: NonEmpty<LocalizedScenario<StockRaceState>>;
    labels: PlayerLabels;
    sceneLabels: StockRaceLabels;
  };

  let { variants, labels, sceneLabels }: Props = $props();
</script>

<StepPlayer {variants} {labels}>
  {#snippet scene(state: StockRaceState, step)}
    <StockRaceScene {state} {step} labels={sceneLabels} />
  {/snippet}
</StepPlayer>
