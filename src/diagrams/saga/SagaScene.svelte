<script lang="ts">
  import { prefersReducedMotion } from "svelte/motion";
  import { fade, fly } from "svelte/transition";
  import type { LocalizedStep } from "../types/localized_step.type";
  import type { SagaDiagramState } from "../types/saga_diagram_state.type";
  import type { SagaLabels } from "../types/saga_labels.type";
  import type { SagaLane } from "../types/saga_lane.type";
  import type { SagaLaneLogos } from "../types/saga_lane_logos.type";

  type Props = {
    state: SagaDiagramState;
    step: LocalizedStep<SagaDiagramState> | null;
    labels: SagaLabels;
    logos: SagaLaneLogos;
  };

  let { state, step, labels, logos }: Props = $props();

  const lanes: readonly SagaLane[] = ["order", "pricing", "warehouse", "payment"];
  const centre: Readonly<Record<SagaLane, number>> = { order: 50, pricing: 150, warehouse: 250, payment: 350 };

  const motion = (milliseconds: number): number => (prefersReducedMotion.current ? 0 : milliseconds);

  const message = $derived(state.message);
  const target = $derived(message === null ? null : centre[message.to]);
  const replyMark = $derived(
    message === null ? "" : message.reply === "ok" ? "✓" : message.reply === "silent" ? "…" : "✕"
  );
</script>

<div class="scene">
  <dl class="status">
    <div>
      <dt>{labels.saga}</dt>
      <dd class="chip saga-{state.saga.toLowerCase()}">{state.saga}</dd>
    </div>
    <div>
      <dt>{labels.order}</dt>
      <dd class="chip order-{state.order.toLowerCase()}">{state.order}</dd>
    </div>
    {#if state.http !== null}
      <div transition:fade={{ duration: motion(200) }}>
        <dt>{labels.http}</dt>
        <dd class="chip http" class:http-error={state.http.startsWith("4")}>{state.http}</dd>
      </div>
    {/if}
    {#if state.nextRound !== null}
      <div transition:fade={{ duration: motion(200) }}>
        <dt>{labels.nextRound}</dt>
        <dd class="chip next">{state.nextRound}</dd>
      </div>
    {/if}
  </dl>

  <div class="lanes">
    <div class="lane-heads">
      {#each lanes as lane (lane)}
        <p class="lane-head" class:active={message !== null && (lane === "order" || lane === message.to)}>
          <img src={logos[lane]} alt="" />
          <span>{lane}</span>
        </p>
      {/each}
    </div>

    <div class="wire">
      <svg viewBox="0 0 400 96" preserveAspectRatio="none" aria-hidden="true">
        {#each lanes as lane (lane)}
          <line class="lifeline" x1={centre[lane]} y1="0" x2={centre[lane]} y2="96" />
        {/each}
      </svg>

      {#if message !== null && target !== null && step !== null}
        {#key step}
          <div class="call" class:compensation={message.compensation}>
            <p class="statement" in:fly={{ y: -6, duration: motion(250) }}>
              {#if message.compensation}<span class="tag">↩ {labels.compensation}</span>{/if}
              <code>{step.statement}</code>
            </p>
            <svg viewBox="0 0 400 96" preserveAspectRatio="none" aria-hidden="true">
              <line class="arrow-out" x1={centre.order + 6} y1="34" x2={target - 6} y2="34" pathLength="1" />
              <polygon class="head-out" points="{target - 6},34 {target - 14},30 {target - 14},38" />
              {#if message.reply !== "silent"}
                <line class="arrow-back reply-{message.reply}" x1={target - 6} y1="70" x2={centre.order + 6} y2="70" pathLength="1" />
                <polygon class="head-back reply-{message.reply}" points="{centre.order + 6},70 {centre.order + 14},66 {centre.order + 14},74" />
              {/if}
            </svg>
            {#if !prefersReducedMotion.current}
              <span class="packet" style="--from: {(centre.order / 400) * 100}%; --to: {(target / 400) * 100}%;"></span>
            {/if}
            {#if message.reply === "silent"}
              <span class="waiting" style:left="{(target / 400) * 100}%"></span>
            {/if}
            <p
              class="reply reply-{message.reply}"
              class:reply-right={target > 200}
              style:--x="{(target / 400) * 100}%"
            >
              {replyMark} {labels.replies[message.reply]}{#if message.detail !== undefined}: <code>{message.detail}</code>{/if}
            </p>
          </div>
        {/key}
      {/if}
    </div>
  </div>

  <div class="log">
    <p class="log-title">{labels.log}</p>
    {#if state.rows.length === 0}
      <p class="empty">{labels.empty}</p>
    {:else}
      <table>
        <thead>
          <tr>
            <th>{labels.step}</th>
            <th>{labels.holds}</th>
            <th>{labels.state}</th>
          </tr>
        </thead>
        <tbody>
          {#each state.rows as row (row.id)}
            <tr class:touched={state.touched === row.id} in:fly={{ y: -8, duration: motion(250) }}>
              <td><code>{row.step}</code> <span class="lane-name">{row.lane}</span></td>
              <td><code>{row.reference}</code></td>
              <td><span class="row-state row-{row.state.toLowerCase()}">{row.state}</span></td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>

<style>
  .scene {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    font-size: var(--sl-text-xs);
  }

  .status {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.25rem;
    margin: 0;
  }

  .status div {
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }

  dt {
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  dd {
    margin: 0;
  }

  .chip {
    padding: 0.15rem 0.45rem;
    border: 1px solid var(--kx-rule-strong);
    border-radius: 2px;
    color: var(--sl-color-white);
    font-family: var(--sl-font-mono);
    font-size: 0.7rem;
    font-weight: 600;
  }

  .saga-completed,
  .saga-compensated,
  .order-paid {
    border-color: var(--kx-lane-b);
    color: var(--kx-lane-b);
  }

  .saga-compensating,
  .saga-stuck,
  .next {
    border-color: var(--sl-color-accent);
    color: var(--sl-color-accent);
  }

  .saga-stuck {
    border-style: dashed;
  }

  .order-cancelled,
  .http-error {
    border-color: var(--sl-color-red);
    color: var(--sl-color-red-high);
  }

  .lanes {
    border: 1px solid var(--kx-rule);
    background: var(--sl-color-black);
  }

  .lane-heads {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    border-bottom: 1px solid var(--kx-rule);
  }

  .lane-head {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    margin: 0;
    padding: 0.45rem 0.25rem;
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
    font-weight: 600;
    transition: color 200ms ease;
  }

  .lane-head.active {
    color: var(--sl-color-white);
  }

  .lane-head img {
    width: 1rem;
    height: 1rem;
    padding: 0.1rem;
    border: 1px solid var(--kx-rule);
    background: var(--kx-tile);
  }

  .wire {
    position: relative;
    height: 7.5rem;
  }

  .wire > svg,
  .call svg {
    position: absolute;
    inset: 1.6rem 0 0;
    width: 100%;
    height: calc(100% - 1.6rem);
  }

  .lifeline {
    stroke: var(--kx-rule-strong);
    stroke-width: 1;
    stroke-dasharray: 3 3;
    vector-effect: non-scaling-stroke;
  }

  .call {
    position: absolute;
    inset: 0;
  }

  .statement {
    position: absolute;
    top: 0.25rem;
    right: 0.5rem;
    left: 0.5rem;
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
  }

  .statement code {
    color: var(--sl-color-white);
    font-size: 0.7rem;
  }

  .tag {
    margin-inline-end: 0.35rem;
    color: var(--sl-color-accent);
    font-family: var(--sl-font-mono);
    font-size: 0.66rem;
    text-transform: uppercase;
  }

  .arrow-out,
  .arrow-back {
    stroke-width: 2;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: draw 450ms ease-out forwards;
  }

  .arrow-out {
    stroke: var(--sl-color-white);
  }

  .head-out {
    fill: var(--sl-color-white);
  }

  .compensation .arrow-out {
    stroke: var(--sl-color-accent);
  }

  .compensation .head-out {
    fill: var(--sl-color-accent);
  }

  .arrow-back {
    stroke-dasharray: 1;
    animation-delay: 500ms;
  }

  .head-back {
    opacity: 0;
    animation: appear 150ms ease-out 900ms forwards;
  }

  .reply-ok {
    stroke: var(--kx-lane-b);
    fill: var(--kx-lane-b);
    color: var(--kx-lane-b);
  }

  .reply-refused,
  .reply-unavailable {
    stroke: var(--sl-color-red);
    fill: var(--sl-color-red);
    color: var(--sl-color-red-high);
  }

  .reply-silent {
    color: var(--sl-color-accent);
  }

  .packet {
    position: absolute;
    top: calc(1.6rem + (100% - 1.6rem) * 0.354);
    left: var(--to);
    width: 0.5rem;
    height: 0.5rem;
    margin: -0.25rem 0 0 -0.25rem;
    border-radius: 50%;
    background: var(--sl-color-accent);
    opacity: 0;
    animation: travel 600ms ease-out forwards;
  }

  .waiting {
    position: absolute;
    top: calc(1.6rem + (100% - 1.6rem) * 0.729);
    width: 0.7rem;
    height: 0.7rem;
    margin: -0.35rem 0 0 -0.35rem;
    border: 1.5px solid var(--sl-color-accent);
    border-radius: 50%;
    animation: pulse 1.2s ease-in-out infinite;
  }

  .reply {
    position: absolute;
    bottom: 0.15rem;
    left: clamp(0.5rem, calc(var(--x) - 4rem), calc(100% - 9rem));
    margin: 0;
    font-family: var(--sl-font-mono);
    font-size: 0.68rem;
    font-weight: 600;
    white-space: nowrap;
    opacity: 0;
    animation: appear 200ms ease-out 900ms forwards;
  }

  .reply-right {
    right: max(0.5rem, calc(100% - var(--x) - 3rem));
    left: auto;
  }

  .reply code {
    color: inherit;
  }

  .log {
    border: 1px solid var(--kx-rule);
    background: var(--sl-color-black);
  }

  .log-title {
    margin: 0;
    padding: 0.45rem 0.75rem;
    border-bottom: 1px solid var(--kx-rule);
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .empty {
    margin: 0;
    padding: 0.75rem;
    color: var(--sl-color-gray-3);
    font-style: italic;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    padding: 0.35rem 0.75rem;
    border-bottom: 1px solid var(--kx-rule);
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    font-weight: 500;
    text-align: start;
    text-transform: uppercase;
  }

  td {
    padding: 0.35rem 0.75rem;
    border-bottom: 1px solid var(--kx-rule);
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: 0;
  }

  tr.touched td {
    background: var(--sl-color-gray-6);
  }

  tr.touched td:first-child {
    box-shadow: inset 2px 0 0 var(--sl-color-accent);
  }

  td code {
    color: var(--sl-color-white);
    font-size: 0.7rem;
    overflow-wrap: anywhere;
  }

  .lane-name {
    margin-inline-start: 0.35rem;
    color: var(--sl-color-gray-3);
  }

  .row-state {
    display: inline-block;
    padding: 0.1rem 0.4rem;
    border: 1px solid var(--kx-rule-strong);
    border-radius: 2px;
    font-family: var(--sl-font-mono);
    font-size: 0.66rem;
    font-weight: 600;
  }

  .row-attempting {
    border-style: dashed;
    border-color: var(--sl-color-accent);
    color: var(--sl-color-accent);
  }

  .row-done {
    border-color: var(--sl-color-white);
    background: var(--sl-color-white);
    color: var(--sl-color-black);
  }

  .row-failed {
    border-color: var(--sl-color-red);
    color: var(--sl-color-red-high);
  }

  .row-compensated {
    color: var(--sl-color-gray-3);
    text-decoration: line-through;
  }

  @keyframes draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes appear {
    to {
      opacity: 1;
    }
  }

  @keyframes pulse {
    50% {
      transform: scale(1.6);
      opacity: 0.4;
    }
  }

  @keyframes travel {
    from {
      left: var(--from);
      opacity: 1;
    }
    95% {
      opacity: 1;
    }
    to {
      left: var(--to);
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .arrow-out,
    .arrow-back,
    .head-back,
    .reply,
    .waiting {
      animation: none;
      stroke-dashoffset: 0;
      opacity: 1;
    }

    .lane-head {
      transition: none;
    }
  }
</style>
