import type { JsonValue } from "../types/json_value.type";

const relyingParty = "<backoffice host>";

const laptop = "q6urq6urq6urq6urq6urqw";

const securityKey = "zc3Nzc3Nzc3Nzc3Nzc3NzQ";

export const passkeyCreationOptions: JsonValue = {
  challenge: "HFZ0iVUUVqDTNJrNBPv2CsNYDOIJziVaqeBqBah3U2E",
  rp: {
    name: "Kinetix Backoffice",
    id: relyingParty
  },
  user: {
    id: "M2M5ZDJlN2EtNmIxZi00ZDhlLWE1YzQtN2UyZjFiMGE5ZDhj",
    name: "admin@example.com",
    displayName: "admin@example.com"
  },
  pubKeyCredParams: [
    {
      alg: -7,
      type: "public-key"
    },
    {
      alg: -257,
      type: "public-key"
    }
  ],
  timeout: 300000,
  attestation: "none",
  excludeCredentials: [
    {
      id: securityKey,
      transports: ["usb"],
      type: "public-key"
    }
  ],
  authenticatorSelection: {
    residentKey: "preferred",
    userVerification: "required",
    requireResidentKey: false
  },
  extensions: {
    credProps: true
  },
  hints: []
};

export const passkeyRegistrationCredential: JsonValue = {
  id: laptop,
  rawId: laptop,
  type: "public-key",
  response: {
    clientDataJSON:
      "eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiSEZaMGlWVVVWcURUTkpyTkJQdjJDc05ZRE9JSnppVmFxZUJxQmFoM1UyRSIsIm9yaWdpbiI6IjxiYWNrb2ZmaWNlIG9yaWdpbj4iLCJjcm9zc09yaWdpbiI6ZmFsc2V9",
    attestationObject:
      "o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YViUSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUldAAAAAAAAAAAAAAAAAAAAAAAAAAAAEKurq6urq6urq6urq6urq6ulAQIDJiABIVggEREREREREREREREREREREREREREREREREREREREREREiWCAiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIg",
    transports: ["hybrid", "internal"],
    publicKeyAlgorithm: -7
  },
  clientExtensionResults: {
    credProps: {
      rk: true
    }
  },
  authenticatorAttachment: "platform"
};

export const passkeyView: JsonValue = {
  id: "0f6c2d4e-8a1b-4c3d-9e5f-6a7b8c9d0e1f",
  credentialId: laptop,
  name: "Work laptop",
  createdAt: "2026-10-29T08:00:00.000Z",
  lastUsedAt: null,
  deviceType: "multiDevice",
  backedUp: true
};

export const passkeyViews: JsonValue = [
  {
    id: "5a1e9c3b-7d2f-4b6a-8e0c-1f4d7a2b9c63",
    credentialId: securityKey,
    name: "Security key",
    createdAt: "2026-10-29T07:42:10.000Z",
    lastUsedAt: "2026-10-29T09:15:31.000Z",
    deviceType: "singleDevice",
    backedUp: false
  },
  passkeyView
];

export const passkeyRequestOptions: JsonValue = {
  rpId: relyingParty,
  challenge: "KMFi_dLHv59FHVceckU_Rjr1GXall4GDu3zD2g_7S_8",
  allowCredentials: [
    {
      id: securityKey,
      transports: ["usb"],
      type: "public-key"
    },
    {
      id: laptop,
      transports: ["hybrid", "internal"],
      type: "public-key"
    }
  ],
  timeout: 120000,
  userVerification: "required"
};

export const passkeyAssertionCredential: JsonValue = {
  id: laptop,
  rawId: laptop,
  type: "public-key",
  response: {
    clientDataJSON:
      "eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiS01GaV9kTEh2NTlGSFZjZWNrVV9SanIxR1hhbGw0R0R1M3pEMmdfN1NfOCIsIm9yaWdpbiI6IjxiYWNrb2ZmaWNlIG9yaWdpbj4iLCJjcm9zc09yaWdpbiI6ZmFsc2V9",
    authenticatorData: "SUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUlJSUkdAAAAAA",
    signature: "MEQCIFpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaAiA8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PA",
    userHandle: "M2M5ZDJlN2EtNmIxZi00ZDhlLWE1YzQtN2UyZjFiMGE5ZDhj"
  },
  clientExtensionResults: {},
  authenticatorAttachment: "platform"
};
