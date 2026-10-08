import type { HandshakeCheckId } from "./handshake_check_id.type";
import type { HandshakeCheckStatus } from "./handshake_check_status.type";
import type { HandshakeIssuer } from "./handshake_issuer.type";

export type HandshakeLabels = {
  readonly anonymous: string;
  readonly certificate: string;
  readonly noCertificate: string;
  readonly issuedBy: string;
  readonly allowed: string;
  readonly checks: string;
  readonly alert: string;
  readonly client: string;
  readonly log: string;
  readonly issuers: Readonly<Record<HandshakeIssuer, string>>;
  readonly checkNames: Readonly<Record<HandshakeCheckId, string>>;
  readonly checkLayers: Readonly<Record<HandshakeCheckId, string>>;
  readonly statuses: Readonly<Record<HandshakeCheckStatus, string>>;
};
