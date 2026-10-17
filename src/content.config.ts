import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        sourceHash: z.string().regex(/^[0-9a-f]{12}$/).optional(),
        eyebrow: z.string().optional(),
        adr: z
          .object({
            number: z.number().int().positive(),
            status: z.enum(["accepted", "superseded"]),
            decided: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
          })
          .optional()
      })
    })
  })
};
