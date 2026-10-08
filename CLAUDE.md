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
the content to the internal repository, never by loosening a rule.

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
