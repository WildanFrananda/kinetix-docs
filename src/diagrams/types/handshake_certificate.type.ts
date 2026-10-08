import type { HandshakeIssuer } from "./handshake_issuer.type";

export type HandshakeCertificate = {
  readonly spiffeId: string;
  readonly issuer: HandshakeIssuer;
};
