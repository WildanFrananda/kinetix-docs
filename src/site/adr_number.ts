export function adrNumber(number: number): string {
  return String(number).padStart(4, "0");
}
