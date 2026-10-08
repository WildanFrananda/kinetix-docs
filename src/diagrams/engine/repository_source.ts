import type { SourceLink } from "../types/source_link.type";

export function repositorySource(
  repository: string,
  commit: string,
  path: string,
  from: number,
  to: number
): SourceLink {
  const file = path.split("/").at(-1) ?? path;
  const anchor = from === to ? `L${from}` : `L${from}-L${to}`;
  const lines = from === to ? `${from}` : `${from}–${to}`;

  return {
    label: `${file}:${lines} @ ${commit.slice(0, 7)}`,
    href: `https://github.com/WildanFrananda/${repository}/blob/${commit}/${path}#${anchor}`
  };
}
