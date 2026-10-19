<script lang="ts">
  import { prefersReducedMotion } from "svelte/motion";
  import { fade, fly } from "svelte/transition";
  import type { LateCommitLabels } from "../types/late_commit_labels.type";
  import type { LateCommitRow } from "../types/late_commit_row.type";
  import type { LateCommitState } from "../types/late_commit_state.type";
  import type { LateCommitWriter } from "../types/late_commit_writer.type";
  import type { LocalizedStep } from "../types/localized_step.type";

  type Props = {
    state: LateCommitState;
    step: LocalizedStep<LateCommitState> | null;
    labels: LateCommitLabels;
  };

  let { state, step, labels }: Props = $props();

  const writerColors: Record<LateCommitWriter, string> = {
    a: "var(--kx-lane-a)",
    b: "var(--kx-lane-b)"
  };

  const motion = (milliseconds: number): number => (prefersReducedMotion.current ? 0 : milliseconds);

  function writerOf(actor: string): LateCommitWriter | null {
    return actor === "a" || actor === "b" ? actor : null;
  }

  function isBehind(row: LateCommitRow): boolean {
    return state.index[row.sku] !== row.committed.title;
  }

  function isSkipped(row: LateCommitRow): boolean {
    if (!isBehind(row) || state.returned === null) {
      return false;
    }

    if (state.mode === "time") {
      return row.committed.updatedAt < state.cursor.position;
    }

    return row.committed.transactionId < Number(state.cursor.position);
  }

  const activeWriter = $derived(step === null ? null : writerOf(step.actor));
  const searchActive = $derived(step !== null && step.actor === "search");
</script>

{#snippet writerCard(writer: LateCommitWriter)}
  {@const status = state.writers[writer]}
  <section class="writer" class:active={activeWriter === writer} style:--lane={writerColors[writer]}>
    <header>
      <span class="name">{labels.writers[writer]}</span>
    </header>
    <p class="status status-{status}">{labels.statuses[status]}</p>
    {#if step !== null && activeWriter === writer}
      {#key step}
        <pre class="statement" in:fly={{ x: -14, duration: motion(350) }}>{step.statement}</pre>
      {/key}
    {/if}
  </section>
{/snippet}

<div class="scene">
  <div class="writers">
    {@render writerCard("a")}
    {@render writerCard("b")}
  </div>

  <section class="table">
    <header>
      <code class="table-name">{labels.table}</code>
    </header>
    <ol class="rows">
      {#each state.rows as row (row.sku)}
        <li class="row">
          <code class="sku">{row.sku}</code>
          <dl class="version">
            <dt>{labels.title}</dt>
            <dd>{row.committed.title}</dd>
            <dt class:used={state.mode === "time"}>{labels.updatedAt}</dt>
            <dd class:used={state.mode === "time"}>{row.committed.updatedAt}</dd>
            <dt class:used={state.mode === "transaction"}>{labels.transaction}</dt>
            <dd class:used={state.mode === "transaction"}>{row.committed.transactionId}</dd>
          </dl>
          {#if row.pending !== null}
            <div class="pending" style:--lane={writerColors[row.pending.writer]} transition:fade={{ duration: motion(250) }}>
              <p class="pending-label">{labels.uncommitted} · <span class="owner">{labels.writers[row.pending.writer]}</span></p>
              <dl class="version">
                <dt>{labels.title}</dt>
                <dd>{row.pending.version.title}</dd>
                <dt class:used={state.mode === "time"}>{labels.updatedAt}</dt>
                <dd class:used={state.mode === "time"}>{row.pending.version.updatedAt}</dd>
                <dt class:used={state.mode === "transaction"}>{labels.transaction}</dt>
                <dd class:used={state.mode === "transaction"}>{row.pending.version.transactionId}</dd>
              </dl>
            </div>
          {/if}
        </li>
      {/each}
    </ol>
  </section>

  <section class="search" class:active={searchActive}>
    <header>
      <span class="name">{labels.search}</span>
    </header>
    <dl class="facts">
      <dt>{labels.cursor} · {labels.cursorKinds[state.mode]}</dt>
      <dd>{state.cursor.position} · {state.cursor.lastSku}</dd>
      {#if state.mode === "transaction"}
        <dt>{labels.horizon}</dt>
        <dd>{state.horizon === null ? "—" : state.horizon}</dd>
      {/if}
      <dt>{labels.lastRead}</dt>
      <dd>
        {#if state.returned === null}
          {labels.notReadYet}
        {:else if state.returned.length === 0}
          {labels.nothingReturned}
        {:else}
          {state.returned.join(", ")}
        {/if}
      </dd>
    </dl>
    <p class="index-name">{labels.index}</p>
    <ul class="index">
      {#each state.rows as row (row.sku)}
        <li class:behind={isBehind(row)} class:skipped={isSkipped(row)}>
          <code>{row.sku}</code>
          <span class="indexed-title">{state.index[row.sku]}</span>
          {#if isSkipped(row)}
            <span class="flag skipped-flag" transition:fade={{ duration: motion(250) }}>{labels.skipped}</span>
          {:else if isBehind(row)}
            <span class="flag" transition:fade={{ duration: motion(250) }}>{labels.stale}</span>
          {/if}
        </li>
      {/each}
    </ul>
    {#if step !== null && searchActive}
      {#key step}
        <pre class="statement search-statement" in:fly={{ x: 14, duration: motion(350) }}>{step.statement}</pre>
      {/key}
    {/if}
  </section>
</div>

<style>
  .scene {
    display: grid;
    grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.5fr) minmax(0, 1fr);
    gap: 0.75rem;
    font-size: var(--sl-text-xs);
  }

  .writers {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-width: 0;
  }

  .writer,
  .table,
  .search {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
    padding: 0.75rem;
    border: 1px solid var(--kx-rule);
    background: var(--sl-color-black);
  }

  .writer {
    border-top: 3px solid var(--lane);
    outline: 1px solid transparent;
    outline-offset: -1px;
    transition: outline-color 300ms ease;
  }

  .writer.active {
    outline-color: var(--lane);
  }

  .search {
    border-top: 3px solid var(--sl-color-accent);
    outline: 1px solid transparent;
    outline-offset: -1px;
    transition: outline-color 300ms ease;
  }

  .search.active {
    outline-color: var(--sl-color-accent);
  }

  header {
    display: flex;
    align-items: center;
    min-height: 1.5rem;
  }

  .name {
    font-weight: 600;
    font-size: var(--sl-text-sm);
  }

  .writer .name {
    color: var(--lane);
  }

  .search .name {
    color: var(--sl-color-accent);
  }

  .table-name {
    overflow-wrap: normal;
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

  .status-open {
    background: color-mix(in srgb, var(--lane) 20%, transparent);
    color: var(--sl-color-text);
  }

  .status-committed {
    background: color-mix(in srgb, var(--sl-color-green) 25%, transparent);
    color: var(--sl-color-green-high);
  }

  .rows,
  .index {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .row {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin: 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px dashed var(--sl-color-gray-5);
  }

  .row:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .sku {
    width: fit-content;
    font-weight: 600;
  }

  .version {
    display: grid;
    grid-template-columns: minmax(0, auto) minmax(8ch, 1fr);
    gap: 0.1rem 0.6rem;
    margin: 0;
  }

  .version dt {
    font-size: 0.66rem;
    overflow-wrap: anywhere;
  }

  dt {
    color: var(--sl-color-gray-3);
  }

  dd {
    margin: 0;
    font-family: var(--sl-font-mono);
    color: var(--sl-color-text);
    overflow-wrap: anywhere;
  }

  dt.used,
  dd.used {
    color: var(--sl-color-accent-high);
    font-weight: 600;
  }

  .pending {
    padding: 0.4rem 0.5rem;
    border: 1px dashed var(--lane);
  }

  .pending-label {
    margin: 0 0 0.25rem;
    color: var(--sl-color-gray-2);
  }

  .owner {
    color: var(--lane);
    font-weight: 600;
  }

  .facts {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.1rem;
    margin: 0;
  }

  .facts dd {
    margin-bottom: 0.35rem;
  }

  .index-name {
    margin: 0;
    color: var(--sl-color-gray-3);
  }

  .index li {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.4rem;
    margin: 0;
  }

  .indexed-title {
    font-family: var(--sl-font-mono);
  }

  .index li.behind .indexed-title {
    color: var(--sl-color-gray-3);
  }

  .flag {
    padding: 0.05rem 0.4rem;
    border-radius: 2px;
    background: color-mix(in srgb, var(--sl-color-orange) 25%, transparent);
    color: var(--sl-color-orange-high);
    font-family: var(--sl-font-mono);
    font-size: 0.65rem;
    text-transform: uppercase;
  }

  .skipped-flag {
    background: color-mix(in srgb, var(--sl-color-red) 25%, transparent);
    color: var(--sl-color-red-high);
    font-weight: 600;
  }

  .statement {
    margin: 0;
    padding: 0.5rem;
    border-left: 3px solid var(--lane);
    background: var(--sl-color-gray-6);
    font-size: 0.7rem;
    line-height: 1.45;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .search-statement {
    border-left-color: var(--sl-color-accent);
  }

  @media (max-width: 40rem) {
    .scene {
      grid-template-columns: minmax(0, 1fr);
    }

    .writers {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .writer,
    .search {
      transition: none;
    }
  }
</style>
