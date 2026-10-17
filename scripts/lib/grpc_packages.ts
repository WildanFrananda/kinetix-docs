import type { ContractFile } from "../types/contract_file.type";
import type { GrpcPackage } from "../types/grpc_package.type";
import { grpcSlug } from "./grpc_slug";

export function grpcPackages(files: readonly ContractFile[]): readonly GrpcPackage[] {
  const grouped = Map.groupBy(files, (file) => file.descriptor.proto.package);

  return [...grouped]
    .map(([name, members]) => ({
      name,
      slug: grpcSlug(name),
      files: members.toSorted((left, right) => left.path.localeCompare(right.path))
    }))
    .toSorted((left, right) => left.name.localeCompare(right.name));
}
