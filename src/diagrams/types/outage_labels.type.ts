import type { OutageEra } from "./outage_era.type";
import type { OutageLink } from "./outage_link.type";
import type { OutageVerdict } from "./outage_verdict.type";

export type OutageLabels = {
  readonly client: string;
  readonly answer: string;
  readonly handling: string;
  readonly reply: string;
  readonly links: Readonly<Record<OutageLink, string>>;
  readonly eras: Readonly<Record<OutageEra, string>>;
  readonly verdicts: Readonly<Record<OutageVerdict, string>>;
};
