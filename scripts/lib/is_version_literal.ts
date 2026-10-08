export function isVersionLiteral(candidate: string, line: string): boolean {
  const quoted = `"${candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`;
  const versionField = new RegExp(`\\bversion: ${quoted}`);
  const versionArgument = new RegExp(`\\btech\\("[^"]*", ${quoted}`);

  return versionField.test(line) || versionArgument.test(line);
}
