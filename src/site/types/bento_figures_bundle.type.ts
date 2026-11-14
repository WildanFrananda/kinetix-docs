import type { BentoFigureItem } from "./bento_figure_item.type";

export type BentoFiguresBundle = {
  readonly contracts: BentoFigureItem;
  readonly concurrency: BentoFigureItem;
  readonly boundary: BentoFigureItem;
  readonly identity: BentoFigureItem;
  readonly verifier: BentoFigureItem;
  readonly learn: BentoFigureItem;
};
