import type { BentoFigureId } from "./bento_figure_id.type";

export type BentoFigureItem = {
  readonly id: BentoFigureId;
  readonly width: number;
  readonly height: number;
  readonly label: string;
  readonly svg: string;
};
