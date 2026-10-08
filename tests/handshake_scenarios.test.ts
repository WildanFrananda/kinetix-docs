import { describe, expect, test } from "bun:test";
import { catalogueFor } from "../src/diagrams/engine/catalogue_for";
import { localizeScenario } from "../src/diagrams/engine/localize_scenario";
import { handshakeScenarios } from "../src/diagrams/handshake/handshake_scenarios";
import type { HandshakeState } from "../src/diagrams/types/handshake_state.type";

function finalState(id: string): HandshakeState {
  const scenario = handshakeScenarios.find((candidate) => candidate.id === id);

  if (scenario === undefined) {
    throw new Error(`no scenario ${id}`);
  }

  return scenario.steps.at(-1)!.state;
}

function allStates(): readonly HandshakeState[] {
  return handshakeScenarios.flatMap((scenario) => [scenario.initial, ...scenario.steps.map((step) => step.state)]);
}

function statusOf(state: HandshakeState, id: string): string | undefined {
  return state.checks.find((check) => check.id === id)?.status;
}

describe("handshake scenarios", () => {
  test("checks run in order, and nothing after a failure is reached", () => {
    for (const state of allStates()) {
      expect(state.checks.map((check) => check.id)).toEqual(["certificate", "issuer", "identity", "allowed"]);

      const failed = state.checks.findIndex((check) => check.status === "fail");

      if (failed >= 0) {
        expect(state.checks.slice(failed + 1).every((check) => check.status === "skipped")).toBe(true);
      }
    }
  });

  test("a refused handshake reaches the caller as UNAVAILABLE, with the reason only in the TLS alert", () => {
    for (const id of ["no-certificate", "impostor"]) {
      const end = finalState(id);

      expect(end.alert).toMatch(/^TLSV1_ALERT_/);
      expect(end.client).toStartWith("UNAVAILABLE");
      expect(end.log).toBeNull();
    }
  });

  test("the forged certificate names exactly the identity it impersonates", () => {
    expect(finalState("impostor").certificate?.spiffeId).toBe(finalState("allowed").certificate?.spiffeId);
    expect(finalState("impostor").certificate?.issuer).toBe("other");
  });

  test("a valid certificate from the right CA is still refused when its service is not allowed", () => {
    const end = finalState("not-allowed");

    expect(statusOf(end, "issuer")).toBe("pass");
    expect(statusOf(end, "allowed")).toBe("fail");
    expect(end.client).toStartWith("PERMISSION_DENIED");
    expect(end.client).not.toContain("order");
    expect(end.log).toContain("peer=payment");
  });

  test("only a caller whose service is on the list is served", () => {
    for (const scenario of handshakeScenarios) {
      const end = scenario.steps.at(-1)!.state;
      const served = end.client?.startsWith("OK") ?? false;
      const service = end.certificate?.spiffeId.split("/service/")[1];

      expect(served).toBe(end.certificate?.issuer === "kinetix" && service !== undefined && end.allowed.includes(service));
    }
  });

  test("every scenario localises in both languages", () => {
    for (const locale of ["en", "id"] as const) {
      for (const scenario of handshakeScenarios) {
        const localized = localizeScenario(scenario, catalogueFor(locale));

        expect(localized.steps.every((step) => step.narration.length > 0)).toBe(true);
        expect(localized.outcome.length).toBeGreaterThan(0);
      }
    }
  });
});
