import { describe, expect, test } from "bun:test";
import { catalogueFor } from "../src/diagrams/engine/catalogue_for";
import { localizeScenario } from "../src/diagrams/engine/localize_scenario";
import { outageScenarios } from "../src/diagrams/outage/outage_scenarios";
import type { OutageState } from "../src/diagrams/types/outage_state.type";

function states(): readonly OutageState[] {
  return outageScenarios.flatMap((scenario) => scenario.steps.map((step) => step.state));
}

describe("outage scenarios", () => {
  test("every case is told the same way: the real answer, the old code, the fix", () => {
    for (const scenario of outageScenarios) {
      expect(scenario.steps.map((step) => [step.state.link, step.state.era, step.state.verdict])).toEqual([
        ["answered", "current", "true"],
        ["unreachable", "before", "false"],
        ["unreachable", "after", "honest"]
      ]);
    }
  });

  test("a dependency that did not answer never yields a correct verdict", () => {
    for (const state of states()) {
      if (state.link === "unreachable") {
        expect(state.verdict).not.toBe("true");
      }
    }
  });

  test("the old answer was indistinguishable from a real one", () => {
    for (const scenario of outageScenarios) {
      const [real, wrong] = scenario.steps;

      expect(wrong!.state.reply?.status).toBe(real.state.reply?.status);
    }
  });

  test("an honest answer either refuses with 503 or says unknown", () => {
    for (const state of states()) {
      if (state.verdict === "honest") {
        const saysUnknown = state.reply?.body.some((line) => line.includes("\"unknown\"")) ?? false;

        expect(state.reply?.status.startsWith("503") || saysUnknown).toBe(true);
      }
    }
  });

  test("an unknown quantity is null, never zero", () => {
    const stock = outageScenarios.find((scenario) => scenario.id === "stock")!;
    const honest = stock.steps.at(-1)!.state;

    expect(honest.reply?.body).toContain("\"available_stock\": null");
    expect(honest.reply?.body.some((line) => line.includes(": 0"))).toBe(false);
  });

  test("the old and the fixed code are linked at different commits", () => {
    for (const scenario of outageScenarios) {
      const before = scenario.steps[1]!.source?.href ?? "";
      const after = scenario.steps[2]!.source?.href ?? "";
      const commit = (href: string): string | undefined => href.match(/\/blob\/([0-9a-f]{40})\//)?.[1];

      expect(commit(before)).toBeDefined();
      expect(commit(after)).toBeDefined();
      expect(commit(before)).not.toBe(commit(after));
    }
  });

  test("every scenario localises in both languages", () => {
    for (const locale of ["en", "id"] as const) {
      for (const scenario of outageScenarios) {
        const localized = localizeScenario(scenario, catalogueFor(locale));

        expect(localized.steps.every((step) => step.narration.length > 0)).toBe(true);
        expect(localized.outcome.length).toBeGreaterThan(0);
      }
    }
  });
});
