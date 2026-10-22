import type { SourceLink } from "../../diagrams/types/source_link.type";
import { kongRelease } from "./kong_release";

export function kongSource(path: string, from: number, to: number): SourceLink {
  const file = path.split("/").at(-1) ?? path;

  return {
    label: `Kong ${kongRelease.version} ${file}:${from}–${to}`,
    href: `https://github.com/Kong/kong/blob/${kongRelease.commit}/${path}#L${from}-L${to}`
  };
}
