export type SigningKeyHolder = {
  readonly access: string | null;
  readonly refresh: string | null;
  readonly signedIn: boolean;
};
