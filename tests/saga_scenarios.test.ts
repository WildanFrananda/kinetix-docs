import { describe, expect, test } from "bun:test";
import { catalogueFor } from "../src/diagrams/engine/catalogue_for";
import { localizeScenario } from "../src/diagrams/engine/localize_scenario";
import { orderCommit } from "../src/diagrams/saga/order_source";
import { sagaScenarios } from "../src/diagrams/saga/saga_scenarios";
import type { SagaDiagramState } from "../src/diagrams/types/saga_diagram_state.type";
import type { Scenario } from "../src/diagrams/types/scenario.type";

const forwardOrder = ["RedeemVoucher", "AllocateFlashSaleStock", "ReserveStock", "CreateEscrowHold", "CreateFulfillmentOrder"];

function scenario(id: string): Scenario<SagaDiagramState> {
  const found = sagaScenarios.find((candidate) => candidate.id === id);

  if (found === undefined) {
    throw new Error(`no saga scenario ${id}`);
  }

  return found;
}

function finalState(id: string): SagaDiagramState {
  const steps = scenario(id).steps;

  return steps[steps.length - 1]!.state;
}

describe("checkout saga scenarios", () => {
  test("rows are created in the order CheckoutSagaRunner takes the steps", () => {
    for (const candidate of sagaScenarios) {
      const created: string[] = [];

      for (const step of candidate.steps) {
        for (const row of step.state.rows) {
          if (!created.includes(row.id)) {
            created.push(row.id);
            const rank = forwardOrder.indexOf(row.step);
            const previous = step.state.rows.filter((other) => created.indexOf(other.id) < created.indexOf(row.id));

            expect(rank).toBeGreaterThanOrEqual(0);
            expect(previous.every((other) => forwardOrder.indexOf(other.step) <= rank)).toBe(true);
          }
        }
      }
    }
  });

  test("compensation releases rows newest first, and never a row that was refused", () => {
    for (const candidate of sagaScenarios) {
      const created: string[] = [];
      const released: string[] = [];
      const failed = new Set<string>();

      for (const step of candidate.steps) {
        for (const row of step.state.rows) {
          if (!created.includes(row.id)) {
            created.push(row.id);
          }

          if (row.state === "Failed") {
            failed.add(row.id);
          }

          if (row.state === "Compensated" && !released.includes(row.id)) {
            released.push(row.id);
          }
        }
      }

      const expected = created.filter((id) => !failed.has(id)).reverse().filter((id) => released.includes(id));

      expect(released).toEqual(expected);
      expect(released.some((id) => failed.has(id))).toBe(false);
    }
  });

  test("a row never moves backwards once it is compensated", () => {
    for (const candidate of sagaScenarios) {
      const compensated = new Set<string>();

      for (const step of candidate.steps) {
        for (const row of step.state.rows) {
          if (compensated.has(row.id)) {
            expect(row.state).toBe("Compensated");
          }

          if (row.state === "Compensated") {
            compensated.add(row.id);
          }
        }
      }
    }
  });

  test("a call that was never answered is still compensated", () => {
    const silent = scenario("silent").steps;
    const unanswered = silent.find((step) => step.state.message?.reply === "silent");

    expect(unanswered?.state.rows.find((row) => row.id === "escrow")?.state).toBe("Attempting");
    expect(finalState("silent").rows.find((row) => row.id === "escrow")?.state).toBe("Compensated");
  });

  test("the sweeper's retry touches only what was still held when the round ended Stuck", () => {
    const steps = scenario("stuck").steps;
    const stuckIndex = steps.findIndex((step) => step.state.saga === "Stuck");
    const stillHeld = steps[stuckIndex]!.state.rows.filter((row) => row.state === "Done").map((row) => row.id);
    const retry = steps[stuckIndex + 1]!;

    expect(steps[stuckIndex]!.state.nextRound).not.toBeNull();
    expect(retry.actor).toBe("sweeper");
    expect(retry.state.touched).not.toBeNull();
    expect(stillHeld).toEqual([retry.state.touched ?? ""]);
  });

  test("each scenario ends in the state the code reaches", () => {
    expect([finalState("succeeds").saga, finalState("succeeds").order, finalState("succeeds").http]).toEqual([
      "Completed",
      "PAID",
      "201 Created"
    ]);

    for (const id of ["refused", "silent", "stuck"]) {
      expect([finalState(id).saga, finalState(id).order, finalState(id).http]).toEqual([
        "Compensated",
        "CANCELLED",
        "409 CHECKOUT_ROLLED_BACK"
      ]);
    }
  });

  test("every step links into order at the pinned commit", () => {
    const links = sagaScenarios.flatMap((candidate) => candidate.steps.flatMap((step) => step.source ?? []));

    expect(links.length).toBe(sagaScenarios.reduce((total, candidate) => total + candidate.steps.length, 0));
    expect(links.every((link) => link.href.includes(`/kinetix-order-service/blob/${orderCommit}/`))).toBe(true);
  });

  test("every scenario localises in both languages", () => {
    for (const locale of ["en", "id"] as const) {
      for (const candidate of sagaScenarios) {
        const localized = localizeScenario(candidate, catalogueFor(locale));

        expect(localized.steps.every((step) => step.narration.length > 0 && step.actorLabel.length > 0)).toBe(true);
      }
    }
  });
});
