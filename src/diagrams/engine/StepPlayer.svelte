<script lang="ts" generics="State">
  import type { Snippet } from "svelte";
  import type { LocalizedScenario } from "../types/localized_scenario.type";
  import type { LocalizedStep } from "../types/localized_step.type";
  import type { NonEmpty } from "../types/non_empty.type";
  import type { PlayerLabels } from "../types/player_labels.type";

  type Props = {
    variants: NonEmpty<LocalizedScenario<State>>;
    labels: PlayerLabels;
    scene: Snippet<[State, LocalizedStep<State> | null]>;
  };

  let { variants, labels, scene }: Props = $props();
  const hintId = $props.id();

  const speeds = [0.5, 1, 2];
  const millisecondsPerStep = 3600;

  let variantIndex = $state(0);
  let position = $state(-1);
  let playing = $state(false);
  let speed = $state(1);

  const variant = $derived(variants[variantIndex] ?? variants[0]);
  const lastPosition = $derived(variant.steps.length - 1);
  const step = $derived(position < 0 ? null : (variant.steps[position] ?? null));
  const current = $derived(step === null ? variant.initial : step.state);
  const finished = $derived(position === lastPosition);

  $effect(() => {
    if (!playing) {
      return;
    }

    if (position >= lastPosition) {
      playing = false;
      return;
    }

    const timer = setTimeout(() => {
      position += 1;
    }, millisecondsPerStep / speed);

    return () => clearTimeout(timer);
  });

  function selectVariant(index: number): void {
    variantIndex = index;
    position = -1;
    playing = false;
  }

  function toggle(): void {
    if (!playing && finished) {
      position = -1;
    }

    playing = !playing;
  }

  function moveTo(target: number): void {
    playing = false;
    position = Math.min(Math.max(target, -1), lastPosition);
  }

  function onKeydown(event: KeyboardEvent): void {
    const target = event.target;

    if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
      return;
    }

    if (event.key === " " && target instanceof HTMLButtonElement) {
      return;
    }

    const actions: Record<string, () => void> = {
      ArrowRight: () => moveTo(position + 1),
      ArrowLeft: () => moveTo(position - 1),
      Home: () => moveTo(-1),
      End: () => moveTo(lastPosition),
      " ": toggle
    };
    const action = actions[event.key];

    if (action !== undefined) {
      event.preventDefault();
      action();
    }
  }

  function keyboardControl(element: HTMLElement): () => void {
    element.addEventListener("keydown", onKeydown);

    return () => element.removeEventListener("keydown", onKeydown);
  }
</script>

<figure class="player not-content" aria-describedby={hintId} {@attach keyboardControl}>
  <p id={hintId} class="visually-hidden">{labels.keyboard}</p>
  {#if variants.length > 1}
    <div class="variants" role="group" aria-label={labels.scenario}>
      {#each variants as candidate, index (candidate.id)}
        <button
          type="button"
          class="variant"
          aria-pressed={index === variantIndex}
          onclick={() => selectVariant(index)}
        >
          {candidate.title}
        </button>
      {/each}
    </div>
  {/if}

  <div class="stage">
    {@render scene(current, step)}
  </div>

  <div class="narration" aria-live="polite">
    {#if step === null}
      <p>{variant.introduction}</p>
    {:else}
      <p><strong>{step.actorLabel}.</strong> {step.narration}</p>
      {#if step.source !== undefined}
        <p class="source">
          {labels.source}:
          <a href={step.source.href} target="_blank" rel="noopener noreferrer"><code>{step.source.label}</code></a>
        </p>
      {/if}
    {/if}
    {#if finished}
      <p class="outcome"><strong>{labels.outcome}.</strong> {variant.outcome}</p>
    {/if}
  </div>

  <div class="controls" role="group" aria-label={labels.progress}>
    <button type="button" class="icon" aria-label={labels.restart} title={labels.restart} onclick={() => moveTo(-1)}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4.5h4.5" /></svg>
    </button>
    <button
      type="button"
      class="icon"
      aria-label={labels.previous}
      title={labels.previous}
      disabled={position < 0}
      onclick={() => moveTo(position - 1)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
    </button>
    <button
      type="button"
      class="icon primary"
      aria-label={playing ? labels.pause : labels.play}
      title={playing ? labels.pause : labels.play}
      onclick={toggle}
    >
      {#if playing}
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>
      {:else}
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" /></svg>
      {/if}
    </button>
    <button
      type="button"
      class="icon"
      aria-label={labels.next}
      title={labels.next}
      disabled={finished}
      onclick={() => moveTo(position + 1)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
    </button>

    <input
      class="scrubber"
      type="range"
      min="-1"
      max={lastPosition}
      step="1"
      value={position}
      aria-label={labels.progress}
      aria-valuetext={position < 0 ? labels.start : `${labels.step} ${position + 1} ${labels.of} ${lastPosition + 1}`}
      oninput={(event) => moveTo(Number(event.currentTarget.value))}
    />
    <span class="counter">{position < 0 ? 0 : position + 1}/{lastPosition + 1}</span>

    <label class="speed">
      <span class="visually-hidden">{labels.speed}</span>
      <select bind:value={speed} title={labels.speed}>
        {#each speeds as option (option)}
          <option value={option}>{option}×</option>
        {/each}
      </select>
    </label>
  </div>
</figure>

<style>
  .player {
    margin: 1.5rem 0;
    border: 1px solid var(--kx-rule);
    border-top: 2px solid var(--sl-color-white);
    border-radius: 0;
    background: var(--sl-color-gray-7);
    overflow: hidden;
  }

  .variants {
    display: flex;
    flex-wrap: wrap;
    gap: 0 1.25rem;
    padding: 0 1rem;
    border-bottom: 1px solid var(--kx-rule);
  }

  .variant {
    padding: 0.7rem 0 0.6rem;
    border: 0;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: var(--sl-color-gray-3);
    font: inherit;
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-xs);
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .variant[aria-pressed="true"] {
    border-bottom-color: var(--sl-color-accent);
    color: var(--sl-color-white);
  }

  .stage {
    padding: 1rem;
  }

  .narration {
    min-height: 7.5rem;
    padding: 0.75rem 1rem;
    border-top: 1px solid var(--kx-rule);
    font-size: var(--sl-text-sm);
    line-height: 1.6;
  }

  .narration p {
    margin: 0 0 0.5rem;
  }

  .source {
    color: var(--sl-color-gray-3);
  }

  .source a {
    color: var(--sl-color-accent);
    text-decoration: none;
  }

  .source a:hover {
    text-decoration: underline;
  }

  .outcome {
    padding: 0.5rem 0.75rem;
    border-left: 3px solid var(--sl-color-accent);
    background: var(--sl-color-black);
    color: var(--sl-color-white);
  }

  .controls {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.5rem 0.75rem;
    border-top: 1px solid var(--kx-rule);
  }

  .icon {
    display: grid;
    place-items: center;
    flex: none;
    width: 2.25rem;
    height: 2.25rem;
    border: 1px solid var(--kx-rule-strong);
    border-radius: 2px;
    background: transparent;
    color: var(--sl-color-white);
    cursor: pointer;
  }

  .icon:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .icon.primary {
    border-color: var(--sl-color-white);
    background: var(--sl-color-white);
    color: var(--sl-color-black);
  }

  .icon svg {
    width: 1.1rem;
    height: 1.1rem;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .icon.primary svg path:only-child {
    fill: currentColor;
  }

  .scrubber {
    flex: 1;
    min-width: 3rem;
    accent-color: var(--sl-color-accent);
  }

  .counter {
    flex: none;
    min-width: 2.5rem;
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-xs);
    text-align: center;
  }

  .speed select {
    padding: 0.25rem;
    border: 1px solid var(--kx-rule-strong);
    border-radius: 2px;
    background: transparent;
    color: var(--sl-color-white);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-xs);
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  button:focus-visible,
  select:focus-visible,
  input:focus-visible {
    outline: 2px solid var(--sl-color-accent);
    outline-offset: 2px;
  }
</style>
