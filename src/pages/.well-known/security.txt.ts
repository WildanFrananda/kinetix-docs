import type { APIRoute } from "astro";
import { securityTxt } from "../../site/security_txt";

export const GET: APIRoute = ({ site }) => {
  return new Response(securityTxt(site), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
};
