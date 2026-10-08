import type { LogoName } from "./logo_name.type";

export type Tech = {
  readonly name: string;
  readonly logo?: LogoName;
  readonly version?: string;
};
