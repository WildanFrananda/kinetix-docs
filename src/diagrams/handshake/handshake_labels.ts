import type { Catalogue } from "../types/catalogue.type";
import type { HandshakeLabels } from "../types/handshake_labels.type";

export function handshakeLabels(catalogue: Catalogue): HandshakeLabels {
  return {
    anonymous: catalogue["mesh.label.anonymous"],
    certificate: catalogue["mesh.label.certificate"],
    noCertificate: catalogue["mesh.label.noCertificate"],
    issuedBy: catalogue["mesh.label.issuedBy"],
    allowed: catalogue["mesh.label.allowed"],
    checks: catalogue["mesh.label.checks"],
    alert: catalogue["mesh.label.alert"],
    client: catalogue["mesh.label.client"],
    log: catalogue["mesh.label.log"],
    issuers: {
      kinetix: catalogue["mesh.issuer.kinetix"],
      other: catalogue["mesh.issuer.other"]
    },
    checkNames: {
      certificate: catalogue["mesh.check.certificate"],
      issuer: catalogue["mesh.check.issuer"],
      identity: catalogue["mesh.check.identity"],
      allowed: catalogue["mesh.check.allowed"]
    },
    checkLayers: {
      certificate: catalogue["mesh.layer.certificate"],
      issuer: catalogue["mesh.layer.issuer"],
      identity: catalogue["mesh.layer.identity"],
      allowed: catalogue["mesh.layer.allowed"]
    },
    statuses: {
      pending: catalogue["mesh.status.pending"],
      pass: catalogue["mesh.status.pass"],
      fail: catalogue["mesh.status.fail"],
      skipped: catalogue["mesh.status.skipped"]
    }
  };
}
