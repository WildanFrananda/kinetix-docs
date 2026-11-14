import type { ServiceCategoryId } from "./service_category_id.type";

type ServiceCategoryTab = {
  readonly id: ServiceCategoryId;
  readonly label: string;
  readonly count: number;
};

export type { ServiceCategoryTab };
