import { catalogueFor } from "../diagrams/engine/catalogue_for";
import type { HeroSwitchboardLabels } from "./types/hero_switchboard_labels.type";
import type { Locale } from "../diagrams/types/locale.type";

function heroSwitchboardLabels(locale: Locale): HeroSwitchboardLabels {
  const catalogue = catalogueFor(locale);

  return {
    regionLabel: catalogue["landing.switchboard.region"],
    fig: catalogue["landing.switchboard.fig"],
    title: catalogue["landing.switchboard.title"],
    hint: catalogue["landing.switchboard.hint"],
    pauseLabel: catalogue["landing.switchboard.pause"],
    playLabel: catalogue["landing.switchboard.play"],
    sliderLabel: catalogue["landing.switchboard.sliderLabel"],
    lockTriggerLabel: catalogue["landing.switchboard.lockTrigger"],
    legendDial: catalogue["landing.switchboard.legendDial"],
    legendLit: catalogue["landing.switchboard.legendLit"],
    legendLock: catalogue["landing.switchboard.legendLock"],
    lockedBadge: catalogue["landing.switchboard.lockedBadge"],
    openBadge: catalogue["landing.switchboard.openBadge"],
    inspectCta: catalogue["landing.switchboard.inspectCta"],
    captionTemplate: catalogue["landing.switchboard.captionTemplate"],
    channelNames: {
      COM: catalogue["landing.switchboard.channel.COM.name"],
      FUL: catalogue["landing.switchboard.channel.FUL.name"],
      IDN: catalogue["landing.switchboard.channel.IDN.name"],
      NTR: catalogue["landing.switchboard.channel.NTR.name"]
    },
    channelNotes: {
      COM: catalogue["landing.switchboard.channel.COM.note"],
      FUL: catalogue["landing.switchboard.channel.FUL.note"],
      IDN: catalogue["landing.switchboard.channel.IDN.note"],
      NTR: catalogue["landing.switchboard.channel.NTR.note"]
    }
  };
}

export { heroSwitchboardLabels };
