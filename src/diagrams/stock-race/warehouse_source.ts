import type { SourceLink } from "../types/source_link.type";

const repository = "https://github.com/WildanFrananda/kinetix-warehouse-service";

export const warehouseCommit = "377490ff62a3a0d3393c15fb7f55995fef21a2a9";

export function warehouseSource(path: string, from: number, to: number): SourceLink {
  const file = path.split("/").at(-1) ?? path;
  const anchor = from === to ? `L${from}` : `L${from}-L${to}`;
  const lines = from === to ? `${from}` : `${from}–${to}`;

  return {
    label: `${file}:${lines}`,
    href: `${repository}/blob/${warehouseCommit}/${path}#${anchor}`
  };
}
