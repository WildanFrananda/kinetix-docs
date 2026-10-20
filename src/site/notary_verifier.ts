import type { NotaryVerifier } from "./types/notary_verifier.type";

export const notaryVerifier: NotaryVerifier = {
  repository: "https://github.com/WildanFrananda/kinetix-notary-service",
  release: "v1.6.1",
  module: {
    file: "notary-verify.wasm",
    sha256: "9f32b779283ceb32e2c032b161414159c9a402c729415e09a71f6cdb5f256b2d",
    bytes: 49859519
  },
  runtime: {
    file: "wasm_exec.js",
    sha256: "0c949f4996f9a89698e4b5c586de32249c3b69b7baadb64d220073cc04acba14",
    bytes: 16992
  },
  cliImage: "ghcr.io/wildanfrananda/kinetix-notary-cli",
  network: {
    name: "Base Sepolia",
    chainId: "84532",
    directory: "0x6C71162b46620Aa835681ADCDC4DB4ab9bB84ac8",
    evidenceRegistry: "0xbF1F15F40cA8Dd63c070d223243febf6731EF480",
    rpcUrl: "https://sepolia.base.org",
    explorer: "https://base-sepolia.blockscout.com"
  }
};

export function verifierPath(file: string): string {
  return `/notary/${notaryVerifier.release}/${file}`;
}

export function verifierDownload(file: string): string {
  return `${notaryVerifier.repository}/releases/download/${notaryVerifier.release}/${file}`;
}
