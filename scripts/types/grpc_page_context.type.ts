import type { Locale } from "../../src/diagrams/types/locale.type";
import type { ContractsRelease } from "../../src/site/types/contracts_release.type";
import type { GrpcConnections } from "./grpc_connections.type";

export type GrpcPageContext = {
  readonly locale: Locale;
  readonly release: ContractsRelease;
  readonly connections: GrpcConnections;
  readonly servicePages: ReadonlySet<string>;
};
