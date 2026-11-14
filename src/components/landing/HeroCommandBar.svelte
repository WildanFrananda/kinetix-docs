<script lang="ts">
  import type { HeroCommandItem } from "../../site/types/hero_command_item.type";
  import type { HeroCommandLabels } from "../../site/types/hero_command_labels.type";

  type Props = {
    items: readonly HeroCommandItem[];
    labels: HeroCommandLabels;
  };

  let { items, labels }: Props = $props();
  let activeIndex = $state(0);
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | undefined = undefined;
  let tabElements: Array<HTMLButtonElement | null> = [];

  const activeItem = $derived(items[activeIndex] ?? items[0]);

  function selectTab(index: number): void {
    activeIndex = index;
    copied = false;
  }

  function onTabKeydown(event: KeyboardEvent, index: number): void {
    const lastIndex = items.length - 1;
    let nextIndex = -1;

    if (event.key === "ArrowRight") {
      nextIndex = index >= lastIndex ? 0 : index + 1;
    } else if (event.key === "ArrowLeft") {
      nextIndex = index <= 0 ? lastIndex : index - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = lastIndex;
    }

    if (nextIndex >= 0) {
      event.preventDefault();
      selectTab(nextIndex);
      tabElements[nextIndex]?.focus();
    }
  }

  async function copyCommand(): Promise<void> {
    if (activeItem === undefined) {
      return;
    }

    if (typeof navigator !== "undefined" && navigator.clipboard !== undefined) {
      await navigator.clipboard.writeText(activeItem.command);
    }

    copied = true;

    if (copyTimer !== undefined) {
      clearTimeout(copyTimer);
    }

    copyTimer = setTimeout(() => {
      copied = false;
    }, 1800);
  }
</script>

<div class="kx-cmd-box not-content">
  <div class="kx-cmd-head">
    <div class="kx-cmd-tabs" role="tablist" aria-label={labels.regionLabel}>
      {#each items as item, index (item.id)}
        <button
          bind:this={tabElements[index]}
          type="button"
          role="tab"
          id={`kx-cmd-tab-${item.id}`}
          class="kx-cmd-tab"
          aria-selected={activeIndex === index}
          tabindex={activeIndex === index ? 0 : -1}
          onclick={() => selectTab(index)}
          onkeydown={(event) => onTabKeydown(event, index)}
        >
          {item.label}
        </button>
      {/each}
    </div>
    <button
      type="button"
      class="kx-cmd-copy"
      onclick={copyCommand}
      aria-label={copied ? labels.copiedLabel : labels.copyLabel}
    >
      <span aria-live="polite">{copied ? labels.copiedLabel : labels.copyLabel}</span>
    </button>
  </div>

  {#each items as item, index (item.id)}
    <div
      role="tabpanel"
      aria-labelledby={`kx-cmd-tab-${item.id}`}
      hidden={activeIndex !== index}
      class="kx-cmd-panel"
    >
      <div class="kx-cmd-line">
        <span class="kx-cmd-prompt" aria-hidden="true">$</span>
        <code>{item.command}</code>
      </div>
      <p class="kx-cmd-note">{item.note}</p>
    </div>
  {/each}
</div>

<style>
  .kx-cmd-box {
    border: 1px solid var(--kx-land-border);
    border-radius: var(--kx-land-radius);
    background: var(--kx-land-card-solid);
    overflow: clip;
    max-inline-size: 38rem;
  }

  .kx-cmd-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding-inline: 0.5rem 0.6rem;
    border-block-end: 1px solid var(--kx-land-border);
    background: var(--kx-land-surface-elevated);
  }

  .kx-cmd-tabs {
    display: flex;
    align-items: stretch;
    gap: 0.25rem;
    overflow-x: auto;
    scrollbar-width: none;
    min-inline-size: 0;
  }

  .kx-cmd-tabs::-webkit-scrollbar {
    display: none;
  }

  .kx-cmd-tab {
    position: relative;
    flex: none;
    padding: 0.55rem 0.75rem;
    border: 0;
    background: transparent;
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-xs);
    cursor: pointer;
    white-space: nowrap;
  }

  .kx-cmd-tab:hover {
    color: var(--sl-color-white);
  }

  .kx-cmd-tab[aria-selected="true"] {
    color: var(--sl-color-white);
  }

  .kx-cmd-tab[aria-selected="true"]::after {
    content: "";
    position: absolute;
    inset-inline: 0.35rem;
    inset-block-end: 0;
    border-block-end: 2px solid var(--sl-color-accent);
  }

  .kx-cmd-copy {
    flex: none;
    padding: 0.3rem 0.65rem;
    border: 1px solid var(--kx-land-border-strong);
    border-radius: 4px;
    background: transparent;
    color: var(--sl-color-gray-2);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    cursor: pointer;
    min-block-size: 1.75rem;
  }

  .kx-cmd-copy:hover {
    border-color: var(--sl-color-accent);
    color: var(--sl-color-white);
  }

  .kx-cmd-panel[hidden] {
    display: none;
  }

  .kx-cmd-panel {
    padding: 0.85rem 1rem;
  }

  .kx-cmd-line {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    overflow-x: auto;
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-sm);
    color: var(--sl-color-white);
  }

  .kx-cmd-prompt {
    color: var(--sl-color-accent);
    user-select: none;
  }

  .kx-cmd-line code {
    background: transparent;
    padding: 0;
    border: 0;
    font-size: inherit;
    color: inherit;
    white-space: nowrap;
  }

  .kx-cmd-note {
    margin: 0.45rem 0 0;
    color: var(--sl-color-gray-3);
    font-size: var(--sl-text-xs);
    line-height: 1.45;
  }

  @media (max-width: 30rem) {
    .kx-cmd-head {
      gap: 0.35rem;
      padding-inline: 0.35rem 0.45rem;
    }

    .kx-cmd-tabs {
      gap: 0.1rem;
    }

    .kx-cmd-tab {
      padding: 0.5rem 0.48rem;
      font-size: 0.72rem;
    }

    .kx-cmd-copy {
      padding: 0.25rem 0.5rem;
    }
  }

  @media (forced-colors: active) {
    .kx-cmd-tab[aria-selected="true"]::after {
      border-block-end-color: Highlight;
    }
  }
</style>
