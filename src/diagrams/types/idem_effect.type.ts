import type { IdemEffectKind } from "./idem_effect_kind.type";

export type IdemEffect = {
  readonly kind: IdemEffectKind;
  readonly value: string;
  readonly wrong: boolean;
};
