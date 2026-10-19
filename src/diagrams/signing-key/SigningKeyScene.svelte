<script lang="ts">
  import { prefersReducedMotion } from "svelte/motion";
  import { fade, fly } from "svelte/transition";
  import type { LocalizedStep } from "../types/localized_step.type";
  import type { SigningKeyLabels } from "../types/signing_key_labels.type";
  import type { SigningKeyParty } from "../types/signing_key_party.type";
  import type { SigningKeyState } from "../types/signing_key_state.type";

  type Props = {
    state: SigningKeyState;
    step: LocalizedStep<SigningKeyState> | null;
    labels: SigningKeyLabels;
  };

  let { state, step, labels }: Props = $props();

  const parties: readonly SigningKeyParty[] = ["courier", "newcomer", "forger"];

  const partyColors: Record<SigningKeyParty, string> = {
    courier: "var(--kx-lane-a)",
    newcomer: "var(--kx-lane-b)",
    forger: "var(--sl-color-red)"
  };

  const motion = (milliseconds: number): number => (prefersReducedMotion.current ? 0 : milliseconds);

  const actor = $derived(step === null ? null : step.actor);
</script>

{#snippet keys(list: readonly string[], signing: string | null)}
  <ul class="keys">
    {#each list as kid (kid)}
      <li class="key" class:signing={kid === signing} transition:fade={{ duration: motion(250) }}>
        <code>{kid}</code>
      </li>
    {/each}
  </ul>
{/snippet}

<div class="scene">
  <section class="card identity" class:active={actor === "identity"}>
    <header><span class="name">{labels.identity}</span></header>
    <dl>
      <dt>{labels.signsWith}</dt>
      <dd><code class="kid">{state.identity.signing}</code></dd>
      <dt>{labels.publishes}</dt>
      <dd>{@render keys(state.identity.published, state.identity.signing)}</dd>
    </dl>
    {#if step !== null && actor === "identity"}
      {#key step}
        <pre class="statement" in:fly={{ y: -8, duration: motion(300) }}>{step.statement}</pre>
      {/key}
    {/if}
  </section>

  <section class="card order">
    <header><span class="name">{labels.order}</span></header>
    <dl>
      <dt>{labels.holds}</dt>
      <dd>{@render keys(state.order.held, null)}</dd>
      <dt>{labels.fetches}</dt>
      <dd class="count">{state.order.fetches}</dd>
    </dl>
  </section>

  <section class="card reply">
    {#if state.reply !== null}
      {#key state.reply}
        <p
          class="verdict verdict-{state.reply.verdict}"
          style:--lane={partyColors[state.reply.to]}
          in:fade={{ duration: motion(250) }}
        >
          <span class="to">{labels.parties[state.reply.to]}</span>
          <strong>{labels.verdicts[state.reply.verdict]}</strong>
        </p>
        <p class="by">{labels.answeredBy[state.reply.by]}</p>
        {#if state.reply.by === "order"}
          <p class="fetch" class:fetched={state.reply.fetched}>
            {state.reply.fetched ? labels.fetchedNow : labels.notFetched}
          </p>
        {/if}
      {/key}
    {/if}
  </section>

  <div class="holders">
    {#each parties as party (party)}
      {@const holder = state.holders[party]}
      <section class="card holder" class:active={actor === party} style:--lane={partyColors[party]}>
        <header><span class="name party">{labels.parties[party]}</span></header>
        <dl>
          <dt>{labels.accessToken}</dt>
          <dd><code class="kid">{holder.access ?? labels.none}</code></dd>
          <dt>{labels.refreshToken}</dt>
          <dd><code class="kid">{holder.refresh ?? labels.none}</code></dd>
        </dl>
        {#if party !== "forger"}
          <p class="session" class:out={!holder.signedIn}>{holder.signedIn ? labels.signedIn : labels.signedOut}</p>
        {/if}
        {#if step !== null && actor === party}
          {#key step}
            <pre class="statement" in:fly={{ y: 8, duration: motion(300) }}>{step.statement}</pre>
          {/key}
        {/if}
      </section>
    {/each}
  </div>
</div>

<style>
  .scene {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-areas:
      "identity order reply"
      "holders holders holders";
    gap: 0.75rem;
    font-size: var(--sl-text-xs);
  }

  .identity {
    grid-area: identity;
  }

  .order {
    grid-area: order;
  }

  .reply {
    grid-area: reply;
  }

  .holders {
    grid-area: holders;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
    padding: 0.75rem;
    border: 1px solid var(--kx-rule);
    background: var(--sl-color-black);
    outline: 1px solid transparent;
    outline-offset: -1px;
    transition: outline-color 300ms ease;
  }

  .identity,
  .order {
    border-top: 3px solid var(--sl-color-accent);
  }

  .holder {
    border-top: 3px solid var(--lane);
  }

  .card.active {
    outline-color: var(--sl-color-accent);
  }

  .holder.active {
    outline-color: var(--lane);
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

  .party {
    color: var(--lane);
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
    color: var(--sl-color-text);
  }

  .count {
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-xl);
    font-weight: 600;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
  }

  .kid {
    overflow-wrap: anywhere;
  }

  .keys {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .key {
    margin: 0;
    padding: 0.1rem 0.4rem;
    border: 1px solid var(--sl-color-gray-5);
  }

  .key.signing {
    border-color: var(--sl-color-accent);
    color: var(--sl-color-accent-high);
  }

  .verdict {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin: 0;
    padding: 0.5rem;
    border-left: 3px solid var(--lane);
    background: var(--sl-color-gray-6);
  }

  .to {
    color: var(--lane);
    font-weight: 600;
  }

  .verdict strong {
    font-family: var(--sl-font-mono);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .verdict-accepted strong,
  .verdict-issued strong,
  .verdict-renewed strong {
    color: var(--sl-color-green-high);
  }

  .verdict-refused strong {
    color: var(--sl-color-red-high);
  }

  .by,
  .fetch {
    margin: 0;
    color: var(--sl-color-gray-2);
  }

  .fetch.fetched {
    color: var(--sl-color-orange-high);
  }

  .session {
    margin: 0;
    padding: 0.1rem 0.45rem;
    width: fit-content;
    border-radius: 2px;
    background: color-mix(in srgb, var(--sl-color-green) 25%, transparent);
    color: var(--sl-color-green-high);
    font-family: var(--sl-font-mono);
    font-size: 0.66rem;
    text-transform: uppercase;
  }

  .session.out {
    background: color-mix(in srgb, var(--sl-color-red) 25%, transparent);
    color: var(--sl-color-red-high);
  }

  .statement {
    margin: 0;
    padding: 0.5rem;
    border-left: 3px solid var(--sl-color-accent);
    background: var(--sl-color-gray-6);
    font-size: 0.7rem;
    line-height: 1.45;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .holder .statement {
    border-left-color: var(--lane);
  }

  @media (max-width: 40rem) {
    .scene {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      grid-template-areas:
        "identity order"
        "reply reply"
        "holders holders";
    }

    .holders {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .card {
      transition: none;
    }
  }
</style>
