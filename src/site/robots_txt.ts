export const trainingCrawlers: readonly string[] = [
  "GPTBot",
  "ClaudeBot",
  "CCBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
  "meta-externalagent"
];

export function robotsTxt(site: URL | undefined): string {
  if (site === undefined) {
    throw new Error("robots.txt needs the site's URL to name its sitemap");
  }

  return [
    ...trainingCrawlers.map((crawler) => `User-agent: ${crawler}`),
    "Disallow: /",
    "",
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${new URL("/sitemap-index.xml", site).href}`,
    ""
  ].join("\n");
}
