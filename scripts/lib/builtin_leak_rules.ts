import type { LeakRule } from "../types/leak_rule.type";
import { isPublishableAddress } from "./is_publishable_address";
import { isVersionLiteral } from "./is_version_literal";

const neverPermitted = (): boolean => false;

export const builtinLeakRules: readonly LeakRule[] = [
  {
    name: "private-key",
    pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
    permits: neverPermitted
  },
  {
    name: "age-secret-key",
    pattern: /AGE-SECRET-KEY-1[0-9A-Z]+/g,
    permits: neverPermitted
  },
  {
    name: "age-recipient",
    pattern: /\bage1[0-9a-z]{58}\b/g,
    permits: neverPermitted
  },
  {
    name: "sops-ciphertext",
    pattern: /ENC\[AES256_GCM,/g,
    permits: neverPermitted
  },
  {
    name: "aws-access-key",
    pattern: /\bAKIA[0-9A-Z]{16}\b/g,
    permits: neverPermitted
  },
  {
    name: "jwt",
    pattern: /\beyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]+/g,
    permits: neverPermitted
  },
  {
    name: "midtrans-key",
    pattern: /\b(?:SB-)?Mid-(?:server|client)-[A-Za-z0-9_-]{8,}/g,
    permits: neverPermitted
  },
  {
    name: "ipv4-address",
    pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    permits: (match, line) => isPublishableAddress(match) || isVersionLiteral(match, line)
  }
];
