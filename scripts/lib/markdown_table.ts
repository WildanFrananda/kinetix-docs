export function markdownTable(headers: readonly string[], rows: readonly (readonly string[])[]): string {
  const ragged = rows.find((row) => row.length !== headers.length);

  if (ragged !== undefined) {
    throw new Error(`a row of ${ragged.length} cells under ${headers.length} headers: ${ragged.join(" | ")}`);
  }

  return [headers, headers.map(() => "---"), ...rows].map((cells) => `| ${cells.join(" | ")} |`).join("\n");
}
