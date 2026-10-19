import type { LateCommitVersion } from "./late_commit_version.type";
import type { LateCommitWriter } from "./late_commit_writer.type";

export type LateCommitPending = {
  readonly writer: LateCommitWriter;
  readonly version: LateCommitVersion;
};
