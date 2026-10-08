<script lang="ts">
  import StepPlayer from "../engine/StepPlayer.svelte";
  import type { LocalizedScenario } from "../types/localized_scenario.type";
  import type { NonEmpty } from "../types/non_empty.type";
  import type { PlayerLabels } from "../types/player_labels.type";
  import type { TrustLabels } from "../types/trust_labels.type";
  import type { TrustState } from "../types/trust_state.type";
  import TrustScene from "./TrustScene.svelte";

  type Props = {
    variants: NonEmpty<LocalizedScenario<TrustState>>;
    labels: PlayerLabels;
    sceneLabels: TrustLabels;
  };

  let { variants, labels, sceneLabels }: Props = $props();
</script>

<StepPlayer {variants} {labels}>
  {#snippet scene(state: TrustState, step)}
    <TrustScene {state} {step} labels={sceneLabels} />
  {/snippet}
</StepPlayer>
