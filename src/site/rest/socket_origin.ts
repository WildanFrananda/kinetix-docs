export function socketOrigin(origin: string): string {
  if (origin.startsWith("https://")) {
    return `wss://${origin.slice("https://".length)}`;
  }

  if (origin.startsWith("http://")) {
    return `ws://${origin.slice("http://".length)}`;
  }

  return origin;
}
