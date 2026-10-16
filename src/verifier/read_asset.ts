import { digestHex } from "./digest_hex";
import type { LoaderDependencies } from "./types/loader_dependencies.type";
import type { VerifierAssetSource } from "./types/verifier_asset_source.type";

export async function readAsset(
  source: VerifierAssetSource,
  dependencies: LoaderDependencies
): Promise<Uint8Array<ArrayBuffer>> {
  const response = await dependencies.fetch(source.url);

  if (!response.ok || response.body === null) {
    throw new Error(`${source.url} answered ${response.status}`);
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  for (;;) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(value);
    received += value.byteLength;
    dependencies.progress(received, source.bytes);
  }

  if (received !== source.bytes) {
    throw new Error(`${source.url} is ${received} bytes; the release pins ${source.bytes}`);
  }

  const bytes = new Uint8Array(new ArrayBuffer(received));
  let offset = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const found = await digestHex(bytes);

  if (found !== source.sha256) {
    throw new Error(`${source.url} has SHA-256 ${found}; the release pins ${source.sha256}`);
  }

  return bytes;
}
