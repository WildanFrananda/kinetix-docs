import { readAsset } from "./read_asset";
import type { GoRuntime } from "./types/go_runtime.type";
import type { LoaderDependencies } from "./types/loader_dependencies.type";
import type { VerifierSources } from "./types/verifier_sources.type";
import type { VerifyFunction } from "./types/verify_function.type";

type VerifierGlobals = {
  Go?: new () => GoRuntime;
  kinetixNotaryVerify?: VerifyFunction;
};

export async function loadVerifier(sources: VerifierSources, dependencies: LoaderDependencies): Promise<VerifyFunction> {
  const globals = globalThis as unknown as VerifierGlobals;

  if (globals.kinetixNotaryVerify !== undefined) {
    return globals.kinetixNotaryVerify;
  }

  const runtime = await readAsset(sources.runtime, { fetch: dependencies.fetch, progress: () => {} });
  const module = await readAsset(sources.module, dependencies);

  new Function(new TextDecoder().decode(runtime))();

  if (globals.Go === undefined) {
    throw new Error("wasm_exec.js did not define the Go runtime");
  }

  const go = new globals.Go();
  const { instance } = await WebAssembly.instantiate(module, go.importObject);

  void go.run(instance);

  if (globals.kinetixNotaryVerify === undefined) {
    throw new Error("notary-verify.wasm started but did not offer kinetixNotaryVerify");
  }

  return globals.kinetixNotaryVerify;
}
