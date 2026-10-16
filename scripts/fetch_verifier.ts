import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { notaryVerifier, verifierDownload } from "../src/site/notary_verifier";
import { checkAsset } from "./lib/check_asset";
import { sha256Hex } from "./lib/sha256_hex";

const root = join("public", "notary");
const target = join(root, notaryVerifier.release);
const local = process.env.KINETIX_NOTARY_VERIFIER_DIR;

mkdirSync(target, { recursive: true });

for (const entry of readdirSync(root)) {
  if (entry !== notaryVerifier.release) {
    rmSync(join(root, entry), { recursive: true, force: true });
  }
}

for (const asset of [notaryVerifier.module, notaryVerifier.runtime]) {
  const path = join(target, asset.file);

  if (existsSync(path) && sha256Hex(readFileSync(path)) === asset.sha256) {
    console.log(`${path} is the pinned ${asset.file}`);
    continue;
  }

  const bytes = local ? new Uint8Array(readFileSync(join(local, asset.file))) : await download(asset.file);

  checkAsset(bytes, asset.sha256, asset.file);
  writeFileSync(path, bytes);
  console.log(`${path} written from ${local ?? verifierDownload(asset.file)}`);
}

async function download(file: string): Promise<Uint8Array> {
  const url = verifierDownload(file);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${url} answered ${response.status}: is notary ${notaryVerifier.release} released with its verifier?`);
  }

  return new Uint8Array(await response.arrayBuffer());
}
