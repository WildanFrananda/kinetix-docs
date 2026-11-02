import type { VerifierAssetSource } from "./verifier_asset_source.type";

export type LoaderDependencies = {
  readonly fetch: typeof globalThis.fetch;
  readonly progress: (received: number, total: number) => void;
  readonly runScript: (source: VerifierAssetSource) => Promise<void>;
};
