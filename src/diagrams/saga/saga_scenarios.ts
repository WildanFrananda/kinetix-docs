import type { NonEmpty } from "../types/non_empty.type";
import type { SagaDiagramState } from "../types/saga_diagram_state.type";
import type { SagaLane } from "../types/saga_lane.type";
import type { SagaLogRow } from "../types/saga_log_row.type";
import type { SagaRowState } from "../types/saga_row_state.type";
import type { Scenario } from "../types/scenario.type";
import { orderSource } from "./order_source";

const runner = "Application/Checkout/CheckoutSagaRunner.cs";
const checkout = "Application/Services/OrderService.cs";
const controller = "Controllers/OrderController.cs";
const sweeper = "Infrastructure/Background/StuckSagaSweeper.cs";
const policy = "Application/Checkout/CompensationPolicy.cs";

const actors = {
  order: "saga.actor.order",
  sweeper: "saga.actor.sweeper"
} as const;

function row(id: string, step: string, reference: string, lane: SagaLane, state: SagaRowState): SagaLogRow {
  return { id, step, reference, lane, state };
}

const voucher = (state: SagaRowState): SagaLogRow => row("voucher", "RedeemVoucher", "HEMAT10", "pricing", state);
const flashSale = (state: SagaRowState): SagaLogRow =>
  row("flash", "AllocateFlashSaleStock", "FS-12 × 1", "pricing", state);
const stockA = (state: SagaRowState): SagaLogRow => row("stock-a", "ReserveStock", "SKU-A × 1", "warehouse", state);
const stockB = (state: SagaRowState): SagaLogRow => row("stock-b", "ReserveStock", "SKU-B × 2", "warehouse", state);
const escrow = (state: SagaRowState): SagaLogRow => row("escrow", "CreateEscrowHold", "ORD-1", "payment", state);
const fulfilment = (state: SagaRowState): SagaLogRow =>
  row("fulfilment", "CreateFulfillmentOrder", "ORD-1", "warehouse", state);

const initial: SagaDiagramState = {
  saga: "Running",
  order: "PENDING_PAYMENT",
  rows: [],
  message: null,
  touched: null,
  http: null,
  nextRound: null
};

function running(rows: readonly SagaLogRow[], touched: string, message: SagaDiagramState["message"]): SagaDiagramState {
  return { ...initial, rows, touched, message };
}

function compensating(rows: readonly SagaLogRow[], touched: string, message: SagaDiagramState["message"]): SagaDiagramState {
  return { ...initial, saga: "Compensating", rows, touched, message };
}

const succeeds: Scenario<SagaDiagramState> = {
  id: "succeeds",
  title: "saga.succeeds.title",
  introduction: "saga.succeeds.introduction",
  outcome: "saga.succeeds.outcome",
  actors,
  initial,
  steps: [
    {
      actor: "order",
      statement: "pricing.RedeemVoucher(HEMAT10, ORD-1)",
      narration: "saga.succeeds.step1",
      source: orderSource(runner, 149, 164),
      state: running([voucher("Done")], "voucher", { to: "pricing", reply: "ok", compensation: false })
    },
    {
      actor: "order",
      statement: "pricing.AllocateFlashSaleStock(FS-12, SKU-A, 1, ORD-1)",
      narration: "saga.succeeds.step2",
      source: orderSource(runner, 166, 182),
      state: running([voucher("Done"), flashSale("Done")], "flash", { to: "pricing", reply: "ok", compensation: false })
    },
    {
      actor: "order",
      statement: "warehouse.ReserveStock(SKU-A, 1, ORD-1)",
      narration: "saga.succeeds.step3",
      source: orderSource(runner, 184, 200),
      state: running(
        [voucher("Done"), flashSale("Done"), stockA("Done")],
        "stock-a",
        { to: "warehouse", reply: "ok", compensation: false }
      )
    },
    {
      actor: "order",
      statement: "warehouse.ReserveStock(SKU-B, 2, ORD-1)",
      narration: "saga.succeeds.step4",
      source: orderSource(runner, 184, 200),
      state: running(
        [voucher("Done"), flashSale("Done"), stockA("Done"), stockB("Done")],
        "stock-b",
        { to: "warehouse", reply: "ok", compensation: false }
      )
    },
    {
      actor: "order",
      statement: "payment.CreateEscrowHold(ORD-1, total, merchant share, shipping fee)",
      narration: "saga.succeeds.step5",
      source: orderSource(runner, 206, 222),
      state: running(
        [voucher("Done"), flashSale("Done"), stockA("Done"), stockB("Done"), escrow("Done")],
        "escrow",
        { to: "payment", reply: "ok", compensation: false }
      )
    },
    {
      actor: "order",
      statement: "warehouse.CreateFulfillmentTask(ORD-1, lines)",
      narration: "saga.succeeds.step6",
      source: orderSource(runner, 228, 248),
      state: running(
        [voucher("Done"), flashSale("Done"), stockA("Done"), stockB("Done"), escrow("Done"), fulfilment("Done")],
        "fulfilment",
        { to: "warehouse", reply: "ok", compensation: false }
      )
    },
    {
      actor: "order",
      statement: "201 Created",
      narration: "saga.succeeds.step7",
      source: orderSource(checkout, 173, 179),
      state: {
        ...initial,
        saga: "Completed",
        order: "PAID",
        rows: [voucher("Done"), flashSale("Done"), stockA("Done"), stockB("Done"), escrow("Done"), fulfilment("Done")],
        http: "201 Created"
      }
    }
  ]
};

const refused: Scenario<SagaDiagramState> = {
  id: "refused",
  title: "saga.refused.title",
  introduction: "saga.refused.introduction",
  outcome: "saga.refused.outcome",
  actors,
  initial,
  steps: [
    {
      actor: "order",
      statement: "pricing.RedeemVoucher(HEMAT10, ORD-1)",
      narration: "saga.refused.step1",
      source: orderSource(runner, 149, 164),
      state: running([voucher("Done")], "voucher", { to: "pricing", reply: "ok", compensation: false })
    },
    {
      actor: "order",
      statement: "pricing.AllocateFlashSaleStock(FS-12, SKU-A, 1, ORD-1)",
      narration: "saga.refused.step2",
      source: orderSource(runner, 166, 182),
      state: running([voucher("Done"), flashSale("Done")], "flash", { to: "pricing", reply: "ok", compensation: false })
    },
    {
      actor: "order",
      statement: "warehouse.ReserveStock(SKU-A, 1, ORD-1)",
      narration: "saga.refused.step3",
      source: orderSource(runner, 184, 200),
      state: running(
        [voucher("Done"), flashSale("Done"), stockA("Done")],
        "stock-a",
        { to: "warehouse", reply: "ok", compensation: false }
      )
    },
    {
      actor: "order",
      statement: "warehouse.ReserveStock(SKU-B, 2, ORD-1)",
      narration: "saga.refused.step4",
      source: orderSource(runner, 184, 200),
      state: running(
        [voucher("Done"), flashSale("Done"), stockA("Done"), stockB("Failed")],
        "stock-b",
        { to: "warehouse", reply: "refused", detail: "INSUFFICIENT_STOCK", compensation: false }
      )
    },
    {
      actor: "order",
      statement: "warehouse.ReleaseStock(SKU-A, ORD-1)",
      narration: "saga.refused.step5",
      source: orderSource(runner, 259, 267),
      state: compensating(
        [voucher("Done"), flashSale("Done"), stockA("Compensated"), stockB("Failed")],
        "stock-a",
        { to: "warehouse", reply: "ok", compensation: true }
      )
    },
    {
      actor: "order",
      statement: "pricing.ReleaseFlashSaleAllocation(FS-12, SKU-A, 1, ORD-1)",
      narration: "saga.refused.step6",
      source: orderSource(runner, 447, 459),
      state: compensating(
        [voucher("Done"), flashSale("Compensated"), stockA("Compensated"), stockB("Failed")],
        "flash",
        { to: "pricing", reply: "ok", compensation: true }
      )
    },
    {
      actor: "order",
      statement: "pricing.ReleaseVoucherRedemption(HEMAT10, ORD-1)",
      narration: "saga.refused.step7",
      source: orderSource(runner, 447, 459),
      state: compensating(
        [voucher("Compensated"), flashSale("Compensated"), stockA("Compensated"), stockB("Failed")],
        "voucher",
        { to: "pricing", reply: "ok", compensation: true }
      )
    },
    {
      actor: "order",
      statement: "409 CHECKOUT_ROLLED_BACK",
      narration: "saga.refused.step8",
      source: orderSource(controller, 90, 95),
      state: {
        ...initial,
        saga: "Compensated",
        order: "CANCELLED",
        rows: [voucher("Compensated"), flashSale("Compensated"), stockA("Compensated"), stockB("Failed")],
        http: "409 CHECKOUT_ROLLED_BACK"
      }
    }
  ]
};

const silent: Scenario<SagaDiagramState> = {
  id: "silent",
  title: "saga.silent.title",
  introduction: "saga.silent.introduction",
  outcome: "saga.silent.outcome",
  actors,
  initial,
  steps: [
    {
      actor: "order",
      statement: "pricing.RedeemVoucher(HEMAT10, ORD-1)",
      narration: "saga.silent.step1",
      source: orderSource(runner, 149, 164),
      state: running([voucher("Done")], "voucher", { to: "pricing", reply: "ok", compensation: false })
    },
    {
      actor: "order",
      statement: "warehouse.ReserveStock(SKU-A, 1, ORD-1)",
      narration: "saga.silent.step2",
      source: orderSource(runner, 184, 200),
      state: running([voucher("Done"), stockA("Done")], "stock-a", { to: "warehouse", reply: "ok", compensation: false })
    },
    {
      actor: "order",
      statement: "payment.CreateEscrowHold(ORD-1, total, merchant share, shipping fee)",
      narration: "saga.silent.step3",
      source: orderSource(runner, 62, 67),
      state: running(
        [voucher("Done"), stockA("Done"), escrow("Attempting")],
        "escrow",
        { to: "payment", reply: "silent", detail: "DEADLINE_EXCEEDED", compensation: false }
      )
    },
    {
      actor: "order",
      statement: "payment.RefundEscrow(ORD-1, reason)",
      narration: "saga.silent.step4",
      source: orderSource(runner, 485, 518),
      state: compensating(
        [voucher("Done"), stockA("Done"), escrow("Compensated")],
        "escrow",
        { to: "payment", reply: "ok", compensation: true }
      )
    },
    {
      actor: "order",
      statement: "warehouse.ReleaseStock(SKU-A, ORD-1)",
      narration: "saga.silent.step5",
      source: orderSource(runner, 447, 459),
      state: compensating(
        [voucher("Done"), stockA("Compensated"), escrow("Compensated")],
        "stock-a",
        { to: "warehouse", reply: "ok", compensation: true }
      )
    },
    {
      actor: "order",
      statement: "pricing.ReleaseVoucherRedemption(HEMAT10, ORD-1)",
      narration: "saga.silent.step6",
      source: orderSource(runner, 447, 459),
      state: compensating(
        [voucher("Compensated"), stockA("Compensated"), escrow("Compensated")],
        "voucher",
        { to: "pricing", reply: "ok", compensation: true }
      )
    },
    {
      actor: "order",
      statement: "409 CHECKOUT_ROLLED_BACK",
      narration: "saga.silent.step7",
      source: orderSource(checkout, 163, 171),
      state: {
        ...initial,
        saga: "Compensated",
        order: "CANCELLED",
        rows: [voucher("Compensated"), stockA("Compensated"), escrow("Compensated")],
        http: "409 CHECKOUT_ROLLED_BACK"
      }
    }
  ]
};

const stuck: Scenario<SagaDiagramState> = {
  id: "stuck",
  title: "saga.stuck.title",
  introduction: "saga.stuck.introduction",
  outcome: "saga.stuck.outcome",
  actors,
  initial,
  steps: [
    {
      actor: "order",
      statement: "pricing.RedeemVoucher(HEMAT10, ORD-1)",
      narration: "saga.stuck.step1",
      source: orderSource(runner, 149, 164),
      state: running([voucher("Done")], "voucher", { to: "pricing", reply: "ok", compensation: false })
    },
    {
      actor: "order",
      statement: "warehouse.ReserveStock(SKU-A, 1, ORD-1)",
      narration: "saga.stuck.step2",
      source: orderSource(runner, 184, 200),
      state: running([voucher("Done"), stockA("Done")], "stock-a", { to: "warehouse", reply: "ok", compensation: false })
    },
    {
      actor: "order",
      statement: "warehouse.ReserveStock(SKU-B, 2, ORD-1)",
      narration: "saga.stuck.step3",
      source: orderSource(runner, 184, 200),
      state: running(
        [voucher("Done"), stockA("Done"), stockB("Failed")],
        "stock-b",
        { to: "warehouse", reply: "refused", detail: "INSUFFICIENT_STOCK", compensation: false }
      )
    },
    {
      actor: "order",
      statement: "warehouse.ReleaseStock(SKU-A, ORD-1)",
      narration: "saga.stuck.step4",
      source: orderSource(runner, 447, 459),
      state: compensating(
        [voucher("Done"), stockA("Compensated"), stockB("Failed")],
        "stock-a",
        { to: "warehouse", reply: "ok", compensation: true }
      )
    },
    {
      actor: "order",
      statement: "pricing.ReleaseVoucherRedemption(HEMAT10, ORD-1)",
      narration: "saga.stuck.step5",
      source: orderSource(runner, 353, 363),
      state: {
        ...initial,
        saga: "Stuck",
        order: "CANCELLED",
        rows: [voucher("Done"), stockA("Compensated"), stockB("Failed")],
        touched: "voucher",
        message: { to: "pricing", reply: "unavailable", detail: "UNAVAILABLE", compensation: true },
        http: "409 CHECKOUT_ROLLED_BACK",
        nextRound: "15–30 s"
      }
    },
    {
      actor: "sweeper",
      statement: "pricing.ReleaseVoucherRedemption(HEMAT10, ORD-1)",
      narration: "saga.stuck.step6",
      source: orderSource(sweeper, 75, 80),
      state: {
        ...initial,
        saga: "Compensating",
        order: "CANCELLED",
        rows: [voucher("Compensated"), stockA("Compensated"), stockB("Failed")],
        touched: "voucher",
        message: { to: "pricing", reply: "ok", compensation: true },
        http: "409 CHECKOUT_ROLLED_BACK"
      }
    },
    {
      actor: "sweeper",
      statement: "Compensated",
      narration: "saga.stuck.step7",
      source: orderSource(policy, 39, 45),
      state: {
        ...initial,
        saga: "Compensated",
        order: "CANCELLED",
        rows: [voucher("Compensated"), stockA("Compensated"), stockB("Failed")],
        http: "409 CHECKOUT_ROLLED_BACK"
      }
    }
  ]
};

export const sagaScenarios: NonEmpty<Scenario<SagaDiagramState>> = [succeeds, refused, silent, stuck];
