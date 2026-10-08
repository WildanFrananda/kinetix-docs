import type { RefreshEra } from "./refresh_era.type";
import type { RefreshRequest } from "./refresh_request.type";
import type { RefreshRow } from "./refresh_row.type";

export type RefreshState = {
  readonly rows: readonly RefreshRow[];
  readonly requests: readonly RefreshRequest[];
  readonly era: RefreshEra | null;
  readonly locked: string | null;
};
