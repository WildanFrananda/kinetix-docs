import type { ContentSecurityPolicy } from "../types/content_security_policy.type";

export const contentSecurityPolicy: ContentSecurityPolicy = {
  directives: [
    "default-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self' https: http://localhost:* http://127.0.0.1:*",
    "worker-src 'self'",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ],
  scriptSources: ["'self'", "'wasm-unsafe-eval'"],
  styleElementSources: ["'self'"],
  styleAttributeSources: ["'unsafe-inline'"]
};
