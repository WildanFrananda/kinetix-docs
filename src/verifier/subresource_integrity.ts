export function subresourceIntegrity(sha256: string): string {
  if (!/^[0-9a-f]{64}$/.test(sha256)) {
    throw new Error(`${sha256} is not a SHA-256 digest written in lowercase hex`);
  }

  const bytes = Array.from({ length: 32 }, (_, index) => Number.parseInt(sha256.slice(index * 2, index * 2 + 2), 16));

  return `sha256-${btoa(String.fromCharCode(...bytes))}`;
}
