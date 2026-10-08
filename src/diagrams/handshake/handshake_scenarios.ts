import { repositorySource } from "../engine/repository_source";
import type { HandshakeCertificate } from "../types/handshake_certificate.type";
import type { HandshakeCheck } from "../types/handshake_check.type";
import type { HandshakeCheckId } from "../types/handshake_check_id.type";
import type { HandshakeCheckStatus } from "../types/handshake_check_status.type";
import type { HandshakeState } from "../types/handshake_state.type";
import type { NonEmpty } from "../types/non_empty.type";
import type { Scenario } from "../types/scenario.type";

const pricing = "kinetix-pricing-service";
const commit = "c571662c07a12c5db946b79e8de442b2df7e7a9d";

const order: readonly HandshakeCheckId[] = ["certificate", "issuer", "identity", "allowed"];

function checks(statuses: Partial<Record<HandshakeCheckId, HandshakeCheckStatus>>): readonly HandshakeCheck[] {
  return order.map((id) => ({ id, status: statuses[id] ?? "pending" }));
}

function connecting(caller: string | null, certificate: HandshakeCertificate | null): HandshakeState {
  return {
    caller,
    server: "pricing",
    certificate,
    sent: false,
    allowed: ["order"],
    checks: checks({}),
    alert: null,
    client: null,
    log: null
  };
}

const serverTls = repositorySource(pricing, commit, "src/security/mtls.rs", 54, 58);
const handshakeFailed =
  "UNAVAILABLE  failed to connect to all addresses; last error: UNAVAILABLE: ipv4:127.0.0.1:50954: Unwrap failed (TSI_DATA_CORRUPTED)";
const tlsPassed = checks({ certificate: "pass", issuer: "pass" });

const anonymous = connecting(null, null);

const noCertificate: Scenario<HandshakeState> = {
  id: "no-certificate",
  title: "mesh.none.title",
  introduction: "mesh.none.introduction",
  outcome: "mesh.none.outcome",
  actors: { process: "mesh.actor.process", pricing: "mesh.actor.pricing" },
  initial: anonymous,
  steps: [
    {
      actor: "process",
      statement: "TLS ClientHello",
      narration: "mesh.none.step1",
      state: { ...anonymous, sent: true }
    },
    {
      actor: "pricing",
      statement: "ServerTlsConfig::client_ca_root",
      narration: "mesh.none.step2",
      source: serverTls,
      state: {
        ...anonymous,
        sent: true,
        checks: checks({ certificate: "fail", issuer: "skipped", identity: "skipped", allowed: "skipped" }),
        alert: "TLSV1_ALERT_CERTIFICATE_REQUIRED",
        client: handshakeFailed
      }
    }
  ]
};

const forgedCertificate: HandshakeCertificate = { spiffeId: "spiffe://kinetix.local/service/order", issuer: "other" };
const forged = connecting(null, forgedCertificate);

const impostor: Scenario<HandshakeState> = {
  id: "impostor",
  title: "mesh.impostor.title",
  introduction: "mesh.impostor.introduction",
  outcome: "mesh.impostor.outcome",
  actors: { impostor: "mesh.actor.impostor", pricing: "mesh.actor.pricing" },
  initial: forged,
  steps: [
    {
      actor: "impostor",
      statement: "Certificate: spiffe://kinetix.local/service/order",
      narration: "mesh.impostor.step1",
      state: { ...forged, sent: true }
    },
    {
      actor: "pricing",
      statement: "ServerTlsConfig::client_ca_root",
      narration: "mesh.impostor.step2",
      source: serverTls,
      state: {
        ...forged,
        sent: true,
        checks: checks({ certificate: "pass", issuer: "fail", identity: "skipped", allowed: "skipped" }),
        alert: "TLSV1_ALERT_UNKNOWN_CA",
        client: handshakeFailed
      }
    }
  ]
};

const paymentCaller = connecting("payment", { spiffeId: "spiffe://kinetix.local/service/payment", issuer: "kinetix" });

const notAllowed: Scenario<HandshakeState> = {
  id: "not-allowed",
  title: "mesh.payment.title",
  introduction: "mesh.payment.introduction",
  outcome: "mesh.payment.outcome",
  actors: { payment: "mesh.actor.payment", pricing: "mesh.actor.pricing" },
  initial: paymentCaller,
  steps: [
    {
      actor: "payment",
      statement: "Certificate: spiffe://kinetix.local/service/payment",
      narration: "mesh.payment.step1",
      state: { ...paymentCaller, sent: true }
    },
    {
      actor: "pricing",
      statement: "ServerTlsConfig::client_ca_root",
      narration: "mesh.payment.step2",
      source: serverTls,
      state: { ...paymentCaller, sent: true, checks: tlsPassed }
    },
    {
      actor: "pricing",
      statement: "PeerGuard::check",
      narration: "mesh.payment.step3",
      source: repositorySource(pricing, commit, "src/security/peer_guard.rs", 38, 47),
      state: {
        ...paymentCaller,
        sent: true,
        checks: checks({ certificate: "pass", issuer: "pass", identity: "pass", allowed: "fail" }),
        client: "PERMISSION_DENIED  this service is not permitted to call pricing",
        log: "WARN refused a gRPC call from a service that is not on the allow list peer=payment"
      }
    }
  ]
};

const orderCaller = connecting("order", { spiffeId: "spiffe://kinetix.local/service/order", issuer: "kinetix" });

const allowed: Scenario<HandshakeState> = {
  id: "allowed",
  title: "mesh.order.title",
  introduction: "mesh.order.introduction",
  outcome: "mesh.order.outcome",
  actors: { order: "mesh.actor.order", pricing: "mesh.actor.pricing" },
  initial: orderCaller,
  steps: [
    {
      actor: "order",
      statement: "Certificate: spiffe://kinetix.local/service/order",
      narration: "mesh.order.step1",
      state: { ...orderCaller, sent: true }
    },
    {
      actor: "pricing",
      statement: "ServerTlsConfig::client_ca_root",
      narration: "mesh.order.step2",
      source: serverTls,
      state: { ...orderCaller, sent: true, checks: tlsPassed }
    },
    {
      actor: "pricing",
      statement: "PeerGuard::check",
      narration: "mesh.order.step3",
      source: repositorySource(pricing, commit, "src/security/spiffe.rs", 37, 70),
      state: {
        ...orderCaller,
        sent: true,
        checks: checks({ certificate: "pass", issuer: "pass", identity: "pass", allowed: "pass" }),
        client: "OK  ListServices → pricing.v1.PricingService, grpc.reflection.v1alpha.ServerReflection",
        log: "INFO gRPC call accepted peer=order"
      }
    }
  ]
};

export const handshakeScenarios: NonEmpty<Scenario<HandshakeState>> = [noCertificate, impostor, notAllowed, allowed];
