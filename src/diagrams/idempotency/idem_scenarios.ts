import { repositorySource } from "../engine/repository_source";
import type { IdemEffect } from "../types/idem_effect.type";
import type { IdemRequest } from "../types/idem_request.type";
import type { IdemState } from "../types/idem_state.type";
import type { IdemStatus } from "../types/idem_status.type";
import type { NonEmpty } from "../types/non_empty.type";
import type { Scenario } from "../types/scenario.type";

const order = "kinetix-order-service";
const payment = "kinetix-payment-service";
const warehouse = "kinetix-warehouse-service";
const orderCommit = "82834065c34981f1c69a88b3d3317d20396358d9";
const paymentCommit = "c08f8cb6298e76495f6b259b239e20b1cd3231de";
const warehouseCommit = "377490ff62a3a0d3393c15fb7f55995fef21a2a9";

const escrowService = "modules/application/src/main/java/com/kinetix/payment/application/EscrowService.java";

const actors = {
  client: "idem.actor.client",
  order: "idem.actor.order",
  payment: "idem.actor.payment",
  warehouse: "idem.actor.warehouse"
} as const;

function request(id: string, statement: string, key: string | null, status: IdemStatus): IdemRequest {
  return { id, statement, key, status };
}

function effect(kind: IdemEffect["kind"], value: string, wrong = false): IdemEffect {
  return { kind, value, wrong };
}

const checkout = "POST /api/v1/orders/checkout";
const empty: IdemState = { requests: [], records: [], effects: [], reply: null };

const noKey: Scenario<IdemState> = {
  id: "no-key",
  title: "idem.noKey.title",
  introduction: "idem.noKey.introduction",
  outcome: "idem.noKey.outcome",
  actors,
  initial: empty,
  steps: [
    {
      actor: "client",
      statement: checkout,
      narration: "idem.noKey.step1",
      source: repositorySource(order, orderCommit, "Application/Services/OrderService.cs", 34, 47),
      state: {
        requests: [request("#1", checkout, null, "processing")],
        records: [],
        effects: [effect("orders", "1"), effect("holds", "1")],
        reply: null
      }
    },
    {
      actor: "client",
      statement: "timeout",
      narration: "idem.noKey.step2",
      state: {
        requests: [request("#1", checkout, null, "lost")],
        records: [],
        effects: [effect("orders", "1"), effect("holds", "1")],
        reply: "timeout"
      }
    },
    {
      actor: "client",
      statement: checkout,
      narration: "idem.noKey.step3",
      state: {
        requests: [request("#1", checkout, null, "lost"), request("#2", checkout, null, "answered")],
        records: [],
        effects: [effect("orders", "2", true), effect("holds", "2", true)],
        reply: "201 ORD-2"
      }
    }
  ]
};

const withKey: Scenario<IdemState> = {
  id: "with-key",
  title: "idem.withKey.title",
  introduction: "idem.withKey.introduction",
  outcome: "idem.withKey.outcome",
  actors,
  initial: empty,
  steps: [
    {
      actor: "client",
      statement: `${checkout}  Idempotency-Key: k-81f2`,
      narration: "idem.withKey.step1",
      source: repositorySource(order, orderCommit, "Infrastructure/Persistence/OrderDbContext.cs", 46, 46),
      state: {
        requests: [request("#1", checkout, "k-81f2", "processing")],
        records: [{ key: "k-81f2", fingerprint: "—", answer: "ORD-1" }],
        effects: [effect("orders", "1"), effect("holds", "1")],
        reply: null
      }
    },
    {
      actor: "client",
      statement: "timeout",
      narration: "idem.withKey.step2",
      state: {
        requests: [request("#1", checkout, "k-81f2", "lost")],
        records: [{ key: "k-81f2", fingerprint: "—", answer: "ORD-1" }],
        effects: [effect("orders", "1"), effect("holds", "1")],
        reply: "timeout"
      }
    },
    {
      actor: "client",
      statement: `${checkout}  Idempotency-Key: k-81f2`,
      narration: "idem.withKey.step3",
      source: repositorySource(order, orderCommit, "Application/Services/OrderService.cs", 36, 47),
      state: {
        requests: [request("#1", checkout, "k-81f2", "lost"), request("#2", checkout, "k-81f2", "replayed")],
        records: [{ key: "k-81f2", fingerprint: "—", answer: "ORD-1" }],
        effects: [effect("orders", "1"), effect("holds", "1")],
        reply: "ORD-1"
      }
    }
  ]
};

const holdKey = "order:ORD-1";
const holdRecord = { key: holdKey, fingerprint: "total=150.000", answer: "HELD" };

const conflict: Scenario<IdemState> = {
  id: "conflict",
  title: "idem.conflict.title",
  introduction: "idem.conflict.introduction",
  outcome: "idem.conflict.outcome",
  actors,
  initial: empty,
  steps: [
    {
      actor: "order",
      statement: "payment.CreateEscrowHold(order:ORD-1, total = 150.000)",
      narration: "idem.conflict.step1",
      source: repositorySource(order, orderCommit, "Infrastructure/Grpc/EscrowGrpcClient.cs", 140, 141),
      state: {
        requests: [request("#1", "CreateEscrowHold(total = 150.000)", holdKey, "answered")],
        records: [holdRecord],
        effects: [effect("holds", "1")],
        reply: "HELD"
      }
    },
    {
      actor: "order",
      statement: "payment.CreateEscrowHold(order:ORD-1, total = 150.000)",
      narration: "idem.conflict.step2",
      source: repositorySource(payment, paymentCommit, escrowService, 82, 103),
      state: {
        requests: [
          request("#1", "CreateEscrowHold(total = 150.000)", holdKey, "answered"),
          request("#2", "CreateEscrowHold(total = 150.000)", holdKey, "replayed")
        ],
        records: [holdRecord],
        effects: [effect("holds", "1")],
        reply: "HELD"
      }
    },
    {
      actor: "order",
      statement: "payment.CreateEscrowHold(order:ORD-1, total = 15.000)",
      narration: "idem.conflict.step3",
      source: repositorySource(payment, paymentCommit, escrowService, 578, 591),
      state: {
        requests: [
          request("#1", "CreateEscrowHold(total = 150.000)", holdKey, "answered"),
          request("#2", "CreateEscrowHold(total = 150.000)", holdKey, "replayed"),
          request("#3", "CreateEscrowHold(total = 15.000)", holdKey, "refused")
        ],
        records: [holdRecord],
        effects: [effect("holds", "1")],
        reply: "INVALID_ARGUMENT  IDEMPOTENCY_KEY_REUSED"
      }
    }
  ]
};

const reserveKey = "reserve:ORD-1:SKU-A";
const reserveRecord = { key: reserveKey, fingerprint: "qty=3", answer: "bin C-01" };

const together: Scenario<IdemState> = {
  id: "together",
  title: "idem.together.title",
  introduction: "idem.together.introduction",
  outcome: "idem.together.outcome",
  actors,
  initial: empty,
  steps: [
    {
      actor: "warehouse",
      statement: "warehouse.ReserveStock(ORD-1, SKU-A, 3)",
      narration: "idem.together.step1",
      source: repositorySource(
        warehouse,
        warehouseCommit,
        "app/services/inventory/idempotent_operation.rb",
        85,
        96
      ),
      state: {
        requests: [request("#1", "ReserveStock(SKU-A, 3)", reserveKey, "processing")],
        records: [{ key: reserveKey, fingerprint: "qty=3", answer: "…" }],
        effects: [effect("reserved", "3")],
        reply: null
      }
    },
    {
      actor: "warehouse",
      statement: "warehouse.ReserveStock(ORD-1, SKU-A, 3)",
      narration: "idem.together.step2",
      source: repositorySource(
        warehouse,
        warehouseCommit,
        "spec/rpc/bin_stock_service_concurrency_spec.rb",
        92,
        114
      ),
      state: {
        requests: [
          request("#1", "ReserveStock(SKU-A, 3)", reserveKey, "processing"),
          request("#2", "ReserveStock(SKU-A, 3)", reserveKey, "waiting")
        ],
        records: [{ key: reserveKey, fingerprint: "qty=3", answer: "…" }],
        effects: [effect("reserved", "3")],
        reply: null
      }
    },
    {
      actor: "warehouse",
      statement: "COMMIT",
      narration: "idem.together.step3",
      source: repositorySource(warehouse, warehouseCommit, "app/services/inventory/idempotent_operation.rb", 137, 179),
      state: {
        requests: [
          request("#1", "ReserveStock(SKU-A, 3)", reserveKey, "answered"),
          request("#2", "ReserveStock(SKU-A, 3)", reserveKey, "replayed")
        ],
        records: [reserveRecord],
        effects: [effect("reserved", "3")],
        reply: "bin C-01 ×2"
      }
    }
  ]
};

export const idemScenarios: NonEmpty<Scenario<IdemState>> = [noKey, withKey, conflict, together];
