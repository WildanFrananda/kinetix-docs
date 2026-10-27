import type { SourceLink } from "../../diagrams/types/source_link.type";
import { phoenixRelease } from "./phoenix_release";

export function phoenixSource(path: string, from: number, to: number): SourceLink {
  const file = path.split("/").at(-1) ?? path;
  const anchor = from === to ? `L${from}` : `L${from}-L${to}`;
  const lines = from === to ? `${from}` : `${from}–${to}`;

  return {
    label: `Phoenix ${phoenixRelease.version} ${file}:${lines}`,
    href: `https://github.com/phoenixframework/phoenix/blob/${phoenixRelease.commit}/${path}#${anchor}`
  };
}
