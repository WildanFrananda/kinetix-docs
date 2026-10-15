import { architectureNodes } from "../diagrams/architecture/architecture_nodes";
import type { GatewayRoute } from "./types/gateway_route.type";

export function gatewayRoutes(): readonly GatewayRoute[] {
  return architectureNodes
    .flatMap((node) => node.routes.map((path) => ({ path, service: node.id })))
    .sort((a, b) => a.path.localeCompare(b.path));
}
