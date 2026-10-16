import type { RawAnswer } from "./types/raw_answer.type";
import type { VerifierAnswer } from "./types/verifier_answer.type";
import type { VerifierReport } from "./types/verifier_report.type";

export function parseAnswer(raw: unknown): VerifierAnswer {
  if (!isRawAnswer(raw)) {
    throw new Error("the verifier answered with something that is not an answer");
  }

  const reports = raw.stdout
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map(parseReport);

  return { exit: raw.exit, reports, stderr: raw.stderr };
}

function isRawAnswer(value: unknown): value is RawAnswer {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    Number.isInteger(candidate.exit) && typeof candidate.stdout === "string" && typeof candidate.stderr === "string"
  );
}

function parseReport(line: string): VerifierReport {
  const value: unknown = JSON.parse(line);

  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`the verifier wrote a line that is not a report: ${line}`);
  }

  const entries = Object.entries(value);

  if (!entries.every(([, field]) => typeof field === "string")) {
    throw new Error(`the verifier wrote a report with a field that is not text: ${line}`);
  }

  const report = Object.fromEntries(entries) as Record<string, string>;

  if (report.verdict === undefined) {
    throw new Error(`the verifier wrote a report with no verdict: ${line}`);
  }

  return report as VerifierReport;
}
