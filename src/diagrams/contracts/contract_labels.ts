import type { Catalogue } from "../types/catalogue.type";
import type { ContractLabels } from "../types/contract_labels.type";

export function contractLabels(catalogue: Catalogue): ContractLabels {
  return {
    change: catalogue["contracts.label.change"],
    noChange: catalogue["contracts.label.noChange"],
    pipeline: catalogue["contracts.label.pipeline"],
    output: catalogue["contracts.label.output"],
    release: catalogue["contracts.label.release"],
    noRelease: catalogue["contracts.label.noRelease"],
    stages: {
      lint: catalogue["contracts.stage.lint"],
      money: catalogue["contracts.stage.money"],
      breaking: catalogue["contracts.stage.breaking"],
      generate: catalogue["contracts.stage.generate"],
      publish: catalogue["contracts.stage.publish"]
    },
    tools: {
      lint: catalogue["contracts.tool.lint"],
      money: catalogue["contracts.tool.money"],
      breaking: catalogue["contracts.tool.breaking"],
      generate: catalogue["contracts.tool.generate"],
      publish: catalogue["contracts.tool.publish"]
    },
    statuses: {
      pending: catalogue["contracts.status.pending"],
      pass: catalogue["contracts.status.pass"],
      fail: catalogue["contracts.status.fail"],
      skipped: catalogue["contracts.status.skipped"]
    }
  };
}
