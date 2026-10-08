import { repositorySource } from "../engine/repository_source";
import type { ContractStage } from "../types/contract_stage.type";
import type { ContractStageId } from "../types/contract_stage_id.type";
import type { ContractStageStatus } from "../types/contract_stage_status.type";
import type { ContractState } from "../types/contract_state.type";
import type { DiffLine } from "../types/diff_line.type";
import type { NonEmpty } from "../types/non_empty.type";
import type { Scenario } from "../types/scenario.type";

const contracts = "kinetix-contracts";
const now = "cbd5d56df761b920ce1125d755d02c7c1f2f0491";
const before = "9008e09bd71a6f2181f2dbc5f6b0f5a1f6a982ae";

const order: readonly ContractStageId[] = ["lint", "money", "breaking", "generate", "publish"];

const actors = {
  author: "contracts.actor.author",
  ci: "contracts.actor.ci"
} as const;

function stages(statuses: Partial<Record<ContractStageId, ContractStageStatus>>): readonly ContractStage[] {
  return order.map((id) => ({ id, status: statuses[id] ?? "pending" }));
}

function lines(...rows: readonly [DiffLine["sign"], string][]): readonly DiffLine[] {
  return rows.map(([sign, text]) => ({ sign, text }));
}

const catalog = "proto/catalog/v1/catalog.proto";
const identity = "proto/identity/v1/identity.proto";

const addField = lines([" ", "message GetProductRequest {"], [" ", "  string sku = 1;"], ["+", "  bool include_stock = 2;"], [" ", "}"]);
const doubleMoney = lines(
  [" ", "message GetProductRequest {"],
  [" ", "  string sku = 1;"],
  ["+", "  double shipping_fee = 2;"],
  [" ", "}"]
);
const deleteField = lines(
  [" ", "message GetProductResponse {"],
  ["-", "  bool found = 1;"],
  [" ", "  Product product = 2;"],
  [" ", "}"]
);
const removeFlag = lines(
  [" ", "message GetUserProfileResponse {"],
  ["-", "  bool has_location = 10;"],
  ["+", "  reserved 10;"],
  [" ", "}"]
);

const additive: Scenario<ContractState> = {
  id: "additive",
  title: "contracts.additive.title",
  introduction: "contracts.additive.introduction",
  outcome: "contracts.additive.outcome",
  actors,
  initial: { file: catalog, diff: [], stages: stages({}), output: [], release: null },
  steps: [
    {
      actor: "author",
      statement: "buf lint",
      narration: "contracts.additive.step1",
      source: repositorySource(contracts, now, "buf.yaml", 22, 40),
      state: { file: catalog, diff: addField, stages: stages({ lint: "pass", money: "pass" }), output: [], release: null }
    },
    {
      actor: "ci",
      statement: "tools/breaking-gate --against \".git#branch=main\"",
      narration: "contracts.additive.step2",
      source: repositorySource(contracts, now, "tools/breaking-gate", 43, 48),
      state: {
        file: catalog,
        diff: addField,
        stages: stages({ lint: "pass", money: "pass", breaking: "pass" }),
        output: ["no breaking change against .git#branch=main"],
        release: null
      }
    },
    {
      actor: "ci",
      statement: "git push origin <tag>",
      narration: "contracts.additive.step3",
      source: repositorySource(contracts, now, ".github/workflows/release.yml", 77, 111),
      state: {
        file: catalog,
        diff: addField,
        stages: stages({ lint: "pass", money: "pass", breaking: "pass", generate: "pass", publish: "pass" }),
        output: ["no breaking change against .git#branch=main"],
        release: "npm · PyPI · RubyGems · Packagist"
      }
    }
  ]
};

const moneyFinding =
  "proto/catalog/v1/catalog.proto:45:3:field \"catalog.v1.GetProductRequest.shipping_fee\" is a double. " +
  "Money must be common.v1.Money{int64 amount_minor, string currency}: a binary float cannot represent 0.1, " +
  "so a total computed in one language disagrees with the same total computed in another. " +
  "(./tools/moneylint/moneylint)";

const floatMoney: Scenario<ContractState> = {
  id: "float-money",
  title: "contracts.money.title",
  introduction: "contracts.money.introduction",
  outcome: "contracts.money.outcome",
  actors,
  initial: { file: catalog, diff: [], stages: stages({}), output: [], release: null },
  steps: [
    {
      actor: "author",
      statement: "+ double shipping_fee = 2;",
      narration: "contracts.money.step1",
      state: { file: catalog, diff: doubleMoney, stages: stages({}), output: [], release: null }
    },
    {
      actor: "ci",
      statement: "buf lint",
      narration: "contracts.money.step2",
      source: repositorySource(contracts, now, "tools/moneylint/main.go", 60, 83),
      state: {
        file: catalog,
        diff: doubleMoney,
        stages: stages({ lint: "pass", money: "fail" }),
        output: [moneyFinding],
        release: null
      }
    },
    {
      actor: "ci",
      statement: "tools/breaking-gate --against \".git#branch=main\"",
      narration: "contracts.money.step3",
      source: repositorySource(contracts, now, ".github/workflows/release.yml", 42, 75),
      state: {
        file: catalog,
        diff: doubleMoney,
        stages: stages({ lint: "pass", money: "fail", breaking: "pass", generate: "skipped", publish: "skipped" }),
        output: [moneyFinding, "no breaking change against .git#branch=main"],
        release: null
      }
    }
  ]
};

const accidental: Scenario<ContractState> = {
  id: "accidental",
  title: "contracts.accidental.title",
  introduction: "contracts.accidental.introduction",
  outcome: "contracts.accidental.outcome",
  actors,
  initial: { file: catalog, diff: [], stages: stages({}), output: [], release: null },
  steps: [
    {
      actor: "author",
      statement: "- bool found = 1;",
      narration: "contracts.accidental.step1",
      state: { file: catalog, diff: deleteField, stages: stages({ lint: "pass", money: "pass" }), output: [], release: null }
    },
    {
      actor: "ci",
      statement: "tools/breaking-gate --against \".git#branch=main\"",
      narration: "contracts.accidental.step2",
      source: repositorySource(contracts, now, "tools/breaking-gate", 78, 83),
      state: {
        file: catalog,
        diff: deleteField,
        stages: stages({ lint: "pass", money: "pass", breaking: "fail", generate: "skipped", publish: "skipped" }),
        output: [
          "breaking changes were found and no unreleased version declares them:",
          "Previously present field \"1\" with name \"found\" on message \"GetProductResponse\" was deleted.",
          "add a '## vX.Y.Z' section to docs/BREAKING.md naming each line above."
        ],
        release: null
      }
    }
  ]
};

const declared: Scenario<ContractState> = {
  id: "declared",
  title: "contracts.declared.title",
  introduction: "contracts.declared.introduction",
  outcome: "contracts.declared.outcome",
  actors,
  initial: { file: identity, diff: [], stages: stages({}), output: [], release: null },
  steps: [
    {
      actor: "author",
      statement: "- bool has_location = 10;",
      narration: "contracts.declared.step1",
      source: repositorySource(contracts, before, identity, 68, 68),
      state: { file: identity, diff: removeFlag, stages: stages({ lint: "pass", money: "pass" }), output: [], release: null }
    },
    {
      actor: "author",
      statement: "docs/BREAKING.md — ## v1.0.20",
      narration: "contracts.declared.step2",
      source: repositorySource(contracts, now, "docs/BREAKING.md", 16, 38),
      state: { file: identity, diff: removeFlag, stages: stages({ lint: "pass", money: "pass" }), output: [], release: null }
    },
    {
      actor: "ci",
      statement: "tools/breaking-gate --against \".git#tag=v1.0.19\" --version v1.0.20",
      narration: "contracts.declared.step3",
      source: repositorySource(contracts, now, "tools/breaking-gate", 85, 112),
      state: {
        file: identity,
        diff: removeFlag,
        stages: stages({ lint: "pass", money: "pass", breaking: "pass", generate: "pass", publish: "pass" }),
        output: [
          "  declared: Previously present field \"10\" with name \"has_location\" on message \"GetUserProfileResponse\" was deleted.",
          "  declared: Previously present field \"8\" with name \"has_location\" on message \"GetMerchantInfoResponse\" was deleted.",
          "every breaking change in this release is declared in docs/BREAKING.md under v1.0.20"
        ],
        release: "v1.0.20 · npm · PyPI · RubyGems · Packagist"
      }
    }
  ]
};

export const contractScenarios: NonEmpty<Scenario<ContractState>> = [additive, floatMoney, accidental, declared];
