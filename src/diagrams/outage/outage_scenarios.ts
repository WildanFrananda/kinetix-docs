import { repositorySource } from "../engine/repository_source";
import type { NonEmpty } from "../types/non_empty.type";
import type { OutageState } from "../types/outage_state.type";
import type { Scenario } from "../types/scenario.type";

const order = "kinetix-order-service";
const catalog = "kinetix-catalog-service";
const orderNow = "82834065c34981f1c69a88b3d3317d20396358d9";
const orderBefore = "58db01149f910bb48eb82d664fe72202caefae5d";
const catalogNow = "776bc6acb74c48b45fa9b30a98a2a12609b104ab";
const catalogBefore = "4875c7b19b7ce3bf5f9bb8dfa77f933479bd7b77";

const unavailable = "503 Service Unavailable";

const priceActors = { order: "outage.actor.order" } as const;
const catalogActors = { catalog: "outage.actor.catalog" } as const;

function idle(request: string, caller: string, dependency: string, call: string): OutageState {
  return { request, caller, dependency, call, link: null, era: null, answer: [], handling: [], reply: null, verdict: null };
}

const checkout = idle("POST /api/v1/orders/checkout", "order", "pricing", "CalculatePrice");

const price: Scenario<OutageState> = {
  id: "price",
  title: "outage.price.title",
  introduction: "outage.price.introduction",
  outcome: "outage.price.outcome",
  actors: priceActors,
  initial: checkout,
  steps: [
    {
      actor: "order",
      statement: "pricing.CalculatePrice",
      narration: "outage.price.step1",
      source: repositorySource(order, orderNow, "Infrastructure/Grpc/PricingGrpcClient.cs", 83, 97),
      state: {
        ...checkout,
        link: "answered",
        era: "current",
        answer: ["final_total { amount_minor: 16500000, currency: \"IDR\" }"],
        handling: [
          "var response = await _client.CalculatePriceAsync(request);",
          "",
          "return new PriceCalculationResult(",
          "    FromMoney(response.Subtotal),",
          "    …",
          "    FromMoney(response.FinalTotal),",
          "    …",
          ");"
        ],
        reply: { status: "201 Created", body: ["\"finalTotal\": 165000"] },
        verdict: "true"
      }
    },
    {
      actor: "order",
      statement: "pricing.CalculatePrice",
      narration: "outage.price.step2",
      source: repositorySource(order, orderBefore, "Application/Services/PricingGrpcClient.cs", 55, 65),
      state: {
        ...checkout,
        link: "unreachable",
        era: "before",
        answer: ["UNAVAILABLE"],
        handling: [
          "} catch (Exception ex) {",
          "    _logger.LogError(",
          "        ex, \"pricing did not answer; this order is priced from the cart alone, so any \"",
          "          + \"voucher or discount the customer expected is NOT applied\");",
          "",
          "    var finalFee = Math.Max(0m, baseShippingFee);",
          "",
          "    return new PriceCalculationResult(",
          "        subtotal, 0m, baseShippingFee, 0m, finalFee, subtotal + finalFee, []",
          "    );",
          "}"
        ],
        reply: { status: "201 Created", body: ["\"finalTotal\": 215000"] },
        verdict: "false"
      }
    },
    {
      actor: "order",
      statement: "pricing.CalculatePrice",
      narration: "outage.price.step3",
      source: repositorySource(order, orderNow, "Infrastructure/Grpc/PricingGrpcClient.cs", 98, 105),
      state: {
        ...checkout,
        link: "unreachable",
        era: "after",
        answer: ["UNAVAILABLE"],
        handling: [
          "} catch (Exception ex) {",
          "    _logger.LogError(",
          "        ex, \"pricing did not answer, so this checkout is refused rather than priced at \"",
          "          + \"list; any voucher, discount or flash sale the customer expected cannot be \"",
          "          + \"verified from here\");",
          "",
          "    throw new PricingUnavailableException(ex);",
          "}"
        ],
        reply: {
          status: unavailable,
          body: [
            "\"error\": \"PRICING_UNAVAILABLE\"",
            "\"message\": \"prices cannot be confirmed right now, so this order was not placed. Nothing has been charged or reserved — please try again shortly.\""
          ]
        },
        verdict: "honest"
      }
    }
  ]
};

const listing = idle("GET /api/v1/products", "catalog", "warehouse", "CheckBinStockBatch");

const stock: Scenario<OutageState> = {
  id: "stock",
  title: "outage.stock.title",
  introduction: "outage.stock.introduction",
  outcome: "outage.stock.outcome",
  actors: catalogActors,
  initial: listing,
  steps: [
    {
      actor: "catalog",
      statement: "warehouse.CheckBinStockBatch",
      narration: "outage.stock.step1",
      source: repositorySource(catalog, catalogNow, "core/application/services/product_service.py", 202, 208),
      state: {
        ...listing,
        link: "answered",
        era: "current",
        answer: ["found: true", "available_stock: 0"],
        handling: [
          "def _status_of(stock: StockInfo) -> StockStatus:",
          "    \"\"\"Three answers, not two: a missing quantity is not a quantity of zero.\"\"\"",
          "    quantity = stock.available_quantity",
          "    if quantity is None:",
          "        return StockStatus.UNKNOWN",
          "",
          "    return StockStatus.IN_STOCK if quantity > 0 else StockStatus.OUT_OF_STOCK"
        ],
        reply: {
          status: "200 OK",
          body: ["\"available_stock\": 0", "\"is_in_stock\": false", "\"stock_status\": \"out_of_stock\""]
        },
        verdict: "true"
      }
    },
    {
      actor: "catalog",
      statement: "warehouse.CheckBinStock",
      narration: "outage.stock.step2",
      source: repositorySource(catalog, catalogBefore, "core/infrastructure/grpc/bin_stock_client.py", 34, 36),
      state: {
        ...listing,
        call: "CheckBinStock",
        link: "unreachable",
        era: "before",
        answer: ["UNAVAILABLE"],
        handling: [
          "except (grpc.RpcError, CircuitOpenError) as error:",
          "    logger.warning(\"warehouse did not answer for %s (%s); stock reported as none\", sku, error)",
          "    return _unknown_stock(sku)",
          "",
          "def _unknown_stock(sku: str) -> StockInfo:",
          "    \"\"\"What this service knows about a SKU warehouse cannot account for: nothing.\"\"\"",
          "    return StockInfo(sku=sku, bin_location=\"\", available_quantity=0, reserved_quantity=0)"
        ],
        reply: { status: "200 OK", body: ["\"available_stock\": 0", "\"is_in_stock\": false"] },
        verdict: "false"
      }
    },
    {
      actor: "catalog",
      statement: "warehouse.CheckBinStockBatch",
      narration: "outage.stock.step3",
      source: repositorySource(catalog, catalogNow, "core/infrastructure/grpc/bin_stock_client.py", 91, 97),
      state: {
        ...listing,
        link: "unreachable",
        era: "after",
        answer: ["UNAVAILABLE"],
        handling: [
          "except grpc.RpcError as rpc_error:",
          "    logger.warning(",
          "        \"warehouse did not answer for %d skus (%s); stock reported as unknown\",",
          "        len(wanted),",
          "        rpc_error.details(),",
          "    )",
          "    return {sku: StockInfo.unknown(sku) for sku in wanted}"
        ],
        reply: {
          status: "200 OK",
          body: ["\"available_stock\": null", "\"is_in_stock\": null", "\"stock_status\": \"unknown\""]
        },
        verdict: "honest"
      }
    }
  ]
};

const create = idle("POST /api/v1/products/create/", "catalog", "identity", "GetMerchantInfo");

const merchant: Scenario<OutageState> = {
  id: "merchant",
  title: "outage.merchant.title",
  introduction: "outage.merchant.introduction",
  outcome: "outage.merchant.outcome",
  actors: catalogActors,
  initial: create,
  steps: [
    {
      actor: "catalog",
      statement: "identity.GetMerchantInfo",
      narration: "outage.merchant.step1",
      source: repositorySource(catalog, catalogNow, "core/application/services/product_service.py", 127, 131),
      state: {
        ...create,
        link: "answered",
        era: "current",
        answer: ["found: true", "status: MERCHANT_STATUS_SUSPENDED", "may_sell: false"],
        handling: [
          "if not info.get(\"may_sell\"):",
          "    raise PermissionError(",
          "        f\"identity does not permit this merchant to trade (standing: \"",
          "        f\"{info.get('status', 'unknown')})\"",
          "    )"
        ],
        reply: {
          status: "403 Forbidden",
          body: ["\"error\": \"identity does not permit this merchant to trade (standing: suspended)\""]
        },
        verdict: "true"
      }
    },
    {
      actor: "catalog",
      statement: "identity.GetMerchantInfo",
      narration: "outage.merchant.step2",
      source: repositorySource(catalog, catalogBefore, "core/infrastructure/grpc/identity_client.py", 53, 59),
      state: {
        ...create,
        link: "unreachable",
        era: "before",
        answer: ["UNAVAILABLE"],
        handling: [
          "except (grpc.RpcError, CircuitOpenError) as error:",
          "    logger.error(",
          "        \"identity did not answer for merchant %s (%s); treating the merchant as unverified\",",
          "        merchant_principal_id,",
          "        error,",
          "    )",
          "    return None"
        ],
        reply: { status: "403 Forbidden", body: ["\"error\": \"Merchant account is not verified/active\""] },
        verdict: "false"
      }
    },
    {
      actor: "catalog",
      statement: "identity.GetMerchantInfo",
      narration: "outage.merchant.step3",
      source: repositorySource(catalog, catalogNow, "core/infrastructure/grpc/identity_client.py", 65, 73),
      state: {
        ...create,
        link: "unreachable",
        era: "after",
        answer: ["UNAVAILABLE"],
        handling: [
          "except grpc.RpcError as rpc_error:",
          "    logger.error(",
          "        \"identity did not answer about merchant %s; the request is refused as unknown, \"",
          "        \"not as unverified\",",
          "        merchant_principal_id,",
          "    )",
          "    raise IdentityUnavailableError(",
          "        merchant_principal_id, f\"gRPC GetMerchantInfo failed: {rpc_error.details()}\"",
          "    ) from rpc_error"
        ],
        reply: {
          status: `${unavailable} · Retry-After: 15`,
          body: [
            "\"error\": \"IDENTITY_UNAVAILABLE\"",
            "\"message\": \"we could not check this merchant account right now, so the request was not applied. Nothing was created, changed or deleted.\""
          ]
        },
        verdict: "honest"
      }
    }
  ]
};

const authenticated = idle("POST /api/v1/products/create/  Authorization: Bearer …", "catalog", "identity", "JWKS");
const authentication = "core/infrastructure/security/identity_token_authentication.py";

const token: Scenario<OutageState> = {
  id: "token",
  title: "outage.token.title",
  introduction: "outage.token.introduction",
  outcome: "outage.token.outcome",
  actors: catalogActors,
  initial: authenticated,
  steps: [
    {
      actor: "catalog",
      statement: "identity JWKS",
      narration: "outage.token.step1",
      source: repositorySource(catalog, catalogNow, authentication, 34, 37),
      state: {
        ...authenticated,
        link: "answered",
        era: "current",
        answer: ["{\"keys\": [ … ]}", "Unable to find a signing key that matches: \"…\""],
        handling: [
          "except PyJWKClientError as jwks_error:",
          "    if KID_MISMATCH in str(jwks_error):",
          "        logger.warning(\"token verification failed: %s\", jwks_error)",
          "        raise AuthenticationFailed(\"Invalid token\") from jwks_error"
        ],
        reply: { status: "401 Unauthorized", body: ["\"detail\": \"Invalid token\""] },
        verdict: "true"
      }
    },
    {
      actor: "catalog",
      statement: "identity JWKS",
      narration: "outage.token.step2",
      source: repositorySource(catalog, catalogBefore, authentication, 24, 28),
      state: {
        ...authenticated,
        link: "unreachable",
        era: "before",
        answer: ["PyJWKClientConnectionError"],
        handling: [
          "try:",
          "    claims = TokenVerifier.shared().verify_access(parts[1])",
          "except Exception as cause:",
          "    logger.warning(\"token verification failed: %s\", cause)",
          "    raise AuthenticationFailed(\"Invalid token\")"
        ],
        reply: { status: "401 Unauthorized", body: ["\"detail\": \"Invalid token\""] },
        verdict: "false"
      }
    },
    {
      actor: "catalog",
      statement: "identity JWKS",
      narration: "outage.token.step3",
      source: repositorySource(catalog, catalogNow, authentication, 31, 33),
      state: {
        ...authenticated,
        link: "unreachable",
        era: "after",
        answer: ["PyJWKClientConnectionError"],
        handling: [
          "except PyJWKClientConnectionError as unreachable:",
          "    logger.error(\"identity's JWKS endpoint did not answer: %s\", unreachable)",
          "    raise IdentityKeysUnavailable() from unreachable"
        ],
        reply: {
          status: unavailable,
          body: [
            "\"detail\": \"we could not verify this token right now because identity did not answer. The token was not rejected.\""
          ]
        },
        verdict: "honest"
      }
    }
  ]
};

export const outageScenarios: NonEmpty<Scenario<OutageState>> = [price, stock, merchant, token];
