import type { VerifierSettings } from "./verifier_settings.type";
import type { VerifierSources } from "./verifier_sources.type";

export type VerifierConfig = {
  readonly release: string;
  readonly sources: VerifierSources;
  readonly defaults: VerifierSettings;
  readonly networkName: string;
  readonly explorer: string;
};
