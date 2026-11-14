<script lang="ts">
  import type { HeroPulseLabels } from "../../site/types/hero_pulse_labels.type";
  import type { HeroPulseNode } from "../../site/types/hero_pulse_node.type";

  type Props = {
    nodes: readonly HeroPulseNode[];
    labels: HeroPulseLabels;
    contractsVersion: string;
  };

  type Wire = {
    readonly id: string;
    readonly from: string;
    readonly to: string;
    readonly path: string;
    readonly duration: string;
    readonly delay: string;
  };

  let { nodes, labels, contractsVersion }: Props = $props();
  let selectedId = $state("contracts");
  let paused = $state(false);

  const wires: readonly Wire[] = [
    {
      id: "clients-gateway",
      from: "clients",
      to: "gateway",
      path: "M 164 185 C 204 185, 204 108, 244 108",
      duration: "2.6s",
      delay: "0s"
    },
    {
      id: "clients-edge",
      from: "clients",
      to: "edge",
      path: "M 164 195 C 204 195, 204 272, 244 272",
      duration: "2.8s",
      delay: "0.4s"
    },
    {
      id: "gateway-contracts",
      from: "gateway",
      to: "contracts",
      path: "M 376 108 C 406 108, 404 182, 434 182",
      duration: "2.4s",
      delay: "0.2s"
    },
    {
      id: "edge-contracts",
      from: "edge",
      to: "contracts",
      path: "M 376 272 C 406 272, 404 198, 434 198",
      duration: "2.5s",
      delay: "0.6s"
    },
    {
      id: "contracts-commerce",
      from: "contracts",
      to: "commerce",
      path: "M 566 176 C 598 176, 598 54, 630 54",
      duration: "2.2s",
      delay: "0.1s"
    },
    {
      id: "contracts-fulfilment",
      from: "contracts",
      to: "fulfilment",
      path: "M 566 184 C 598 184, 598 144, 630 144",
      duration: "2.5s",
      delay: "0.5s"
    },
    {
      id: "contracts-identity",
      from: "contracts",
      to: "identity",
      path: "M 566 196 C 598 196, 598 236, 630 236",
      duration: "2.3s",
      delay: "0.3s"
    },
    {
      id: "contracts-notary",
      from: "contracts",
      to: "notary",
      path: "M 566 204 C 598 204, 598 326, 630 326",
      duration: "2.7s",
      delay: "0.7s"
    }
  ];

  const selectedNode = $derived(nodes.find((node) => node.id === selectedId) ?? nodes[0]);

  function findNode(id: string): HeroPulseNode | undefined {
    return nodes.find((node) => node.id === id);
  }

  function isWireActive(wire: Wire): boolean {
    if (selectedId === "contracts") {
      return true;
    }

    return wire.from === selectedId || wire.to === selectedId;
  }

  function togglePlayback(): void {
    paused = !paused;
  }

  function selectNode(id: string): void {
    selectedId = id;
  }
</script>

<section class="kx-pulse-shell not-content" class:is-paused={paused} aria-label={labels.regionLabel}>
  <div class="kx-pulse-bar">
    <div class="kx-pulse-meta">
      <span class="kx-pulse-dot" aria-hidden="true"></span>
      <span class="kx-pulse-title">{labels.coreHub} · v{contractsVersion}</span>
    </div>
    <button type="button" class="kx-pulse-toggle" onclick={togglePlayback}>
      {paused ? labels.playLabel : labels.pauseLabel}
    </button>
  </div>

  <div class="kx-pulse-stage" class:is-paused={paused}>
    <div class="kx-pulse-headers" aria-hidden="true">
      <span>{labels.clientsGroup}</span>
      <span>{labels.edgeGroup}</span>
      <span>{labels.coreHub}</span>
      <span>{labels.servicesGroup}</span>
    </div>

    <div class="kx-pulse-canvas">
      <svg class="kx-pulse-svg" viewBox="0 0 800 380" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="kx-beam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--kx-lane-a)" />
            <stop offset="50%" stop-color="var(--sl-color-accent)" />
            <stop offset="100%" stop-color="var(--kx-lane-b)" />
          </linearGradient>
          <radialGradient id="kx-orb-glow">
            <stop offset="0%" stop-color="#fff4e6" />
            <stop offset="40%" stop-color="var(--sl-color-accent)" />
            <stop offset="100%" stop-color="transparent" />
          </radialGradient>
        </defs>

        {#each wires as wire (wire.id)}
          <path
            d={wire.path}
            class="kx-wire-base"
            class:is-active={isWireActive(wire)}
          />
          <path
            d={wire.path}
            class="kx-wire-signal"
            class:is-active={isWireActive(wire)}
            style={`--pulse-duration: ${wire.duration}; --pulse-delay: ${wire.delay};`}
          />
          <circle
            class={`kx-wire-halo kx-wire-id-${wire.id}`}
            class:is-active={isWireActive(wire)}
            r="8"
            style={`--pulse-duration: ${wire.duration}; --pulse-delay: ${wire.delay};`}
          />
          <circle
            class={`kx-wire-orb kx-wire-id-${wire.id}`}
            class:is-active={isWireActive(wire)}
            r="3"
            style={`--pulse-duration: ${wire.duration}; --pulse-delay: ${wire.delay};`}
          />
        {/each}
      </svg>

      <div class="kx-pulse-grid">
      <div class="kx-col kx-col-clients">
        <span class="kx-col-label">{labels.clientsGroup}</span>
        {#if findNode("clients")}
          {@const node = findNode("clients")}
          {#if node}
            <button
              type="button"
              class="kx-node"
              class:is-selected={selectedId === node.id}
              onclick={() => selectNode(node.id)}
              aria-pressed={selectedId === node.id}
            >
              <span class="kx-node-name">{node.label}</span>
              <span class="kx-node-sub">{node.sublabel}</span>
            </button>
          {/if}
        {/if}
      </div>

      <div class="kx-col kx-col-edge">
        <span class="kx-col-label">{labels.edgeGroup}</span>
        {#each ["gateway", "edge"] as id (id)}
          {@const node = findNode(id)}
          {#if node}
            <button
              type="button"
              class="kx-node"
              class:is-selected={selectedId === node.id}
              onclick={() => selectNode(node.id)}
              aria-pressed={selectedId === node.id}
            >
              <span class="kx-node-name">{node.label}</span>
              <span class="kx-node-sub">{node.sublabel}</span>
            </button>
          {/if}
        {/each}
      </div>

      <div class="kx-col kx-col-core">
        <span class="kx-col-label">{labels.coreHub}</span>
        {#if findNode("contracts")}
          {@const node = findNode("contracts")}
          {#if node}
            <button
              type="button"
              class="kx-node kx-node-core"
              class:is-selected={selectedId === node.id}
              onclick={() => selectNode(node.id)}
              aria-pressed={selectedId === node.id}
            >
              <span class="kx-core-chip">gRPC</span>
              <span class="kx-node-name">{node.label}</span>
              <span class="kx-node-sub">{node.sublabel}</span>
            </button>
          {/if}
        {/if}
      </div>

      <div class="kx-col kx-col-domains">
        <span class="kx-col-label">{labels.servicesGroup}</span>
        {#each ["commerce", "fulfilment", "identity", "notary"] as id (id)}
          {@const node = findNode(id)}
          {#if node}
            <button
              type="button"
              class="kx-node"
              class:is-selected={selectedId === node.id}
              onclick={() => selectNode(node.id)}
              aria-pressed={selectedId === node.id}
            >
              <span class="kx-node-name">{node.label}</span>
              <span class="kx-node-sub">{node.sublabel}</span>
            </button>
          {/if}
        {/each}
      </div>
      </div>
    </div>
  </div>

  {#if selectedNode}
    <div class="kx-pulse-inspector" aria-live="polite">
      <div class="kx-inspector-copy">
        <strong class="kx-inspector-name">{selectedNode.label}</strong>
        <p class="kx-inspector-detail">{selectedNode.detail}</p>
      </div>
      <a class="kx-inspector-link" href={selectedNode.href}>
        {selectedNode.linkLabel} <span aria-hidden="true">→</span>
      </a>
    </div>
  {/if}
</section>

<style>
  .kx-pulse-shell {
    position: relative;
    border: 1px solid var(--kx-land-border);
    border-radius: var(--kx-land-radius-lg);
    background: var(--kx-land-card-bg);
    box-shadow: var(--kx-land-card-shadow);
    overflow: clip;
  }

  .kx-pulse-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem 0.75rem;
    padding: 0.65rem 1rem;
    border-block-end: 1px solid var(--kx-land-border);
    background: var(--kx-land-surface-elevated);
  }

  .kx-pulse-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-inline-size: 0;
  }

  .kx-pulse-dot {
    position: relative;
    inline-size: 0.5rem;
    block-size: 0.5rem;
    border-radius: 999px;
    background: var(--sl-color-accent);
    box-shadow: 0 0 10px var(--sl-color-accent);
    flex: none;
  }

  .kx-pulse-dot::after {
    content: "";
    position: absolute;
    inset: -3px;
    border-radius: inherit;
    border: 1px solid var(--sl-color-accent);
    opacity: 0;
  }

  .kx-pulse-title {
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--sl-color-gray-2);
    white-space: nowrap;
  }

  .kx-pulse-toggle {
    flex: none;
    padding: 0.28rem 0.65rem;
    border: 1px solid var(--kx-land-border-strong);
    border-radius: 4px;
    background: transparent;
    color: var(--sl-color-gray-2);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    white-space: nowrap;
    cursor: pointer;
    min-block-size: 1.75rem;
  }

  .kx-pulse-toggle:hover {
    border-color: var(--sl-color-accent);
    color: var(--sl-color-white);
  }

  .kx-pulse-stage {
    position: relative;
    padding: 0.9rem 1rem 1.25rem;
    background-image: radial-gradient(circle at 57% 50%, var(--kx-land-glow-soft), transparent 62%);
  }

  .kx-pulse-headers {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
    margin-block-end: 0.65rem;
    font-family: var(--sl-font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--sl-color-gray-3);
  }

  .kx-pulse-canvas {
    position: relative;
  }

  .kx-pulse-svg {
    display: block;
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    pointer-events: none;
  }

  .kx-wire-base {
    fill: none;
    stroke: var(--kx-land-border-strong);
    stroke-width: 1.5;
    opacity: 0.45;
    transition: opacity 0.2s ease, stroke 0.2s ease;
  }

  .kx-wire-base.is-active {
    stroke: var(--sl-color-accent);
    opacity: 0.5;
  }

  .kx-wire-signal {
    fill: none;
    stroke: url(#kx-beam-grad);
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-dasharray: 34 184;
    stroke-dashoffset: 0;
    opacity: 0.25;
    transition: opacity 0.2s ease;
  }

  .kx-wire-signal.is-active {
    opacity: 0.95;
  }

  .kx-wire-halo {
    fill: url(#kx-orb-glow);
    opacity: 0;
    offset-distance: 0%;
  }

  .kx-wire-orb {
    fill: #ffe8d6;
    opacity: 0;
    offset-distance: 0%;
  }

  .kx-wire-id-clients-gateway {
    offset-path: path("M 164 185 C 204 185, 204 108, 244 108");
  }

  .kx-wire-id-clients-edge {
    offset-path: path("M 164 195 C 204 195, 204 272, 244 272");
  }

  .kx-wire-id-gateway-contracts {
    offset-path: path("M 376 108 C 406 108, 404 182, 434 182");
  }

  .kx-wire-id-edge-contracts {
    offset-path: path("M 376 272 C 406 272, 404 198, 434 198");
  }

  .kx-wire-id-contracts-commerce {
    offset-path: path("M 566 176 C 598 176, 598 54, 630 54");
  }

  .kx-wire-id-contracts-fulfilment {
    offset-path: path("M 566 184 C 598 184, 598 144, 630 144");
  }

  .kx-wire-id-contracts-identity {
    offset-path: path("M 566 196 C 598 196, 598 236, 630 236");
  }

  .kx-wire-id-contracts-notary {
    offset-path: path("M 566 204 C 598 204, 598 326, 630 326");
  }

  @media (prefers-reduced-motion: no-preference) {
    .kx-pulse-shell:not(.is-paused) .kx-pulse-dot::after {
      animation: kx-dot-ripple 2.2s cubic-bezier(0.2, 0.7, 0.4, 1) infinite;
    }

    .kx-pulse-shell:not(.is-paused) .kx-node-core {
      animation: kx-hub-breathe 3.6s ease-in-out infinite;
    }

    .kx-pulse-stage:not(.is-paused) .kx-wire-signal {
      animation: kx-signal-flow var(--pulse-duration, 2.5s) linear var(--pulse-delay, 0s) infinite;
    }

    .kx-pulse-stage:not(.is-paused) .kx-wire-halo.is-active {
      opacity: 0.9;
      animation: kx-orb-travel var(--pulse-duration, 2.5s) linear var(--pulse-delay, 0s) infinite;
    }

    .kx-pulse-stage:not(.is-paused) .kx-wire-orb.is-active {
      opacity: 1;
      animation: kx-orb-travel var(--pulse-duration, 2.5s) linear var(--pulse-delay, 0s) infinite;
    }
  }

  @keyframes kx-signal-flow {
    from {
      stroke-dashoffset: 218;
    }

    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes kx-orb-travel {
    0% {
      offset-distance: 0%;
      opacity: 0;
    }

    12% {
      opacity: 1;
    }

    88% {
      opacity: 1;
    }

    100% {
      offset-distance: 100%;
      opacity: 0;
    }
  }

  @keyframes kx-dot-ripple {
    0% {
      transform: scale(0.9);
      opacity: 0.85;
    }

    100% {
      transform: scale(2.4);
      opacity: 0;
    }
  }

  @keyframes kx-hub-breathe {
    0%,
    100% {
      box-shadow: 0 0 0 1px var(--sl-color-accent), 0 0 22px var(--kx-land-glow-soft);
    }

    50% {
      box-shadow: 0 0 0 1px var(--sl-color-accent), 0 0 38px rgba(240, 116, 47, 0.34);
    }
  }

  .kx-pulse-grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
    align-items: center;
    min-block-size: 20rem;
  }

  .kx-col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.85rem;
    min-inline-size: 0;
  }

  .kx-col-domains {
    gap: 0.65rem;
  }

  .kx-col-label {
    display: none;
    font-family: var(--sl-font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--sl-color-gray-3);
  }

  .kx-node {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.15rem;
    inline-size: 100%;
    padding: 0.6rem 0.75rem;
    border: 1px solid var(--kx-land-border-strong);
    border-radius: var(--kx-land-radius);
    background: var(--kx-land-card-solid);
    color: var(--sl-color-white);
    text-align: start;
    cursor: pointer;
    transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
  }

  .kx-node:hover {
    border-color: var(--sl-color-accent);
  }

  .kx-node.is-selected {
    border-color: var(--sl-color-accent);
    background: var(--kx-land-node-active);
    box-shadow: 0 0 0 1px var(--sl-color-accent), 0 0 22px var(--kx-land-glow-soft);
  }

  .kx-node-core {
    padding: 0.9rem 0.85rem;
    border-color: rgba(240, 116, 47, 0.45);
    box-shadow: 0 0 26px var(--kx-land-glow-soft);
  }

  .kx-core-chip {
    padding: 0.1rem 0.4rem;
    margin-block-end: 0.25rem;
    border-radius: 3px;
    background: var(--sl-color-accent-low);
    color: var(--sl-color-accent-high);
    font-family: var(--sl-font-mono);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .kx-node-name {
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-xs);
    font-weight: 600;
    color: var(--sl-color-white);
  }

  .kx-node-sub {
    font-size: 0.72rem;
    color: var(--sl-color-gray-3);
    line-height: 1.3;
  }

  .kx-pulse-inspector {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem 1.25rem;
    padding: 0.85rem 1rem;
    border-block-start: 1px solid var(--kx-land-border);
    background: var(--kx-land-surface-elevated);
  }

  .kx-inspector-copy {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    flex: 1 1 18rem;
    min-inline-size: 0;
  }

  .kx-inspector-name {
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-xs);
    color: var(--sl-color-accent);
  }

  .kx-inspector-detail {
    margin: 0;
    font-size: var(--sl-text-sm);
    color: var(--sl-color-gray-2);
    line-height: 1.45;
  }

  .kx-inspector-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.45rem 0.8rem;
    border: 1px solid var(--kx-land-border-strong);
    border-radius: 6px;
    color: var(--sl-color-white);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-xs);
    text-decoration: none;
    white-space: nowrap;
  }

  .kx-inspector-link:hover {
    border-color: var(--sl-color-accent);
    color: var(--sl-color-accent);
  }

  @media (max-width: 48rem) {
    .kx-pulse-headers {
      display: none;
    }

    .kx-pulse-svg {
      display: none;
    }

    .kx-pulse-grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 0.75rem;
      min-block-size: 0;
    }

    .kx-col-label {
      display: block;
      grid-column: 1 / -1;
    }

    .kx-col {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(9.5rem, 1fr));
      gap: 0.5rem;
    }
  }

  @media (forced-colors: active) {
    .kx-node.is-selected {
      outline: 2px solid Highlight;
    }
  }
</style>
