<script lang="ts">
  import { prefersReducedMotion } from "svelte/motion";
  import { fade, scale } from "svelte/transition";
  import type { HandshakeCheckStatus } from "../types/handshake_check_status.type";
  import type { HandshakeLabels } from "../types/handshake_labels.type";
  import type { HandshakeState } from "../types/handshake_state.type";

  type Props = {
    state: HandshakeState;
    labels: HandshakeLabels;
  };

  let { state, labels }: Props = $props();

  const motion = (milliseconds: number): number => (prefersReducedMotion.current ? 0 : milliseconds);

  const glyph: Readonly<Record<HandshakeCheckStatus, string>> = { pending: "", pass: "✓", fail: "✕", skipped: "–" };

  const travelling = $derived(state.sent && state.checks.every((check) => check.status === "pending"));
  const refused = $derived(state.checks.some((check) => check.status === "fail"));
  const settled = $derived(state.checks.filter((check) => check.status !== "pending").length);
</script>

<div class="scene">
  <section class="wire">
    <div class="party">
      <span class="name">{state.caller ?? labels.anonymous}</span>
      {#if state.certificate === null}
        <div class="certificate none">
          <span class="label">{labels.noCertificate}</span>
        </div>
      {:else}
        <div class="certificate" class:foreign={state.certificate.issuer === "other"}>
          <span class="label">{labels.certificate}</span>
          <code>{state.certificate.spiffeId}</code>
          <span class="issuer">{labels.issuedBy} <strong>{labels.issuers[state.certificate.issuer]}</strong></span>
        </div>
      {/if}
    </div>

    <div class="lane" class:refused aria-hidden="true">
      {#key state}
        {#if travelling && !prefersReducedMotion.current}
          <span class="token" class:empty={state.certificate === null}></span>
        {/if}
      {/key}
    </div>

    <div class="party server">
      <span class="name">{state.server}</span>
      <div class="allow">
        <span class="label">{labels.allowed}</span>
        <ul>
          {#each state.allowed as peer (peer)}
            <li>{peer}</li>
          {/each}
        </ul>
      </div>
    </div>
  </section>

  <section class="checks">
    <p class="heading">{labels.checks}</p>
    <ol>
      {#each state.checks as check, index (check.id)}
        <li class="check status-{check.status}">
          {#key check.status}
            <span
              class="marker"
              aria-hidden="true"
              in:scale|global={{ start: 0.4, duration: motion(240), delay: motion(index * 160) }}
            >
              {glyph[check.status]}
            </span>
          {/key}
          <span class="what">
            {labels.checkNames[check.id]}
            <code>{labels.checkLayers[check.id]}</code>
          </span>
          <span class="status">{labels.statuses[check.status]}</span>
        </li>
      {/each}
    </ol>
  </section>

  {#key state}
    <section class="result" class:refused>
      {#if state.alert !== null}
        <div class="row" in:fade|global={{ duration: motion(240), delay: motion(settled * 160) }}>
          <p class="heading">{labels.alert}</p>
          <code class="alert">{state.alert}</code>
        </div>
      {/if}
      <div class="row">
        <p class="heading">{labels.client}</p>
        {#if state.client === null}
          <p class="empty">—</p>
        {:else}
          <code in:fade|global={{ duration: motion(240), delay: motion(settled * 160 + 200) }}>{state.client}</code>
        {/if}
      </div>
      <div class="row">
        <p class="heading">{labels.log}</p>
        {#if state.log === null}
          <p class="empty">—</p>
        {:else}
          <code in:fade|global={{ duration: motion(240), delay: motion(settled * 160 + 400) }}>{state.log}</code>
        {/if}
      </div>
    </section>
  {/key}
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

  .wire {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: minmax(0, 1.7fr) minmax(2.5rem, 0.5fr) minmax(0, 1fr);
    align-items: center;
    gap: 0.6rem;
  }

  @media (max-width: 40rem) {
    .wire {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  .heading,
  .label {
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
  }

  .party {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    min-width: 0;
  }

  .name {
    color: var(--sl-color-white);
    font-family: var(--sl-font-mono);
    font-size: 0.78rem;
    font-weight: 700;
  }

  .server .name {
    color: var(--sl-color-accent-high);
  }

  .certificate {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.5rem 0.6rem;
    border: 1px solid var(--kx-rule-strong);
    border-left: 3px solid var(--kx-lane-a);
    border-radius: var(--kx-radius);
    background: var(--kx-surface);
  }

  .certificate code {
    color: var(--sl-color-white);
    font-size: 0.7rem;
    overflow-wrap: anywhere;
  }

  .certificate.foreign {
    border-left-color: var(--sl-color-red);
  }

  .certificate.none {
    border-style: dashed;
    border-left-width: 1px;
  }

  .issuer {
    color: var(--sl-color-gray-2);
    font-size: 0.68rem;
  }

  .issuer strong {
    color: var(--sl-color-white);
  }

  .certificate.foreign .issuer strong {
    color: var(--sl-color-red);
  }

  .lane {
    position: relative;
    height: 2px;
    background: var(--kx-rule-strong);
  }

  .lane.refused {
    background: repeating-linear-gradient(to right, var(--sl-color-red) 0 5px, transparent 5px 9px);
  }

  .token {
    position: absolute;
    top: 50%;
    left: 0;
    width: 0.9rem;
    height: 0.65rem;
    margin-top: -0.325rem;
    border: 1.5px solid var(--kx-lane-a);
    border-radius: 2px;
    background: var(--sl-color-black);
    animation: travel 1.2s ease-in-out forwards;
  }

  .token.empty {
    border-style: dashed;
    border-color: var(--sl-color-gray-3);
  }

  .allow {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem 0.5rem;
  }

  .allow ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .allow li {
    margin: 0;
    padding: 0.05rem 0.4rem;
    border: 1px solid var(--kx-lane-b);
    border-radius: var(--kx-radius);
    color: var(--sl-color-white);
    font-family: var(--sl-font-mono);
    font-size: 0.68rem;
  }

  ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .check {
    --marker: 1.15rem;
    display: grid;
    grid-template-columns: var(--marker) minmax(0, 1fr) auto;
    align-items: start;
    gap: 0.6rem;
    margin: 0;
    padding: 0.4rem 0;
    border-bottom: 1px solid var(--kx-rule);
  }

  .check:last-child {
    border-bottom: 0;
  }

  .marker {
    display: grid;
    place-items: center;
    width: var(--marker);
    height: var(--marker);
    border: 1px solid var(--sl-color-gray-4);
    border-radius: var(--kx-radius);
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

  .what {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    color: var(--sl-color-white);
    font-weight: 600;
    line-height: 1.3;
  }

  .what code {
    color: var(--sl-color-gray-3);
    font-size: 0.66rem;
    font-weight: 400;
  }

  .status-skipped .what {
    color: var(--sl-color-gray-3);
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

  .result {
    border-left: 3px solid var(--kx-lane-b);
  }

  .result.refused {
    border-left-color: var(--sl-color-red);
  }

  .row {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .row code {
    padding: 0.4rem 0.55rem;
    border: 1px solid var(--kx-rule);
    background: var(--kx-surface);
    color: var(--sl-color-white);
    font-size: 0.7rem;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .row code.alert {
    color: var(--sl-color-red);
    font-weight: 600;
  }

  @keyframes travel {
    0% {
      left: 0;
      opacity: 0;
    }
    12% {
      opacity: 1;
    }
    100% {
      left: calc(100% - 0.9rem);
      opacity: 1;
    }
  }

  @keyframes travel-down {
    0% {
      top: 0;
      opacity: 0;
    }
    12% {
      opacity: 1;
    }
    100% {
      top: calc(100% - 0.65rem);
      opacity: 1;
    }
  }

  @media (max-width: 40rem) {
    .lane {
      justify-self: center;
      width: 2px;
      height: 2rem;
    }

    .token {
      top: 0;
      left: calc(50% - 0.45rem);
      margin-top: 0;
      animation-name: travel-down;
    }

    .lane.refused {
      background: repeating-linear-gradient(to bottom, var(--sl-color-red) 0 5px, transparent 5px 9px);
    }
  }
</style>
