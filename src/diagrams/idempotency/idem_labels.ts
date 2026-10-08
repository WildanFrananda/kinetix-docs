import type { Catalogue } from "../types/catalogue.type";
import type { IdemLabels } from "../types/idem_labels.type";

export function idemLabels(catalogue: Catalogue): IdemLabels {
  return {
    requests: catalogue["idem.label.requests"],
    noKey: catalogue["idem.label.noKey"],
    statuses: {
      processing: catalogue["idem.status.processing"],
      answered: catalogue["idem.status.answered"],
      lost: catalogue["idem.status.lost"],
      replayed: catalogue["idem.status.replayed"],
      refused: catalogue["idem.status.refused"],
      waiting: catalogue["idem.status.waiting"]
    },
    records: catalogue["idem.label.records"],
    noRecords: catalogue["idem.label.noRecords"],
    key: catalogue["idem.label.key"],
    fingerprint: catalogue["idem.label.fingerprint"],
    answer: catalogue["idem.label.answer"],
    effects: catalogue["idem.label.effects"],
    kinds: {
      orders: catalogue["idem.kind.orders"],
      holds: catalogue["idem.kind.holds"],
      reserved: catalogue["idem.kind.reserved"]
    },
    reply: catalogue["idem.label.reply"]
  };
}
