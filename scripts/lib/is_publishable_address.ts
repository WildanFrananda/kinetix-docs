const exampleNetworks = ["192.0.2.", "198.51.100.", "203.0.113."];

export function isPublishableAddress(candidate: string): boolean {
  const octets = candidate.split(".").map(Number);

  if (octets.some((octet) => octet > 255)) {
    return true;
  }

  const loopback = candidate.startsWith("127.");
  const unspecified = candidate === "0.0.0.0";
  const example = exampleNetworks.some((network) => candidate.startsWith(network));

  return loopback || unspecified || example;
}
