<script lang="ts">
  import { untrack } from "svelte";
  import { documentKind } from "./document_kind";
  import { isEvidenceVerdictName } from "./evidence_verdict_names";
  import { fillTemplate } from "./fill_template";
  import { loadVerifier } from "./load_verifier";
  import { parseAnswer } from "./parse_answer";
  import { reportFields } from "./report_fields";
  import type { DocumentKind } from "./types/document_kind.type";
  import type { VerifierAnswer } from "./types/verifier_answer.type";
  import type { VerifierConfig } from "./types/verifier_config.type";
  import type { VerifierLabels } from "./types/verifier_labels.type";
  import type { VerifierReport } from "./types/verifier_report.type";
  import type { VerifyFunction } from "./types/verify_function.type";
  import { isVerdictName } from "./verdict_names";
  import { verifierEnvironment } from "./verifier_environment";

  type Props = {
    labels: VerifierLabels;
    config: VerifierConfig;
    proveHref?: string;
  };

  type Phase = "idle" | "loading" | "verifying" | "done" | "failed";

  let { labels, config, proveHref }: Props = $props();

  let documentText = $state("");
  let rpcUrl = $state(untrack(() => config.defaults.rpcUrl));
  let chainId = $state(untrack(() => config.defaults.chainId));
  let directory = $state(untrack(() => config.defaults.directory));
  let evidenceRegistry = $state(untrack(() => config.defaults.evidenceRegistry));
  let phase = $state<Phase>("idle");
  let received = $state(0);
  let answer = $state<VerifierAnswer | null>(null);
  let answered = $state<DocumentKind>("liabilities");
  let failure = $state("");
  let verify = $state<VerifyFunction | null>(null);
  let hydrated = $state(false);

  const busy = $derived(phase === "loading" || phase === "verifying");

  $effect(() => {
    hydrated = true;
  });

  function megabytes(bytes: number): string {
    return (bytes / 1_000_000).toFixed(1);
  }

  function explanation(report: VerifierReport): string {
    if (answered === "evidence") {
      return isEvidenceVerdictName(report.verdict) ? labels.evidenceVerdicts[report.verdict] : labels.unlisted;
    }

    return isVerdictName(report.verdict) ? labels.verdicts[report.verdict] : labels.unlisted;
  }

  function tone(report: VerifierReport): string {
    if (report.verdict === "included") {
      return "good";
    }

    if (report.verdict === "rejected" || report.verdict === "disagreement") {
      return "bad";
    }

    return "open";
  }

  function statementOf(report: VerifierReport): string | undefined {
    const check = report.statement;

    if (check === "absent" || check === "attributable" || check === "not_attributable") {
      return labels.statements[check];
    }

    return check;
  }

  async function chooseFile(event: Event): Promise<void> {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];

    if (file !== undefined) {
      documentText = await file.text();
    }
  }

  async function submit(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    answer = null;
    failure = "";

    if (documentText.trim() === "") {
      phase = "failed";
      failure = labels.empty;
      return;
    }

    if (verify === null) {
      phase = "loading";

      try {
        verify = await loadVerifier(config.sources, {
          fetch: globalThis.fetch.bind(globalThis),
          progress: (bytes) => {
            received = bytes;
          }
        });
      } catch (error) {
        phase = "failed";
        failure = fillTemplate(labels.loadFailed, { reason: error instanceof Error ? error.message : String(error) });
        return;
      }
    }

    phase = "verifying";

    try {
      const kind = documentKind(documentText);
      const raw = await verify(documentText, verifierEnvironment({ rpcUrl, chainId, directory, evidenceRegistry }));
      const parsed = parseAnswer(raw);

      answered = kind;
      answer = parsed;
      phase = "done";
    } catch (error) {
      phase = "failed";
      failure = error instanceof Error ? error.message : String(error);
    }
  }
</script>

<form class="verifier not-content" onsubmit={submit}>
  <label class="field">
    <span class="label">{labels.document}</span>
    <textarea bind:value={documentText} rows="9" spellcheck="false" autocomplete="off" disabled={busy}></textarea>
    <span class="hint">{labels.documentHint}</span>
  </label>

  <label class="file">
    <span class="label">{labels.file}</span>
    <input type="file" accept="application/json,.json" onchange={chooseFile} disabled={busy} />
  </label>

  <label class="field">
    <span class="label">{labels.endpoint}</span>
    <input type="url" bind:value={rpcUrl} spellcheck="false" autocomplete="off" disabled={busy} />
    <span class="hint">{fillTemplate(labels.endpointHint, { network: config.networkName })}</span>
  </label>

  <details class="network">
    <summary>{labels.network}: {config.networkName}</summary>
    <label class="field">
      <span class="label">{labels.chainId}</span>
      <input type="text" inputmode="numeric" bind:value={chainId} spellcheck="false" disabled={busy} />
    </label>
    <label class="field">
      <span class="label">{labels.directory}</span>
      <input type="text" bind:value={directory} spellcheck="false" autocomplete="off" disabled={busy} />
      <a class="hint" href={`${config.explorer}/address/${config.defaults.directory}`}>{config.defaults.directory}</a>
    </label>
    <label class="field">
      <span class="label">{labels.evidenceRegistry}</span>
      <input type="text" bind:value={evidenceRegistry} spellcheck="false" autocomplete="off" disabled={busy} />
      <a class="hint" href={`${config.explorer}/address/${config.defaults.evidenceRegistry}`}
        >{config.defaults.evidenceRegistry}</a
      >
    </label>
  </details>

  <div class="actions">
    <button type="submit" disabled={busy || !hydrated}>{labels.verify}</button>
    <p class="status" aria-live="polite">
      {#if phase === "loading"}
        {fillTemplate(labels.loading, {
          received: megabytes(received),
          total: megabytes(config.sources.module.bytes)
        })}
      {:else if phase === "verifying"}
        {labels.verifying}
      {:else if verify !== null}
        {fillTemplate(labels.loaded, { release: config.release, sha256: config.sources.module.sha256 })}
      {/if}
    </p>
  </div>

  {#if phase === "failed"}
    <p class="failure" role="alert">{failure}</p>
  {/if}

  {#if answer !== null}
    <div class="answer" aria-live="polite">
      {#if answer.stderr !== ""}
        <p class="failure">{labels.refused}</p>
        <pre>{answer.stderr}</pre>
      {/if}

      {#each answer.reports as report, index (index)}
        <section class={`report ${tone(report)}`}>
          <p class="verdict"><code>{report.verdict}</code></p>
          <p>{explanation(report)}</p>

          <dl>
            {#each reportFields as field (field)}
              {#if report[field] !== undefined}
                <dt>{labels.fields[field]}</dt>
                <dd>{field === "statement" ? statementOf(report) : report[field]}</dd>
              {/if}
            {/each}
          </dl>

          {#if report.provable === "bad_proof" && proveHref !== undefined}
            <p class="provable"><a href={proveHref}>{labels.provable}</a></p>
          {/if}
        </section>
      {/each}

      <p class="exit">{fillTemplate(labels.exit, { exit: String(answer.exit) })}</p>
    </div>
  {/if}
</form>

<style>
  .verifier {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-block: 1.5rem;
    padding: 1rem;
    border: 1px solid var(--kx-rule);
    border-top: 2px solid var(--sl-color-white);
    background: var(--kx-surface);
    font-size: var(--sl-text-sm);
  }

  .field,
  .file {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    min-width: 0;
  }

  .label {
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .hint {
    color: var(--sl-color-gray-3);
    font-size: var(--sl-text-xs);
    overflow-wrap: anywhere;
  }

  textarea,
  input[type="url"],
  input[type="text"] {
    width: 100%;
    box-sizing: border-box;
    padding: 0.5rem 0.6rem;
    border: 1px solid var(--kx-rule-strong);
    border-radius: var(--kx-radius);
    background: var(--sl-color-black);
    color: var(--sl-color-white);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-xs);
  }

  textarea {
    resize: vertical;
  }

  input[type="file"] {
    max-width: 100%;
    color: var(--sl-color-gray-2);
    font-size: var(--sl-text-xs);
  }

  .network {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .network summary {
    cursor: pointer;
    color: var(--sl-color-gray-2);
  }

  .network[open] summary {
    margin-bottom: 0.75rem;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 1rem;
  }

  button {
    padding: 0.45rem 1.1rem;
    border: 1px solid var(--sl-color-accent);
    border-radius: var(--kx-radius);
    background: var(--sl-color-accent);
    color: var(--sl-color-black);
    font-weight: 600;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.55;
    cursor: progress;
  }

  .status {
    flex: 1 1 14rem;
    min-width: 0;
    margin: 0;
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    overflow-wrap: anywhere;
  }

  .failure {
    margin: 0;
    color: var(--sl-color-accent);
  }

  pre {
    margin: 0;
    padding: 0.6rem;
    border: 1px solid var(--kx-rule);
    background: var(--sl-color-black);
    font-size: var(--sl-text-xs);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .answer {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .report {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
    border: 1px solid var(--kx-rule);
    border-left: 3px solid var(--kx-rule-strong);
    background: var(--sl-color-black);
  }

  .report.good {
    border-left-color: var(--kx-lane-b);
  }

  .report.bad {
    border-left-color: var(--sl-color-accent);
  }

  .report p {
    margin: 0;
  }

  .verdict code {
    font-size: var(--sl-text-base);
    font-weight: 600;
  }

  .report.good .verdict code {
    color: var(--kx-lane-b);
  }

  .report.bad .verdict code {
    color: var(--sl-color-accent);
  }

  dl {
    display: grid;
    grid-template-columns: minmax(0, 9rem) minmax(0, 1fr);
    gap: 0.3rem 0.75rem;
    margin: 0;
    font-size: var(--sl-text-xs);
  }

  @media (max-width: 30rem) {
    dl {
      grid-template-columns: minmax(0, 1fr);
    }

    dd {
      margin-bottom: 0.35rem;
    }
  }

  dt {
    color: var(--sl-color-gray-3);
  }

  dd {
    margin: 0;
    font-family: var(--sl-font-mono);
    overflow-wrap: anywhere;
  }

  .provable a {
    color: var(--sl-color-accent);
  }

  .exit {
    margin: 0;
    color: var(--sl-color-gray-3);
    font-size: var(--sl-text-xs);
  }
</style>
