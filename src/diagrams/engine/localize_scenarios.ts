import type { Catalogue } from "../types/catalogue.type";
import type { LocalizedScenario } from "../types/localized_scenario.type";
import type { NonEmpty } from "../types/non_empty.type";
import type { Scenario } from "../types/scenario.type";
import { localizeScenario } from "./localize_scenario";

export function localizeScenarios<State>(
  scenarios: NonEmpty<Scenario<State>>,
  catalogue: Catalogue
): NonEmpty<LocalizedScenario<State>> {
  const [first, ...rest] = scenarios;

  return [
    localizeScenario(first, catalogue),
    ...rest.map((scenario) => localizeScenario(scenario, catalogue))
  ];
}
