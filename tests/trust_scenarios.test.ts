import { describe, expect, test } from "bun:test";
import { catalogueFor } from "../src/diagrams/engine/catalogue_for";
import { localizeScenario } from "../src/diagrams/engine/localize_scenario";
import { trustScenarios } from "../src/diagrams/trust/trust_scenarios";

describe("trust boundary scenarios", () => {
  test("every case moves from before the fix to after it, and never back", () => {
    for (const scenario of trustScenarios) {
      const eras = scenario.steps.map((step) => step.state.era);
      const firstAfter = eras.indexOf("after");

      expect(firstAfter).toBeGreaterThan(0);
      expect(eras.slice(firstAfter).every((era) => era === "after")).toBe(true);
    }
  });

  test("before the fix the client asserts a fact it does not own, and after it asserts none", () => {
    for (const scenario of trustScenarios) {
      const before = scenario.steps.filter((step) => step.state.era === "before");
      const after = scenario.steps.filter((step) => step.state.era === "after");

      expect(before.some((step) => step.state.fields.some((field) => field.verdict === "asserted"))).toBe(true);
      expect(after.every((step) => step.state.fields.every((field) => field.verdict !== "asserted"))).toBe(true);
    }
  });

  test("each era ends with the outcome its era earns", () => {
    for (const scenario of trustScenarios) {
      const beforeOutcome = scenario.steps.filter((step) => step.state.era === "before").at(-1)?.state.outcome;
      const afterOutcome = scenario.steps.at(-1)?.state.outcome;

      expect(beforeOutcome?.verdict).toBe("forged");
      expect(afterOutcome?.verdict).toBe("owned");
    }
  });

  test("before-the-fix steps link to an older commit than after-the-fix steps", () => {
    for (const scenario of trustScenarios) {
      const commitOf = (href: string): string => href.split("/blob/")[1]?.split("/")[0] ?? "";
      const commitsIn = (era: "before" | "after"): Set<string> =>
        new Set(
          scenario.steps
            .filter((step) => step.state.era === era)
            .flatMap((step) => (step.source === undefined ? [] : [commitOf(step.source.href)]))
        );
      const before = commitsIn("before");
      const after = commitsIn("after");

      expect(before.size).toBeGreaterThan(0);
      expect(after.size).toBeGreaterThan(0);
      expect([...before].some((commit) => after.has(commit))).toBe(false);
    }
  });

  test("every case localises in both languages", () => {
    for (const locale of ["en", "id"] as const) {
      for (const scenario of trustScenarios) {
        const localized = localizeScenario(scenario, catalogueFor(locale));

        expect(localized.steps.every((step) => step.narration.length > 0)).toBe(true);
      }
    }
  });
});
