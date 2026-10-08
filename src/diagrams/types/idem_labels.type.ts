import type { IdemEffectKind } from "./idem_effect_kind.type";
import type { IdemStatus } from "./idem_status.type";

export type IdemLabels = {
  readonly requests: string;
  readonly noKey: string;
  readonly statuses: Readonly<Record<IdemStatus, string>>;
  readonly records: string;
  readonly noRecords: string;
  readonly key: string;
  readonly fingerprint: string;
  readonly answer: string;
  readonly effects: string;
  readonly kinds: Readonly<Record<IdemEffectKind, string>>;
  readonly reply: string;
};
