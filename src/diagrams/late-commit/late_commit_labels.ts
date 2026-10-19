import type { Catalogue } from "../types/catalogue.type";
import type { LateCommitLabels } from "../types/late_commit_labels.type";

export function lateCommitLabels(catalogue: Catalogue): LateCommitLabels {
  return {
    writers: {
      a: catalogue["lateCommit.writer.a"],
      b: catalogue["lateCommit.writer.b"]
    },
    statuses: {
      idle: catalogue["lateCommit.status.idle"],
      open: catalogue["lateCommit.status.open"],
      committed: catalogue["lateCommit.status.committed"]
    },
    cursorKinds: {
      time: catalogue["lateCommit.cursorKind.time"],
      transaction: catalogue["lateCommit.cursorKind.transaction"]
    },
    search: catalogue["lateCommit.search"],
    table: catalogue["lateCommit.table"],
    uncommitted: catalogue["lateCommit.uncommitted"],
    title: catalogue["lateCommit.title"],
    updatedAt: catalogue["lateCommit.updatedAt"],
    transaction: catalogue["lateCommit.transaction"],
    cursor: catalogue["lateCommit.cursor"],
    horizon: catalogue["lateCommit.horizon"],
    lastRead: catalogue["lateCommit.lastRead"],
    nothingReturned: catalogue["lateCommit.nothingReturned"],
    notReadYet: catalogue["lateCommit.notReadYet"],
    index: catalogue["lateCommit.index"],
    stale: catalogue["lateCommit.stale"],
    skipped: catalogue["lateCommit.skipped"]
  };
}
