import type { LateCommitPending } from "./late_commit_pending.type";
import type { LateCommitVersion } from "./late_commit_version.type";

export type LateCommitRow = {
  readonly sku: string;
  readonly committed: LateCommitVersion;
  readonly pending: LateCommitPending | null;
};
