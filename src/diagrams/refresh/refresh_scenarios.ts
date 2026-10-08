import { repositorySource } from "../engine/repository_source";
import type { NonEmpty } from "../types/non_empty.type";
import type { RefreshHolder } from "../types/refresh_holder.type";
import type { RefreshOutcome } from "../types/refresh_outcome.type";
import type { RefreshRequest } from "../types/refresh_request.type";
import type { RefreshRow } from "../types/refresh_row.type";
import type { RefreshRowStatus } from "../types/refresh_row_status.type";
import type { RefreshState } from "../types/refresh_state.type";
import type { Scenario } from "../types/scenario.type";

const identity = "kinetix-identity-service";
const fixed = "332ebf33c0b0038e4c9a748c9120f034add78abc";
const racy = "6b185b723ba48fd69a8b47a18f3be286694d54e2";
const tokenService = "src/application/services/token.service.ts";

const rotateAndMark = repositorySource(identity, fixed, tokenService, 198, 205);
const reuseRevokes = repositorySource(identity, fixed, tokenService, 189, 192);
const revokedRefused = repositorySource(identity, fixed, tokenService, 185, 187);

const reused = "401  This refresh token has already been used; the session has been revoked";
const revoked = "401  This refresh token has been revoked";
const reuse = "rotation_reuse";

function row(
  name: string,
  status: RefreshRowStatus,
  holders: readonly RefreshHolder[],
  replacedBy: string | null = null,
  reason: string | null = null
): RefreshRow {
  return { name, status, replacedBy, holders, reason };
}

function request(id: string, who: RefreshHolder, presents: string, outcome: RefreshOutcome, reply: string | null = null): RefreshRequest {
  return { id, who, presents, outcome, reply };
}

function state(rows: readonly RefreshRow[], requests: readonly RefreshRequest[] = []): RefreshState {
  return { rows, requests, era: null, locked: null };
}

const refresh = (token: string): string => `POST /api/v1/auth/refresh  ${token}`;

const ordinary: Scenario<RefreshState> = {
  id: "ordinary",
  title: "refresh.ordinary.title",
  introduction: "refresh.ordinary.introduction",
  outcome: "refresh.ordinary.outcome",
  actors: { owner: "refresh.actor.owner" },
  initial: state([row("R1", "live", ["owner"])]),
  steps: [
    {
      actor: "owner",
      statement: refresh("R1"),
      narration: "refresh.ordinary.step1",
      source: rotateAndMark,
      state: state(
        [row("R1", "used", ["owner"], "R2"), row("R2", "live", ["owner"])],
        [request("#1", "owner", "R1", "rotated", "200  → R2")]
      )
    },
    {
      actor: "owner",
      statement: refresh("R2"),
      narration: "refresh.ordinary.step2",
      state: state(
        [row("R1", "used", ["owner"], "R2"), row("R2", "used", ["owner"], "R3"), row("R3", "live", ["owner"])],
        [request("#1", "owner", "R1", "rotated", "200  → R2"), request("#2", "owner", "R2", "rotated", "200  → R3")]
      )
    }
  ]
};

const replayed: Scenario<RefreshState> = {
  id: "replayed",
  title: "refresh.replayed.title",
  introduction: "refresh.replayed.introduction",
  outcome: "refresh.replayed.outcome",
  actors: { owner: "refresh.actor.owner", thief: "refresh.actor.thief" },
  initial: state([row("R1", "live", ["owner", "thief"])]),
  steps: [
    {
      actor: "owner",
      statement: refresh("R1"),
      narration: "refresh.replayed.step1",
      source: rotateAndMark,
      state: state(
        [row("R1", "used", ["owner", "thief"], "R2"), row("R2", "live", ["owner"])],
        [request("#1", "owner", "R1", "rotated", "200  → R2")]
      )
    },
    {
      actor: "thief",
      statement: refresh("R1"),
      narration: "refresh.replayed.step2",
      source: reuseRevokes,
      state: state(
        [row("R1", "revoked", ["owner", "thief"], "R2", reuse), row("R2", "revoked", ["owner"], null, reuse)],
        [request("#1", "owner", "R1", "rotated", "200  → R2"), request("#2", "thief", "R1", "refused", reused)]
      )
    },
    {
      actor: "owner",
      statement: refresh("R2"),
      narration: "refresh.replayed.step3",
      source: revokedRefused,
      state: state(
        [row("R1", "revoked", ["owner", "thief"], "R2", reuse), row("R2", "revoked", ["owner"], null, reuse)],
        [
          request("#1", "owner", "R1", "rotated", "200  → R2"),
          request("#2", "thief", "R1", "refused", reused),
          request("#3", "owner", "R2", "refused", revoked)
        ]
      )
    }
  ]
};

const thiefFirst: Scenario<RefreshState> = {
  id: "thief-first",
  title: "refresh.thiefFirst.title",
  introduction: "refresh.thiefFirst.introduction",
  outcome: "refresh.thiefFirst.outcome",
  actors: { owner: "refresh.actor.owner", thief: "refresh.actor.thief" },
  initial: state([row("R1", "live", ["owner", "thief"])]),
  steps: [
    {
      actor: "thief",
      statement: refresh("R1"),
      narration: "refresh.thiefFirst.step1",
      source: rotateAndMark,
      state: state(
        [row("R1", "used", ["owner", "thief"], "R2"), row("R2", "live", ["thief"])],
        [request("#1", "thief", "R1", "rotated", "200  → R2")]
      )
    },
    {
      actor: "owner",
      statement: refresh("R1"),
      narration: "refresh.thiefFirst.step2",
      source: reuseRevokes,
      state: state(
        [row("R1", "revoked", ["owner", "thief"], "R2", reuse), row("R2", "revoked", ["thief"], null, reuse)],
        [request("#1", "thief", "R1", "rotated", "200  → R2"), request("#2", "owner", "R1", "refused", reused)]
      )
    },
    {
      actor: "thief",
      statement: refresh("R2"),
      narration: "refresh.thiefFirst.step3",
      source: revokedRefused,
      state: state(
        [row("R1", "revoked", ["owner", "thief"], "R2", reuse), row("R2", "revoked", ["thief"], null, reuse)],
        [
          request("#1", "thief", "R1", "rotated", "200  → R2"),
          request("#2", "owner", "R1", "refused", reused),
          request("#3", "thief", "R2", "refused", revoked)
        ]
      )
    }
  ]
};

const bothSent = [request("#1", "owner", "R1", "sent"), request("#2", "thief", "R1", "sent")];

const together: Scenario<RefreshState> = {
  id: "together",
  title: "refresh.together.title",
  introduction: "refresh.together.introduction",
  outcome: "refresh.together.outcome",
  actors: { both: "refresh.actor.both", identity: "refresh.actor.identity" },
  initial: state([row("R1", "live", ["owner", "thief"])]),
  steps: [
    {
      actor: "both",
      statement: `${refresh("R1")}  ×2`,
      narration: "refresh.together.step1",
      state: state([row("R1", "live", ["owner", "thief"])], bothSent)
    },
    {
      actor: "identity",
      statement: "v0.1.10",
      narration: "refresh.together.step2",
      source: repositorySource(identity, racy, tokenService, 169, 195),
      state: {
        ...state(
          [row("R1", "used", ["owner", "thief"], "R2"), row("R2", "live", ["owner"]), row("R2′", "live", ["thief"])],
          [request("#1", "owner", "R1", "rotated", "200  → R2"), request("#2", "thief", "R1", "rotated", "200  → R2′")]
        ),
        era: "before"
      }
    },
    {
      actor: "identity",
      statement: "SELECT … FOR UPDATE",
      narration: "refresh.together.step3",
      source: repositorySource(identity, fixed, tokenService, 174, 179),
      state: {
        ...state([row("R1", "live", ["owner", "thief"])], [request("#1", "owner", "R1", "sent"), request("#2", "thief", "R1", "waiting")]),
        era: "after",
        locked: "R1"
      }
    },
    {
      actor: "identity",
      statement: "COMMIT",
      narration: "refresh.together.step4",
      source: reuseRevokes,
      state: {
        ...state(
          [row("R1", "revoked", ["owner", "thief"], "R2", reuse), row("R2", "revoked", ["owner"], null, reuse)],
          [request("#1", "owner", "R1", "rotated", "200  → R2"), request("#2", "thief", "R1", "refused", reused)]
        ),
        era: "after"
      }
    },
    {
      actor: "identity",
      statement: refresh("R2"),
      narration: "refresh.together.step5",
      source: repositorySource(identity, fixed, "test/refresh_rotation_race.spec.ts", 86, 98),
      state: {
        ...state(
          [row("R1", "revoked", ["owner", "thief"], "R2", reuse), row("R2", "revoked", ["owner"], null, reuse)],
          [
            request("#1", "owner", "R1", "rotated", "200  → R2"),
            request("#2", "thief", "R1", "refused", reused),
            request("#3", "owner", "R2", "refused", revoked)
          ]
        ),
        era: "after"
      }
    }
  ]
};

export const refreshScenarios: NonEmpty<Scenario<RefreshState>> = [ordinary, replayed, thiefFirst, together];
