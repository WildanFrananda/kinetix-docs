import type { Catalogue } from "../types/catalogue.type";
import type { PlayerLabels } from "../types/player_labels.type";

export function playerLabels(catalogue: Catalogue): PlayerLabels {
  return {
    scenario: catalogue["player.scenario"],
    play: catalogue["player.play"],
    pause: catalogue["player.pause"],
    previous: catalogue["player.previous"],
    next: catalogue["player.next"],
    restart: catalogue["player.restart"],
    speed: catalogue["player.speed"],
    progress: catalogue["player.progress"],
    step: catalogue["player.step"],
    of: catalogue["player.of"],
    start: catalogue["player.start"],
    source: catalogue["player.source"],
    outcome: catalogue["player.outcome"],
    transcript: catalogue["player.transcript"],
    keyboard: catalogue["player.keyboard"]
  };
}
