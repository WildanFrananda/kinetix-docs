import { services } from "./services";
import type { LogoName } from "./types/logo_name.type";
import type { StackEntry } from "./types/stack_entry.type";
import type { StackGroupId } from "./types/stack_group_id.type";
import type { StackLayer } from "./types/stack_layer.type";
import type { Tech } from "./types/tech.type";

function tech(name: string, version?: string, logo?: LogoName): Tech {
  return {
    name,
    ...(version === undefined ? {} : { version }),
    ...(logo === undefined ? {} : { logo })
  };
}

const postgres = tech("PostgreSQL", "16", "postgresql");
const github = "https://github.com/WildanFrananda";

function service(name: string, layers: readonly StackLayer[]): StackEntry {
  const found = services.find((candidate) => candidate.name === name);

  if (found === undefined) {
    throw new Error(`no service named "${name}"`);
  }

  return {
    name: found.name,
    summary: found.owns,
    repository: found.repository,
    layers
  };
}

const serviceEntries: readonly StackEntry[] = [
  service("identity", [
    { role: "stack.role.language", techs: [tech("TypeScript", "5.5.4", "typescript")] },
    { role: "stack.role.runtime", techs: [tech("Bun", "1", "bun")] },
    { role: "stack.role.framework", techs: [tech("NestJS", "11.2.1", "nestjs"), tech("Fastify", "5.12.1")] },
    { role: "stack.role.grpc", techs: [tech("@grpc/grpc-js", "1.14.4")] },
    { role: "stack.role.data", techs: [postgres, tech("TypeORM", "1.1.0")] },
    { role: "stack.role.tests", techs: [tech("Jest", "30.4.2")] }
  ]),
  service("catalog", [
    { role: "stack.role.language", techs: [tech("Python", "3.14", "python")] },
    { role: "stack.role.framework", techs: [tech("Django", "6.1", "django"), tech("Django REST framework", "3.18.0")] },
    { role: "stack.role.runtime", techs: [tech("Gunicorn", "23.0.0")] },
    { role: "stack.role.grpc", techs: [tech("grpcio", "1.83.0")] },
    { role: "stack.role.data", techs: [postgres, tech("psycopg", "3.3.4")] },
    { role: "stack.role.tests", techs: [tech("pytest", "8.4.2")] },
    { role: "stack.role.quality", techs: [tech("mypy", "1.18.2")] }
  ]),
  service("pricing", [
    { role: "stack.role.language", techs: [tech("Rust", "1.88", "rust")] },
    { role: "stack.role.framework", techs: [tech("Rocket", "0.5.1")] },
    { role: "stack.role.runtime", techs: [tech("Tokio", "1.53.1")] },
    { role: "stack.role.grpc", techs: [tech("Tonic", "0.11.0"), tech("prost", "0.12.6")] },
    { role: "stack.role.data", techs: [postgres, tech("Diesel", "2.2.12"), tech("diesel-async", "0.5.2")] },
    { role: "stack.role.tests", techs: [tech("cargo test")] }
  ]),
  service("order", [
    { role: "stack.role.language", techs: [tech("C#", undefined, "csharp")] },
    { role: "stack.role.runtime", techs: [tech(".NET", "10", "dotnetcore")] },
    { role: "stack.role.framework", techs: [tech("ASP.NET Core"), tech("Kestrel")] },
    { role: "stack.role.grpc", techs: [tech("Grpc.AspNetCore", "2.67.0")] },
    {
      role: "stack.role.data",
      techs: [
        postgres,
        tech("EF Core", "10.0.12"),
        tech("Npgsql", "10.0.3"),
        tech("Redis", "7.2", "redis"),
        tech("StackExchange.Redis", "2.8.24")
      ]
    },
    { role: "stack.role.tests", techs: [tech("xUnit", "2.9.3"), tech("Moq", "4.20.72")] }
  ]),
  service("payment", [
    { role: "stack.role.language", techs: [tech("Java", "21", "java")] },
    { role: "stack.role.framework", techs: [tech("Spring Boot", "4.1.1", "spring"), tech("Tomcat", "11.0.26")] },
    { role: "stack.role.grpc", techs: [tech("grpc-java", "1.83.1")] },
    { role: "stack.role.data", techs: [postgres, tech("Spring Data JPA"), tech("Liquibase")] },
    { role: "stack.role.tests", techs: [tech("JUnit Jupiter", "6.1.3"), tech("Mockito", "5.14.2")] },
    { role: "stack.role.tooling", techs: [tech("Gradle", "8.14.6")] }
  ]),
  service("warehouse", [
    { role: "stack.role.language", techs: [tech("Ruby", "4.0.6", "ruby")] },
    { role: "stack.role.framework", techs: [tech("Rails", "8.1.3.1", "rails")] },
    { role: "stack.role.runtime", techs: [tech("Puma", "8.0.2"), tech("Thruster", "0.1.23")] },
    { role: "stack.role.grpc", techs: [tech("grpc", "1.84.0")] },
    { role: "stack.role.data", techs: [postgres, tech("pg", "1.6.3"), tech("Solid Queue", "1.6.0")] },
    { role: "stack.role.quality", techs: [tech("Sorbet", "0.6.13421")] },
    { role: "stack.role.tests", techs: [tech("RSpec Rails", "7.1.1")] }
  ]),
  service("matching", [
    { role: "stack.role.language", techs: [tech("Elixir", "1.20.2", "elixir"), tech("Erlang/OTP", "29.0.3")] },
    { role: "stack.role.framework", techs: [tech("Phoenix", "1.8.12", "phoenix"), tech("Bandit", "1.12.5")] },
    { role: "stack.role.grpc", techs: [tech("grpc", "1.0.5")] },
    { role: "stack.role.data", techs: [postgres, tech("Ecto SQL", "3.14.0"), tech("Postgrex", "0.22.4")] },
    { role: "stack.role.tests", techs: [tech("ExUnit")] }
  ]),
  service("review", [
    { role: "stack.role.language", techs: [tech("PHP", "8.5", "php")] },
    { role: "stack.role.framework", techs: [tech("Laravel", "13.29.0", "laravel"), tech("Octane", "2.19.1")] },
    { role: "stack.role.runtime", techs: [tech("FrankenPHP")] },
    { role: "stack.role.grpc", techs: [tech("grpc/grpc", "1.82.0")] },
    { role: "stack.role.data", techs: [postgres, tech("Eloquent")] },
    { role: "stack.role.tests", techs: [tech("Pest", "4.7.8")] }
  ]),
  service("notification", [
    { role: "stack.role.language", techs: [tech("Scala", "3.3.4", "scala")] },
    { role: "stack.role.runtime", techs: [tech("JDK", "21", "java")] },
    {
      role: "stack.role.framework",
      techs: [tech("http4s Ember", "0.23.30"), tech("Cats Effect", "3.5.7"), tech("fs2", "3.11.0")]
    },
    { role: "stack.role.grpc", techs: [tech("grpc-java", "1.69.0"), tech("fs2-grpc", "2.7.21")] },
    { role: "stack.role.data", techs: [postgres, tech("Doobie", "1.0.0-RC6"), tech("Flyway", "11.8.2")] },
    { role: "stack.role.tests", techs: [tech("munit-cats-effect", "2.0.0")] },
    { role: "stack.role.tooling", techs: [tech("sbt", "1.10.7")] }
  ]),
  service("communication", [
    { role: "stack.role.language", techs: [tech("C++23", undefined, "cplusplus")] },
    { role: "stack.role.framework", techs: [tech("Drogon")] },
    { role: "stack.role.messaging", techs: [tech("mqtt_cpp", "13.2.3")] },
    { role: "stack.role.grpc", techs: [tech("gRPC C++")] },
    { role: "stack.role.data", techs: [tech("TinyORM", "0.38.1")] },
    { role: "stack.role.tests", techs: [tech("GoogleTest", "1.15.2")] },
    { role: "stack.role.tooling", techs: [tech("CMake", "3.25+"), tech("vcpkg")] }
  ]),
  service("search", [
    { role: "stack.role.language", techs: [tech("Go", "1.26.4", "go")] },
    { role: "stack.role.framework", techs: [tech("chi", "5.3.2")] },
    { role: "stack.role.grpc", techs: [tech("grpc-go", "1.84.0")] },
    {
      role: "stack.role.data",
      techs: [tech("Typesense", "30.2"), tech("typesense-go", "3.2.0"), postgres, tech("pgx", "5.11.0"), tech("sqlc")]
    },
    { role: "stack.role.tests", techs: [tech("testify", "1.12.1")] }
  ])
];

const edgeEntries: readonly StackEntry[] = [
  {
    name: "api-gateway",
    summary: "stack.edge.gateway.summary",
    repository: `${github}/kinetix-api-gateway`,
    layers: [
      { role: "stack.role.engine", techs: [tech("Kong Gateway", "3.9")] },
      { role: "stack.role.tooling", techs: [tech("Apple Pkl", "0.32.1")] }
    ]
  },
  {
    name: "contracts",
    summary: "stack.edge.contracts.summary",
    repository: `${github}/kinetix-contracts`,
    layers: [
      { role: "stack.role.language", techs: [tech("Protocol Buffers", "proto3")] },
      { role: "stack.role.tooling", techs: [tech("Buf", "v2 config"), tech("protoc plugins", "29.3")] },
      {
        role: "stack.role.generated",
        techs: [
          tech("TypeScript", undefined, "typescript"),
          tech("Python", undefined, "python"),
          tech("C#", undefined, "csharp"),
          tech("Java", undefined, "java"),
          tech("Ruby", undefined, "ruby"),
          tech("PHP", undefined, "php"),
          tech("Go", undefined, "go")
        ]
      }
    ]
  },
  {
    name: "courier-mobile",
    summary: "stack.edge.courier.summary",
    repository: `${github}/kinetix-courier-mobile`,
    layers: [
      { role: "stack.role.language", techs: [tech("Dart", "3.10+", "dart")] },
      { role: "stack.role.ui", techs: [tech("Flutter", "stable", "flutter")] },
      {
        role: "stack.role.framework",
        techs: [tech("provider", "6.1.5"), tech("get_it", "9.2.1"), tech("dio", "5.11.0"), tech("Hive", "2.2.3")]
      },
      { role: "stack.role.tests", techs: [tech("flutter_test"), tech("mocktail", "1.0.5")] }
    ]
  }
];

const platformEntries: readonly StackEntry[] = [
  {
    name: "data",
    summary: "stack.platform.data.summary",
    layers: [
      { role: "stack.role.data", techs: [postgres, tech("Redis", "7.2", "redis"), tech("Typesense", "30.2")] }
    ]
  },
  {
    name: "trust",
    summary: "stack.platform.trust.summary",
    layers: [
      { role: "stack.role.engine", techs: [tech("step-ca"), tech("SPIFFE"), tech("mTLS")] },
      { role: "stack.role.tooling", techs: [tech("SOPS", "3.13.3"), tech("age", "1.3.2")] }
    ]
  },
  {
    name: "observability",
    summary: "stack.platform.observability.summary",
    layers: [
      {
        role: "stack.role.engine",
        techs: [
          tech("Prometheus", "2.54.1", "prometheus"),
          tech("Loki", "3.1.1"),
          tech("Promtail", "3.1.1"),
          tech("Grafana", "11.2.0", "grafana")
        ]
      }
    ]
  }
];

const deliveryEntries: readonly StackEntry[] = [
  {
    name: "containers",
    summary: "stack.delivery.containers.summary",
    layers: [
      {
        role: "stack.role.engine",
        techs: [tech("Docker", undefined, "docker"), tech("Docker Compose", "5.5.1"), tech("Buildx", "0.37.1")]
      }
    ]
  },
  {
    name: "pipelines",
    summary: "stack.delivery.pipelines.summary",
    layers: [
      {
        role: "stack.role.engine",
        techs: [tech("GitHub Actions", undefined, "githubactions"), tech("GitLab CI", undefined, "gitlab")]
      },
      { role: "stack.role.quality", techs: [tech("gitleaks", "8.30.1"), tech("Trivy")] }
    ]
  },
  {
    name: "infrastructure",
    summary: "stack.delivery.infrastructure.summary",
    layers: [
      { role: "stack.role.engine", techs: [tech("OpenTofu", "1.12.6")] },
      { role: "stack.role.language", techs: [tech("D", "LDC 1.43.0")] }
    ]
  }
];

const plannedEntries: readonly StackEntry[] = [
  {
    name: "customer-android",
    summary: "stack.planned.android.summary",
    layers: [
      { role: "stack.role.language", techs: [tech("Kotlin", undefined, "kotlin")] },
      { role: "stack.role.ui", techs: [tech("Jetpack Compose", undefined, "jetpackcompose")] }
    ]
  },
  {
    name: "customer-ios",
    summary: "stack.planned.ios.summary",
    layers: [
      { role: "stack.role.language", techs: [tech("Swift", undefined, "swift")] },
      { role: "stack.role.ui", techs: [tech("SwiftUI")] }
    ]
  },
  {
    name: "backoffice",
    summary: "stack.planned.backoffice.summary",
    layers: [
      { role: "stack.role.language", techs: [tech("TypeScript", undefined, "typescript")] },
      { role: "stack.role.framework", techs: [tech("TanStack Start"), tech("React", undefined, "react")] }
    ]
  },
  {
    name: "recommendation",
    summary: "stack.planned.recommendation.summary",
    layers: [{ role: "stack.role.language", techs: [tech("R", undefined, "r")] }]
  }
];

const docsEntries: readonly StackEntry[] = [
  {
    name: "kinetix-docs",
    summary: "stack.docs.summary",
    repository: `${github}/kinetix-docs`,
    layers: [
      { role: "stack.role.framework", techs: [tech("Astro", "7.3.4", "astro"), tech("Starlight", "0.42.3")] },
      { role: "stack.role.ui", techs: [tech("Svelte", "5.57.1", "svelte")] },
      { role: "stack.role.runtime", techs: [tech("Bun", "1.3.14", "bun"), tech("TypeScript", "6.0.3", "typescript")] },
      { role: "stack.role.hosting", techs: [tech("Vercel", undefined, "vercel")] }
    ]
  }
];

export const stackGroups: Readonly<Record<StackGroupId, readonly StackEntry[]>> = {
  services: serviceEntries,
  edge: edgeEntries,
  platform: platformEntries,
  delivery: deliveryEntries,
  planned: plannedEntries,
  docs: docsEntries
};
