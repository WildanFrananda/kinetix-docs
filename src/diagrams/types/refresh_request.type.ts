import type { RefreshHolder } from "./refresh_holder.type";
import type { RefreshOutcome } from "./refresh_outcome.type";

export type RefreshRequest = {
  readonly id: string;
  readonly who: RefreshHolder;
  readonly presents: string;
  readonly outcome: RefreshOutcome;
  readonly reply: string | null;
};
