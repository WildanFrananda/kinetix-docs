import type { LateCommitCursorMode } from "./late_commit_cursor_mode.type";
import type { LateCommitWriter } from "./late_commit_writer.type";
import type { LateCommitWriterStatus } from "./late_commit_writer_status.type";

export type LateCommitLabels = {
  readonly writers: Readonly<Record<LateCommitWriter, string>>;
  readonly statuses: Readonly<Record<LateCommitWriterStatus, string>>;
  readonly cursorKinds: Readonly<Record<LateCommitCursorMode, string>>;
  readonly search: string;
  readonly table: string;
  readonly uncommitted: string;
  readonly title: string;
  readonly updatedAt: string;
  readonly transaction: string;
  readonly cursor: string;
  readonly horizon: string;
  readonly lastRead: string;
  readonly nothingReturned: string;
  readonly notReadYet: string;
  readonly index: string;
  readonly stale: string;
  readonly skipped: string;
};
