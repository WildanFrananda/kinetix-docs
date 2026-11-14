<script lang="ts">
  import type { LandingServiceItem } from "../../site/types/landing_service_item.type";
  import type { ServiceCategoryId } from "../../site/types/service_category_id.type";
  import type { ServiceCategoryTab } from "../../site/types/service_category_tab.type";
  import type { ServiceExplorerLabels } from "../../site/types/service_explorer_labels.type";

  type Props = {
    items: readonly LandingServiceItem[];
    tabs: readonly ServiceCategoryTab[];
    labels: ServiceExplorerLabels;
  };

  let { items, tabs, labels }: Props = $props();
  let activeCategory = $state<ServiceCategoryId>("all");

  const visibleItems = $derived(
    activeCategory === "all" ? items : items.filter((item) => item.category === activeCategory)
  );

  function monogram(name: string): string {
    const words = name.split(/[\s./+-]+/).filter((word) => word.length > 0);

    if (words.length > 1) {
      return words
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
    }

    return `${name.charAt(0).toUpperCase()}${name.charAt(1).toLowerCase()}`;
  }

  function selectCategory(id: ServiceCategoryId): void {
    activeCategory = id;
  }
</script>

<div class="kx-svc-explorer">
  <div class="kx-svc-filters" role="group" aria-label={labels.filterLabel}>
    {#each tabs as tab (tab.id)}
      <button
        type="button"
        class="kx-svc-filter"
        aria-pressed={activeCategory === tab.id}
        onclick={() => selectCategory(tab.id)}
      >
        <span>{tab.label}</span>
        <span class="kx-svc-count">{tab.count}</span>
      </button>
    {/each}
  </div>

  <div class="kx-svc-grid" data-category={activeCategory}>
    {#each visibleItems as service (service.name)}
      <article class="kx-svc-card">
        <header class="kx-svc-head">
          <div class="kx-svc-logos" aria-hidden="true">
            <span class="kx-svc-tile">
              {#if service.languageLogoUrl}
                <img src={service.languageLogoUrl} alt="" loading="lazy" decoding="async" />
              {:else}
                <span class="kx-svc-mono">{monogram(service.languageName)}</span>
              {/if}
            </span>
            <span class="kx-svc-tile">
              {#if service.frameworkLogoUrl}
                <img src={service.frameworkLogoUrl} alt="" loading="lazy" decoding="async" />
              {:else}
                <span class="kx-svc-mono">{monogram(service.frameworkName)}</span>
              {/if}
            </span>
          </div>
          <span class="kx-svc-cat">
            <svg class="kx-svc-pulse" viewBox="0 0 18 10" aria-hidden="true">
              <path class="kx-svc-pulse-base" d="M1 5h4l1.5-3.5 2.5 7 1.8-3.5H17" />
              <path class="kx-svc-pulse-trace" d="M1 5h4l1.5-3.5 2.5 7 1.8-3.5H17" />
            </svg>
            <span>{service.categoryLabel}</span>
          </span>
        </header>

        <div class="kx-svc-body">
          <h3 class="kx-svc-name">{service.name}</h3>
          <p class="kx-svc-owns">{service.owns}</p>
          <p class="kx-svc-stack">
            <span>{service.languageName}</span>
            <span aria-hidden="true">·</span>
            <span>{service.frameworkName}</span>
            {#if service.frameworkVersion}
              <span class="kx-svc-ver">{service.frameworkVersion}</span>
            {/if}
          </p>
        </div>

        <footer class="kx-svc-foot">
          {#if service.docHref}
            <a class="kx-svc-link kx-svc-link-primary" href={service.docHref}>
              {labels.docsLink} <span class="kx-svc-arrow" aria-hidden="true">→</span>
            </a>
          {/if}
          <a class="kx-svc-link" href={service.repository} target="_blank" rel="noopener noreferrer">
            {labels.sourceLink} <span class="kx-svc-arrow" aria-hidden="true">↗</span>
          </a>
        </footer>
      </article>
    {/each}
  </div>
</div>

<style>
  .kx-svc-explorer {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .kx-svc-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .kx-svc-filter {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    min-block-size: 44px;
    padding: 0 0.85rem;
    border: 1px solid var(--kx-land-border-strong);
    border-radius: 6px;
    background: var(--kx-land-card-bg);
    color: var(--sl-color-gray-2);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-xs);
    cursor: pointer;
    transition: border-color 0.16s ease, color 0.16s ease, background-color 0.16s ease, scale 0.14s ease-out;
  }

  .kx-svc-filter:hover {
    border-color: var(--sl-color-accent);
    color: var(--sl-color-white);
  }

  .kx-svc-filter:active {
    scale: 0.97;
  }

  .kx-svc-filter:focus-visible,
  .kx-svc-link:focus-visible {
    outline: 2px solid var(--sl-color-accent);
    outline-offset: 2px;
    border-radius: 6px;
  }

  .kx-svc-filter[aria-pressed="true"] {
    border-color: var(--sl-color-accent);
    background: var(--sl-color-accent-low);
    color: var(--sl-color-white);
    box-shadow: inset 0 -2px 0 var(--sl-color-accent);
  }

  .kx-svc-count {
    font-size: 0.7rem;
    color: var(--sl-color-gray-3);
  }

  .kx-svc-filter[aria-pressed="true"] .kx-svc-count {
    color: var(--sl-color-accent-high);
  }

  .kx-svc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 17.25rem), 1fr));
    gap: 0.9rem;
  }

  .kx-svc-card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    padding: 1.1rem;
    border: 1px solid var(--kx-land-border);
    border-radius: var(--kx-land-radius);
    background: var(--kx-land-card-bg);
    min-inline-size: 0;
    overflow: clip;
    transition: border-color 0.2s ease, background-color 0.2s ease, translate 0.34s ease-out;
    transition-timing-function: ease, ease, linear(0, 0.45 20%, 1.06 55%, 0.99 80%, 1);
  }

  .kx-svc-card::before {
    content: "";
    position: absolute;
    inset-block-start: 0;
    inset-inline: 0;
    block-size: 2px;
    background: linear-gradient(90deg, transparent, var(--sl-color-accent), var(--kx-land-accent-warm), transparent);
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 0.24s ease;
    pointer-events: none;
  }

  .kx-svc-card:hover {
    border-color: var(--sl-color-accent);
  }

  .kx-svc-card:hover::before {
    opacity: 1;
  }

  .kx-svc-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .kx-svc-logos {
    display: flex;
    gap: 0.35rem;
  }

  .kx-svc-tile {
    display: grid;
    place-items: center;
    inline-size: 1.9rem;
    block-size: 1.9rem;
    padding: 0.3rem;
    border: 1px solid var(--kx-rule);
    border-radius: 4px;
    background: var(--kx-tile);
    transition: scale 0.28s ease-out;
    transition-timing-function: linear(0, 0.45 20%, 1.08 55%, 0.99 80%, 1);
  }

  .kx-svc-tile img {
    inline-size: 100%;
    block-size: 100%;
    object-fit: contain;
  }

  .kx-svc-mono {
    color: #171614;
    font-family: var(--sl-font-mono);
    font-size: 0.65rem;
    font-weight: 600;
  }

  .kx-svc-cat {
    display: inline-flex;
    align-items: center;
    gap: 0.38rem;
    font-family: var(--sl-font-mono);
    font-size: 0.66rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--sl-color-gray-3);
  }

  .kx-svc-pulse {
    inline-size: 18px;
    block-size: 10px;
    fill: none;
    stroke-width: 1.4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .kx-svc-pulse-base {
    stroke: var(--kx-land-border-strong);
  }

  .kx-svc-pulse-trace {
    stroke: var(--sl-color-accent);
    stroke-dasharray: 28;
    stroke-dashoffset: 28;
    opacity: 0.55;
    transition: stroke-dashoffset 0.55s ease-out, opacity 0.25s ease;
  }

  .kx-svc-card:hover .kx-svc-pulse-trace {
    stroke-dashoffset: 0;
    opacity: 1;
  }

  .kx-svc-body {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    min-inline-size: 0;
  }

  .kx-svc-name {
    margin: 0;
    color: var(--sl-color-white);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-base);
    font-weight: 600;
  }

  .kx-svc-owns {
    margin: 0;
    color: var(--sl-color-gray-2);
    font-size: var(--sl-text-sm);
    line-height: 1.45;
  }

  .kx-svc-stack {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.3rem;
    margin: 0.15rem 0 0;
    color: var(--sl-color-gray-3);
    font-size: var(--sl-text-xs);
  }

  .kx-svc-ver {
    font-family: var(--sl-font-mono);
    font-size: 0.72rem;
  }

  .kx-svc-foot {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 1rem;
    margin-block-start: auto;
    padding-block-start: 0.35rem;
    border-block-start: 1px solid var(--kx-land-border);
  }

  .kx-svc-link {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    min-block-size: 44px;
    padding-inline: 0.15rem;
    color: var(--sl-color-gray-2);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-xs);
    text-decoration: none;
  }

  .kx-svc-link-primary {
    color: var(--sl-color-accent);
  }

  .kx-svc-link:hover {
    color: var(--sl-color-white);
  }

  .kx-svc-arrow {
    display: inline-block;
    transition: translate 0.2s ease-out;
  }

  .kx-svc-link:hover .kx-svc-arrow {
    translate: 2px 0;
  }

  @keyframes kx-svc-enter {
    from {
      opacity: 0.01;
      translate: 0 8px;
    }

    to {
      opacity: 1;
      translate: 0 0;
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    .kx-svc-card {
      animation: kx-svc-enter 260ms ease-out both;
    }

    .kx-svc-card:hover {
      translate: 0 -2px;
    }

    .kx-svc-card:hover .kx-svc-tile {
      scale: 1.07;
    }
  }

  @media (forced-colors: active) {
    .kx-svc-filter[aria-pressed="true"] {
      outline: 2px solid Highlight;
    }
  }
</style>
