const declaration = /^(message|enum|service) (\w+) \{/;
const rpc = /^\s+rpc (\w+)\(/;

export function declarationLines(source: string): ReadonlyMap<string, number> {
  const lines = new Map<string, number>();
  let service: string | undefined;

  for (const [index, text] of source.split("\n").entries()) {
    const opened = declaration.exec(text);
    const method = rpc.exec(text);

    if (opened !== null) {
      service = opened[1] === "service" ? opened[2] : undefined;
      record(lines, `${opened[1]} ${opened[2]}`, index + 1);
    } else if (method !== null && service !== undefined) {
      record(lines, `rpc ${service}/${method[1]}`, index + 1);
    } else if (text.startsWith("}")) {
      service = undefined;
    }
  }

  return lines;
}

function record(lines: Map<string, number>, declaration: string, line: number): void {
  if (lines.has(declaration)) {
    throw new Error(`${declaration} is declared twice`);
  }

  lines.set(declaration, line);
}
