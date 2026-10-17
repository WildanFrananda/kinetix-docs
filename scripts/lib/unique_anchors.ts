export function uniqueAnchors(page: string, headings: readonly string[]): void {
  const anchors = headings.map((heading) => heading.toLowerCase());
  const repeated = anchors.filter((anchor, index) => anchors.indexOf(anchor) !== index);

  if (repeated.length > 0) {
    throw new Error(`${page} would carry the anchor ${repeated.join(", ")} twice`);
  }
}
