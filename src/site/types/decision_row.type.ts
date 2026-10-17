export type DecisionRow = {
  readonly number: string;
  readonly title: string;
  readonly href: string;
  readonly status: "accepted" | "superseded";
  readonly decided: string;
};
