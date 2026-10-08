import type { SagaReply } from "./saga_reply.type";

export type SagaLabels = {
  readonly saga: string;
  readonly order: string;
  readonly http: string;
  readonly nextRound: string;
  readonly log: string;
  readonly step: string;
  readonly holds: string;
  readonly state: string;
  readonly empty: string;
  readonly compensation: string;
  readonly replies: Readonly<Record<SagaReply, string>>;
};
