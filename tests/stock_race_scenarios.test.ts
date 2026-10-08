import { describe, expect, test } from "bun:test";
import { catalogueFor } from "../src/diagrams/engine/catalogue_for";
import { localizeScenario } from "../src/diagrams/engine/localize_scenario";
import { stockRaceScenarios } from "../src/diagrams/stock-race/stock_race_scenarios";
import { warehouseCommit } from "../src/diagrams/stock-race/warehouse_source";
import type { StockRaceState } from "../src/diagrams/types/stock_race_state.type";

const [withoutLock, withLock] = stockRaceScenarios;

function promised(state: StockRaceState): number {
  return state.lanes.a.holds + state.lanes.b.holds;
}

function finalState(steps: readonly { readonly state: StockRaceState }[]): StockRaceState {
  const last = steps.at(-1);

  if (last === undefined) {
    throw new Error("a scenario without steps");
  }

  return last.state;
}

describe("stock race scenarios", () => {
  test("without a locking read, both orders commit and three units are oversold", () => {
    const end = finalState(withoutLock.steps);

    expect(end.lanes.a.status).toBe("committed");
    expect(end.lanes.b.status).toBe("committed");
    expect(end.reserved).toBe(3);
    expect(promised(end) - end.quantity).toBe(3);
  });

  test("with FOR UPDATE, the second order reads the fresh count and is refused", () => {
    const end = finalState(withLock.steps);

    expect(end.lanes.a.status).toBe("committed");
    expect(end.lanes.b.status).toBe("refused");
    expect(end.lanes.b.read).toBe(3);
    expect(promised(end)).toBe(end.quantity);
  });

  test("only an order inside its transaction holds the lock, and only a lock held by the other order makes one wait", () => {
    for (const scenario of stockRaceScenarios) {
      for (const step of scenario.steps) {
        const { lockHolder, lanes } = step.state;

        if (lockHolder !== null) {
          expect(lanes[lockHolder].status).toBe("running");
        }

        for (const lane of ["a", "b"] as const) {
          if (lanes[lane].status === "waiting") {
            expect(lockHolder).not.toBeNull();
            expect(lockHolder).not.toBe(lane);
          }
        }
      }
    }
  });

  test("every source link points into warehouse at the pinned commit", () => {
    const links = stockRaceScenarios.flatMap((scenario) => scenario.steps.flatMap((step) => step.source ?? []));

    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link.href).toContain(`/kinetix-warehouse-service/blob/${warehouseCommit}/`);
    }
  });

  test("localising resolves every actor and narration in both languages", () => {
    for (const locale of ["en", "id"] as const) {
      for (const scenario of stockRaceScenarios) {
        const localized = localizeScenario(scenario, catalogueFor(locale));

        for (const step of localized.steps) {
          expect(step.actorLabel.length).toBeGreaterThan(0);
          expect(step.narration.length).toBeGreaterThan(0);
        }
      }
    }
  });

  test("a step by an actor the scenario does not declare is refused", () => {
    const [first] = withLock.steps;
    const broken = { ...withLock, steps: [{ ...first, actor: "c" }] as const };

    expect(() => localizeScenario(broken, catalogueFor("en"))).toThrow('"c", which is not one of its actors');
  });
});
