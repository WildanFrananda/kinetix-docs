<script lang="ts">
  import { prefersReducedMotion, Tween } from "svelte/motion";
  import { crossfade, fade, fly, scale } from "svelte/transition";
  import type { LocalizedStep } from "../types/localized_step.type";
  import type { StockRaceLabels } from "../types/stock_race_labels.type";
  import type { StockRaceLane } from "../types/stock_race_lane.type";
  import type { StockRaceState } from "../types/stock_race_state.type";

  type Props = {
    state: StockRaceState;
    step: LocalizedStep<StockRaceState> | null;
    labels: StockRaceLabels;
  };

  let { state, step, labels }: Props = $props();

  const laneColors: Record<StockRaceLane, string> = {
    a: "var(--kx-lane-a)",
    b: "var(--kx-lane-b)"
  };

  const motion = (milliseconds: number): number => (prefersReducedMotion.current ? 0 : milliseconds);

  const [send, receive] = crossfade({
    duration: () => motion(550),
    fallback: (node) => fade(node, { duration: motion(200) })
  });

  function laneOf(actor: string): StockRaceLane | null {
    return actor === "a" || actor === "b" ? actor : null;
  }

  function slotOwner(index: number, holdsOfA: number, promisedUnits: number): StockRaceLane | null {
    if (index < holdsOfA) {
      return "a";
    }

    return index < promisedUnits ? "b" : null;
  }

  const reserved = Tween.of(() => state.reserved, { duration: () => motion(650) });
  const available = $derived(Math.round(state.quantity - reserved.current));
  const promised = $derived(state.lanes.a.holds + state.lanes.b.holds);
  const oversold = $derived(Math.max(promised - state.quantity, 0));
  const slots = $derived(
    Array.from({ length: Math.max(state.quantity, promised) }, (_, index) => ({
      index,
      owner: slotOwner(index, state.lanes.a.holds, promised),
      beyondShelf: index >= state.quantity
    }))
  );
  const activeLane = $derived(step === null ? null : laneOf(step.actor));
</script>

{#snippet lock(closed: boolean)}
  <svg class="lock-icon" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    {#if closed}
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    {:else}
      <path d="M8 11V7a4 4 0 0 1 7.5-2" />
    {/if}
  </svg>
{/snippet}

{#snippet laneCard(lane: StockRaceLane)}
  {@const laneState = state.lanes[lane]}
  <section
    class="lane lane-{lane}"
    class:active={activeLane === lane}
    class:waiting={laneState.status === "waiting"}
    style:--lane={laneColors[lane]}
  >
    <header>
      <span class="lane-name">{labels.lanes[lane]}</span>
      {#if state.lockHolder === lane}
        <span class="lock held" title={labels.lockHeld} in:receive={{ key: "lock" }} out:send={{ key: "lock" }}>
          {@render lock(true)}
        </span>
      {/if}
    </header>
    <p class="status status-{laneState.status}">{labels.statuses[laneState.status]}</p>
    <dl>
      <dt>{labels.read}</dt>
      <dd>{laneState.read === null ? labels.nothingRead : laneState.read}</dd>
      <dt>{labels.holds}</dt>
      <dd>{laneState.holds} {labels.units}</dd>
    </dl>
    {#if step !== null && activeLane === lane}
      {#key step}
        <pre class="statement" in:fly={{ x: lane === "a" ? -14 : 14, duration: motion(350) }}>{step.statement}</pre>
      {/key}
    {/if}
  </section>
{/snippet}

<div class="scene">
  {@render laneCard("a")}

  <section class="row" style:--touch={activeLane === null ? "transparent" : laneColors[activeLane]}>
    {#key step}
      {#if activeLane !== null}
        <span class="touch" aria-hidden="true"></span>
      {/if}
    {/key}
    <header>
      <code class="row-name">{labels.row}</code>
      {#if state.lockHolder === null}
        <span class="lock free" title={labels.lockFree} in:receive={{ key: "lock" }} out:send={{ key: "lock" }}>
          {@render lock(false)}
        </span>
      {/if}
    </header>
    <dl class="figures">
      <div>
        <dt>{labels.onShelf}</dt>
        <dd>{state.quantity}</dd>
      </div>
      <div>
        <dt>{labels.reserved}</dt>
        <dd>{Math.round(reserved.current)}</dd>
      </div>
      <div>
        <dt>{labels.available}</dt>
        <dd class:empty={available === 0}>{available}</dd>
      </div>
    </dl>
    {#if state.pending !== null && state.lockHolder !== null}
      <p class="pending" style:--lane={laneColors[state.lockHolder]} transition:fade={{ duration: motion(250) }}>
        <span class="pending-label">{labels.uncommitted} · <span class="pending-owner">{labels.lanes[state.lockHolder]}</span></span>
        <code class="pending-value">reserved_quantity = {state.pending}</code>
      </p>
    {/if}
  </section>

  {@render laneCard("b")}

  <footer class="meter">
    <p class="meter-label">
      {labels.promised}: <strong>{promised}</strong> / {state.quantity}
      {#if oversold > 0}
        <span class="oversold" transition:fade={{ duration: motion(250) }}>{labels.oversold} {oversold} {labels.units}</span>
      {/if}
    </p>
    <ol class="slots">
      {#each slots as slot (slot.index)}
        <li
          class="slot"
          class:beyond={slot.beyondShelf}
          class:taken={slot.owner !== null}
          style:--lane={slot.owner === null ? "transparent" : laneColors[slot.owner]}
          transition:scale={{ start: 0.6, duration: motion(300) }}
        ></li>
      {/each}
    </ol>
  </footer>
</div>

<style>
  .scene {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr) minmax(0, 1fr);
    grid-template-areas:
      "a row b"
      "meter meter meter";
    gap: 0.75rem;
    font-size: var(--sl-text-xs);
  }

  .lane-a {
    grid-area: a;
  }

  .lane-b {
    grid-area: b;
  }

  .row {
    grid-area: row;
  }

  .meter {
    grid-area: meter;
  }

  @media (max-width: 40rem) {
    .scene {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      grid-template-areas:
        "row row"
        "a b"
        "meter meter";
    }
  }

  .lane,
  .row {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
    padding: 0.75rem;
    border: 1px solid var(--kx-rule);
    border-radius: 0;
    background: var(--sl-color-black);
  }

  .lane {
    border-top: 3px solid var(--lane);
    transition: outline-color 300ms ease;
    outline: 1px solid transparent;
    outline-offset: -1px;
  }

  .lane.active {
    outline-color: var(--lane);
  }

  .lane.waiting {
    animation: waiting 1.4s ease-in-out infinite;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    min-height: 1.75rem;
  }

  .lane-name {
    color: var(--lane);
    font-weight: 600;
    font-size: var(--sl-text-sm);
  }

  .row-name {
    overflow-wrap: normal;
    font-size: var(--sl-text-xs);
  }

  .status {
    margin: 0;
    padding: 0.15rem 0.45rem;
    width: fit-content;
    border-radius: 2px;
    background: var(--sl-color-gray-6);
    color: var(--sl-color-gray-2);
    font-family: var(--sl-font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  .status-running {
    background: color-mix(in srgb, var(--lane) 20%, transparent);
    color: var(--sl-color-text);
  }

  .status-waiting {
    background: color-mix(in srgb, var(--sl-color-orange) 25%, transparent);
    color: var(--sl-color-orange-high);
  }

  .status-committed {
    background: color-mix(in srgb, var(--sl-color-green) 25%, transparent);
    color: var(--sl-color-green-high);
  }

  .status-refused {
    background: color-mix(in srgb, var(--sl-color-red) 25%, transparent);
    color: var(--sl-color-red-high);
  }

  dl {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.1rem;
    margin: 0;
  }

  dt {
    color: var(--sl-color-gray-3);
  }

  dd {
    margin: 0 0 0.35rem;
    font-family: var(--sl-font-mono);
    color: var(--sl-color-text);
  }

  .statement {
    margin: 0;
    padding: 0.5rem;
    border-left: 3px solid var(--lane);
    border-radius: 0;
    background: var(--sl-color-gray-6);
    font-size: 0.7rem;
    line-height: 1.45;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .figures {
    gap: 0.35rem;
  }

  .figures div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
    padding-bottom: 0.35rem;
    border-bottom: 1px dashed var(--sl-color-gray-5);
  }

  .figures div:last-child {
    border-bottom: 0;
  }

  .figures dd {
    margin: 0;
    font-size: var(--sl-text-xl);
    font-weight: 600;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
  }

  .figures dd.empty {
    color: var(--sl-color-red-high);
  }

  .pending {
    margin: 0;
    padding: 0.4rem 0.5rem;
    border: 1px dashed var(--lane);
    border-radius: 0;
    color: var(--sl-color-gray-2);
  }

  .pending-label {
    display: block;
    margin-bottom: 0.25rem;
  }

  .pending-owner {
    color: var(--lane);
    font-weight: 600;
  }

  .pending-value {
    display: block;
    font-family: var(--sl-font-mono);
    font-size: 0.7rem;
    color: var(--sl-color-text);
    overflow-wrap: anywhere;
  }

  .lock {
    display: grid;
    place-items: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 2px;
  }

  .lock.held {
    background: color-mix(in srgb, var(--lane) 25%, transparent);
    color: var(--lane);
  }

  .lock.free {
    color: var(--sl-color-gray-3);
  }

  .lock-icon {
    width: 1.1rem;
    height: 1.1rem;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .touch {
    position: absolute;
    inset: -1px;
    border: 2px solid var(--touch);
    border-radius: inherit;
    pointer-events: none;
    animation: touch 900ms ease-out forwards;
  }

  .meter-label {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.5rem;
    margin: 0 0 0.4rem;
    color: var(--sl-color-gray-2);
  }

  .oversold {
    padding: 0.1rem 0.45rem;
    border-radius: 2px;
    background: color-mix(in srgb, var(--sl-color-red) 25%, transparent);
    color: var(--sl-color-red-high);
    font-family: var(--sl-font-mono);
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .slots {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .slot {
    width: 2.25rem;
    height: 1.25rem;
    margin: 0;
    border: 1px solid var(--sl-color-gray-4);
    border-radius: 1px;
    transition: background-color 300ms ease;
  }

  .slot.taken {
    border-color: var(--lane);
    background: color-mix(in srgb, var(--lane) 55%, transparent);
  }

  .slot.beyond {
    border: 1px dashed var(--sl-color-red);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--sl-color-red) 30%, transparent);
  }

  @keyframes waiting {
    0%,
    100% {
      border-color: var(--sl-color-gray-5);
    }
    50% {
      border-color: var(--sl-color-orange);
    }
  }

  @keyframes touch {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(1.04);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .lane,
    .slot {
      transition: none;
    }

    .lane.waiting {
      animation: none;
      border-color: var(--sl-color-orange);
    }

    .touch {
      animation: none;
      opacity: 0;
    }
  }
</style>
