import type { RestWebApp } from "./rest_web_app.type";

export type RestEndpointProps = {
  readonly id: string;
  readonly via?: RestWebApp;
};
