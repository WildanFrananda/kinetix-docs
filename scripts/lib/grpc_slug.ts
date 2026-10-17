export function grpcSlug(packageName: string): string {
  return packageName.replaceAll(".", "-");
}
