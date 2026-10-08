<script lang="ts">
  import { prefersReducedMotion } from "svelte/motion";
  import { fade, fly } from "svelte/transition";
  import type { IdemLabels } from "../types/idem_labels.type";
  import type { IdemState } from "../types/idem_state.type";
  import type { LocalizedStep } from "../types/localized_step.type";

  type Props = {
    state: IdemState;
    step: LocalizedStep<IdemState> | null;
    labels: IdemLabels;
  };

  let { state, step, labels }: Props = $props();

  const motion = (milliseconds: number): number => (prefersReducedMotion.current ? 0 : milliseconds);
  const latest = $derived(state.requests.at(-1)?.id ?? null);
</script>

<div class="scene">
  <section class="requests">
    <p class="heading">{labels.requests}</p>
    {#if state.requests.length === 0}
      <p class="empty">—</p>
    {:else}
      <ol>
        {#each state.requests as request (request.id)}
          <li
            class="request status-{request.status}"
            class:latest={step !== null && request.id === latest}
            in:fly={{ x: -12, duration: motion(250) }}
          >
            <div class="request-head">
              <span class="request-id">{request.id}</span>
              <code class="statement">{request.statement}</code>
            </div>
            <div class="request-meta">
              {#if request.key === null}
                <span class="key none">{labels.noKey}</span>
              {:else}
                <code class="key">{request.key}</code>
              {/if}
              <span class="status">{labels.statuses[request.status]}</span>
            </div>
          </li>
        {/each}
      </ol>
    {/if}
  </section>

  <section class="ledger">
    <p class="heading">{labels.records}</p>
    {#if state.records.length === 0}
      <p class="empty">{state.requests.length === 0 ? "—" : labels.noRecords}</p>
    {:else}
      <table>
        <thead>
          <tr>
            <th>{labels.key}</th>
            <th>{labels.fingerprint}</th>
            <th>{labels.answer}</th>
          </tr>
        </thead>
        <tbody>
          {#each state.records as record (record.key)}
            <tr in:fade={{ duration: motion(250) }}>
              <td><code>{record.key}</code></td>
              <td><code>{record.fingerprint}</code></td>
              <td><code>{record.answer}</code></td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}

    {#if state.effects.length > 0}
      <p class="heading">{labels.effects}</p>
      <dl class="effects">
        {#each state.effects as item (item.kind)}
          <div class:wrong={item.wrong}>
            <dt>{labels.kinds[item.kind]}</dt>
            {#key item.value}
              <dd in:fly={{ y: -8, duration: motion(300) }}>{item.value}</dd>
            {/key}
          </div>
        {/each}
      </dl>
    {/if}

    {#if state.reply !== null}
      <div class="reply" in:fade={{ duration: motion(250) }}>
        <span>{labels.reply}</span>
        <code>{state.reply}</code>
      </div>
    {/if}
  </section>
</div>

<style>
  .scene {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
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

  .heading {
    margin: 0;
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .heading:not(:first-child) {
    margin-top: 0.4rem;
  }

  .empty {
    margin: 0;
    color: var(--sl-color-gray-3);
    font-style: italic;
  }

  ol {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .request {
    --status: var(--sl-color-gray-4);
    margin: 0;
    padding: 0.5rem 0.6rem;
    border: 1px solid var(--kx-rule);
    border-left: 3px solid var(--status);
  }

  .request.latest {
    background: var(--sl-color-gray-6);
  }

  .status-processing,
  .status-waiting {
    --status: var(--sl-color-accent);
  }

  .status-replayed {
    --status: var(--kx-lane-b);
  }

  .status-refused {
    --status: var(--sl-color-red);
  }

  .status-lost {
    border-left-style: dashed;
  }

  .request-head {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .request-id {
    color: var(--sl-color-white);
    font-family: var(--sl-font-mono);
    font-weight: 600;
  }

  .statement {
    color: var(--sl-color-white);
    font-size: 0.7rem;
    overflow-wrap: anywhere;
  }

  .request-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.3rem 0.6rem;
    margin-top: 0.35rem;
  }

  .key {
    padding: 0.05rem 0.35rem;
    border: 1px solid var(--kx-rule-strong);
    color: var(--sl-color-gray-2);
    font-size: 0.68rem;
  }

  .key.none {
    border-style: dashed;
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
  }

  .status {
    color: var(--status);
    font-family: var(--sl-font-mono);
    font-size: 0.68rem;
    font-weight: 600;
  }

  .status-processing .status,
  .status-waiting .status {
    animation: breathe 1.4s ease-in-out infinite;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    padding: 0.25rem 0.4rem;
    border-bottom: 1px solid var(--kx-rule);
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    font-weight: 500;
    text-align: start;
  }

  td {
    padding: 0.3rem 0.4rem;
    border-bottom: 1px solid var(--kx-rule);
  }

  td code {
    color: var(--sl-color-white);
    font-size: 0.68rem;
    overflow-wrap: anywhere;
  }

  .effects {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    margin: 0;
  }

  .effects div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .effects dt {
    color: var(--sl-color-gray-3);
  }

  .effects dd {
    margin: 0;
    color: var(--sl-color-white);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-lg);
    font-weight: 600;
  }

  .effects .wrong dd {
    color: var(--sl-color-red-high);
  }

  .reply {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.4rem;
    margin-top: 0.25rem;
    padding: 0.45rem 0.6rem;
    border: 1px solid var(--kx-rule-strong);
  }

  .reply span {
    color: var(--sl-color-gray-3);
  }

  .reply code {
    color: var(--sl-color-white);
    font-size: 0.72rem;
    font-weight: 600;
  }

  @keyframes breathe {
    50% {
      opacity: 0.45;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .status-processing .status,
    .status-waiting .status {
      animation: none;
    }
  }
</style>
