import english from "../../catalogue/en.json";
import indonesian from "../../catalogue/id.json";
import type { Catalogue } from "../types/catalogue.type";
import type { Locale } from "../types/locale.type";

const catalogues = {
  en: english,
  id: indonesian
} satisfies Record<Locale, Catalogue>;

export function catalogueFor(locale: Locale): Catalogue {
  return catalogues[locale];
}
