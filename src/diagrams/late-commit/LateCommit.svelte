<script lang="ts">
  import StepPlayer from "../engine/StepPlayer.svelte";
  import type { LateCommitLabels } from "../types/late_commit_labels.type";
  import type { LateCommitState } from "../types/late_commit_state.type";
  import type { LocalizedScenario } from "../types/localized_scenario.type";
  import type { NonEmpty } from "../types/non_empty.type";
  import type { PlayerLabels } from "../types/player_labels.type";
  import LateCommitScene from "./LateCommitScene.svelte";

  type Props = {
    variants: NonEmpty<LocalizedScenario<LateCommitState>>;
    labels: PlayerLabels;
    sceneLabels: LateCommitLabels;
  };

  let { variants, labels, sceneLabels }: Props = $props();
</script>

<StepPlayer {variants} {labels}>
  {#snippet scene(state: LateCommitState, step)}
    <LateCommitScene {state} {step} labels={sceneLabels} />
  {/snippet}
</StepPlayer>
