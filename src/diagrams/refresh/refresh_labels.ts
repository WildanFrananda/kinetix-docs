import type { Catalogue } from "../types/catalogue.type";
import type { RefreshLabels } from "../types/refresh_labels.type";

export function refreshLabels(catalogue: Catalogue): RefreshLabels {
  return {
    family: catalogue["refresh.label.family"],
    token: catalogue["refresh.label.token"],
    state: catalogue["refresh.label.state"],
    replacedBy: catalogue["refresh.label.replacedBy"],
    holders: catalogue["refresh.label.holders"],
    requests: catalogue["refresh.label.requests"],
    noRequests: catalogue["refresh.label.noRequests"],
    presents: catalogue["refresh.label.presents"],
    locked: catalogue["refresh.label.locked"],
    statuses: {
      live: catalogue["refresh.status.live"],
      used: catalogue["refresh.status.used"],
      revoked: catalogue["refresh.status.revoked"]
    },
    outcomes: {
      sent: catalogue["refresh.outcome.sent"],
      waiting: catalogue["refresh.outcome.waiting"],
      rotated: catalogue["refresh.outcome.rotated"],
      refused: catalogue["refresh.outcome.refused"]
    },
    who: {
      owner: catalogue["refresh.who.owner"],
      thief: catalogue["refresh.who.thief"]
    },
    eras: {
      before: catalogue["refresh.era.before"],
      after: catalogue["refresh.era.after"]
    }
  };
}
