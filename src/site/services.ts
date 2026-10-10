import type { Service } from "./types/service.type";

const github = "https://github.com/WildanFrananda";

export const services: readonly Service[] = [
  {
    name: "identity",
    repository: `${github}/kinetix-identity-service`,
    owns: "service.identity.owns",
    language: { name: "TypeScript", logo: "typescript" },
    framework: { name: "NestJS", logo: "nestjs", version: "11.2.1" }
  },
  {
    name: "catalog",
    repository: `${github}/kinetix-catalog-service`,
    owns: "service.catalog.owns",
    language: { name: "Python", logo: "python" },
    framework: { name: "Django", logo: "django", version: "6.1" }
  },
  {
    name: "pricing",
    repository: `${github}/kinetix-pricing-service`,
    owns: "service.pricing.owns",
    language: { name: "Rust", logo: "rust" },
    framework: { name: "Rocket", version: "0.5.1" }
  },
  {
    name: "order",
    repository: `${github}/kinetix-order-service`,
    owns: "service.order.owns",
    language: { name: "C#", logo: "csharp" },
    framework: { name: "ASP.NET Core", logo: "dotnetcore", version: ".NET 10" }
  },
  {
    name: "payment",
    repository: `${github}/kinetix-payment-service`,
    owns: "service.payment.owns",
    language: { name: "Java", logo: "java" },
    framework: { name: "Spring Boot", logo: "spring", version: "4.1.1" }
  },
  {
    name: "warehouse",
    repository: `${github}/kinetix-warehouse-service`,
    owns: "service.warehouse.owns",
    language: { name: "Ruby", logo: "ruby" },
    framework: { name: "Rails", logo: "rails", version: "8.1.3.1" }
  },
  {
    name: "matching",
    repository: `${github}/kinetix-matching-service`,
    owns: "service.matching.owns",
    language: { name: "Elixir", logo: "elixir" },
    framework: { name: "Phoenix", logo: "phoenix", version: "1.8.12" }
  },
  {
    name: "review",
    repository: `${github}/kinetix-review-service`,
    owns: "service.review.owns",
    language: { name: "PHP", logo: "php" },
    framework: { name: "Laravel", logo: "laravel", version: "13.29.0" }
  },
  {
    name: "notification",
    repository: `${github}/kinetix-notification-service`,
    owns: "service.notification.owns",
    language: { name: "Scala", logo: "scala" },
    framework: { name: "http4s", version: "0.23.30" }
  },
  {
    name: "communication",
    repository: `${github}/kinetix-communication-service`,
    owns: "service.communication.owns",
    language: { name: "C++", logo: "cplusplus" },
    framework: { name: "Drogon" }
  },
  {
    name: "search",
    repository: `${github}/kinetix-search-service`,
    owns: "service.search.owns",
    language: { name: "Go", logo: "go" },
    framework: { name: "chi", version: "5.3.2" }
  }
];
