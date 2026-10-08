import type { TranslationStatus } from "./translation_status.type";

export type TranslationEntry = {
  readonly slug: string;
  readonly status: TranslationStatus;
  readonly expectedHash?: string;
};
