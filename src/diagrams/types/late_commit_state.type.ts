import type { LateCommitCursor } from "./late_commit_cursor.type";
import type { LateCommitCursorMode } from "./late_commit_cursor_mode.type";
import type { LateCommitRow } from "./late_commit_row.type";
import type { LateCommitWriter } from "./late_commit_writer.type";
import type { LateCommitWriterStatus } from "./late_commit_writer_status.type";

export type LateCommitState = {
  readonly mode: LateCommitCursorMode;
  readonly writers: Readonly<Record<LateCommitWriter, LateCommitWriterStatus>>;
  readonly rows: readonly LateCommitRow[];
  readonly cursor: LateCommitCursor;
  readonly horizon: number | null;
  readonly returned: readonly string[] | null;
  readonly index: Readonly<Record<string, string>>;
};
