import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { gatewayRoutes } from "../src/site/gateway_routes";

describe("gateway routes", () => {
  test("no path is claimed by two services", () => {
    const paths = gatewayRoutes().map((route) => route.path);

    expect(new Set(paths).size).toBe(paths.length);
  });

  test("every service a route leads to has a page in both languages", () => {
    const missing = [...new Set(gatewayRoutes().map((route) => route.service))].filter(
      (service) =>
        !existsSync(`src/content/docs/services/${service}.mdx`) ||
        !existsSync(`src/content/docs/id/services/${service}.mdx`)
    );

    expect(missing).toEqual([]);
  });

  test("the sockets are routed to matching", () => {
    const sockets = gatewayRoutes().filter((route) => route.path.startsWith("/ws/"));

    expect(sockets).toEqual([
      { path: "/ws/v1/matching/driver", service: "matching" },
      { path: "/ws/v1/matching/merchant", service: "matching" }
    ]);
  });
});
