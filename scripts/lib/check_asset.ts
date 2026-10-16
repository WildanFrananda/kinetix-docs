import { sha256Hex } from "./sha256_hex";

export function checkAsset(bytes: Uint8Array, expected: string, name: string): void {
  const found = sha256Hex(bytes);

  if (found !== expected) {
    throw new Error(`${name} has SHA-256 ${found}; src/site/notary_verifier.ts pins ${expected}`);
  }
}
