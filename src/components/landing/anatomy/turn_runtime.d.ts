type TurnAnchorResult = {
  readonly world: readonly [number, number, number];
  readonly screen: readonly [number, number];
  readonly direction?: readonly [number, number, number];
};

type TurnController = {
  readonly set: (values: Record<string, number>) => void;
  readonly get: () => Record<string, number>;
  readonly anchor: (groupName: string, localPoint: readonly [number, number, number], direction?: readonly [number, number, number]) => TurnAnchorResult;
};

type TurnMountOptions = {
  readonly follow?: ((values: Record<string, number>) => Record<string, number>) | null;
  readonly onHold?: () => void;
  readonly onFrame?: () => void;
};

type TurnApi = {
  readonly mount: (stage: HTMLElement, data: Record<string, unknown>, options?: TurnMountOptions) => TurnController;
  readonly cover: (controller: TurnController, layerNames: readonly string[]) => {
    readonly uCoverEdge: Float32Array;
    readonly uCoverCount: Float32Array;
  };
  readonly poseUniforms: (controller: TurnController, groupName: string, prefix?: string) => Record<string, number[]>;
};

declare const TURN: TurnApi;
declare const TURN_CSS: string;

export { TURN, TURN_CSS };
export type { TurnAnchorResult, TurnController, TurnMountOptions };
