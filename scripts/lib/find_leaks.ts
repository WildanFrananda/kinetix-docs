import type { LeakFinding } from "../types/leak_finding.type";
import type { LeakRule } from "../types/leak_rule.type";

export function findLeaks(text: string, rules: readonly LeakRule[]): LeakFinding[] {
  const findings: LeakFinding[] = [];

  for (const rule of rules) {
    for (const match of text.matchAll(rule.pattern)) {
      if (!rule.permits(match[0])) {
        const preceding = text.slice(0, match.index);
        const line = preceding.split("\n").length;
        const column = match.index - preceding.lastIndexOf("\n");

        findings.push({ rule: rule.name, line, column });
      }
    }
  }

  return findings.sort((left, right) => left.line - right.line || left.column - right.column);
}
