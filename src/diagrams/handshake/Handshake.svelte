<script lang="ts">
  import StepPlayer from "../engine/StepPlayer.svelte";
  import type { HandshakeLabels } from "../types/handshake_labels.type";
  import type { HandshakeState } from "../types/handshake_state.type";
  import type { LocalizedScenario } from "../types/localized_scenario.type";
  import type { NonEmpty } from "../types/non_empty.type";
  import type { PlayerLabels } from "../types/player_labels.type";
  import HandshakeScene from "./HandshakeScene.svelte";

  type Props = {
    variants: NonEmpty<LocalizedScenario<HandshakeState>>;
    labels: PlayerLabels;
    sceneLabels: HandshakeLabels;
  };

  let { variants, labels, sceneLabels }: Props = $props();
</script>

<StepPlayer {variants} {labels}>
  {#snippet scene(state: HandshakeState)}
    <HandshakeScene {state} labels={sceneLabels} />
  {/snippet}
</StepPlayer>
