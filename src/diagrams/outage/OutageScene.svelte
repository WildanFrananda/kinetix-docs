<script lang="ts">
  import { prefersReducedMotion } from "svelte/motion";
  import { fade, fly, scale } from "svelte/transition";
  import type { OutageLabels } from "../types/outage_labels.type";
  import type { OutageState } from "../types/outage_state.type";

  type Props = {
    state: OutageState;
    labels: OutageLabels;
  };

  let { state, labels }: Props = $props();

  const motion = (milliseconds: number): number => (prefersReducedMotion.current ? 0 : milliseconds);
</script>

<div class="scene">
  <section class="wire">
    <div class="nodes">
      <span class="node">{labels.client}</span>
      <span class="edge" aria-hidden="true"></span>
      <span class="node caller">{state.caller}</span>
      <span class="edge call" class:cut={state.link === "unreachable"} aria-hidden="true">
        {#key state}
          {#if state.link !== null && !prefersReducedMotion.current}
            <span class="packet {state.link}"></span>
          {/if}
          {#if state.link === "unreachable"}
            <span class="break">✕</span>
          {/if}
        {/key}
      </span>
      <span class="node dependency" class:down={state.link === "unreachable"}>{state.dependency}</span>
    </div>
    <div class="caption">
      <code class="request">{state.request}</code>
      <span class="call-line">
        <code>{state.caller} → {state.dependency} · {state.call}</code>
        {#if state.link !== null}
          <span class="link {state.link}">{labels.links[state.link]}</span>
        {/if}
      </span>
    </div>
  </section>

  {#key state}
    <section class="answer">
      <p class="heading">{labels.answer}</p>
      {#if state.answer.length === 0}
        <p class="empty">—</p>
      {:else}
        <div class="code" class:failure={state.link === "unreachable"}>
          {#each state.answer as line, index (index)}
            <code in:fade|global={{ duration: motion(240), delay: motion(650 + index * 80) }}>{line}</code>
          {/each}
        </div>
      {/if}
    </section>

    <section class="handling">
      <div class="heading-row">
        <p class="heading">{labels.handling}</p>
        {#if state.era !== null}
          <span class="era era-{state.era}">{labels.eras[state.era]}</span>
        {/if}
      </div>
      {#if state.handling.length === 0}
        <p class="empty">—</p>
      {:else}
        <div class="code">
          {#each state.handling as line, index (index)}
            <code in:fly|global={{ x: -8, duration: motion(220), delay: motion(800 + index * 45) }}>{line}</code>
          {/each}
        </div>
      {/if}
    </section>

    <section class="reply verdict-{state.verdict ?? 'none'}">
      <div class="heading-row">
        <p class="heading">{labels.reply}</p>
        {#if state.verdict !== null}
          <span class="stamp" in:scale|global={{ start: 0.6, duration: motion(260), delay: motion(1500) }}>
            {labels.verdicts[state.verdict]}
          </span>
        {/if}
      </div>
      {#if state.reply === null}
        <p class="empty">—</p>
      {:else}
        <div class="response" in:fade|global={{ duration: motion(280), delay: motion(1200) }}>
          <code class="status">{state.reply.status}</code>
          <div class="body">
            <code>{"{"}</code>
            {#each state.reply.body as line, index (index)}
              <code class="field">{line}{index < state.reply.body.length - 1 ? "," : ""}</code>
            {/each}
            <code>{"}"}</code>
          </div>
        </div>
      {/if}
    </section>
  {/key}
</div>

<style>
  .scene {
    display: grid;
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.6fr);
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

  .wire,
  .reply {
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

  .heading-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.35rem 0.75rem;
  }

  .empty {
    margin: 0;
    color: var(--sl-color-gray-3);
  }

  .nodes {
    display: flex;
    align-items: center;
    padding: 0.35rem 0;
  }

  .node {
    flex: none;
    padding: 0.35rem 0.6rem;
    border: 1px solid var(--kx-rule-strong);
    border-radius: var(--kx-radius);
    background: var(--kx-surface);
    color: var(--sl-color-white);
    font-family: var(--sl-font-mono);
    font-size: 0.72rem;
    font-weight: 600;
  }

  .node.caller {
    border-color: var(--sl-color-accent);
  }

  .node.dependency.down {
    border-style: dashed;
    border-color: var(--sl-color-red);
    color: var(--sl-color-gray-3);
  }

  .edge {
    position: relative;
    flex: 1;
    min-width: 1.25rem;
    height: 2px;
    background: var(--kx-rule-strong);
  }

  .edge.call {
    min-width: 3rem;
  }

  .edge.cut {
    background: repeating-linear-gradient(to right, var(--sl-color-red) 0 5px, transparent 5px 9px);
  }

  .packet {
    position: absolute;
    top: 50%;
    left: 0;
    width: 0.5rem;
    height: 0.5rem;
    margin-top: -0.25rem;
    border-radius: 50%;
    background: var(--sl-color-accent);
    opacity: 0;
  }

  .packet.answered {
    animation: round-trip 1.3s ease-in-out forwards;
  }

  .packet.unreachable {
    animation: lost 1.1s ease-in forwards;
  }

  .break {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 0 0.2rem;
    background: var(--sl-color-black);
    color: var(--sl-color-red);
    font-size: 0.8rem;
    font-weight: 700;
    line-height: 1;
    transform: translate(-50%, -50%);
    animation: appear 0.25s ease-out 0.6s both;
  }

  .caption {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.35rem 1rem;
  }

  .caption code {
    color: var(--sl-color-gray-2);
    font-size: 0.68rem;
    overflow-wrap: anywhere;
  }

  .call-line {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.5rem;
  }

  .link {
    font-family: var(--sl-font-mono);
    font-size: 0.68rem;
    font-weight: 600;
  }

  .link.answered {
    color: var(--kx-lane-b);
  }

  .link.unreachable {
    color: var(--sl-color-red);
  }

  .code {
    display: flex;
    flex-direction: column;
    padding: 0.5rem 0.6rem;
    border: 1px solid var(--kx-rule);
    background: var(--kx-surface);
  }

  .code code {
    min-height: 1.1em;
    padding-left: 4ch;
    color: var(--sl-color-white);
    font-size: 0.7rem;
    line-height: 1.5;
    text-indent: -4ch;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .code.failure code {
    color: var(--sl-color-red);
    font-weight: 600;
  }

  .era {
    padding: 0.05rem 0.4rem;
    border: 1px solid var(--kx-rule-strong);
    border-radius: var(--kx-radius);
    color: var(--sl-color-gray-2);
    font-family: var(--sl-font-mono);
    font-size: 0.66rem;
  }

  .era-before {
    border-color: var(--sl-color-red);
    color: var(--sl-color-red);
  }

  .era-after {
    border-color: var(--kx-lane-a);
    color: var(--kx-lane-a);
  }

  .reply {
    --verdict: var(--kx-rule-strong);
    border-left: 3px solid var(--verdict);
  }

  .verdict-true {
    --verdict: var(--kx-lane-b);
  }

  .verdict-false {
    --verdict: var(--sl-color-red);
  }

  .verdict-honest {
    --verdict: var(--kx-lane-a);
  }

  .stamp {
    padding: 0.15rem 0.5rem;
    border: 1.5px solid var(--verdict);
    border-radius: var(--kx-radius);
    color: var(--verdict);
    font-family: var(--sl-font-mono);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .response {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .status {
    align-self: flex-start;
    color: var(--sl-color-white);
    font-size: 0.78rem;
    font-weight: 700;
    overflow-wrap: anywhere;
  }

  .body {
    display: flex;
    flex-direction: column;
    padding: 0.5rem 0.6rem;
    border: 1px solid var(--kx-rule);
    background: var(--kx-surface);
  }

  .body code {
    color: var(--sl-color-white);
    font-size: 0.7rem;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .body code.field {
    padding-left: 1rem;
  }

  @keyframes round-trip {
    0% {
      left: 0;
      opacity: 0;
    }
    8% {
      opacity: 1;
    }
    45%,
    55% {
      left: calc(100% - 0.5rem);
    }
    92% {
      opacity: 1;
    }
    100% {
      left: 0;
      opacity: 0;
    }
  }

  @keyframes lost {
    0% {
      left: 0;
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    55% {
      left: calc(50% - 0.25rem);
      opacity: 1;
    }
    100% {
      left: calc(50% - 0.25rem);
      opacity: 0;
    }
  }

  @keyframes appear {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.4);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .break {
      animation: none;
    }
  }
</style>
