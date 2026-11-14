import type { SwitchboardChannelCode } from "./switchboard_channel_code.type";

type HeroSwitchboardLabels = {
  readonly regionLabel: string;
  readonly fig: string;
  readonly title: string;
  readonly hint: string;
  readonly pauseLabel: string;
  readonly playLabel: string;
  readonly sliderLabel: string;
  readonly lockTriggerLabel: string;
  readonly legendDial: string;
  readonly legendLit: string;
  readonly legendLock: string;
  readonly lockedBadge: string;
  readonly openBadge: string;
  readonly inspectCta: string;
  readonly captionTemplate: string;
  readonly channelNames: Record<SwitchboardChannelCode, string>;
  readonly channelNotes: Record<SwitchboardChannelCode, string>;
};

export type { HeroSwitchboardLabels };
