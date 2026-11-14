import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  computeLandingStats,
  heroCommands,
  heroPulseNodes,
  landingServices,
  serviceCategoryTabs
} from "../src/site/landing_data";
import { services } from "../src/site/services";

describe("landing page data", () => {
  test("every service in services.ts is represented with a valid category and doc link check", () => {
    const english = landingServices("en");
    const indonesian = landingServices("id");

    expect(english.map((item) => item.name)).toEqual(services.map((service) => service.name));
    expect(indonesian.map((item) => item.name)).toEqual(services.map((service) => service.name));

    for (const item of english) {
      if (item.docHref !== undefined) {
        const expectedFile = join("src", "content", "docs", "services", `${item.name}.mdx`);

        expect(existsSync(expectedFile)).toBe(true);
      }
    }
  });

  test("category tab counts add up to the full service list", () => {
    const items = landingServices("en");
    const tabs = serviceCategoryTabs("en", items);
    const allTab = tabs.find((tab) => tab.id === "all");
    const domainSum = tabs
      .filter((tab) => tab.id !== "all")
      .reduce((sum, tab) => sum + tab.count, 0);

    expect(allTab?.count).toBe(items.length);
    expect(domainSum).toBe(items.length);
  });

  test("hero pulse nodes and commands are populated in both locales", () => {
    expect(heroPulseNodes("en").length).toBe(8);
    expect(heroPulseNodes("id").length).toBe(8);
    expect(heroCommands("en").length).toBe(3);
    expect(heroCommands("id").length).toBe(3);
  });

  test("landing stats reflect real service and API counts", () => {
    const stats = computeLandingStats(12, 8);

    expect(stats.services).toBe(services.length);
    expect(stats.languages).toBe(12);
    expect(stats.grpcOperations).toBeGreaterThan(0);
    expect(stats.restOperations).toBeGreaterThan(0);
  });
});
