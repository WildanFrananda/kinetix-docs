# kinetix-docs

Public documentation for Kinetix: architecture, service responsibilities, contracts, and a learning
track that teaches distributed backend design from the running system. Built with
[Astro Starlight](https://starlight.astro.build/), in English and Bahasa Indonesia.

Operational material — infrastructure, runbooks, incidents, recovery, cost — lives in the private
`kinetix-docs-internal` repository and never here.

## Run it

```sh
cp .env.example .env    # set DOCS_SITE_URL; DOCS_DENYLIST may stay empty locally
bun install
bun run dev
```

## Checks

| Command | Fails when |
| --- | --- |
| `bun run check` | A type error in a page, component or script |
| `bun test` | A unit test of the checks below fails |
| `bun run check:translations` | An Indonesian page is stale, unstamped, or has no English source |
| `bun run check:leaks` | A published file contains a key, a token, a non-example IP address, or a denylisted value |
| `bun run build` | A page fails its schema or links to a page that does not exist |

## Translating a page

English pages live in `src/content/docs/`, Indonesian ones at the same path under
`src/content/docs/id/`. An Indonesian page records which revision of the English page it translates:

```yaml
sourceHash: "739ad6b1bc22"
```

`bun run check:translations` prints the hash to record. When the English page changes, the
Indonesian page becomes `stale` and the build fails until it is retranslated and restamped. A page
with no translation is shown in English.

## Deployment

The `deploy` job in `.github/workflows/ci.yml` publishes to Vercel after `verify` and `leaks` pass on
`main`. Vercel's Git integration is disabled in `vercel.json` so nothing reaches production without
those checks.

| Kind | Name | Holds |
| --- | --- | --- |
| Repository variable | `DOCS_SITE_URL` | The public site URL |
| Secret | `DOCS_DENYLIST` | One value per line that must never be published |
| Secret | `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | Vercel deployment access |
