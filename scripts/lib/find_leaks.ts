import type { LeakFinding } from "../types/leak_finding.type";
import type { LeakRule } from "../types/leak_rule.type";

export function findLeaks(text: string, rules: readonly LeakRule[]): LeakFinding[] {
  const findings: LeakFinding[] = [];

  for (const rule of rules) {
    for (const match of text.matchAll(rule.pattern)) {
      const preceding = text.slice(0, match.index);
      const lineStart = preceding.lastIndexOf("\n") + 1;
      const lineEnd = text.indexOf("\n", match.index);
      const lineText = text.slice(lineStart, lineEnd === -1 ? text.length : lineEnd);

      if (!rule.permits(match[0], lineText)) {
        findings.push({
          rule: rule.name,
          line: preceding.split("\n").length,
          column: match.index - lineStart + 1
        });
      }
    }
  }

  return findings.sort((left, right) => left.line - right.line || left.column - right.column);
}
