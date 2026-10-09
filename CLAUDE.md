# CLAUDE.md — kinetix-docs

This repository is public, its site is public, and its git history is public forever. Anything
committed here has been published, even if a later commit removes it.

Its private counterpart is `kinetix-docs-internal`. When a topic has both a concept and a procedure,
the concept is written here and the procedure there. Internal pages may link here; pages here never
link to internal ones, because every reader of this site would get a dead link.

## What may never appear here

- A defect that is open and unfixed. It becomes a page — a lesson, a postmortem — only after the fix
  is deployed, and then without anything an attacker could still use.
- IP addresses other than `127.0.0.0/8`, `0.0.0.0` and the documentation ranges `192.0.2.0/24`,
  `198.51.100.0/24`, `203.0.113.0/24`. Hostnames of real machines, instance ids, bucket names, key
  paths, CI variable names.
- Key material of any kind, SOPS/age or PKI operating detail, real costs, runbooks.

`bun run check:leaks` enforces what a pattern can catch; concrete values are kept in the
`DOCS_DENYLIST` secret so that the list is not itself published. A red `leaks` job is fixed by moving
the content to the internal repository, never by loosening a rule. The one argued exception: a dotted
quad written as a version literal — `version: "8.1.3.1"` or the version argument of `tech(…)` — is a
version, not an address (`scripts/lib/is_version_literal.ts`); the same digits anywhere else are still
flagged.

## How a page is written

- **Verified against the code it describes.** Code is linked by commit permalink —
  `https://github.com/WildanFrananda/<repo>/blob/<sha>/<path>#L<a>-L<b>` — never by branch, so a link
  keeps showing what the page was written against.
- **No empty pages.** A section exists from its first verified page onward. A technology Kinetix
  does not use gets no page; where not using it was a decision, that decision is an ADR.
- **One Diátaxis type per page**: tutorial (learning by doing), how-to (a task), reference (facts to
  look up), explanation (why). A page that mixes them is split.
- **Audience** is an engineer who knows HTTP, SQL and one backend language. Distributed-systems
  concepts are explained; programming basics are not.
- **English is the source.** The Indonesian page keeps technical terms in English where that is what
  an Indonesian engineer says: idempotency key, saga, circuit breaker, outbox, row lock, retry,
  timeout, payload, endpoint, deploy.

## Translating

English pages live in `src/content/docs/<path>`, Indonesian ones in `src/content/docs/id/<path>`. The
Indonesian page carries `sourceHash` in its frontmatter: the first twelve hex characters of the
SHA-256 of the English file it translates. The hash is of the file's content rather than a commit, so
a page and its translation can be written in the same commit.

`bun run check:translations` reports each page as `current`, `missing`, `stale`, `unstamped` or
`orphan`, and prints the hash to record. `missing` is allowed — Starlight shows the English page with a
notice — and the other three fail the build.

## Sections

The information architecture is the 22-section taxonomy the user chose, crossed with Diátaxis page
types, plus a learning track. Directory names under `src/content/docs/`:

| Directory | Public scope |
| --- | --- |
| `getting-started/` | Running the system locally, first contribution |
| `domain/` | Business domains, glossary, user journeys, business rules, boundaries |
| `architecture/` | C4 context, container and component views; principles; security and integration design |
| `decisions/` | ADRs, including rejected alternatives and "why not X" |
| `services/` | Catalogue of services, ownership, dependencies, per-service design |
| `apis/` | gRPC (generated from `kinetix-contracts`), REST, WebSocket; authentication, versioning |
| `data/` | Data model, ownership, flows, caching, migrations |
| `development/` | Coding standards per language, testing strategy, static analysis, workflow |
| `delivery/` | How services are built, tested, versioned and released |
| `observability/` | Logging, metrics and tracing standards |
| `reliability/` | Timeouts, retries, circuit breakers, idempotency, failure scenarios |
| `security/` | Identity, token design, mTLS, trust boundaries |
| `performance/` | Requirements, benchmarks, load tests |
| `learn/` | The learning track: one real problem per lesson, solved in the real code |
| `reference/` | Glossary, standards, templates, FAQ |

Operations, incident handling, disaster recovery procedures, infrastructure detail and cost belong to
`kinetix-docs-internal`.

## Service pages

A page under `services/` is a reference page. Its tables — facts, the RPCs it serves with their callers,
the operations it calls — are rendered by `ServiceFacts`, `ServiceServes` and `ServiceCalls` from
`src/site/services.ts` and the architecture map's verified nodes and edges, through
`src/site/service_connections.ts`. They are never typed into the page, so the map and the pages cannot
disagree. The prose is checked against the version the service runs in production (read the tag from
the deploy pins, then link that commit), and every claim about who may do what is read from the code
before it is written — writing the order page found an authorisation defect, which was fixed and
deployed before the page went out.

## Interactive diagrams

Interactive, animated diagrams are the reason this site is built on Starlight. They are Svelte 5
islands under `src/diagrams/`:

- `engine/StepPlayer.svelte` is generic: scenario variants, play/pause/step/speed, a scrubber,
  keyboard control, an `aria-live` narration and the source link of each step. It renders a scene
  through a snippet and knows nothing about any one diagram.
- A diagram is **typed scenario data** (`Scenario<State>`): actors, the statement each step sends, a
  full state snapshot after every step, and a commit-pinned source link. Snapshots, not diffs, so
  stepping backwards is always exact. The scene component (e.g. `stock-race/StockRaceScene.svelte`)
  only draws a state.
- Every scenario must be **verified before it is drawn** — against the code, and where it describes
  database or network behaviour, against a real run. The stock race was reproduced in two live
  Postgres sessions before its steps were written.
- Text lives in `src/catalogue/en.json` and `id.json`, never in components or scenario files. A
  `satisfies Record<Locale, Catalogue>` makes a key missing from `id.json` a type error.
- An Astro wrapper in `src/components/` reads the page's content language
  (`starlightRoute.entryMeta.lang`), localises the scenarios on the server, mounts the island with
  `client:visible`, and renders a text transcript beside it for readers without JavaScript and for
  search.
- Motion respects `prefers-reduced-motion` everywhere: `svelte/motion`'s `prefersReducedMotion` for
  transitions and tweens, a media query for CSS animation.

## Design system

The look is an engineering manual, not a product landing page. The user rejected the first design —
violet-to-cyan gradients, gradient text, glow, an orbit of logos, pill buttons — as "vibe coding".
Do not bring any of it back.

- Paper and ink with one accent: off-white `#f7f5f0` and near-black `#171614` in light mode, warm
  charcoal in dark, and signal orange (`--sl-color-accent`) for links, the current page and the
  hero kicker. No gradients, no shadows, no glow, no hover lift.
- Tokens are in `src/styles/theme.css`: Starlight's colour variables for both themes, plus `--kx-rule`,
  `--kx-rule-strong`, `--kx-surface`, `--kx-tile`, `--kx-lane-a`, `--kx-lane-b`, `--kx-radius` (3px).
  Components use these and Starlight's variables, never literal colours.
- Type: Source Serif 4 for headings, IBM Plex Sans for text, IBM Plex Mono for code and for small
  uppercase labels. All self-hosted from Fontsource.
- Structure is drawn with rules: a 2px ink rule over a list or table, 1px rules between rows, a rule
  above every `h2` (on `.sl-heading-wrapper.level-h2` — Starlight renders the `h2` inline).
- The hero is a Starlight component override (`components/overrides/Hero.astro`) that keeps
  Starlight's contract (`h1#_top` with `data-page-title`, tagline, `LinkButton` actions) beside a
  spec sheet whose service and language counts are computed from `src/site/services.ts`.
- Technology logos are devicon SVGs imported with `?url` through `src/site/logos.ts`, drawn by
  `TechLogo.astro` on a paper tile. A technology with no logo is a text label in the stack listing
  and a two-letter monogram only where a tile is required. A wordmark that is unreadable at tile size
  (gRPC) is not used.
- Anything rendered inside page content that is not prose carries `not-content`, or Starlight's
  markdown spacing pushes its children apart.
- Check every visual change at a true 390 px viewport through CDP (plain headless `--screenshot`
  cannot go below ~500 px), in light and dark, and measure `scrollWidth` against `innerWidth`.

## Verification

Run before reporting any change as done:

```sh
bun run check
bun test
bun run check:translations
DOCS_DENYLIST="" bun run check:leaks
bun run build
```

`DOCS_SITE_URL` must be set for `check` and `build`; any URL works locally.
