import type { Catalogue } from "../types/catalogue.type";
import type { OutageLabels } from "../types/outage_labels.type";

export function outageLabels(catalogue: Catalogue): OutageLabels {
  return {
    client: catalogue["outage.label.client"],
    answer: catalogue["outage.label.answer"],
    handling: catalogue["outage.label.handling"],
    reply: catalogue["outage.label.reply"],
    links: {
      answered: catalogue["outage.link.answered"],
      unreachable: catalogue["outage.link.unreachable"]
    },
    eras: {
      current: catalogue["outage.era.current"],
      before: catalogue["outage.era.before"],
      after: catalogue["outage.era.after"]
    },
    verdicts: {
      true: catalogue["outage.verdict.true"],
      false: catalogue["outage.verdict.false"],
      honest: catalogue["outage.verdict.honest"]
    }
  };
}
