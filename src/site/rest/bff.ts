export const bff = {
  prefix: "/bff",
  sessionCookie: "__Host-kx_session",
  pendingCookie: "__Host-kx_pending",
  refusedPaths: [
    "/api/v1/auth/login",
    "/api/v1/auth/register",
    "/api/v1/auth/refresh",
    "/api/v1/auth/logout",
    "/api/v1/auth/2fa/verify",
    "/api/v1/auth/2fa/passkey/verify",
    "/api/v1/couriers/register"
  ],
  identityPaths: ["/api/v1/auth", "/api/v1/couriers"]
} as const;
