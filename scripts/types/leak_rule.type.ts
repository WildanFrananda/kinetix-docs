export type LeakRule = {
  readonly name: string;
  readonly pattern: RegExp;
  readonly permits: (match: string, line: string) => boolean;
};
