import type { LeakRule } from "../types/leak_rule.type";

export function denylistRules(denylist: string): LeakRule[] {
  return denylist
    .split("\n")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .map((entry, index) => ({
      name: `denylist entry ${index + 1}`,
      pattern: new RegExp(entry.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"),
      permits: () => false
    }));
}
