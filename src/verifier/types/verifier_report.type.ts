export type VerifierReport = {
  readonly verdict: string;
  readonly chainId?: string;
  readonly ledger?: string;
  readonly epoch?: string;
  readonly total?: string;
  readonly asOf?: string;
  readonly anchoredAt?: string;
  readonly holder?: string;
  readonly kind?: string;
  readonly amount?: string;
  readonly court?: string;
  readonly statement?: string;
  readonly faults?: string;
  readonly provable?: string;
  readonly reason?: string;
};
