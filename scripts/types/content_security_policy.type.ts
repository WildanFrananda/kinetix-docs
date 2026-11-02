export type ContentSecurityPolicy = {
  readonly directives: readonly string[];
  readonly scriptSources: readonly string[];
  readonly styleElementSources: readonly string[];
  readonly styleAttributeSources: readonly string[];
};
