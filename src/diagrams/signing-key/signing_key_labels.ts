import type { Catalogue } from "../types/catalogue.type";
import type { SigningKeyLabels } from "../types/signing_key_labels.type";

export function signingKeyLabels(catalogue: Catalogue): SigningKeyLabels {
  return {
    identity: catalogue["signingKey.identity"],
    order: catalogue["signingKey.order"],
    parties: {
      courier: catalogue["signingKey.party.courier"],
      newcomer: catalogue["signingKey.party.newcomer"],
      forger: catalogue["signingKey.party.forger"]
    },
    verdicts: {
      issued: catalogue["signingKey.verdict.issued"],
      accepted: catalogue["signingKey.verdict.accepted"],
      renewed: catalogue["signingKey.verdict.renewed"],
      refused: catalogue["signingKey.verdict.refused"]
    },
    answeredBy: {
      identity: catalogue["signingKey.answeredBy.identity"],
      order: catalogue["signingKey.answeredBy.order"]
    },
    signsWith: catalogue["signingKey.signsWith"],
    publishes: catalogue["signingKey.publishes"],
    holds: catalogue["signingKey.holds"],
    fetches: catalogue["signingKey.fetches"],
    accessToken: catalogue["signingKey.accessToken"],
    refreshToken: catalogue["signingKey.refreshToken"],
    none: catalogue["signingKey.none"],
    signedIn: catalogue["signingKey.signedIn"],
    signedOut: catalogue["signingKey.signedOut"],
    fetchedNow: catalogue["signingKey.fetchedNow"],
    notFetched: catalogue["signingKey.notFetched"]
  };
}
