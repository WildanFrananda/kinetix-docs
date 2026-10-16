import type { VerifierAssetSource } from "./verifier_asset_source.type";

export type VerifierSources = {
  readonly module: VerifierAssetSource;
  readonly runtime: VerifierAssetSource;
};
