import type { IdemStatus } from "./idem_status.type";

export type IdemRequest = {
  readonly id: string;
  readonly statement: string;
  readonly key: string | null;
  readonly status: IdemStatus;
};
