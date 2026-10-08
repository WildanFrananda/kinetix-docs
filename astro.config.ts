import { existsSync } from "node:fs";
import starlight from "@astrojs/starlight";
import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";
import starlightLinksValidator from "starlight-links-validator";

if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

const site = process.env.DOCS_SITE_URL;

if (!site) {
  throw new Error("DOCS_SITE_URL is not set: copy .env.example to .env and set it to the site's public URL");
}

export default defineConfig({
  site,
  integrations: [
    starlight({
      title: "Kinetix",
      logo: {
        light: "./src/assets/kinetix-mark-light.svg",
        dark: "./src/assets/kinetix-mark-dark.svg"
      },
      favicon: "/favicon.svg",
      customCss: [
        "@fontsource-variable/ibm-plex-sans",
        "@fontsource-variable/source-serif-4/opsz.css",
        "@fontsource/ibm-plex-mono/400.css",
        "@fontsource/ibm-plex-mono/500.css",
        "@fontsource/ibm-plex-mono/600.css",
        "./src/styles/theme.css"
      ],
      components: {
        Hero: "./src/components/overrides/Hero.astro"
      },
      expressiveCode: {
        themes: ["github-dark-default", "github-light-default"],
        styleOverrides: {
          borderRadius: "2px",
          codeFontFamily: "var(--sl-font-mono)",
          frames: {
            shadowColor: "transparent"
          }
        }
      },
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
      sidebar: [
        {
          label: "Architecture",
          translations: {
            id: "Arsitektur"
          },
          items: [
            {
              autogenerate: {
                directory: "architecture"
              }
            }
          ]
        },
        {
          label: "Learn",
          translations: {
            id: "Belajar"
          },
          items: [
            {
              autogenerate: {
                directory: "learn"
              }
            }
          ]
        }
      ],
      plugins: [starlightLinksValidator()]
    }),
    svelte()
  ]
});
