import type { Locale } from "../../src/diagrams/types/locale.type";

export function localePrefix(locale: Locale): string {
  return locale === "en" ? "" : `/${locale}`;
}
