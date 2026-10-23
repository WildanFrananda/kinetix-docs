import type { RestCase } from "../../types/rest_case.type";
import type { RestEndpoint } from "../../types/rest_endpoint.type";
import { restSource } from "../rest_source";

export const notaryAnswers: readonly RestCase[] = [
  {
    status: 401,
    when: "rest.notary.answers.missingToken",
    headers: ["WWW-Authenticate: Bearer realm=\"kinetix\""],
    json: {
      error: "unauthenticated",
      message: "a bearer token is required"
    },
    source: restSource("notary", "internal/tokens/authenticator.go", 89, 92)
  },
  {
    status: 401,
    when: "rest.notary.answers.tokenRefused",
    headers: ["WWW-Authenticate: Bearer realm=\"kinetix\""],
    json: {
      error: "unauthenticated",
      message: "the token was refused"
    },
    source: restSource("notary", "internal/tokens/authenticator.go", 94, 106)
  },
  {
    status: 401,
    when: "rest.notary.answers.notAccessToken",
    headers: ["WWW-Authenticate: Bearer realm=\"kinetix\""],
    json: {
      error: "unauthenticated",
      message: "the token is not an access token"
    },
    source: restSource("notary", "internal/tokens/authenticator.go", 108, 110)
  },
  {
    status: 404,
    when: "rest.notary.answers.unknownPath",
    json: {
      error: "not_found",
      message: "nothing is served at this path"
    },
    source: restSource("notary", "internal/httpapi/route_table.go", 29, 40)
  },
  {
    status: 405,
    when: "rest.notary.answers.methodNotAllowed",
    headers: ["Allow: GET, HEAD, POST"],
    json: {
      error: "method_not_allowed",
      message: "this path answers GET, HEAD, POST"
    },
    source: restSource("notary", "internal/httpapi/route_table.go", 56, 61)
  },
  {
    status: 503,
    when: "rest.notary.answers.identityUnavailable",
    json: {
      error: "identity_unavailable",
      message: "the notary cannot check tokens right now"
    },
    source: restSource("notary", "internal/tokens/authenticator.go", 96, 103)
  },
  {
    status: 503,
    when: "rest.notary.answers.database",
    json: {
      error: "unavailable",
      message: "the notary cannot read its records right now"
    },
    source: restSource("notary", "internal/httpapi/proofs.go", 100, 102)
  }
];

export const notaryEndpoints: readonly RestEndpoint[] = [
  {
    id: "notary.liabilityProofs",
    service: "notary",
    method: "GET",
    path: "/api/v1/proofs/liabilities/{epoch}",
    summary: "rest.notary.liabilityProofs.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.notary.liabilityProofs.who"
    },
    request: {
      fields: [
        {
          name: "epoch",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.notary.liabilityProofs.field.epoch"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.notary.liabilityProofs.case.proven",
        json: {
          epoch: "190",
          asOf: "2026-10-22T00:00:00Z",
          digest: "0x2c07490320a82afe293e3576a8cca22b2cf977e216225260a25fe61101e50268",
          ledger: {
            chainId: "84532",
            address: "0x1111111111111111111111111111111111111111"
          },
          proofs: [
            {
              format: "kinetix.notary.inclusion.v2",
              scheme: 2,
              chainId: "84532",
              ledger: "0x1111111111111111111111111111111111111111",
              epoch: "190",
              commitment: "0x428d2e2de626d9b0020271e5155f1c67ecaf791e3b4f93a97fc803d3589ee152",
              amount: "15000000",
              index: "5",
              siblings: [
                {
                  hash: "0x4cbf116893530c416e99723f72e042ff4fdbc4040e30f0a0fad0aad0edd6c5cc",
                  sum: "0"
                },
                {
                  hash: "0x85000e656f7bf40a98a2ae138e91f6028a500c54fe8809386191aa894a07e891",
                  sum: "0"
                },
                {
                  hash: "0xe11791929dea548644329ac30dd73de21643ee3a97084a959d7c62080a02429c",
                  sum: "0"
                }
              ],
              account: {
                holder: "0f8b6c1e-5a2d-4c3b-9e7f-1a2b3c4d5e6f",
                kind: "customer_balance",
                salt: "0xc47d19bdbd6e911347887259063a4534cdc7fbe2556bf0180d1833ccf24ddd5e",
                secret: "0x5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e"
              },
              statement: {
                court: "0x2222222222222222222222222222222222222222",
                signature:
                  "0x5432d5e68acc8449ff062102875452edd6882020cade0b904bcbe5132811cdff69fc7bb15593e4db138d213f22daecb0d4788facd252b2e634eaa2c9d39355db1b"
              }
            }
          ]
        },
        source: restSource("notary", "internal/httpapi/proofs.go", 50, 77)
      },
      {
        status: 200,
        when: "rest.notary.liabilityProofs.case.noAccount",
        json: {
          epoch: "190",
          asOf: "2026-10-22T00:00:00Z",
          digest: "0x2c07490320a82afe293e3576a8cca22b2cf977e216225260a25fe61101e50268",
          ledger: {
            chainId: "84532",
            address: "0x1111111111111111111111111111111111111111"
          },
          proofs: []
        },
        source: restSource("notary", "internal/proving/prover.go", 196, 201)
      },
      {
        status: 400,
        when: "rest.notary.liabilityProofs.case.invalidEpoch",
        json: {
          error: "invalid_epoch",
          message: "\"last\" is neither an epoch number nor latest"
        },
        source: restSource("notary", "internal/httpapi/proofs.go", 36, 41)
      },
      {
        status: 404,
        when: "rest.notary.liabilityProofs.case.noneFinal",
        json: {
          error: "epoch_not_found",
          message: "no epoch is final yet"
        },
        source: restSource("notary", "internal/proving/prover.go", 249, 251)
      },
      {
        status: 404,
        when: "rest.notary.liabilityProofs.case.neverBuilt",
        json: {
          error: "epoch_not_found",
          message: "epoch 9999 was never built"
        },
        source: restSource("notary", "internal/proving/prover.go", 261, 269)
      },
      {
        status: 409,
        when: "rest.notary.liabilityProofs.case.notFinal",
        json: {
          error: "epoch_not_final",
          message: "epoch 191 is submitted, not final yet"
        },
        source: restSource("notary", "internal/proving/prover.go", 175, 183)
      },
      {
        status: 410,
        when: "rest.notary.liabilityProofs.case.abandoned",
        json: {
          error: "epoch_abandoned",
          message: "epoch 188 was abandoned and never anchored"
        },
        source: restSource("notary", "internal/proving/prover.go", 167, 174)
      },
      {
        status: 500,
        when: "rest.notary.liabilityProofs.case.failed",
        json: {
          error: "internal",
          message: "the proofs could not be produced"
        },
        source: restSource("notary", "internal/httpapi/proofs.go", 88, 98)
      },
      {
        status: 503,
        when: "rest.notary.liabilityProofs.case.signerUnavailable",
        json: {
          error: "signer_unavailable",
          message: "the notary cannot sign a statement for this epoch right now"
        },
        source: restSource("notary", "internal/httpapi/proofs.go", 103, 104)
      },
      {
        status: 503,
        when: "rest.notary.liabilityProofs.case.chainUnavailable",
        json: {
          error: "chain_unavailable",
          message: "the notary cannot reach the chain right now"
        },
        source: restSource("notary", "internal/httpapi/proofs.go", 105, 106)
      }
    ],
    source: restSource("notary", "internal/httpapi/proofs.go", 28, 78)
  },
  {
    id: "notary.registrationTemplate",
    service: "notary",
    method: "GET",
    path: "/api/v1/proofs/registrations",
    summary: "rest.notary.registrationTemplate.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.notary.registrationTemplate.who"
    },
    request: {
      fields: []
    },
    cases: [
      {
        status: 200,
        when: "rest.notary.registrationTemplate.case.template",
        json: {
          types: {
            EIP712Domain: [
              {
                name: "name",
                type: "string"
              },
              {
                name: "version",
                type: "string"
              },
              {
                name: "chainId",
                type: "uint256"
              },
              {
                name: "verifyingContract",
                type: "address"
              }
            ],
            RegistrationRequest: [
              {
                name: "holder",
                type: "address"
              },
              {
                name: "principal",
                type: "string"
              },
              {
                name: "issuedAt",
                type: "uint64"
              }
            ]
          },
          primaryType: "RegistrationRequest",
          domain: {
            name: "Kinetix Withholding Court",
            version: "1",
            chainId: 84532,
            verifyingContract: "0x3333333333333333333333333333333333333333"
          },
          message: {
            principal: "0f8b6c1e-5a2d-4c3b-9e7f-1a2b3c4d5e6f"
          }
        },
        source: restSource("notary", "internal/httpapi/registrations.go", 50, 61)
      }
    ],
    source: restSource("notary", "internal/httpapi/registrations.go", 42, 62)
  },
  {
    id: "notary.register",
    service: "notary",
    method: "POST",
    path: "/api/v1/proofs/registrations",
    summary: "rest.notary.register.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.notary.register.who"
    },
    request: {
      fields: [
        {
          name: "holder",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.notary.register.field.holder"
        },
        {
          name: "issuedAt",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.notary.register.field.issuedAt"
        },
        {
          name: "signature",
          in: "body",
          type: "string",
          required: true,
          rule: "rest.notary.register.field.signature"
        }
      ],
      json: {
        holder: "0x657cb2e1d417fd966d350cdf7007bb5e30b04b02",
        issuedAt: "1792638900",
        signature:
          "0x77769507f082d7f48b5aee84f1862562541cc9457d49b9ab2dfef4bd1091dacb71b3988e46e628a0306a8c04142e31b5e2f646b978a212cc14a0e0d03f072ed91b"
      }
    },
    cases: [
      {
        status: 200,
        when: "rest.notary.register.case.registered",
        json: {
          court: {
            chainId: "84532",
            address: "0x3333333333333333333333333333333333333333"
          },
          epoch: "190",
          registrations: [
            {
              holder: "0x657cb2e1d417fd966d350cdf7007bb5e30b04b02",
              account: "0xc16fc594c6f4258d2fcb10b740a6e4088714f818bb2706d8b3d8d02f10233fca",
              fromEpoch: "190",
              kind: "customer_balance",
              digest: "0x0445908c4e0e52f5b3ccb9bf0c73519df1edb550bd06bda6fb89491f3c517bad",
              signature:
                "0xc452b533e34366e23e9344bf75fa78de180de7df52314f4fa6f54031bc3560514c7810c23154a68f328999de9dda3be89bf329ecdf061b8a2546e857500252091c"
            }
          ]
        },
        source: restSource("notary", "internal/httpapi/registrations.go", 88, 108)
      },
      {
        status: 400,
        when: "rest.notary.register.case.malformed",
        json: {
          error: "invalid_request",
          message: "the body is not a registration request"
        },
        source: restSource("notary", "internal/httpapi/registrations.go", 114, 125)
      },
      {
        status: 400,
        when: "rest.notary.register.case.trailing",
        json: {
          error: "invalid_request",
          message: "the body carries more than one registration request"
        },
        source: restSource("notary", "internal/httpapi/registrations.go", 127, 134)
      },
      {
        status: 400,
        when: "rest.notary.register.case.invalidField",
        json: {
          error: "invalid_request",
          message: "holder is not an address"
        },
        source: restSource("notary", "internal/httpapi/registrations.go", 136, 183)
      },
      {
        status: 403,
        when: "rest.notary.register.case.stale",
        json: {
          error: "registration_refused",
          message: "the request was issued at 2026-10-22T03:05:00Z; it must be at most 5m0s old"
        },
        source: restSource("notary", "internal/registering/registrar.go", 216, 228)
      },
      {
        status: 403,
        when: "rest.notary.register.case.wrongSigner",
        json: {
          error: "registration_refused",
          message:
            "the request is signed by 0x8a3e1f5c7b9d2e4a6c8f0b1d3e5a7c9f2b4d6e81, not by 0x657cb2e1d417fd966d350cdf7007bb5e30b04b02"
        },
        source: restSource("notary", "internal/registering/registrar.go", 235, 244)
      },
      {
        status: 403,
        when: "rest.notary.register.case.badSignature",
        json: {
          error: "registration_refused",
          message: "the signature is not a canonical secp256k1 signature"
        },
        source: restSource("notary", "internal/ethereum/recoverer.go", 22, 46)
      },
      {
        status: 404,
        when: "rest.notary.register.case.noAccount",
        json: {
          error: "no_account",
          message: "epoch 190 holds no account of this principal"
        },
        source: restSource("notary", "internal/registering/registrar.go", 158, 166)
      },
      {
        status: 409,
        when: "rest.notary.register.case.noneFinal",
        json: {
          error: "registration_not_open",
          message: "no epoch is final yet"
        },
        source: restSource("notary", "internal/registering/registrar.go", 116, 118)
      },
      {
        status: 409,
        when: "rest.notary.register.case.beforeSecrets",
        json: {
          error: "registration_not_open",
          message: "epoch 190 was built before account secrets; registration opens with the next final epoch"
        },
        source: restSource("notary", "internal/registering/registrar.go", 134, 142)
      },
      {
        status: 500,
        when: "rest.notary.register.case.failed",
        json: {
          error: "internal",
          message: "the registration could not be issued"
        },
        source: restSource("notary", "internal/httpapi/registrations.go", 196, 206)
      },
      {
        status: 503,
        when: "rest.notary.register.case.signerUnavailable",
        json: {
          error: "signer_unavailable",
          message: "the notary cannot sign a registration right now"
        },
        source: restSource("notary", "internal/httpapi/registrations.go", 211, 212)
      },
      {
        status: 503,
        when: "rest.notary.register.case.chainUnavailable",
        json: {
          error: "chain_unavailable",
          message: "the notary cannot reach the chain right now"
        },
        source: restSource("notary", "internal/httpapi/registrations.go", 213, 214)
      }
    ],
    source: restSource("notary", "internal/httpapi/registrations.go", 64, 109)
  },
  {
    id: "notary.orderEvidence",
    service: "notary",
    method: "GET",
    path: "/api/v1/proofs/evidence/orders/{order}",
    summary: "rest.notary.orderEvidence.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.notary.orderEvidence.who"
    },
    request: {
      fields: [
        {
          name: "order",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.notary.orderEvidence.field.order"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.notary.orderEvidence.case.proven",
        json: {
          proofs: [
            {
              format: "kinetix.notary.evidence.v1",
              scheme: 1,
              chainId: "84532",
              registry: "0x4444444444444444444444444444444444444444",
              batch: {
                stream: "order_lifecycle",
                number: "41",
                previousDigest: "0x5908dc69b97993048d5fee340c815b2877a4836f1e556db6eeb0af45efe66b56",
                root: "0xaf8bba4ebc0263053e87ec54848d8f12de030cce11885cf221b2cb4afbea789f",
                leafCount: "6",
                throughTransaction: "5530912",
                throughSequence: "0",
                closedAt: "1792627200",
                digest: "0xdbbaaab4210fb2fdb85f440b67b72174ac3e2dc311d116e7ecd2c9ac5feca03d"
              },
              record: {
                transaction: "5529874",
                sequence: "2",
                lifecycle: {
                  orderNumber: "ORD-20261021-3F9A1C7B",
                  kind: 1,
                  fromStatus: 1,
                  toStatus: 2,
                  returnNumber: "",
                  returnStatus: 0,
                  actorKind: 5,
                  actorPrincipalId: "",
                  buyerPrincipalId: "0f8b6c1e-5a2d-4c3b-9e7f-1a2b3c4d5e6f",
                  merchantPrincipalId: "7c2e9a41-3b6d-4f80-a1c5-92d4e6f7b8a0",
                  occurredAt: "2026-10-21T03:15:42.518204Z"
                }
              },
              salt: "0xdc772b7e61c76b7274d0af5c94674e9070f3f3bf642428c9e30c3ef85902c987",
              index: "4",
              siblings: [
                "0x3b881a00631c80206053fc2df544e89fb88964c18bda01ddfa401cb72021bd51",
                "0x6face6d88b23f22fb5582fb3f56942b53b7ed52b0162cd5b8176dba0362919b8",
                "0xa6cf51c28f192be7735c25dd98a067b33aeae208658062dd466762f66131ae05"
              ]
            },
            {
              format: "kinetix.notary.evidence.v1",
              scheme: 1,
              chainId: "84532",
              registry: "0x4444444444444444444444444444444444444444",
              batch: {
                stream: "delivery",
                number: "17",
                previousDigest: "0xb254fb19430e5a4a1264003482e76e836d5cd534e7f70041c97fb7bb24aeae34",
                root: "0xe5a69671c00bf8f4fb9630a46f11c51d5ae71f87f4cbee994ea10f152697ae10",
                leafCount: "3",
                throughTransaction: "88231",
                throughSequence: "0",
                closedAt: "1792627200",
                digest: "0xffd5f411ab71b784afc3cfdc0b7f194ebcba97f0ee29855d52beeadfcbdedaa9"
              },
              record: {
                transaction: "88214",
                sequence: "0",
                delivery: {
                  orderNumber: "ORD-20261021-3F9A1C7B",
                  driverPrincipalId: "b4d1f6a2-8e3c-47b9-9a05-6c1e2d3f4a5b",
                  photoSha256: "0x413d5d8fcc5414936fdfa8e6472c9644cde414bcd4d9d8d12025e91fcac7ce26",
                  signatureSha256: "0x9477dcf6d7db68f52292a4343ee322c2ccbe9f413fa783316ef22b125aa718bc",
                  deliveredAt: "2026-10-21T09:42:07.305118Z"
                }
              },
              salt: "0xbc8c9c399192ae4972f44fbd6cd1f62ca2080b2220c9ad064bb1481c0aa86b7f",
              index: "1",
              siblings: [
                "0x844f83f52fb66db345862d203ea1686de407d5c7b087ad4a46e2c4b3fde9a811",
                "0xecbc7512f65bb52b9d3b6e7f4496f983cfdb7645546c82aa5aa38712ace287ab"
              ]
            }
          ],
          pending: 1
        },
        source: restSource("notary", "internal/httpapi/evidence_proofs.go", 58, 71)
      },
      {
        status: 200,
        when: "rest.notary.orderEvidence.case.pending",
        json: {
          proofs: [],
          pending: 3
        },
        source: restSource("notary", "internal/evidencing/prover.go", 99, 123)
      },
      {
        status: 400,
        when: "rest.notary.orderEvidence.case.invalidReference",
        json: {
          error: "invalid_reference",
          message: "the order is not named"
        },
        source: restSource("notary", "internal/httpapi/evidence_proofs.go", 44, 49)
      },
      {
        status: 404,
        when: "rest.notary.orderEvidence.case.noEvidence",
        json: {
          error: "no_evidence",
          message: "the notary keeps no evidence this caller is a party to"
        },
        source: restSource("notary", "internal/evidencing/prover.go", 81, 89)
      },
      {
        status: 500,
        when: "rest.notary.orderEvidence.case.failed",
        json: {
          error: "disagreement",
          message: "the evidence proofs could not be produced"
        },
        source: restSource("notary", "internal/httpapi/evidence_proofs.go", 82, 92)
      }
    ],
    source: restSource("notary", "internal/httpapi/evidence_proofs.go", 36, 72)
  },
  {
    id: "notary.reviewEvidence",
    service: "notary",
    method: "GET",
    path: "/api/v1/proofs/evidence/reviews/{review}",
    summary: "rest.notary.reviewEvidence.summary",
    access: {
      token: "required",
      gatewayVerifies: true,
      who: "rest.notary.reviewEvidence.who"
    },
    request: {
      fields: [
        {
          name: "review",
          in: "path",
          type: "string",
          required: true,
          rule: "rest.notary.reviewEvidence.field.review"
        }
      ]
    },
    cases: [
      {
        status: 200,
        when: "rest.notary.reviewEvidence.case.proven",
        json: {
          proofs: [
            {
              format: "kinetix.notary.evidence.v1",
              scheme: 1,
              chainId: "84532",
              registry: "0x4444444444444444444444444444444444444444",
              batch: {
                stream: "review",
                number: "9",
                previousDigest: "0xe2ede9702a665e41faaf8787966de1d5b3a16017a9b92ce4d2f9d5a7b5345380",
                root: "0xd5fa3aecd4fdf8e6db0069c80f5dd3da87780954bf66e485869cd6ac9a8f3d8c",
                leafCount: "5",
                throughTransaction: "730455",
                throughSequence: "12",
                closedAt: "1792627200",
                digest: "0xbd8194b196292cf1201a2ebf686bcbf7055afad18036abd025bb915c98f40a00"
              },
              record: {
                transaction: "730448",
                sequence: "10",
                review: {
                  reviewId: "5e8a2c4f-1b7d-4e9a-8c3f-2d6b9a0e1f47",
                  kind: 1,
                  orderId: "ORD-20261021-3F9A1C7B",
                  subjectId: "1287",
                  authorPrincipalId: "0f8b6c1e-5a2d-4c3b-9e7f-1a2b3c4d5e6f",
                  merchantPrincipalId: "7c2e9a41-3b6d-4f80-a1c5-92d4e6f7b8a0",
                  rating: 5,
                  commentSha256: "0x4a10115ff27d492a7422b4af064149a0f0c03b60e11feca30b26b90fdde85e3c",
                  createdAt: "2026-10-21T12:03:55.420861Z"
                }
              },
              salt: "0xa8594c6e8a4c822bb977a3a909189ff96224ca85a9e0106ff3677001b8ec3d14",
              index: "2",
              siblings: [
                "0x3b904dd468365212013f547511222a26426c9232b107d2ab6be8a5ef8ec31877",
                "0xecc90f4ed9dce3d69fbd04b296cdb957dabc5605dcc020a9361156d0831d7a55",
                "0xca06ed759fea4bfdaadc3b0994558176cb8969791ad5783434d4ffaa0a9fa1d6"
              ]
            }
          ],
          pending: 0
        },
        source: restSource("notary", "internal/httpapi/evidence_proofs.go", 58, 71)
      },
      {
        status: 200,
        when: "rest.notary.reviewEvidence.case.pending",
        json: {
          proofs: [],
          pending: 1
        },
        source: restSource("notary", "internal/evidencing/prover.go", 99, 123)
      },
      {
        status: 400,
        when: "rest.notary.reviewEvidence.case.invalidReference",
        json: {
          error: "invalid_reference",
          message: "the review is not named"
        },
        source: restSource("notary", "internal/httpapi/evidence_proofs.go", 44, 49)
      },
      {
        status: 404,
        when: "rest.notary.reviewEvidence.case.noEvidence",
        json: {
          error: "no_evidence",
          message: "the notary keeps no evidence this caller is a party to"
        },
        source: restSource("notary", "internal/evidencing/prover.go", 81, 89)
      },
      {
        status: 500,
        when: "rest.notary.reviewEvidence.case.failed",
        json: {
          error: "disagreement",
          message: "the evidence proofs could not be produced"
        },
        source: restSource("notary", "internal/httpapi/evidence_proofs.go", 82, 92)
      }
    ],
    source: restSource("notary", "internal/httpapi/evidence_proofs.go", 36, 72)
  }
];
