import type { DocumentKind } from "./types/document_kind.type";

const evidenceFormat = "kinetix.notary.evidence.v1";

export function documentKind(text: string): DocumentKind {
  let value: unknown;

  try {
    value = JSON.parse(text);
  } catch {
    return "liabilities";
  }

  if (!isObject(value)) {
    return "liabilities";
  }

  if (value.format === evidenceFormat) {
    return "evidence";
  }

  const proofs = value.proofs;

  if (Array.isArray(proofs) && proofs.length > 0 && isObject(proofs[0]) && proofs[0].format === evidenceFormat) {
    return "evidence";
  }

  return "liabilities";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
