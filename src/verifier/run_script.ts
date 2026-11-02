import { subresourceIntegrity } from "./subresource_integrity";
import type { VerifierAssetSource } from "./types/verifier_asset_source.type";

export function runScript(source: VerifierAssetSource): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");

    script.src = source.url;
    script.integrity = subresourceIntegrity(source.sha256);
    script.addEventListener("load", () => {
      resolve();
    });
    script.addEventListener("error", () => {
      reject(new Error(`${source.url} did not load, or its SHA-256 is not the release's ${source.sha256}`));
    });
    document.head.append(script);
  });
}
