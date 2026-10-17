import type { RpcCaller } from "../../src/site/types/rpc_caller.type";

export type GrpcConnections = {
  readonly servers: ReadonlyMap<string, readonly string[]>;
  readonly callers: ReadonlyMap<string, readonly RpcCaller[]>;
};
