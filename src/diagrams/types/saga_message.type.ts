import type { SagaLane } from "./saga_lane.type";
import type { SagaReply } from "./saga_reply.type";

export type SagaMessage = {
  readonly to: SagaLane;
  readonly reply: SagaReply;
  readonly detail?: string;
  readonly compensation: boolean;
};
