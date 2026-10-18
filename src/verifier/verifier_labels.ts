import type { Catalogue } from "../diagrams/types/catalogue.type";
import { evidenceVerdictNames } from "./evidence_verdict_names";
import { reportFields } from "./report_fields";
import type { DocumentKind } from "./types/document_kind.type";
import type { EvidenceVerdictName } from "./types/evidence_verdict_name.type";
import type { ReportField } from "./types/report_field.type";
import type { StatementCheck } from "./types/statement_check.type";
import type { VerdictName } from "./types/verdict_name.type";
import type { VerifierLabels } from "./types/verifier_labels.type";
import { verdictNames } from "./verdict_names";

const statementChecks: readonly StatementCheck[] = ["absent", "attributable", "not_attributable"];

export function verifierLabels(catalogue: Catalogue, page: DocumentKind = "liabilities"): VerifierLabels {
  const evidence = page === "evidence";

  return {
    document: catalogue["verifier.document"],
    documentHint: evidence ? catalogue["verifier.evidence.documentHint"] : catalogue["verifier.documentHint"],
    file: catalogue["verifier.file"],
    endpoint: catalogue["verifier.endpoint"],
    endpointHint: evidence ? catalogue["verifier.evidence.endpointHint"] : catalogue["verifier.endpointHint"],
    network: catalogue["verifier.network"],
    chainId: catalogue["verifier.chainId"],
    directory: catalogue["verifier.directory"],
    evidenceRegistry: catalogue["verifier.evidenceRegistry"],
    verify: catalogue["verifier.verify"],
    loading: catalogue["verifier.loading"],
    verifying: catalogue["verifier.verifying"],
    loaded: catalogue["verifier.loaded"],
    loadFailed: catalogue["verifier.loadFailed"],
    empty: catalogue["verifier.empty"],
    exit: catalogue["verifier.exit"],
    refused: catalogue["verifier.refused"],
    provable: catalogue["verifier.provable"],
    unlisted: catalogue["verifier.unlisted"],
    noscript: catalogue["verifier.noscript"],
    verdicts: Object.fromEntries(
      verdictNames.map((name) => [name, catalogue[`verifier.verdict.${name}` as const]])
    ) as Record<VerdictName, string>,
    evidenceVerdicts: Object.fromEntries(
      evidenceVerdictNames.map((name) => [name, catalogue[`verifier.evidence.verdict.${name}` as const]])
    ) as Record<EvidenceVerdictName, string>,
    statements: Object.fromEntries(
      statementChecks.map((check) => [check, catalogue[`verifier.statement.${check}` as const]])
    ) as Record<StatementCheck, string>,
    fields: Object.fromEntries(
      reportFields.map((field) => [field, catalogue[`verifier.field.${field}` as const]])
    ) as Record<ReportField, string>
  };
}
