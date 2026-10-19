import type { NonEmpty } from "../types/non_empty.type";
import type { Scenario } from "../types/scenario.type";
import type { SigningKeyHolder } from "../types/signing_key_holder.type";
import type { SigningKeyState } from "../types/signing_key_state.type";
import { identitySource, orderSource } from "./token_sources";

const k1 = "4UewdD-Y";
const k2 = "5yvfpYzc";

const keyProvider = "src/infrastructure/crypto/jwt_key_provider.ts";
const tokenService = "src/application/services/token.service.ts";
const orderKeys = "Security/JwksKeyProvider.cs";

const actors = {
  identity: "signingKey.identity",
  courier: "signingKey.party.courier",
  newcomer: "signingKey.party.newcomer",
  forger: "signingKey.party.forger"
} as const;

const nobody: SigningKeyHolder = { access: null, refresh: null, signedIn: false };
const courierBefore: SigningKeyHolder = { access: k1, refresh: k1, signedIn: true };
const newcomerIn: SigningKeyHolder = { access: k2, refresh: k2, signedIn: true };

const initial: SigningKeyState = {
  identity: { signing: k1, published: [k1] },
  order: { held: [k1], fetches: 1 },
  holders: { courier: courierBefore, newcomer: nobody, forger: nobody },
  reply: null
};

const signIn = "POST /api/v1/auth/login";
const newcomerCalls = `GET /api/v1/cart\nAuthorization: Bearer …\n  kid ${k2}`;
const courierCalls = `GET /api/v1/cart\nAuthorization: Bearer …\n  kid ${k1}`;
const courierRefreshes = `POST /api/v1/auth/refresh\n{ "refreshToken": "…" }\n  kid ${k1}`;
const forgerCalls = "GET /api/v1/cart\nAuthorization: Bearer …\n  kid made-up-key";

const withoutPrevious: Scenario<SigningKeyState> = {
  id: "one-key",
  title: "signingKey.oneKey.title",
  introduction: "signingKey.oneKey.introduction",
  outcome: "signingKey.oneKey.outcome",
  actors,
  initial,
  steps: [
    {
      actor: "identity",
      statement: "KINETIX_IDENTITY_JWT_PRIVATE_KEY_B64=<K2>\nKINETIX_IDENTITY_JWT_PREVIOUS_PUBLIC_KEYS_B64=",
      narration: "signingKey.oneKey.step1",
      source: identitySource(keyProvider, 126, 137),
      state: { ...initial, identity: { signing: k2, published: [k2] } }
    },
    {
      actor: "newcomer",
      statement: signIn,
      narration: "signingKey.oneKey.step2",
      state: {
        ...initial,
        identity: { signing: k2, published: [k2] },
        holders: { courier: courierBefore, newcomer: newcomerIn, forger: nobody },
        reply: { to: "newcomer", verdict: "issued", by: "identity", fetched: false }
      }
    },
    {
      actor: "newcomer",
      statement: newcomerCalls,
      narration: "signingKey.oneKey.step3",
      source: orderSource(orderKeys, 63, 97),
      state: {
        identity: { signing: k2, published: [k2] },
        order: { held: [k2], fetches: 2 },
        holders: { courier: courierBefore, newcomer: newcomerIn, forger: nobody },
        reply: { to: "newcomer", verdict: "accepted", by: "order", fetched: true }
      }
    },
    {
      actor: "courier",
      statement: courierCalls,
      narration: "signingKey.oneKey.step4",
      source: orderSource(orderKeys, 77, 97),
      state: {
        identity: { signing: k2, published: [k2] },
        order: { held: [k2], fetches: 2 },
        holders: { courier: courierBefore, newcomer: newcomerIn, forger: nobody },
        reply: { to: "courier", verdict: "refused", by: "order", fetched: false }
      }
    },
    {
      actor: "courier",
      statement: courierRefreshes,
      narration: "signingKey.oneKey.step5",
      source: identitySource(tokenService, 259, 282),
      state: {
        identity: { signing: k2, published: [k2] },
        order: { held: [k2], fetches: 2 },
        holders: { courier: nobody, newcomer: newcomerIn, forger: nobody },
        reply: { to: "courier", verdict: "refused", by: "identity", fetched: false }
      }
    }
  ]
};

const both = [k2, k1];

const withPrevious: Scenario<SigningKeyState> = {
  id: "previous-keys",
  title: "signingKey.previous.title",
  introduction: "signingKey.previous.introduction",
  outcome: "signingKey.previous.outcome",
  actors,
  initial,
  steps: [
    {
      actor: "identity",
      statement: "KINETIX_IDENTITY_JWT_PRIVATE_KEY_B64=<K2>\nKINETIX_IDENTITY_JWT_PREVIOUS_PUBLIC_KEYS_B64=<K1, public>",
      narration: "signingKey.previous.step1",
      source: identitySource(keyProvider, 61, 98),
      state: { ...initial, identity: { signing: k2, published: both } }
    },
    {
      actor: "newcomer",
      statement: signIn,
      narration: "signingKey.previous.step2",
      state: {
        ...initial,
        identity: { signing: k2, published: both },
        holders: { courier: courierBefore, newcomer: newcomerIn, forger: nobody },
        reply: { to: "newcomer", verdict: "issued", by: "identity", fetched: false }
      }
    },
    {
      actor: "newcomer",
      statement: newcomerCalls,
      narration: "signingKey.previous.step3",
      source: orderSource(orderKeys, 63, 97),
      state: {
        identity: { signing: k2, published: both },
        order: { held: both, fetches: 2 },
        holders: { courier: courierBefore, newcomer: newcomerIn, forger: nobody },
        reply: { to: "newcomer", verdict: "accepted", by: "order", fetched: true }
      }
    },
    {
      actor: "courier",
      statement: courierCalls,
      narration: "signingKey.previous.step4",
      state: {
        identity: { signing: k2, published: both },
        order: { held: both, fetches: 2 },
        holders: { courier: courierBefore, newcomer: newcomerIn, forger: nobody },
        reply: { to: "courier", verdict: "accepted", by: "order", fetched: false }
      }
    },
    {
      actor: "courier",
      statement: courierRefreshes,
      narration: "signingKey.previous.step5",
      source: identitySource(keyProvider, 114, 124),
      state: {
        identity: { signing: k2, published: both },
        order: { held: both, fetches: 2 },
        holders: { courier: { access: k2, refresh: k2, signedIn: true }, newcomer: newcomerIn, forger: nobody },
        reply: { to: "courier", verdict: "renewed", by: "identity", fetched: false }
      }
    },
    {
      actor: "forger",
      statement: forgerCalls,
      narration: "signingKey.previous.step6",
      source: orderSource(orderKeys, 77, 97),
      state: {
        identity: { signing: k2, published: both },
        order: { held: both, fetches: 2 },
        holders: {
          courier: { access: k2, refresh: k2, signedIn: true },
          newcomer: newcomerIn,
          forger: { access: "made-up-key", refresh: null, signedIn: false }
        },
        reply: { to: "forger", verdict: "refused", by: "order", fetched: false }
      }
    }
  ]
};

export const signingKeyScenarios: NonEmpty<Scenario<SigningKeyState>> = [withoutPrevious, withPrevious];
