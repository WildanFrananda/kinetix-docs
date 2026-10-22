export function codeSpans(text: string): readonly string[] {
  const parts = text.split("`");

  if (parts.length % 2 === 0) {
    throw new Error(`unbalanced backticks in "${text}"`);
  }

  return parts;
}
