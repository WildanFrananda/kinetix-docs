import { describe, expect, test } from "bun:test";
import { architectureEdges } from "../src/diagrams/architecture/architecture_edges";
import { outgoingCalls, servedOperations, serviceNode } from "../src/site/service_connections";
import { services } from "../src/site/services";

describe("service connections", () => {
  test("every service listed on the site is on the architecture map", () => {
    for (const service of services) {
      expect(serviceNode(service.name).id).toBe(service.name);
    }
  });

  test("a service's served list is its node's, once each, in order", () => {
    for (const service of services) {
      expect(servedOperations(service.name).map((entry) => entry.operation)).toEqual([...serviceNode(service.name).serves]);
    }
  });

  test("every gRPC call into a service is listed against an operation it serves", () => {
    for (const service of services) {
      const listed = servedOperations(service.name).reduce((count, entry) => count + entry.callers.length, 0);
      const incoming = architectureEdges
        .filter((edge) => edge.to === service.name && edge.kind === "grpc")
        .reduce((count, edge) => count + edge.calls.length, 0);

      expect(listed).toBe(incoming);
    }
  });

  test("a service's calls are exactly the edges leaving it", () => {
    for (const service of services) {
      const leaving = architectureEdges
        .filter((edge) => edge.from === service.name)
        .reduce((count, edge) => count + edge.calls.length, 0);

      expect(outgoingCalls(service.name)).toHaveLength(leaving);
    }
  });

  test("an unknown service is refused rather than rendered empty", () => {
    expect(() => serviceNode("nonexistent")).toThrow("no service nonexistent");
  });
});
