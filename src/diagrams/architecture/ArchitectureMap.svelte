<script lang="ts">
  import { prefersReducedMotion } from "svelte/motion";
  import { fade } from "svelte/transition";
  import type { ArchitectureMapLabels } from "../types/architecture_map_labels.type";
  import type { LocalizedMapEdge } from "../types/localized_map_edge.type";
  import type { LocalizedMapNode } from "../types/localized_map_node.type";
  import { edgeSegment } from "./edge_segment";
  import { mapHeight, mapWidth, nodeHalfHeight, nodeHalfWidth } from "./map_dimensions";

  type Props = {
    nodes: readonly LocalizedMapNode[];
    edges: readonly LocalizedMapEdge[];
    labels: ArchitectureMapLabels;
  };

  let { nodes, edges, labels }: Props = $props();

  const uid = $props.id();
  const width = mapWidth;
  const height = mapHeight;
  const halfWidth = nodeHalfWidth;
  const halfHeight = nodeHalfHeight;

  let selected = $state<string | null>(null);
  let hovered = $state<string | null>(null);

  const focus = $derived(selected ?? hovered);
  const byId = $derived(new Map(nodes.map((node) => [node.id, node])));
  const directions = $derived(new Set(edges.map((edge) => `${edge.from}>${edge.to}`)));

  const lines = $derived(
    edges.map((edge) => {
      const from = byId.get(edge.from);
      const to = byId.get(edge.to);

      if (from === undefined || to === undefined) {
        throw new Error(`edge ${edge.from} -> ${edge.to} names a node that is not on the map`);
      }

      const twoWay = directions.has(`${edge.to}>${edge.from}`);
      const segment = edgeSegment(from, to, halfWidth, halfHeight, twoWay ? 7 : 0, 5);
      const active = focus !== null && (edge.from === focus || edge.to === focus);

      return {
        key: `${edge.from}>${edge.to}`,
        kind: edge.kind,
        active,
        path: `M ${segment.start.x.toFixed(1)} ${segment.start.y.toFixed(1)} L ${segment.end.x.toFixed(1)} ${segment.end.y.toFixed(1)}`
      };
    })
  );

  const neighbours = $derived(
    focus === null
      ? new Set<string>()
      : new Set(edges.flatMap((edge) => (edge.from === focus ? [edge.to] : edge.to === focus ? [edge.from] : [])))
  );

  const current = $derived(selected === null ? null : (byId.get(selected) ?? null));
  const outgoing = $derived(current === null ? [] : edges.filter((edge) => edge.from === current.id));
  const incoming = $derived(current === null ? [] : edges.filter((edge) => edge.to === current.id));
  const routed = $derived(nodes.filter((node) => node.routes.length > 0));

  function stateOf(node: LocalizedMapNode): string {
    if (focus === null) {
      return "idle";
    }

    if (node.id === focus) {
      return "focus";
    }

    if (focus === "gateway" && node.routes.length > 0) {
      return "routed";
    }

    return neighbours.has(node.id) ? "neighbour" : "dim";
  }

  function labelOf(id: string): string {
    return byId.get(id)?.label ?? id;
  }

  function grouped(operations: readonly string[]): [string, string[]][] {
    const groups = new Map<string, string[]>();

    for (const operation of operations) {
      const [service = operation, method = ""] = operation.split("/");
      groups.set(service, [...(groups.get(service) ?? []), method]);
    }

    return [...groups.entries()];
  }

  function toggle(id: string): void {
    selected = selected === id ? null : id;
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape" && selected !== null) {
      selected = null;
    }
  }

  function keyboardControl(element: HTMLElement): () => void {
    element.addEventListener("keydown", onKeydown);

    return () => element.removeEventListener("keydown", onKeydown);
  }
</script>

{#snippet callList(edge: LocalizedMapEdge, other: string)}
  <li class="call-group">
    <p class="peer">{labelOf(other)}</p>
    <ul>
      {#each edge.calls as call (call.operation)}
        {@const [service, method] = edge.kind === "grpc" ? call.operation.split("/") : [undefined, call.operation]}
        <li>
          <code class="operation">{method}</code>
          {#if service !== undefined}<span class="service">{service}</span>{/if}
          {#if call.note !== undefined}<span class="note">{call.note}</span>{/if}
          <a class="source" href={call.source.href} target="_blank" rel="noopener noreferrer">{call.source.label}</a>
        </li>
      {/each}
    </ul>
  </li>
{/snippet}

<figure class="map not-content" {@attach keyboardControl}>
  <p class="hint">{labels.hint}</p>

  <div class="scroller">
    <div class="canvas">
      <svg viewBox="0 0 {width} {height}" aria-hidden="true">
        <defs>
          <marker id="{uid}-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" class="arrow" />
          </marker>
          <marker id="{uid}-arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" class="arrow-active" />
          </marker>
        </defs>
        {#each lines as line (line.key)}
          <path
            d={line.path}
            class="edge edge-{line.kind}"
            class:active={line.active}
            class:dim={focus !== null && !line.active}
            marker-end="url(#{uid}-arrow{line.active ? '-active' : ''})"
          />
        {/each}
        {#if !prefersReducedMotion.current}
          {#each lines.filter((line) => line.active) as line (line.key)}
            <circle r="4" class="packet" transition:fade={{ duration: 150 }}>
              <animateMotion dur="1.5s" repeatCount="indefinite" path={line.path} />
            </circle>
          {/each}
        {/if}
      </svg>

      {#each nodes as node (node.id)}
        <button
          type="button"
          class="node node-{node.kind} state-{stateOf(node)}"
          class:undeployed={!node.deployed}
          data-node={node.id}
          style:left="{(node.x / width) * 100}%"
          style:top="{(node.y / height) * 100}%"
          aria-pressed={selected === node.id}
          onclick={() => toggle(node.id)}
          onmouseenter={() => (hovered = node.id)}
          onmouseleave={() => (hovered = null)}
          onfocus={() => (hovered = node.id)}
          onblur={() => (hovered = null)}
        >
          {#if node.logoUrl !== undefined}
            <img src={node.logoUrl} alt="" />
          {/if}
          <span class="label">{node.label}</span>
        </button>
      {/each}
    </div>
  </div>

  <ul class="legend">
    <li><span class="swatch swatch-grpc"></span>{labels.legend.grpc}</li>
    <li><span class="swatch swatch-http"></span>{labels.legend.http}</li>
    <li><span class="swatch swatch-external"></span>{labels.legend.external}</li>
  </ul>

  <div aria-live="polite">
    {#if current !== null}
    <div class="panel">
      <header>
        <div>
          <p class="kind">{labels.kinds[current.kind]}</p>
          <p class="title">
            {#if current.logoUrl !== undefined}<img src={current.logoUrl} alt="" />{/if}
            {current.label}
            {#if !current.deployed}<span class="badge">{labels.notDeployed}</span>{/if}
          </p>
        </div>
        <button type="button" class="clear" onclick={() => (selected = null)}>{labels.clear}</button>
      </header>
      <p class="summary">{current.summary}</p>

      <div class="facts">
        {#if current.id === "gateway"}
          <section>
            <h4>{labels.legend.routed}</h4>
            <ul class="plain">
              {#each routed as node (node.id)}
                <li><span class="peer-inline">{node.label}</span> <code>{node.routes.join("  ")}</code></li>
              {/each}
            </ul>
          </section>
        {/if}

        {#if current.serves.length > 0}
          <section>
            <h4>{labels.serves}</h4>
            <ul class="plain">
              {#each grouped(current.serves) as [service, methods] (service)}
                <li><span class="service">{service}</span> <code>{methods.join(", ")}</code></li>
              {/each}
            </ul>
          </section>
        {/if}

        {#if outgoing.length > 0}
          <section>
            <h4>{labels.calls}</h4>
            <ul class="plain">
              {#each outgoing as edge (edge.to)}
                {@render callList(edge, edge.to)}
              {/each}
            </ul>
          </section>
        {/if}

        {#if incoming.length > 0}
          <section>
            <h4>{labels.calledBy}</h4>
            <ul class="plain">
              {#each incoming as edge (edge.from)}
                {@render callList(edge, edge.from)}
              {/each}
            </ul>
          </section>
        {:else if current.kind === "service" && current.serves.length > 0}
          <section>
            <h4>{labels.calledBy}</h4>
            <p class="empty">{labels.nothingCalls}</p>
          </section>
        {/if}

        {#if current.kind === "service" && current.routes.length > 0}
          <section>
            <h4>{labels.routes}</h4>
            <p><code>{current.routes.join("  ")}</code></p>
          </section>
        {/if}

        {#if current.stores.length > 0}
          <section>
            <h4>{labels.data}</h4>
            <p>{current.stores.join(" · ")}</p>
          </section>
        {/if}

        {#if current.repository !== undefined}
          <section>
            <h4>{labels.repository}</h4>
            <p><a href={current.repository} target="_blank" rel="noopener noreferrer">{current.repository.replace("https://", "")}</a></p>
          </section>
        {/if}
      </div>
    </div>
    {/if}
  </div>
</figure>

<style>
  .map {
    margin: 1.5rem 0;
    border: 1px solid var(--kx-rule);
    border-top: 2px solid var(--sl-color-white);
    background: var(--sl-color-gray-7);
  }

  .hint {
    margin: 0;
    padding: 0.6rem 1rem;
    border-bottom: 1px solid var(--kx-rule);
    color: var(--sl-color-gray-3);
    font-size: var(--sl-text-xs);
  }

  .scroller {
    overflow-x: auto;
  }

  .canvas {
    position: relative;
    min-width: 36rem;
    aspect-ratio: 1000 / 690;
    container-type: inline-size;
    background-image: radial-gradient(var(--kx-rule) 1px, transparent 1px);
    background-size: 2.5cqw 2.5cqw;
  }

  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .edge {
    fill: none;
    stroke: var(--sl-color-gray-4);
    stroke-width: 1.25;
    transition:
      stroke 200ms ease,
      opacity 200ms ease;
  }

  .edge-http {
    stroke-dasharray: 6 5;
  }

  .edge-external {
    stroke-dasharray: 2 4;
  }

  .edge.active {
    stroke: var(--sl-color-accent);
    stroke-width: 2;
  }

  .edge.dim {
    opacity: 0.18;
  }

  .arrow {
    fill: var(--sl-color-gray-4);
  }

  .arrow-active {
    fill: var(--sl-color-accent);
  }

  .packet {
    fill: var(--sl-color-accent);
    stroke: var(--sl-color-black);
    stroke-width: 1.5;
  }

  .node {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6cqw;
    width: 17cqw;
    height: 5.2cqw;
    padding: 0 0.6cqw;
    border: 1px solid var(--sl-color-white);
    border-radius: 2px;
    background: var(--sl-color-black);
    color: var(--sl-color-white);
    font-family: var(--sl-font-mono);
    font-size: 1.5cqw;
    font-weight: 600;
    transform: translate(-50%, -50%);
    cursor: pointer;
    transition:
      opacity 200ms ease,
      border-color 200ms ease,
      box-shadow 200ms ease;
  }

  .node img {
    flex: none;
    width: 2cqw;
    height: 2cqw;
    padding: 0.2cqw;
    border-radius: 1px;
    background: var(--kx-tile);
  }

  .label {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .node-gateway {
    background: var(--sl-color-white);
    color: var(--sl-color-black);
  }

  .node-client,
  .node-external {
    border-style: dashed;
    background: var(--sl-color-gray-7);
    font-weight: 500;
  }

  .node.undeployed {
    border-style: dashed;
    color: var(--sl-color-gray-3);
  }

  .node.state-focus,
  .node[aria-pressed="true"] {
    border-color: var(--sl-color-accent);
    box-shadow: inset 0 0 0 1px var(--sl-color-accent);
  }

  .node.state-neighbour {
    border-color: var(--sl-color-accent);
  }

  .node.state-routed {
    box-shadow: inset 0 -0.45cqw 0 var(--sl-color-accent);
  }

  .node.state-dim {
    opacity: 0.35;
  }

  .node:focus-visible {
    outline: 2px solid var(--sl-color-accent);
    outline-offset: 2px;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 1.25rem;
    margin: 0;
    padding: 0.6rem 1rem;
    border-top: 1px solid var(--kx-rule);
    list-style: none;
    color: var(--sl-color-gray-3);
    font-size: var(--sl-text-xs);
  }

  .legend li {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    margin: 0;
  }

  .swatch {
    width: 1.75rem;
    border-top: 1.5px solid var(--sl-color-gray-3);
  }

  .swatch-http {
    border-top-style: dashed;
  }

  .swatch-external {
    border-top-style: dotted;
  }

  .panel {
    border-top: 1px solid var(--kx-rule);
  }

  .panel header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.9rem 1rem 0;
  }

  .kind {
    margin: 0;
    color: var(--sl-color-accent);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.2rem 0 0;
    color: var(--sl-color-white);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-lg);
    font-weight: 600;
  }

  .title img {
    width: 1.4rem;
    height: 1.4rem;
    padding: 0.15rem;
    border: 1px solid var(--kx-rule);
    background: var(--kx-tile);
  }

  .badge {
    padding: 0.1rem 0.45rem;
    border: 1px dashed var(--sl-color-gray-3);
    color: var(--sl-color-gray-3);
    font-size: var(--sl-text-2xs);
    font-weight: 500;
    text-transform: uppercase;
  }

  .clear {
    flex: none;
    padding: 0.3rem 0.6rem;
    border: 1px solid var(--kx-rule-strong);
    border-radius: 2px;
    background: transparent;
    color: var(--sl-color-white);
    font: inherit;
    font-size: var(--sl-text-xs);
    cursor: pointer;
  }

  .summary {
    margin: 0.5rem 0 0;
    padding: 0 1rem;
    color: var(--sl-color-gray-2);
    font-size: var(--sl-text-sm);
  }

  .facts {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr));
    gap: 0.25rem 1.5rem;
    padding: 0.5rem 1rem 1rem;
  }

  section h4 {
    margin: 0.75rem 0 0.35rem;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid var(--kx-rule);
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  section p {
    margin: 0;
    font-size: var(--sl-text-sm);
  }

  .plain,
  .plain ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .plain li {
    margin: 0 0 0.3rem;
    font-size: var(--sl-text-xs);
    line-height: 1.5;
  }

  .call-group {
    margin-bottom: 0.6rem !important;
  }

  .peer,
  .peer-inline {
    margin: 0 0 0.15rem;
    color: var(--sl-color-white);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-xs);
    font-weight: 600;
  }

  .operation {
    color: var(--sl-color-white);
    font-size: var(--sl-text-xs);
  }

  .service,
  .note {
    margin-inline-start: 0.35rem;
    color: var(--sl-color-gray-3);
  }

  .note {
    font-style: italic;
  }

  .source {
    margin-inline-start: 0.35rem;
    color: var(--sl-color-accent);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    text-decoration: none;
  }

  .source:hover {
    text-decoration: underline;
  }

  .empty {
    color: var(--sl-color-gray-3);
    font-style: italic;
  }

  section a:not(.source) {
    color: var(--sl-color-white);
    text-decoration-color: var(--sl-color-accent);
    text-underline-offset: 0.2em;
  }

  @media (prefers-reduced-motion: reduce) {
    .edge,
    .node {
      transition: none;
    }
  }
</style>
