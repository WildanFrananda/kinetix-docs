<script lang="ts">
  import { prefersReducedMotion } from "svelte/motion";
  import { fade, fly } from "svelte/transition";
  import type { RefreshLabels } from "../types/refresh_labels.type";
  import type { RefreshState } from "../types/refresh_state.type";

  type Props = {
    state: RefreshState;
    labels: RefreshLabels;
  };

  let { state, labels }: Props = $props();

  const motion = (milliseconds: number): number => (prefersReducedMotion.current ? 0 : milliseconds);
  const latest = $derived(state.requests.at(-1)?.id ?? null);
</script>

<div class="scene">
  <section class="family">
    <div class="heading-row">
      <p class="heading">{labels.family}</p>
      {#if state.era !== null}
        <span class="era era-{state.era}">{labels.eras[state.era]}</span>
      {/if}
    </div>
    <table>
      <thead>
        <tr>
          <th>{labels.token}</th>
          <th>{labels.state}</th>
          <th>{labels.replacedBy}</th>
          <th>{labels.holders}</th>
        </tr>
      </thead>
      <tbody>
        {#each state.rows as row (row.name)}
          <tr class="status-{row.status}" class:locked={state.locked === row.name} in:fly={{ x: -10, duration: motion(260) }}>
            <td><code class="name">{row.name}</code></td>
            <td>
              {#key row.status}
                <span class="status" in:fade={{ duration: motion(260) }}>{labels.statuses[row.status]}</span>
              {/key}
              {#if row.reason !== null}
                <code class="reason">{row.reason}</code>
              {/if}
              {#if state.locked === row.name}
                <span class="lock">{labels.locked}</span>
              {/if}
            </td>
            <td><code>{row.replacedBy ?? "—"}</code></td>
            <td>
              <span class="holders">
                {#each row.holders as holder (holder)}
                  <span class="holder holder-{holder}">{labels.who[holder]}</span>
                {/each}
              </span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>

  <section class="requests">
    <p class="heading">{labels.requests}</p>
    {#if state.requests.length === 0}
      <p class="empty">{labels.noRequests}</p>
    {:else}
      <ol>
        {#each state.requests as entry (entry.id)}
          <li
            class="request outcome-{entry.outcome} who-{entry.who}"
            class:latest={entry.id === latest}
            in:fly={{ x: 10, duration: motion(260) }}
          >
            <div class="request-head">
              <span class="request-id">{entry.id}</span>
              <span class="holder holder-{entry.who}">{labels.who[entry.who]}</span>
              <span class="presents">{labels.presents} <code>{entry.presents}</code></span>
            </div>
            <div class="request-foot">
              {#key entry.outcome}
                <span class="outcome" in:fade={{ duration: motion(240) }}>{labels.outcomes[entry.outcome]}</span>
              {/key}
              {#if entry.reply !== null}
                <code class="reply" in:fade={{ duration: motion(260), delay: motion(120) }}>{entry.reply}</code>
              {/if}
            </div>
          </li>
        {/each}
      </ol>
    {/if}
  </section>
</div>

<style>
  .scene {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
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

  .heading-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.35rem 0.75rem;
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

  .era {
    padding: 0.05rem 0.4rem;
    border: 1px solid var(--kx-rule-strong);
    border-radius: var(--kx-radius);
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
    padding: 0.4rem;
    border-bottom: 1px solid var(--kx-rule);
    vertical-align: top;
  }

  tr {
    --status: var(--sl-color-gray-3);
  }

  tr.status-live {
    --status: var(--kx-lane-b);
  }

  tr.status-revoked {
    --status: var(--sl-color-red);
  }

  tr.locked td {
    background: color-mix(in srgb, var(--sl-color-accent) 10%, transparent);
  }

  td code {
    color: var(--sl-color-white);
    font-size: 0.7rem;
  }

  .name {
    font-weight: 700;
  }

  .status {
    display: block;
    color: var(--status);
    font-family: var(--sl-font-mono);
    font-size: 0.68rem;
    font-weight: 600;
  }

  .status-revoked .name {
    text-decoration: line-through;
    text-decoration-color: var(--sl-color-red);
  }

  .reason {
    display: block;
    margin-top: 0.15rem;
    color: var(--sl-color-gray-3);
    font-size: 0.64rem;
  }

  .lock {
    display: inline-block;
    margin-top: 0.2rem;
    padding: 0 0.3rem;
    border: 1px solid var(--sl-color-accent);
    border-radius: var(--kx-radius);
    color: var(--sl-color-accent-high);
    font-family: var(--sl-font-mono);
    font-size: 0.62rem;
    animation: breathe 1.4s ease-in-out infinite;
  }

  .holders {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .holder {
    padding: 0 0.3rem;
    border: 1px solid var(--kx-rule-strong);
    border-radius: var(--kx-radius);
    color: var(--sl-color-gray-2);
    font-family: var(--sl-font-mono);
    font-size: 0.64rem;
  }

  .holder-thief {
    border-color: var(--sl-color-red);
    color: var(--sl-color-red);
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
    --outcome: var(--sl-color-gray-4);
    margin: 0;
    padding: 0.5rem 0.6rem;
    border: 1px solid var(--kx-rule);
    border-left: 3px solid var(--outcome);
  }

  .request.latest {
    background: var(--sl-color-gray-6);
  }

  .outcome-rotated {
    --outcome: var(--kx-lane-b);
  }

  .outcome-refused {
    --outcome: var(--sl-color-red);
  }

  .outcome-waiting,
  .outcome-sent {
    --outcome: var(--sl-color-accent);
  }

  .request-head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.4rem;
  }

  .request-id {
    color: var(--sl-color-white);
    font-family: var(--sl-font-mono);
    font-weight: 600;
  }

  .presents {
    color: var(--sl-color-gray-3);
  }

  .presents code {
    color: var(--sl-color-white);
    font-size: 0.7rem;
  }

  .request-foot {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-top: 0.35rem;
  }

  .outcome {
    color: var(--outcome);
    font-family: var(--sl-font-mono);
    font-size: 0.68rem;
    font-weight: 600;
  }

  .outcome-waiting .outcome,
  .outcome-sent .outcome {
    animation: breathe 1.4s ease-in-out infinite;
  }

  .reply {
    color: var(--sl-color-white);
    font-size: 0.68rem;
    overflow-wrap: anywhere;
  }

  @keyframes breathe {
    50% {
      opacity: 0.45;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .lock,
    .outcome-waiting .outcome,
    .outcome-sent .outcome {
      animation: none;
    }
  }
</style>
