import type { RefreshHolder } from "./refresh_holder.type";
import type { RefreshRowStatus } from "./refresh_row_status.type";

export type RefreshRow = {
  readonly name: string;
  readonly status: RefreshRowStatus;
  readonly replacedBy: string | null;
  readonly holders: readonly RefreshHolder[];
  readonly reason: string | null;
};
