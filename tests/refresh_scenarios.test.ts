import { describe, expect, test } from "bun:test";
import { catalogueFor } from "../src/diagrams/engine/catalogue_for";
import { localizeScenario } from "../src/diagrams/engine/localize_scenario";
import { refreshScenarios } from "../src/diagrams/refresh/refresh_scenarios";
import type { RefreshState } from "../src/diagrams/types/refresh_state.type";

function allStates(): readonly RefreshState[] {
  return refreshScenarios.flatMap((scenario) => [scenario.initial, ...scenario.steps.map((step) => step.state)]);
}

function scenario(id: string) {
  const found = refreshScenarios.find((candidate) => candidate.id === id);

  if (found === undefined) {
    throw new Error(`no scenario ${id}`);
  }

  return found;
}

describe("refresh scenarios", () => {
  test("a revoked family has no live token left", () => {
    for (const state of allStates()) {
      if (state.rows.some((row) => row.status === "revoked")) {
        expect(state.rows.filter((row) => row.status === "live")).toEqual([]);
        expect(state.rows.every((row) => row.reason === "rotation_reuse")).toBe(true);
      }
    }
  });

  test("every token rotated away names its replacement, and the replacement exists", () => {
    for (const state of allStates()) {
      for (const row of state.rows) {
        if (row.replacedBy !== null) {
          expect(state.rows.map((candidate) => candidate.name)).toContain(row.replacedBy);
        }
        if (row.status === "used") {
          expect(row.replacedBy).not.toBeNull();
        }
      }
    }
  });

  test("a rotated request names a token in the family, and a refusal is a 401", () => {
    for (const state of allStates()) {
      for (const request of state.requests) {
        if (request.outcome === "rotated") {
          const issued = request.reply?.split("→ ")[1];
          expect(state.rows.map((row) => row.name)).toContain(issued ?? "");
        }
        if (request.outcome === "refused") {
          expect(request.reply).toStartWith("401");
        }
      }
    }
  });

  test("before the fix both simultaneous refreshes got a live branch; after it neither did", () => {
    const steps = scenario("together").steps;
    const before = steps.find((step) => step.state.era === "before")!.state;
    const after = steps.at(-1)!.state;

    expect(before.rows.filter((row) => row.status === "live")).toHaveLength(2);
    expect(before.requests.every((request) => request.outcome === "rotated")).toBe(true);
    expect(after.rows.filter((row) => row.status === "live")).toEqual([]);
  });

  test("while the row is locked, the second request waits rather than reading", () => {
    const locked = scenario("together").steps.find((step) => step.state.locked !== null)!.state;

    expect(locked.requests.map((request) => request.outcome)).toEqual(["sent", "waiting"]);
  });

  test("every scenario localises in both languages", () => {
    for (const locale of ["en", "id"] as const) {
      for (const each of refreshScenarios) {
        const localized = localizeScenario(each, catalogueFor(locale));

        expect(localized.steps.every((step) => step.narration.length > 0)).toBe(true);
        expect(localized.outcome.length).toBeGreaterThan(0);
      }
    }
  });
});
