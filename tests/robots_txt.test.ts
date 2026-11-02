import { describe, expect, test } from "bun:test";
import { robotsTxt, trainingCrawlers } from "../src/site/robots_txt";

describe("robots.txt", () => {
  const text = robotsTxt(new URL("https://docs.example/"));
  const groups = text.trim().split("\n\n");

  test("refuses the crawlers that collect for model training, in one group", () => {
    expect(groups[0]).toBe([...trainingCrawlers.map((crawler) => `User-agent: ${crawler}`), "Disallow: /"].join("\n"));
    expect(trainingCrawlers.length).toBeGreaterThan(0);
  });

  test("leaves the site open to every other crawler, search engines included", () => {
    expect(groups[1]).toBe("User-agent: *\nAllow: /");
  });

  test("names the sitemap at the site's own address", () => {
    expect(groups[2]).toBe("Sitemap: https://docs.example/sitemap-index.xml");
  });

  test("needs the site's URL", () => {
    expect(() => robotsTxt(undefined)).toThrow("site's URL");
  });
});
