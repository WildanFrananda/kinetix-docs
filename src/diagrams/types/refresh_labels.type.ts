import type { RefreshEra } from "./refresh_era.type";
import type { RefreshHolder } from "./refresh_holder.type";
import type { RefreshOutcome } from "./refresh_outcome.type";
import type { RefreshRowStatus } from "./refresh_row_status.type";

export type RefreshLabels = {
  readonly family: string;
  readonly token: string;
  readonly state: string;
  readonly replacedBy: string;
  readonly holders: string;
  readonly requests: string;
  readonly noRequests: string;
  readonly presents: string;
  readonly locked: string;
  readonly statuses: Readonly<Record<RefreshRowStatus, string>>;
  readonly outcomes: Readonly<Record<RefreshOutcome, string>>;
  readonly who: Readonly<Record<RefreshHolder, string>>;
  readonly eras: Readonly<Record<RefreshEra, string>>;
};
