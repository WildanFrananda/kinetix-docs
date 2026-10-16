import type { VerifierSettings } from "./types/verifier_settings.type";

export function verifierEnvironment(settings: VerifierSettings): Readonly<Record<string, string>> {
  return {
    KINETIX_NOTARY_RPC_URL: settings.rpcUrl.trim(),
    KINETIX_NOTARY_CHAIN_ID: settings.chainId.trim(),
    KINETIX_NOTARY_DIRECTORY_ADDRESS: settings.directory.trim(),
    KINETIX_NOTARY_RPC_TIMEOUT: "30s"
  };
}
