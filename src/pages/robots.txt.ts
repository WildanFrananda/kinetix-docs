import type { APIRoute } from "astro";
import { robotsTxt } from "../site/robots_txt";

export const GET: APIRoute = ({ site }) => {
  return new Response(robotsTxt(site), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
};
