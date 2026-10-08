import type { OutageEra } from "./outage_era.type";
import type { OutageLink } from "./outage_link.type";
import type { OutageReply } from "./outage_reply.type";
import type { OutageVerdict } from "./outage_verdict.type";

export type OutageState = {
  readonly request: string;
  readonly caller: string;
  readonly dependency: string;
  readonly call: string;
  readonly link: OutageLink | null;
  readonly era: OutageEra | null;
  readonly answer: readonly string[];
  readonly handling: readonly string[];
  readonly reply: OutageReply | null;
  readonly verdict: OutageVerdict | null;
};
