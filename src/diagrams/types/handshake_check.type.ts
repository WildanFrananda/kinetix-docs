import type { HandshakeCheckId } from "./handshake_check_id.type";
import type { HandshakeCheckStatus } from "./handshake_check_status.type";

export type HandshakeCheck = {
  readonly id: HandshakeCheckId;
  readonly status: HandshakeCheckStatus;
};
