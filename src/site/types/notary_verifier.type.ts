import type { NotaryNetwork } from "./notary_network.type";
import type { VerifierAsset } from "./verifier_asset.type";

export type NotaryVerifier = {
  readonly repository: string;
  readonly release: string;
  readonly module: VerifierAsset;
  readonly runtime: VerifierAsset;
  readonly cliImage: string;
  readonly network: NotaryNetwork;
};
