import type { ServiceCategoryId } from "./service_category_id.type";

type LandingServiceItem = {
  readonly name: string;
  readonly category: Exclude<ServiceCategoryId, "all">;
  readonly categoryLabel: string;
  readonly owns: string;
  readonly languageName: string;
  readonly languageLogoUrl: string | undefined;
  readonly frameworkName: string;
  readonly frameworkLogoUrl: string | undefined;
  readonly frameworkVersion: string | undefined;
  readonly repository: string;
  readonly docHref: string | undefined;
};

export type { LandingServiceItem };
