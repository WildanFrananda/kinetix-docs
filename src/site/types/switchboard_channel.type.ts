import type { SwitchboardChannelCode } from "./switchboard_channel_code.type";

type SwitchboardChannel = {
  readonly code: SwitchboardChannelCode;
  readonly angle: number;
  readonly locked: number;
  readonly gauge: number;
  readonly port: number;
  readonly transport: string;
  readonly latencyMs: string;
  readonly rps: number;
  readonly docHrefEn: string;
  readonly docHrefId: string;
};

export type { SwitchboardChannel };
