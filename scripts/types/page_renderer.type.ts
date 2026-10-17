import type { Locale } from "../../src/diagrams/types/locale.type";

export type PageRenderer = {
  readonly path: string;
  readonly render: (locale: Locale, sourceHash?: string) => string;
};
