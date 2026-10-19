import type { LateCommitCursorMode } from "../types/late_commit_cursor_mode.type";
import type { LateCommitRow } from "../types/late_commit_row.type";
import type { LateCommitState } from "../types/late_commit_state.type";
import type { LateCommitVersion } from "../types/late_commit_version.type";
import type { NonEmpty } from "../types/non_empty.type";
import type { Scenario } from "../types/scenario.type";
import { catalogBeforeTheFix, catalogSource, catalogWithTheFix } from "./catalog_source";

const model = "core/infrastructure/models/product_model.py";
const repository = "core/infrastructure/repositories/django_product_repository.py";
const trigger = "core/migrations/0009_products_record_their_change_transaction.py";

const before: LateCommitVersion = { title: "Shoe A", updatedAt: "07:38:58.056", transactionId: 735 };
const beforeB: LateCommitVersion = { title: "Shoe B", updatedAt: "07:38:58.056", transactionId: 735 };
const renamedA: LateCommitVersion = { title: "Shoe A, renamed", updatedAt: "07:39:12.106", transactionId: 736 };
const renamedB: LateCommitVersion = { title: "Shoe B, renamed", updatedAt: "07:39:13.105", transactionId: 737 };

const writeA = "BEGIN;\nUPDATE products\nSET title = 'Shoe A, renamed',\n    updated_at = '07:39:12.106'\nWHERE sku = 'SHOE-A';";
const writeB = "BEGIN;\nUPDATE products\nSET title = 'Shoe B, renamed',\n    updated_at = '07:39:13.105'\nWHERE sku = 'SHOE-B';\nCOMMIT;";
const commitA = "COMMIT;";

function readByTime(updatedThrough: string): string {
  return `SELECT sku, title, updated_at\nFROM products\nWHERE (updated_at, sku)\n    > ('${updatedThrough}', 'SHOE-B')\nORDER BY updated_at, sku;`;
}

const readByTransaction =
  "SELECT sku, title, change_transaction_id\nFROM products\nWHERE change_transaction_id\n    < pg_snapshot_xmin(pg_current_snapshot())\n  AND (change_transaction_id, sku)\n    > (735, 'SHOE-B')\nORDER BY change_transaction_id, sku;";

const actors = {
  a: "lateCommit.writer.a",
  b: "lateCommit.writer.b",
  search: "lateCommit.search"
} as const;

function rows(a: LateCommitRow, b: LateCommitRow): readonly LateCommitRow[] {
  return [a, b];
}

function initialOf(mode: LateCommitCursorMode): LateCommitState {
  return {
    mode,
    writers: { a: "idle", b: "idle" },
    rows: rows(
      { sku: "SHOE-A", committed: before, pending: null },
      { sku: "SHOE-B", committed: beforeB, pending: null }
    ),
    cursor: { position: mode === "time" ? "07:38:58.056" : "735", lastSku: "SHOE-B" },
    horizon: null,
    returned: null,
    index: { "SHOE-A": "Shoe A", "SHOE-B": "Shoe B" }
  };
}

const aOpen = { sku: "SHOE-A", committed: before, pending: { writer: "a", version: renamedA } } as const;
const aCommitted = { sku: "SHOE-A", committed: renamedA, pending: null } as const;
const bCommitted = { sku: "SHOE-B", committed: renamedB, pending: null } as const;

const byTime: Scenario<LateCommitState> = {
  id: "cursor-on-time",
  title: "lateCommit.time.title",
  introduction: "lateCommit.time.introduction",
  outcome: "lateCommit.time.outcome",
  actors,
  initial: initialOf("time"),
  steps: [
    {
      actor: "a",
      statement: writeA,
      narration: "lateCommit.time.step1",
      source: catalogSource(catalogBeforeTheFix, model, 18, 18),
      state: {
        ...initialOf("time"),
        writers: { a: "open", b: "idle" },
        rows: rows(aOpen, { sku: "SHOE-B", committed: beforeB, pending: null })
      }
    },
    {
      actor: "b",
      statement: writeB,
      narration: "lateCommit.time.step2",
      state: {
        ...initialOf("time"),
        writers: { a: "open", b: "committed" },
        rows: rows(aOpen, bCommitted)
      }
    },
    {
      actor: "search",
      statement: readByTime("07:38:58.056"),
      narration: "lateCommit.time.step3",
      source: catalogSource(catalogBeforeTheFix, repository, 32, 74),
      state: {
        ...initialOf("time"),
        writers: { a: "open", b: "committed" },
        rows: rows(aOpen, bCommitted),
        cursor: { position: "07:39:13.105", lastSku: "SHOE-B" },
        returned: ["SHOE-B"],
        index: { "SHOE-A": "Shoe A", "SHOE-B": "Shoe B, renamed" }
      }
    },
    {
      actor: "a",
      statement: commitA,
      narration: "lateCommit.time.step4",
      state: {
        ...initialOf("time"),
        writers: { a: "committed", b: "committed" },
        rows: rows(aCommitted, bCommitted),
        cursor: { position: "07:39:13.105", lastSku: "SHOE-B" },
        returned: ["SHOE-B"],
        index: { "SHOE-A": "Shoe A", "SHOE-B": "Shoe B, renamed" }
      }
    },
    {
      actor: "search",
      statement: readByTime("07:39:13.105"),
      narration: "lateCommit.time.step5",
      source: catalogSource(catalogBeforeTheFix, repository, 32, 74),
      state: {
        ...initialOf("time"),
        writers: { a: "committed", b: "committed" },
        rows: rows(aCommitted, bCommitted),
        cursor: { position: "07:39:13.105", lastSku: "SHOE-B" },
        returned: [],
        index: { "SHOE-A": "Shoe A", "SHOE-B": "Shoe B, renamed" }
      }
    }
  ]
};

const byTransaction: Scenario<LateCommitState> = {
  id: "cursor-on-transaction",
  title: "lateCommit.transaction.title",
  introduction: "lateCommit.transaction.introduction",
  outcome: "lateCommit.transaction.outcome",
  actors,
  initial: initialOf("transaction"),
  steps: [
    {
      actor: "a",
      statement: writeA,
      narration: "lateCommit.transaction.step1",
      source: catalogSource(catalogWithTheFix, trigger, 10, 33),
      state: {
        ...initialOf("transaction"),
        writers: { a: "open", b: "idle" },
        rows: rows(aOpen, { sku: "SHOE-B", committed: beforeB, pending: null })
      }
    },
    {
      actor: "b",
      statement: writeB,
      narration: "lateCommit.transaction.step2",
      state: {
        ...initialOf("transaction"),
        writers: { a: "open", b: "committed" },
        rows: rows(aOpen, bCommitted)
      }
    },
    {
      actor: "search",
      statement: readByTransaction,
      narration: "lateCommit.transaction.step3",
      source: catalogSource(catalogWithTheFix, repository, 77, 134),
      state: {
        ...initialOf("transaction"),
        writers: { a: "open", b: "committed" },
        rows: rows(aOpen, bCommitted),
        horizon: 736,
        returned: []
      }
    },
    {
      actor: "a",
      statement: commitA,
      narration: "lateCommit.transaction.step4",
      state: {
        ...initialOf("transaction"),
        writers: { a: "committed", b: "committed" },
        rows: rows(aCommitted, bCommitted),
        horizon: 736,
        returned: []
      }
    },
    {
      actor: "search",
      statement: readByTransaction,
      narration: "lateCommit.transaction.step5",
      source: catalogSource(catalogWithTheFix, repository, 77, 134),
      state: {
        ...initialOf("transaction"),
        writers: { a: "committed", b: "committed" },
        rows: rows(aCommitted, bCommitted),
        cursor: { position: "737", lastSku: "SHOE-B" },
        horizon: 738,
        returned: ["SHOE-A", "SHOE-B"],
        index: { "SHOE-A": "Shoe A, renamed", "SHOE-B": "Shoe B, renamed" }
      }
    }
  ]
};

export const lateCommitScenarios: NonEmpty<Scenario<LateCommitState>> = [byTime, byTransaction];
