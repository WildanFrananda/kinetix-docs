import type { JsonValue } from "./json_value.type";

export type RestMessage = {
  readonly headers?: readonly string[];
  readonly contentType?: string;
  readonly json?: JsonValue;
  readonly raw?: string;
};
