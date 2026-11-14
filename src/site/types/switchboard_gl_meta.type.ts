import type { SwitchboardGlCamera } from "./switchboard_gl_camera.type";

type SwitchboardGlMeta = {
  readonly width: number;
  readonly height: number;
  readonly camera: SwitchboardGlCamera;
  readonly plateZ: number;
  readonly dialRadius: number;
  readonly reticle: readonly [number, number, number];
  readonly ports: readonly (readonly [number, number, number])[];
  readonly portsScreen: readonly (readonly [number, number])[];
  readonly vaultLampScreen: readonly [number, number];
  readonly gaugeNeedlePivot: readonly [number, number];
};

export type { SwitchboardGlMeta };
