import { describe, expect, test } from "bun:test";
import { catalogueFor } from "../src/diagrams/engine/catalogue_for";
import { localizeScenario } from "../src/diagrams/engine/localize_scenario";
import { signingKeyScenarios } from "../src/diagrams/signing-key/signing_key_scenarios";
import { identityCommit, orderCommit } from "../src/diagrams/signing-key/token_sources";
import type { SigningKeyState } from "../src/diagrams/types/signing_key_state.type";

const [withoutPrevious, withPrevious] = signingKeyScenarios;

function finalState(steps: readonly { readonly state: SigningKeyState }[]): SigningKeyState {
  const last = steps.at(-1);

  if (last === undefined) {
    throw new Error("a scenario without steps");
  }

  return last.state;
}

describe("signing key scenarios", () => {
  test("without the previous key, the courier who signed in before is signed out", () => {
    const end = finalState(withoutPrevious.steps);

    expect(end.identity.published).toEqual([end.identity.signing]);
    expect(end.order.held).toEqual([end.identity.signing]);
    expect(end.holders.courier.signedIn).toBe(false);
    expect(end.reply?.verdict).toBe("refused");
  });

  test("with the previous key, the courier stays signed in and moves to the new key", () => {
    const end = finalState(withPrevious.steps);
    const renewal = withPrevious.steps[4].state;

    expect(end.identity.published).toHaveLength(2);
    expect(renewal.reply?.verdict).toBe("renewed");
    expect(end.holders.courier.signedIn).toBe(true);
    expect(end.holders.courier.access).toBe(end.identity.signing);
  });

  test("a made-up key is refused without making order ask identity", () => {
    const end = finalState(withPrevious.steps);
    const before = withPrevious.steps[4].state;

    expect(end.reply).toEqual({ to: "forger", verdict: "refused", by: "order", fetched: false });
    expect(end.order.fetches).toBe(before.order.fetches);
  });

  test("order accepts a call only with a key it holds, and fetches only when it holds none for the call", () => {
    for (const scenario of signingKeyScenarios) {
      let previous = scenario.initial;

      for (const step of scenario.steps) {
        const { reply, order, holders } = step.state;

        if (reply !== null && reply.verdict === "accepted") {
          const kid = holders[reply.to].access;

          expect(kid === null ? false : order.held.includes(kid)).toBe(true);
        }

        if (reply !== null && reply.by === "identity") {
          expect(reply.fetched).toBe(false);
        }

        if (reply !== null && reply.fetched) {
          const kid = holders[reply.to].access;

          expect(kid === null ? true : previous.order.held.includes(kid)).toBe(false);
          expect(order.fetches).toBe(previous.order.fetches + 1);
        } else {
          expect(order.fetches).toBe(previous.order.fetches);
        }

        previous = step.state;
      }
    }
  });

  test("every source link points at the commits production runs", () => {
    const links = signingKeyScenarios.flatMap((scenario) => scenario.steps.flatMap((step) => step.source ?? []));

    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      const pinned =
        link.href.includes(`/kinetix-identity-service/blob/${identityCommit}/`) ||
        link.href.includes(`/kinetix-order-service/blob/${orderCommit}/`);

      expect(pinned).toBe(true);
    }
  });

  test("localising resolves every actor and narration in both languages", () => {
    for (const locale of ["en", "id"] as const) {
      for (const scenario of signingKeyScenarios) {
        const localized = localizeScenario(scenario, catalogueFor(locale));

        for (const step of localized.steps) {
          expect(step.actorLabel.length).toBeGreaterThan(0);
          expect(step.narration.length).toBeGreaterThan(0);
        }
      }
    }
  });
});
