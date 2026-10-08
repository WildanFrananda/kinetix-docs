import type { Tech } from "./tech.type";

export type TechLogoProps = {
  readonly tech: Tech;
  readonly size?: "sm" | "md" | "lg";
  readonly showName?: boolean;
  readonly fallback?: "monogram" | "none";
};
