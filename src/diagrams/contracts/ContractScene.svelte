<script lang="ts">
  import { prefersReducedMotion } from "svelte/motion";
  import { fade, fly, scale } from "svelte/transition";
  import type { ContractLabels } from "../types/contract_labels.type";
  import type { ContractStageStatus } from "../types/contract_stage_status.type";
  import type { ContractState } from "../types/contract_state.type";
  import type { DiffLine } from "../types/diff_line.type";

  type Props = {
    state: ContractState;
    labels: ContractLabels;
  };

  let { state, labels }: Props = $props();

  const motion = (milliseconds: number): number => (prefersReducedMotion.current ? 0 : milliseconds);

  const signClass: Readonly<Record<DiffLine["sign"], string>> = { "+": "add", "-": "remove", " ": "context" };
  const glyph: Readonly<Record<ContractStageStatus, string>> = { pending: "", pass: "✓", fail: "✕", skipped: "–" };

  const reached = $derived(state.stages.findLastIndex((stage) => stage.status === "pass" || stage.status === "fail"));
  const failed = $derived(state.stages.some((stage) => stage.status === "fail"));
  const registries = $derived(state.release === null ? [] : state.release.split(" · "));
</script>

<div class="scene">
  <section class="change">
    <p class="heading">{labels.change}</p>
    <code class="file">{state.file}</code>
    {#if state.diff.length === 0}
      <p class="empty">{labels.noChange}</p>
    {:else}
      <div class="diff">
        {#each state.diff as line, index (index)}
          <div class="line {signClass[line.sign]}" in:fly={{ x: -10, duration: motion(240), delay: motion(index * 70) }}>
            <span class="sign" aria-hidden="true">{line.sign}</span>
            <code>{line.text}</code>
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <section class="pipeline">
    <p class="heading">{labels.pipeline}</p>
    <ol>
      {#each state.stages as stage, index (stage.id)}
        <li class="stage status-{stage.status}">
          {#if index < state.stages.length - 1}
            <span
              class="segment"
              class:filled={index < reached}
              class:failed={state.stages[index + 1]?.status === "fail"}
              style:transition-delay="{motion(index * 120)}ms"
              aria-hidden="true"
            ></span>
          {/if}
          {#key stage.status}
            <span class="marker" aria-hidden="true" in:scale={{ start: 0.4, duration: motion(260) }}>
              {glyph[stage.status]}
            </span>
          {/key}
          <span class="name">
            {labels.stages[stage.id]}
            <code>{labels.tools[stage.id]}</code>
          </span>
          <span class="status">{labels.statuses[stage.status]}</span>
        </li>
      {/each}
    </ol>
  </section>

  <section class="output" class:failed>
    <p class="heading">{labels.output}</p>
    {#if state.output.length === 0}
      <p class="empty">—</p>
    {:else}
      <div class="terminal">
        {#each state.output as line, index (line)}
          <code
            class:declared={line.trimStart().startsWith("declared:")}
            in:fade={{ duration: motion(240), delay: motion(index * 90) }}
          >{line}</code>
        {/each}
      </div>
    {/if}

    <div class="release">
      <span class="heading">{labels.release}</span>
      {#if registries.length > 0}
        <ul>
          {#each registries as registry, index (registry)}
            <li class:version={/^v\d/.test(registry)} in:fly={{ y: 6, duration: motion(260), delay: motion(index * 110) }}>
              {registry}
            </li>
          {/each}
        </ul>
      {:else if failed}
        <span class="none refused" in:fade={{ duration: motion(240) }}>{labels.noRelease}</span>
      {:else}
        <span class="none">—</span>
      {/if}
    </div>
  </section>
</div>

<style>
  .scene {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    gap: 0.75rem;
    font-size: var(--sl-text-xs);
  }

  @media (max-width: 40rem) {
    .scene {
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

  .output {
    grid-column: 1 / -1;
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
    color: var(--sl-color-gray-3);
    font-style: italic;
  }

  .file {
    align-self: flex-start;
    padding: 0.05rem 0.35rem;
    border: 1px solid var(--kx-rule-strong);
    color: var(--sl-color-gray-2);
    font-size: 0.68rem;
    overflow-wrap: anywhere;
  }

  .diff {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--kx-rule);
    background: var(--kx-surface);
  }

  .line {
    display: grid;
    grid-template-columns: 1.4rem minmax(0, 1fr);
    align-items: baseline;
    padding: 0.12rem 0;
  }

  .line code {
    color: var(--sl-color-white);
    font-size: 0.72rem;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .sign {
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
    text-align: center;
  }

  .line.add {
    background: color-mix(in srgb, var(--kx-lane-b) 14%, transparent);
  }

  .line.add .sign {
    color: var(--kx-lane-b);
    font-weight: 700;
  }

  .line.remove {
    background: color-mix(in srgb, var(--sl-color-red) 14%, transparent);
  }

  .line.remove .sign {
    color: var(--sl-color-red);
    font-weight: 700;
  }

  .line.remove code {
    text-decoration: line-through;
    text-decoration-color: color-mix(in srgb, var(--sl-color-red) 60%, transparent);
  }

  ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .stage {
    --marker: 1.15rem;
    --pad: 0.35rem;
    position: relative;
    display: grid;
    grid-template-columns: var(--marker) minmax(0, 1fr) auto;
    align-items: start;
    gap: 0.6rem;
    margin: 0;
    padding: var(--pad) 0;
  }

  .segment {
    position: absolute;
    top: calc(var(--pad) + var(--marker) / 2);
    bottom: calc(-1 * (var(--pad) + var(--marker) / 2));
    left: calc(var(--marker) / 2 - 1px);
    width: 2px;
    background: var(--kx-rule);
  }

  .segment::after {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--kx-lane-b);
    transform: scaleY(0);
    transform-origin: top;
    transition: transform 280ms ease;
    transition-delay: inherit;
  }

  .segment.failed::after {
    background: var(--sl-color-red);
  }

  .segment.filled::after {
    transform: scaleY(1);
  }

  .marker {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    width: var(--marker);
    height: var(--marker);
    border: 1px solid var(--sl-color-gray-4);
    border-radius: var(--kx-radius);
    background: var(--sl-color-black);
    color: var(--sl-color-black);
    font-size: 0.7rem;
    font-weight: 700;
    line-height: 1;
  }

  .status-pass .marker {
    border-color: var(--kx-lane-b);
    background: var(--kx-lane-b);
  }

  .status-fail .marker {
    border-color: var(--sl-color-red);
    background: var(--sl-color-red);
  }

  .status-skipped .marker {
    border-style: dashed;
    color: var(--sl-color-gray-3);
  }

  .name {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    color: var(--sl-color-white);
    font-weight: 600;
    line-height: 1.3;
  }

  .name code {
    color: var(--sl-color-gray-3);
    font-size: 0.66rem;
    font-weight: 400;
    overflow-wrap: anywhere;
  }

  .status {
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
    font-size: 0.68rem;
    line-height: var(--marker);
  }

  .status-pass .status {
    color: var(--kx-lane-b);
    font-weight: 600;
  }

  .status-fail .status {
    color: var(--sl-color-red);
    font-weight: 600;
  }

  .status-skipped .name {
    color: var(--sl-color-gray-3);
  }

  .terminal {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.55rem 0.65rem;
    border: 1px solid var(--kx-rule);
    border-left: 3px solid var(--kx-lane-b);
    background: var(--kx-surface);
  }

  .output.failed .terminal {
    border-left-color: var(--sl-color-red);
  }

  .terminal code {
    color: var(--sl-color-white);
    font-size: 0.7rem;
    line-height: 1.5;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .terminal code.declared {
    color: var(--kx-lane-b);
  }

  .release {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem 0.75rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--kx-rule);
  }

  .release ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .release li {
    margin: 0;
    padding: 0.1rem 0.45rem;
    border: 1px solid var(--kx-lane-b);
    border-radius: var(--kx-radius);
    color: var(--sl-color-white);
    font-family: var(--sl-font-mono);
    font-size: 0.68rem;
  }

  .release li.version {
    border-color: var(--sl-color-accent);
    color: var(--sl-color-accent-high);
    font-weight: 600;
  }

  .none {
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
    font-size: 0.7rem;
  }

  .none.refused {
    color: var(--sl-color-red);
    font-weight: 600;
  }

  @media (prefers-reduced-motion: reduce) {
    .segment::after {
      transition: none;
    }
  }
</style>
