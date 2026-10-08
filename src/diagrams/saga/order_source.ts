import type { SourceLink } from "../types/source_link.type";

const repository = "https://github.com/WildanFrananda/kinetix-order-service";

export const orderCommit = "82834065c34981f1c69a88b3d3317d20396358d9";

export function orderSource(path: string, from: number, to: number): SourceLink {
  const file = path.split("/").at(-1) ?? path;
  const anchor = from === to ? `L${from}` : `L${from}-L${to}`;
  const lines = from === to ? `${from}` : `${from}–${to}`;

  return {
    label: `${file}:${lines}`,
    href: `${repository}/blob/${orderCommit}/${path}#${anchor}`
  };
}
