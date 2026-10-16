import type { RawAnswer } from "./raw_answer.type";

export type VerifyFunction = (document: string, environment: Readonly<Record<string, string>>) => Promise<RawAnswer>;
