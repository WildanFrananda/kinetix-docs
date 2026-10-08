export function frontmatterValue(content: string, key: string): string | undefined {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content)?.[1];

  if (frontmatter === undefined) {
    return undefined;
  }

  const line = new RegExp(`^${key}:\\s*["']?([^"'\\s]+)["']?\\s*$`, "m").exec(frontmatter);

  return line?.[1];
}
