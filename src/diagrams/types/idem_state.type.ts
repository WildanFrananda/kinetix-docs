import type { IdemEffect } from "./idem_effect.type";
import type { IdemRecord } from "./idem_record.type";
import type { IdemRequest } from "./idem_request.type";

export type IdemState = {
  readonly requests: readonly IdemRequest[];
  readonly records: readonly IdemRecord[];
  readonly effects: readonly IdemEffect[];
  readonly reply: string | null;
};
