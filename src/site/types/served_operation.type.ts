import type { RpcCaller } from "./rpc_caller.type";

export type ServedOperation = {
  readonly operation: string;
  readonly callers: readonly RpcCaller[];
};
