import { describe, expect, test } from "bun:test";
import { catalogueFor } from "../src/diagrams/engine/catalogue_for";
import { localizeScenario } from "../src/diagrams/engine/localize_scenario";
import { idemScenarios } from "../src/diagrams/idempotency/idem_scenarios";
import type { IdemState } from "../src/diagrams/types/idem_state.type";

function finalState(id: string): IdemState {
  const scenario = idemScenarios.find((candidate) => candidate.id === id);

  if (scenario === undefined) {
    throw new Error(`no scenario ${id}`);
  }

  return scenario.steps[scenario.steps.length - 1]!.state;
}

describe("idempotency scenarios", () => {
  test("without a key the retry duplicates the effect, and the diagram says so", () => {
    const end = finalState("no-key");

    expect(end.records).toEqual([]);
    expect(end.effects.every((item) => item.value === "2" && item.wrong)).toBe(true);
  });

  test("with a key, a replayed retry leaves every effect at one", () => {
    for (const id of ["with-key", "conflict", "together"]) {
      const end = finalState(id);

      expect(end.effects.some((item) => item.wrong)).toBe(false);
      expect(end.requests.some((request) => request.status === "replayed")).toBe(true);
    }
  });

  test("every request after the first in a keyed scenario carries the same key", () => {
    for (const id of ["with-key", "conflict", "together"]) {
      const keys = new Set(finalState(id).requests.map((request) => request.key));

      expect(keys.size).toBe(1);
      expect(keys.has(null)).toBe(false);
    }
  });

  test("a reused key with a different request is refused, and changes nothing", () => {
    const end = finalState("conflict");
    const refused = end.requests.filter((request) => request.status === "refused");

    expect(refused).toHaveLength(1);
    expect(end.effects).toEqual([{ kind: "holds", value: "1", wrong: false }]);
    expect(end.reply).toContain("IDEMPOTENCY_KEY_REUSED");
  });

  test("every scenario localises in both languages", () => {
    for (const locale of ["en", "id"] as const) {
      for (const scenario of idemScenarios) {
        const localized = localizeScenario(scenario, catalogueFor(locale));

        expect(localized.steps.every((step) => step.narration.length > 0)).toBe(true);
      }
    }
  });
});
