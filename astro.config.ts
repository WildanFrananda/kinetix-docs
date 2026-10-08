import { existsSync } from "node:fs";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightLinksValidator from "starlight-links-validator";

if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

const site = process.env.DOCS_SITE_URL;

if (!site) {
  throw new Error("DOCS_SITE_URL is not set");
}

export default defineConfig({
  site,
  integrations: [
    starlight({
      title: "Kinetix",
      description: "Architecture, contracts and engineering decisions of the Kinetix real-time e-commerce and fulfilment platform.",
      defaultLocale: "root",
      locales: {
        root: {
          label: "English",
          lang: "en"
        },
        id: {
          label: "Bahasa Indonesia",
          lang: "id"
        }
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/WildanFrananda"
        }
      ],
      editLink: {
        baseUrl: "https://github.com/WildanFrananda/kinetix-docs/edit/main/"
      },
      lastUpdated: true,
      plugins: [starlightLinksValidator()]
    })
  ]
});
