<script lang="ts">
  import { prefersReducedMotion } from "svelte/motion";
  import { fade, fly } from "svelte/transition";
  import type { LocalizedStep } from "../types/localized_step.type";
  import type { TrustLabels } from "../types/trust_labels.type";
  import type { TrustState } from "../types/trust_state.type";

  type Props = {
    state: TrustState;
    step: LocalizedStep<TrustState> | null;
    labels: TrustLabels;
  };

  let { state, step, labels }: Props = $props();

  const motion = (milliseconds: number): number => (prefersReducedMotion.current ? 0 : milliseconds);
  const newest = $derived(state.calls.length - 1);
</script>

<div class="scene era-{state.era}">
  <header class="banner">
    <span class="era">{labels.eras[state.era]}</span>
    <code class="endpoint">{state.endpoint}</code>
  </header>

  <div class="columns">
    <section class="request">
      <p class="heading">{labels.request}</p>
      {#if state.fields.length === 0}
        <p class="empty">—</p>
      {:else}
        <ul>
          {#each state.fields as field (field.name)}
            <li class="field verdict-{field.verdict}" in:fly={{ x: -10, duration: motion(250) }}>
              <code class="name">{field.name}</code>
              <code class="value">{field.value}</code>
              <span class="verdict">{labels.verdicts[field.verdict]}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </section>

    <section class="flow">
      <p class="heading">{labels.path}</p>
      {#if state.calls.length === 0}
        <p class="empty">—</p>
      {:else}
        <ol>
          {#each state.calls as call, index (`${call.from}>${call.to}>${call.label}`)}
            <li class="call" class:newest={step !== null && index === newest} in:fly={{ y: -6, duration: motion(250) }}>
              <span class="hop"><code>{call.from}</code><span class="arrow">→</span><code>{call.to}</code></span>
              <code class="label">{call.label}</code>
            </li>
          {/each}
        </ol>
      {/if}

      {#if state.outcome !== null}
        <div class="outcome outcome-{state.outcome.verdict}" in:fade={{ duration: motion(300) }}>
          <p class="heading">{labels.outcome}</p>
          <dl>
            {#each state.outcome.amounts as amount (amount.kind)}
              <div>
                <dt>{labels.amounts[amount.kind]}</dt>
                <dd>{amount.value}</dd>
              </div>
            {/each}
          </dl>
          <p class="decided">{labels.outcomes[state.outcome.verdict]}</p>
        </div>
      {/if}
    </section>
  </div>
</div>

<style>
  .scene {
    --era: var(--sl-color-red);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    font-size: var(--sl-text-xs);
  }

  .scene.era-after {
    --era: var(--kx-lane-b);
  }

  .banner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 0.9rem;
    padding: 0.5rem 0.75rem;
    border-left: 3px solid var(--era);
    background: color-mix(in srgb, var(--era) 10%, var(--sl-color-black));
    transition: background-color 300ms ease;
  }

  .era {
    color: var(--era);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .endpoint {
    color: var(--sl-color-white);
    font-size: 0.72rem;
    overflow-wrap: anywhere;
  }

  .columns {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 0.75rem;
  }

  @media (max-width: 40rem) {
    .columns {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
    padding: 0.75rem;
    border: 1px solid var(--kx-rule);
    background: var(--sl-color-black);
  }

  .heading {
    margin: 0;
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .empty {
    margin: 0;
    color: var(--sl-color-gray-4);
  }

  ul,
  ol {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    margin: 0;
  }

  .field {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-areas:
      "name value"
      "verdict verdict";
    gap: 0.1rem 0.6rem;
    padding: 0.35rem 0.5rem;
    border: 1px solid var(--kx-rule);
    border-left-width: 3px;
  }

  .name {
    grid-area: name;
    color: var(--sl-color-white);
    font-size: 0.72rem;
    font-weight: 600;
  }

  .value {
    grid-area: value;
    color: var(--sl-color-gray-2);
    font-size: 0.72rem;
    text-align: end;
    overflow-wrap: anywhere;
  }

  .verdict {
    grid-area: verdict;
    color: var(--sl-color-gray-3);
    font-size: 0.68rem;
  }

  .verdict-asserted {
    border-left-color: var(--sl-color-red);
    background: color-mix(in srgb, var(--sl-color-red) 8%, transparent);
  }

  .verdict-asserted .verdict {
    color: var(--sl-color-red-high);
    font-weight: 600;
  }

  .verdict-choice {
    border-left-color: var(--sl-color-gray-4);
  }

  .verdict-resolved {
    border-left-color: var(--kx-lane-b);
  }

  .verdict-resolved .verdict {
    color: var(--kx-lane-b);
    font-weight: 600;
  }

  .call {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    padding: 0.3rem 0.5rem;
    border-left: 2px solid var(--kx-rule-strong);
  }

  .call.newest {
    border-left-color: var(--sl-color-accent);
    background: var(--sl-color-gray-6);
  }

  .hop {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: var(--sl-color-gray-3);
    font-size: 0.7rem;
  }

  .arrow {
    color: var(--sl-color-accent);
  }

  .label {
    color: var(--sl-color-white);
    font-size: 0.72rem;
    overflow-wrap: anywhere;
  }

  .outcome {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-top: 0.25rem;
    padding: 0.6rem 0.7rem;
    border: 1px solid var(--outcome);
    border-left-width: 3px;
  }

  .outcome-forged {
    --outcome: var(--sl-color-red);
  }

  .outcome-owned {
    --outcome: var(--kx-lane-b);
  }

  dl {
    margin: 0;
  }

  dl div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
  }

  dt {
    color: var(--sl-color-gray-3);
  }

  dd {
    margin: 0;
    color: var(--sl-color-white);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-base);
    font-weight: 600;
  }

  .decided {
    margin: 0;
    color: var(--outcome);
    font-family: var(--sl-font-mono);
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  @media (prefers-reduced-motion: reduce) {
    .banner {
      transition: none;
    }
  }
</style>
