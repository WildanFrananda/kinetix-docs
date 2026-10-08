import type { Catalogue } from "../types/catalogue.type";
import type { LocalizedScenario } from "../types/localized_scenario.type";
import type { LocalizedStep } from "../types/localized_step.type";
import type { Scenario } from "../types/scenario.type";
import type { ScenarioStep } from "../types/scenario_step.type";

export function localizeScenario<State>(scenario: Scenario<State>, catalogue: Catalogue): LocalizedScenario<State> {
  const localizeStep = (step: ScenarioStep<State>): LocalizedStep<State> => {
    const actor = scenario.actors[step.actor];

    if (actor === undefined) {
      throw new Error(`scenario "${scenario.id}" has a step by "${step.actor}", which is not one of its actors`);
    }

    return {
      actor: step.actor,
      actorLabel: catalogue[actor],
      statement: step.statement,
      narration: catalogue[step.narration],
      state: step.state,
      ...(step.source === undefined ? {} : { source: step.source })
    };
  };
  const [first, ...rest] = scenario.steps;

  return {
    id: scenario.id,
    title: catalogue[scenario.title],
    introduction: catalogue[scenario.introduction],
    outcome: catalogue[scenario.outcome],
    initial: scenario.initial,
    steps: [localizeStep(first), ...rest.map(localizeStep)]
  };
}
