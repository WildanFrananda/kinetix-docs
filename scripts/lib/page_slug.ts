export function pageSlug(relativePath: string): string | undefined {
  const match = /^(.+)\.mdx?$/.exec(relativePath);

  return match?.[1];
}
