import type { NotaryVerifier } from "./types/notary_verifier.type";

export const notaryVerifier: NotaryVerifier = {
  repository: "https://github.com/WildanFrananda/kinetix-notary-service",
  release: "v1.4.0",
  module: {
    file: "notary-verify.wasm",
    sha256: "289ae0c0f695f2802fe4a6b8d1d7d0d42d253b22562ee8bbe2a52e72f36c1d04",
    bytes: 44203656
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
