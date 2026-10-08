import type { HandshakeCertificate } from "./handshake_certificate.type";
import type { HandshakeCheck } from "./handshake_check.type";

export type HandshakeState = {
  readonly caller: string | null;
  readonly server: string;
  readonly certificate: HandshakeCertificate | null;
  readonly sent: boolean;
  readonly allowed: readonly string[];
  readonly checks: readonly HandshakeCheck[];
  readonly alert: string | null;
  readonly client: string | null;
  readonly log: string | null;
};
