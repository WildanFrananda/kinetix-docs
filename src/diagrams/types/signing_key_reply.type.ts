import type { SigningKeyAnswerer } from "./signing_key_answerer.type";
import type { SigningKeyParty } from "./signing_key_party.type";
import type { SigningKeyVerdict } from "./signing_key_verdict.type";

export type SigningKeyReply = {
  readonly to: SigningKeyParty;
  readonly verdict: SigningKeyVerdict;
  readonly by: SigningKeyAnswerer;
  readonly fetched: boolean;
};
