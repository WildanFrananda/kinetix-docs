import { describe, expect, test } from "bun:test";
import { BENTO_FIGURES_BUNDLE } from "../src/components/landing/anatomy/bento_figures_bundle";
import type { BentoFigureId } from "../src/site/types/bento_figure_id.type";

const EXPECTED_IDS: readonly BentoFigureId[] = [
  "contracts",
  "concurrency",
  "boundary",
  "identity",
  "verifier",
  "learn"
];

describe("bento anatomy isometric bundle", () => {
  test("contains all six engineering pillar plates with valid viewBox geometry", () => {
    expect(Object.keys(BENTO_FIGURES_BUNDLE).sort()).toEqual([...EXPECTED_IDS].sort());

    for (const id of EXPECTED_IDS) {
      const fig = BENTO_FIGURES_BUNDLE[id];
      expect(fig.id).toBe(id);
      expect(fig.width).toBeGreaterThanOrEqual(300);
      expect(fig.height).toBe(185);
      expect(fig.label.length).toBeGreaterThan(8);
      expect(fig.svg).toContain(`<svg `);
      expect(fig.svg).toContain(`viewBox="0 0 ${fig.width} ${fig.height}"`);
      expect(fig.svg).toContain(`data-mat="`);
      expect(fig.svg).toContain(`iso-solid`);
      expect(fig.svg).toContain(`iso-halo`);
      expect(fig.svg).not.toContain("<script");
      expect(fig.svg).not.toContain("style=");
    }
  });

  test("preserves wide and narrow aspect dimensions across span-7 and span-5 plates", () => {
    expect(BENTO_FIGURES_BUNDLE.contracts.width).toBe(380);
    expect(BENTO_FIGURES_BUNDLE.identity.width).toBe(380);
    expect(BENTO_FIGURES_BUNDLE.verifier.width).toBe(380);
    expect(BENTO_FIGURES_BUNDLE.concurrency.width).toBe(300);
    expect(BENTO_FIGURES_BUNDLE.boundary.width).toBe(300);
    expect(BENTO_FIGURES_BUNDLE.learn.width).toBe(300);
  });
});
