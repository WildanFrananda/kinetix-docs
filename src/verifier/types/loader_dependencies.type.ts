export type LoaderDependencies = {
  readonly fetch: typeof globalThis.fetch;
  readonly progress: (received: number, total: number) => void;
};
