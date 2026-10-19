<script lang="ts">
  import StepPlayer from "../engine/StepPlayer.svelte";
  import type { LocalizedScenario } from "../types/localized_scenario.type";
  import type { NonEmpty } from "../types/non_empty.type";
  import type { PlayerLabels } from "../types/player_labels.type";
  import type { SigningKeyLabels } from "../types/signing_key_labels.type";
  import type { SigningKeyState } from "../types/signing_key_state.type";
  import SigningKeyScene from "./SigningKeyScene.svelte";

  type Props = {
    variants: NonEmpty<LocalizedScenario<SigningKeyState>>;
    labels: PlayerLabels;
    sceneLabels: SigningKeyLabels;
  };

  let { variants, labels, sceneLabels }: Props = $props();
</script>

<StepPlayer {variants} {labels}>
  {#snippet scene(state: SigningKeyState, step)}
    <SigningKeyScene {state} {step} labels={sceneLabels} />
  {/snippet}
</StepPlayer>
