import type { JsonValue } from "./json_value.type";

export type RestSocketFrame = {
  readonly event: string;
  readonly [key: string]: JsonValue;
};
