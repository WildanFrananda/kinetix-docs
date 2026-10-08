import type { LaneState } from "../types/lane_state.type";
import type { LaneStatus } from "../types/lane_status.type";
import type { NonEmpty } from "../types/non_empty.type";
import type { Scenario } from "../types/scenario.type";
import type { StockRaceState } from "../types/stock_race_state.type";
import { warehouseSource } from "./warehouse_source";

const reserveService = "app/services/inventory/reserve_stock_service.rb";
const idempotentOperation = "app/services/inventory/idempotent_operation.rb";

const readUnlocked = "BEGIN;\nSELECT * FROM bin_inventories\nWHERE sku = 'SKU-C' ORDER BY id;";
const readLocked = "BEGIN;\nSELECT * FROM bin_inventories\nWHERE sku = 'SKU-C' ORDER BY id\nFOR UPDATE;";
const reserveAll = "UPDATE bin_inventories\nSET reserved_quantity = 3\nWHERE id = 1;";

const actors = {
  a: "stockRace.lane.a",
  b: "stockRace.lane.b"
} as const;

function lane(status: LaneStatus, read: number | null, holds: number): LaneState {
  return { status, read, holds };
}

const initial: StockRaceState = {
  quantity: 3,
  reserved: 0,
  pending: null,
  lockHolder: null,
  lanes: {
    a: lane("idle", null, 0),
    b: lane("idle", null, 0)
  }
};

const withoutLock: Scenario<StockRaceState> = {
  id: "without-lock",
  title: "stockRace.noLock.title",
  introduction: "stockRace.noLock.introduction",
  outcome: "stockRace.noLock.outcome",
  actors,
  initial,
  steps: [
    {
      actor: "a",
      statement: readUnlocked,
      narration: "stockRace.noLock.step1",
      state: {
        ...initial,
        lanes: { a: lane("running", 0, 0), b: lane("idle", null, 0) }
      }
    },
    {
      actor: "b",
      statement: readUnlocked,
      narration: "stockRace.noLock.step2",
      state: {
        ...initial,
        lanes: { a: lane("running", 0, 0), b: lane("running", 0, 0) }
      }
    },
    {
      actor: "a",
      statement: reserveAll,
      narration: "stockRace.noLock.step3",
      source: warehouseSource(reserveService, 120, 120),
      state: {
        ...initial,
        pending: 3,
        lockHolder: "a",
        lanes: { a: lane("running", 0, 3), b: lane("running", 0, 0) }
      }
    },
    {
      actor: "b",
      statement: reserveAll,
      narration: "stockRace.noLock.step4",
      source: warehouseSource(reserveService, 120, 120),
      state: {
        ...initial,
        pending: 3,
        lockHolder: "a",
        lanes: { a: lane("running", 0, 3), b: lane("waiting", 0, 0) }
      }
    },
    {
      actor: "a",
      statement: "COMMIT;",
      narration: "stockRace.noLock.step5",
      state: {
        ...initial,
        reserved: 3,
        pending: 3,
        lockHolder: "b",
        lanes: { a: lane("committed", 0, 3), b: lane("running", 0, 3) }
      }
    },
    {
      actor: "b",
      statement: "COMMIT;",
      narration: "stockRace.noLock.step6",
      state: {
        ...initial,
        reserved: 3,
        lanes: { a: lane("committed", 0, 3), b: lane("committed", 0, 3) }
      }
    }
  ]
};

const withLock: Scenario<StockRaceState> = {
  id: "with-lock",
  title: "stockRace.withLock.title",
  introduction: "stockRace.withLock.introduction",
  outcome: "stockRace.withLock.outcome",
  actors,
  initial,
  steps: [
    {
      actor: "a",
      statement: readLocked,
      narration: "stockRace.withLock.step1",
      source: warehouseSource(reserveService, 86, 86),
      state: {
        ...initial,
        lockHolder: "a",
        lanes: { a: lane("running", 0, 0), b: lane("idle", null, 0) }
      }
    },
    {
      actor: "b",
      statement: readLocked,
      narration: "stockRace.withLock.step2",
      source: warehouseSource(idempotentOperation, 26, 32),
      state: {
        ...initial,
        lockHolder: "a",
        lanes: { a: lane("running", 0, 0), b: lane("waiting", null, 0) }
      }
    },
    {
      actor: "a",
      statement: reserveAll,
      narration: "stockRace.withLock.step3",
      source: warehouseSource(reserveService, 119, 120),
      state: {
        ...initial,
        pending: 3,
        lockHolder: "a",
        lanes: { a: lane("running", 0, 3), b: lane("waiting", null, 0) }
      }
    },
    {
      actor: "a",
      statement: "COMMIT;",
      narration: "stockRace.withLock.step4",
      source: warehouseSource(idempotentOperation, 85, 96),
      state: {
        ...initial,
        reserved: 3,
        lockHolder: "b",
        lanes: { a: lane("committed", 0, 3), b: lane("running", 3, 0) }
      }
    },
    {
      actor: "b",
      statement: "ROLLBACK;",
      narration: "stockRace.withLock.step5",
      source: warehouseSource(reserveService, 107, 116),
      state: {
        ...initial,
        reserved: 3,
        lanes: { a: lane("committed", 0, 3), b: lane("refused", 3, 0) }
      }
    }
  ]
};

export const stockRaceScenarios: NonEmpty<Scenario<StockRaceState>> = [withoutLock, withLock];
