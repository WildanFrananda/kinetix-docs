import type { RestField } from "./rest_field.type";
import type { RestMessage } from "./rest_message.type";

export type RestRequest = RestMessage & {
  readonly fields: readonly RestField[];
};
