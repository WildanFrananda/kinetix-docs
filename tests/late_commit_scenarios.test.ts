import { describe, expect, test } from "bun:test";
import { catalogueFor } from "../src/diagrams/engine/catalogue_for";
import { localizeScenario } from "../src/diagrams/engine/localize_scenario";
import { catalogBeforeTheFix, catalogWithTheFix } from "../src/diagrams/late-commit/catalog_source";
import { lateCommitScenarios } from "../src/diagrams/late-commit/late_commit_scenarios";
import type { LateCommitState } from "../src/diagrams/types/late_commit_state.type";

const [byTime, byTransaction] = lateCommitScenarios;

function finalState(steps: readonly { readonly state: LateCommitState }[]): LateCommitState {
  const last = steps.at(-1);

  if (last === undefined) {
    throw new Error("a scenario without steps");
  }

  return last.state;
}

function committedTitle(state: LateCommitState, sku: string): string {
  const row = state.rows.find((candidate) => candidate.sku === sku);

  if (row === undefined) {
    throw new Error(`no row ${sku}`);
  }

  return row.committed.title;
}

describe("late commit scenarios", () => {
  test("a cursor on updated_at leaves A's committed change behind it for good", () => {
    const end = finalState(byTime.steps);
    const a = end.rows.find((row) => row.sku === "SHOE-A");

    expect(end.writers.a).toBe("committed");
    expect(end.returned).toEqual([]);
    expect(end.index["SHOE-A"]).not.toBe(committedTitle(end, "SHOE-A"));
    expect(a?.committed.updatedAt.localeCompare(end.cursor.position)).toBe(-1);
  });

  test("a cursor on the transaction holds B back while A runs, then serves both in transaction order", () => {
    const held = byTransaction.steps[2].state;
    const end = finalState(byTransaction.steps);

    expect(held.writers.a).toBe("open");
    expect(held.returned).toEqual([]);
    expect(held.cursor.position).toBe("735");
    expect(held.horizon).toBe(736);
    expect(end.returned).toEqual(["SHOE-A", "SHOE-B"]);
    for (const row of end.rows) {
      expect(end.index[row.sku]).toBe(row.committed.title);
    }
  });

  test("a row is served by transaction only once it is below the horizon", () => {
    for (const step of byTransaction.steps) {
      const { horizon, returned, rows } = step.state;

      for (const sku of returned ?? []) {
        const row = rows.find((candidate) => candidate.sku === sku);

        expect(row?.pending).toBeNull();
        expect(horizon).not.toBeNull();
        expect(row?.committed.transactionId ?? Infinity).toBeLessThan(horizon ?? 0);
      }
    }
  });

  test("an uncommitted version is never indexed", () => {
    for (const scenario of lateCommitScenarios) {
      for (const step of scenario.steps) {
        for (const row of step.state.rows) {
          if (row.pending !== null) {
            expect(step.state.index[row.sku]).not.toBe(row.pending.version.title);
          }
        }
      }
    }
  });

  test("the time scenario links catalog before the fix, the transaction scenario links it after", () => {
    const before = byTime.steps.flatMap((step) => step.source ?? []);
    const after = byTransaction.steps.flatMap((step) => step.source ?? []);

    expect(before.length).toBeGreaterThan(0);
    expect(after.length).toBeGreaterThan(0);
    for (const link of before) {
      expect(link.href).toContain(`/kinetix-catalog-service/blob/${catalogBeforeTheFix}/`);
    }
    for (const link of after) {
      expect(link.href).toContain(`/kinetix-catalog-service/blob/${catalogWithTheFix}/`);
    }
  });

  test("localising resolves every actor and narration in both languages", () => {
    for (const locale of ["en", "id"] as const) {
      for (const scenario of lateCommitScenarios) {
        const localized = localizeScenario(scenario, catalogueFor(locale));

        for (const step of localized.steps) {
          expect(step.actorLabel.length).toBeGreaterThan(0);
          expect(step.narration.length).toBeGreaterThan(0);
        }
      }
    }
  });
});
