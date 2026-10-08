import type { Locale } from "../types/locale.type";

export function localeOf(lang: string): Locale {
  if (lang === "en" || lang === "id") {
    return lang;
  }

  throw new Error(`no diagram catalogue for language "${lang}"`);
}
