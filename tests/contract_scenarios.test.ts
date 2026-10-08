import { describe, expect, test } from "bun:test";
import { contractScenarios } from "../src/diagrams/contracts/contract_scenarios";
import { catalogueFor } from "../src/diagrams/engine/catalogue_for";
import { localizeScenario } from "../src/diagrams/engine/localize_scenario";
import type { ContractState } from "../src/diagrams/types/contract_state.type";

function finalState(id: string): ContractState {
  const scenario = contractScenarios.find((candidate) => candidate.id === id);

  if (scenario === undefined) {
    throw new Error(`no scenario ${id}`);
  }

  return scenario.steps[scenario.steps.length - 1]!.state;
}

function allStates(): readonly ContractState[] {
  return contractScenarios.flatMap((scenario) => [scenario.initial, ...scenario.steps.map((step) => step.state)]);
}

function statusOf(state: ContractState, id: string): string | undefined {
  return state.stages.find((stage) => stage.id === id)?.status;
}

describe("contract scenarios", () => {
  test("every state lists the pipeline in the order it runs", () => {
    for (const state of allStates()) {
      expect(state.stages.map((stage) => stage.id)).toEqual(["lint", "money", "breaking", "generate", "publish"]);
    }
  });

  test("nothing is generated or published from a contract that failed a check", () => {
    for (const state of allStates()) {
      if (state.stages.some((stage) => stage.status === "fail")) {
        expect(statusOf(state, "generate")).not.toBe("pass");
        expect(statusOf(state, "publish")).not.toBe("pass");
        expect(state.release).toBeNull();
      }
    }
  });

  test("a release appears exactly when every stage has passed", () => {
    for (const state of allStates()) {
      const allPassed = state.stages.every((stage) => stage.status === "pass");

      expect(state.release !== null).toBe(allPassed);
    }
  });

  test("a release reaches the four registries the release workflow publishes to", () => {
    for (const id of ["additive", "declared"]) {
      const registries = finalState(id).release?.split(" · ").filter((part) => !/^v\d/.test(part));

      expect(registries).toEqual(["npm", "PyPI", "RubyGems", "Packagist"]);
    }
  });

  test("a float money field is backward compatible and still rejected", () => {
    const end = finalState("float-money");

    expect(statusOf(end, "money")).toBe("fail");
    expect(statusOf(end, "breaking")).toBe("pass");
    expect(end.output.at(-1)).toBe("no breaking change against .git#branch=main");
  });

  test("an undeclared deletion fails the gate, a declared one passes it", () => {
    expect(statusOf(finalState("accidental"), "breaking")).toBe("fail");
    expect(statusOf(finalState("declared"), "breaking")).toBe("pass");
    expect(finalState("declared").output.filter((line) => line.trimStart().startsWith("declared:"))).toHaveLength(2);
  });

  test("every source link is pinned to a commit", () => {
    for (const scenario of contractScenarios) {
      for (const step of scenario.steps) {
        if (step.source !== undefined) {
          expect(step.source.href).toMatch(/\/blob\/[0-9a-f]{40}\//);
        }
      }
    }
  });

  test("every scenario localises in both languages", () => {
    for (const locale of ["en", "id"] as const) {
      for (const scenario of contractScenarios) {
        const localized = localizeScenario(scenario, catalogueFor(locale));

        expect(localized.steps.every((step) => step.narration.length > 0)).toBe(true);
        expect(localized.outcome.length).toBeGreaterThan(0);
      }
    }
  });
});
