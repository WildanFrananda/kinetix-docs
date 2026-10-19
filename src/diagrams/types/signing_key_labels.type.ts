import type { SigningKeyAnswerer } from "./signing_key_answerer.type";
import type { SigningKeyParty } from "./signing_key_party.type";
import type { SigningKeyVerdict } from "./signing_key_verdict.type";

export type SigningKeyLabels = {
  readonly identity: string;
  readonly order: string;
  readonly parties: Readonly<Record<SigningKeyParty, string>>;
  readonly verdicts: Readonly<Record<SigningKeyVerdict, string>>;
  readonly answeredBy: Readonly<Record<SigningKeyAnswerer, string>>;
  readonly signsWith: string;
  readonly publishes: string;
  readonly holds: string;
  readonly fetches: string;
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly none: string;
  readonly signedIn: string;
  readonly signedOut: string;
  readonly fetchedNow: string;
  readonly notFetched: string;
};
