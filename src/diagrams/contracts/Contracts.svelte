<script lang="ts">
  import StepPlayer from "../engine/StepPlayer.svelte";
  import type { ContractLabels } from "../types/contract_labels.type";
  import type { ContractState } from "../types/contract_state.type";
  import type { LocalizedScenario } from "../types/localized_scenario.type";
  import type { NonEmpty } from "../types/non_empty.type";
  import type { PlayerLabels } from "../types/player_labels.type";
  import ContractScene from "./ContractScene.svelte";

  type Props = {
    variants: NonEmpty<LocalizedScenario<ContractState>>;
    labels: PlayerLabels;
    sceneLabels: ContractLabels;
  };

  let { variants, labels, sceneLabels }: Props = $props();
</script>

<StepPlayer {variants} {labels}>
  {#snippet scene(state: ContractState)}
    <ContractScene {state} labels={sceneLabels} />
  {/snippet}
</StepPlayer>
