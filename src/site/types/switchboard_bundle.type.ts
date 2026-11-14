import type { SwitchboardGlMeta } from "./switchboard_gl_meta.type";

type SwitchboardBundle = {
  readonly turn: Record<string, unknown>;
  readonly gl: SwitchboardGlMeta;
  readonly backSvg: string;
  readonly dialSvg: string;
  readonly midSvg: string;
  readonly plungerSvg: string;
  readonly frontSvg: string;
};

export type { SwitchboardBundle };
