import { describe, expect, test } from "bun:test";
import { restAnswers } from "../src/site/rest/rest_answers";
import { restEndpoints } from "../src/site/rest/rest_endpoints";
import { restReleases } from "../src/site/rest/rest_releases";
import { statusReasons } from "../src/site/rest/status_reasons";
import type { RestEndpoint } from "../src/site/types/rest_endpoint.type";
import type { RestFieldLocation } from "../src/site/types/rest_field_location.type";
import type { RestService } from "../src/site/types/rest_service.type";

const kong = "https://github.com/Kong/kong/blob/";

const gatewayPrefixes: Readonly<Record<RestService, readonly string[]>> = {
  gateway: ["/health"],
  identity: [
    "/api/v1/auth",
    "/api/v1/users",
    "/api/v1/sellers",
    "/api/v1/couriers",
    "/.well-known/jwks.json"
  ],
  catalog: ["/api/v1/products", "/api/v1/categories"],
  search: ["/api/v1/products/search", "/api/v1/products/suggest"],
  pricing: ["/api/v1/pricing"],
  order: ["/api/v1/cart", "/api/v1/orders"],
  review: ["/api/v1/reviews"],
  warehouse: ["/api/v1/warehouse"],
  matching: ["/api/v1/matching"],
  payment: ["/api/v1/payment"],
  notary: ["/api/v1/proofs"],
  notification: ["/api/v1/notifications/devices"]
};

function releasePrefix(service: RestService): string {
  const release = restReleases[service];

  return `https://github.com/WildanFrananda/${release.repository}/blob/${release.commit}/`;
}

function fieldNames(endpoint: RestEndpoint, location: RestFieldLocation): string[] {
  return endpoint.request.fields.filter((field) => field.in === location).map((field) => field.name);
}

describe("REST endpoints", () => {
  test("ids are unique", () => {
    const ids = restEndpoints.map((endpoint) => endpoint.id);

    expect(ids.filter((id, index) => ids.indexOf(id) !== index)).toEqual([]);
  });

  for (const endpoint of restEndpoints) {
    describe(endpoint.id, () => {
      const prefix = `rest.${endpoint.service}.`;

      test("id and texts belong to its service", () => {
        const keys = [
          endpoint.summary,
          endpoint.access.who,
          ...endpoint.request.fields.map((field) => field.rule),
          ...endpoint.cases.map((entry) => entry.when)
        ];

        expect(endpoint.id.startsWith(`${endpoint.service}.`)).toBe(true);
        expect(keys.filter((key) => !key.startsWith(prefix))).toEqual([]);
      });

      test("every source link is pinned to the release production runs", () => {
        const links = [endpoint.source, ...endpoint.cases.map((entry) => entry.source)];

        expect(links.filter((link) => !link.href.startsWith(releasePrefix(endpoint.service)))).toEqual([]);
      });

      test("the path is behind one of its service's gateway routes", () => {
        const host = endpoint.host ?? "api";

        expect(
          host === "storage" || gatewayPrefixes[endpoint.service].some((route) => endpoint.path.startsWith(route))
        ).toBe(true);
      });

      test("every value in braces in the path is a path field, and only those", () => {
        const placeholders = [...endpoint.path.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]);

        expect(endpoint.path).not.toContain("?");
        expect(fieldNames(endpoint, "path").sort()).toEqual(placeholders.sort());
      });

      test("cases are in order of status, and every status has a reason phrase", () => {
        const statuses = endpoint.cases.map((entry) => entry.status);

        expect(statuses).toEqual([...statuses].sort((a, b) => a - b));
        expect(statuses.filter((status) => statusReasons[status] === undefined)).toEqual([]);
        expect(statuses.length).toBeGreaterThan(0);
      });

      test("a case carries a body or says nothing, never both kinds", () => {
        const both = endpoint.cases.filter((entry) => entry.json !== undefined && entry.raw !== undefined);

        expect(both).toEqual([]);
      });
    });
  }

  for (const [service, cases] of Object.entries(restAnswers) as [RestService, typeof restAnswers.gateway][]) {
    test(`${service}: answers to any request are pinned and ordered`, () => {
      const allowed = service === "gateway" ? [kong, releasePrefix(service)] : [releasePrefix(service)];
      const statuses = cases.map((entry) => entry.status);

      expect(cases.filter((entry) => !allowed.some((start) => entry.source.href.startsWith(start)))).toEqual([]);
      expect(cases.filter((entry) => !entry.when.startsWith(`rest.${service}.`))).toEqual([]);
      expect(statuses).toEqual([...statuses].sort((a, b) => a - b));
    });
  }

  test("every service behind the gateway has its endpoints and its answers", () => {
    const services = Object.keys(gatewayPrefixes) as RestService[];
    const empty = services.filter(
      (service) => !restEndpoints.some((endpoint) => endpoint.service === service) || restAnswers[service].length === 0
    );

    expect(empty).toEqual([]);
  });
});
