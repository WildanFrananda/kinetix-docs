import type { SigningKeyHolder } from "./signing_key_holder.type";
import type { SigningKeyIssuer } from "./signing_key_issuer.type";
import type { SigningKeyParty } from "./signing_key_party.type";
import type { SigningKeyReply } from "./signing_key_reply.type";
import type { SigningKeyVerifier } from "./signing_key_verifier.type";

export type SigningKeyState = {
  readonly identity: SigningKeyIssuer;
  readonly order: SigningKeyVerifier;
  readonly holders: Readonly<Record<SigningKeyParty, SigningKeyHolder>>;
  readonly reply: SigningKeyReply | null;
};
