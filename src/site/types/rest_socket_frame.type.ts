import type { JsonValue } from "./json_value.type";

export type RestSocketFrame = readonly [string | null, string | null, string, string, JsonValue];
