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
| `verify/` | Checking what Kinetix commits to without trusting Kinetix: the proof-of-liabilities verifier (added 2026-10-16) |
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
deployed before the page went out. Follow the money as well as the permissions: writing the pricing page
found that a voucher could cut the courier's fee, because the discounted fee was what payment paid out.
A new call between services is a new edge on the map, and the map may have to be re-laid out for it;
`tests/architecture_map.test.ts` refuses a line that passes behind a box.

## Decision records

`decisions/` holds architecture decision records (since 2026-10-17). It follows a rule ruled on 2026-10-17:
**only decisions already in effect**. A proposal that is not built gets no record here; it stays in the
internal documents until it runs.

- **Frontmatter.** A record carries `adr: { number, status, decided }`, which `src/content.config.ts`
  validates. `status` is `accepted` or `superseded`.
  - `decided` is a date read from the repositories: the commit or the plan that first records the decision.
  - `number` is the order of writing, padded to four digits by `src/site/adr_number.ts`.
  - `sidebar.order` equals `number`.
- **Components.**
  - `DecisionStatus` renders the number, status and date at the top of a record.
  - `DecisionList` builds the overview table from the collection's frontmatter in the reader's language, so
    the list cannot fall behind the records.
- **Body.** Four sections, in this order: Context, Decision, Consequences, Alternatives rejected. "In effect"
  is added where the decision is a rule with cases.
  - Every claim links to a public repository by permalink, at the commit production runs (read the tag from
    the deploy pins).
  - The private infrastructure repository is never linked, so a fact only it holds is not a fact a record
    can rest on.
  - A record that a lesson already tells at length stays short and links to the lesson.
- **Superseding.** A superseded record is never deleted or rewritten. It is marked `superseded` and points to
  the record that replaced it.
- **Status.** 0001–0004 were written on 2026-10-17: contracts in one repository, money as integer minor
  units, search on Typesense, and licence changes as decisions. The docs map in the internal repository
  lists what is still to be recorded.

## gRPC reference

`apis/grpc/` is generated, never written by hand. `bun run generate:grpc` (`scripts/generate_grpc_reference.ts`)
reads the file descriptors in the published npm package `kinetix-contracts`. The version it reads is pinned
exactly in `package.json` and `src/site/contracts_release.ts`. It writes one page per proto package plus an
overview, in English and Indonesian. Each Indonesian page is stamped with the hash of its English page, so
`check:translations` sees it as current.

- **Servers and callers** come from the architecture map: the nodes' `serves` and the gRPC edges. The map,
  the service pages and the reference therefore cannot disagree. The generator refuses any operation on the
  map that the contract does not define. A dash means the map records none. Today that includes payment's
  liability RPCs and the notary's watch, because the notary is not on the map yet.
- **Source links** point at `.proto` lines in the pinned commit. The line numbers come from the package's own
  `.proto` files (`scripts/lib/declaration_lines.ts`). The parser expects `buf format` layout and refuses a
  declaration it cannot find.
- **Drift test.** `tests/grpc_reference.test.ts` fails when a committed page differs from the generator's
  output. A hand edit, or a change to the map or catalogue without regenerating, turns CI red.
- **Strings** come from the catalogue, under `grpc.*`.
- **Wrapper.** The generated body is wrapped in `<div class="grpc-reference">`, which scopes one style rule:
  identifiers in these tables never break mid-word, and a wide table scrolls inside its own box. The site-wide
  rule for table cells, `overflow-wrap: anywhere`, stays as it is because the lessons' tables rely on it.
- **Bumping the contracts:**
  1. Run `bun add -d --exact kinetix-contracts@<version>`.
  2. In `src/site/contracts_release.ts`, set `version` and `commit` to the release and its tag's commit.
  3. Confirm the package's `.proto` files equal `git show <tag>:proto/…` byte for byte, because the overview
     says so.
  4. Run `bun run generate:grpc`.

  1.3.0 was checked this way on 2026-10-17: all 21 files were identical to `edc6c26`.

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

## The proof verifier

The Verify section's how-to carries a working verifier, not a picture of one (notary PLAN.md, decisions
31–35). It is the notary's own `notary-verify`, compiled to WebAssembly, so the page and the CLI cannot
disagree; this repository writes no verification logic of its own.

- `src/site/notary_verifier.ts` pins the notary release, the SHA-256 and size of `notary-verify.wasm` and
  `wasm_exec.js`, the CLI image and the network defaults (chain id, directory, RPC endpoint).
  `scripts/fetch_verifier.ts` (`bun run fetch:verifier`, and the first step of `dev` and `build`) downloads
  both assets from that GitHub release into `public/notary/<release>/`, which is ignored by git, and refuses
  any byte that does not match the pin. `KINETIX_NOTARY_VERIFIER_DIR` takes them from a local
  `bin/build-verifier-wasm` output instead, still checked against the pin, for work ahead of a release.
  A new notary release that changes the verifier is a new pin here.
- The island is `src/verifier/NotaryVerifier.svelte`, mounted by `components/NotaryVerifier.astro`. Its
  logic lives in plain modules beside it (`load_verifier`, `read_asset`, `parse_answer`), which the browser
  and `bun test` both run: `tests/notary_verifier_module.test.ts` loads the pinned WebAssembly under Bun and
  checks its answers. The browser checks the hash again before it instantiates anything.
- The page's text lives in the catalogue under `verifier.*`, and the verdict list in `src/verifier/verdict_names.ts`
  mirrors the CLI's exit codes.
- `check:leaks` skips `.wasm`: it is a pinned release asset, never written here. `public/notary` is excluded
  from `tsconfig.json`, because `astro check` would otherwise type-check Go's `wasm_exec.js`.
- **`client:visible` waits for the island to be seen, and `astro-island` itself has no box** (`display:
  contents`), so `scrollIntoView` on it scrolls nowhere and nothing hydrates; scroll to the form instead.
  The Verify button stays disabled until the island has hydrated, because a click before that submits the
  bare HTML form and reloads the page with the document gone.
- Checked on 2026-10-16 in headless Chromium against Base Sepolia: a production proof answered `included`,
  attributable, no faults, exit 0; the same proof with its amount changed answered `rejected`, exit 1.
- The pin is v1.4.0 (notary `7d292fa`). Its `SHA256SUMS` was built three ways and agreed byte for byte: the
  release job on amd64, the laptop on arm64, and a fresh clone of the tag running the page's own command. All
  notary permalinks on the Verify pages point at that commit.

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
