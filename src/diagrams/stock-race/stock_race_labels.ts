import type { Catalogue } from "../types/catalogue.type";
import type { StockRaceLabels } from "../types/stock_race_labels.type";

export function stockRaceLabels(catalogue: Catalogue): StockRaceLabels {
  return {
    lanes: {
      a: catalogue["stockRace.lane.a"],
      b: catalogue["stockRace.lane.b"]
    },
    statuses: {
      idle: catalogue["stockRace.status.idle"],
      running: catalogue["stockRace.status.running"],
      waiting: catalogue["stockRace.status.waiting"],
      committed: catalogue["stockRace.status.committed"],
      refused: catalogue["stockRace.status.refused"]
    },
    row: catalogue["stockRace.row"],
    onShelf: catalogue["stockRace.onShelf"],
    reserved: catalogue["stockRace.reserved"],
    uncommitted: catalogue["stockRace.uncommitted"],
    available: catalogue["stockRace.available"],
    lockFree: catalogue["stockRace.lockFree"],
    lockHeld: catalogue["stockRace.lockHeld"],
    read: catalogue["stockRace.read"],
    nothingRead: catalogue["stockRace.nothingRead"],
    holds: catalogue["stockRace.holds"],
    promised: catalogue["stockRace.promised"],
    oversold: catalogue["stockRace.oversold"],
    units: catalogue["stockRace.units"]
  };
}
