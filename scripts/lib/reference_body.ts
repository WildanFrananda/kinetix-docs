export function referenceBody(blocks: readonly string[]): readonly string[] {
  return ['<div class="grpc-reference">', ...blocks, "</div>"];
}
