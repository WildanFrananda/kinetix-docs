import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { architectureNodes } from "../diagrams/architecture/architecture_nodes";
import { catalogueFor } from "../diagrams/engine/catalogue_for";
import type { Locale } from "../diagrams/types/locale.type";
import { contractsRelease } from "./contracts_release";
import { logos } from "./logos";
import { notaryVerifier } from "./notary_verifier";
import { restEndpoints } from "./rest/rest_endpoints";
import { restSockets } from "./rest/rest_sockets";
import { services } from "./services";
import type { HeroCommandItem } from "./types/hero_command_item.type";
import type { HeroCommandLabels } from "./types/hero_command_labels.type";
import type { HeroPulseLabels } from "./types/hero_pulse_labels.type";
import type { HeroPulseNode } from "./types/hero_pulse_node.type";
import type { LandingServiceItem } from "./types/landing_service_item.type";
import type { LandingStats } from "./types/landing_stats.type";
import type { ServiceCategoryId } from "./types/service_category_id.type";
import type { ServiceCategoryTab } from "./types/service_category_tab.type";
import type { ServiceExplorerLabels } from "./types/service_explorer_labels.type";

type DomainCategory = Exclude<ServiceCategoryId, "all">;

function resolveServiceDocsDir(): string {
  const fromModule = fileURLToPath(new URL("../content/docs/services/", import.meta.url));

  if (existsSync(fromModule)) {
    return fromModule;
  }

  return resolve(process.cwd(), "src/content/docs/services");
}

const serviceDocsDir = resolveServiceDocsDir();

const serviceCategories: Readonly<Record<string, DomainCategory>> = {
  catalog: "commerce",
  pricing: "commerce",
  order: "commerce",
  payment: "commerce",
  review: "commerce",
  search: "commerce",
  warehouse: "fulfilment",
  matching: "fulfilment",
  notification: "fulfilment",
  communication: "fulfilment",
  identity: "trust",
  notary: "trust",
  seal: "trust",
  edge: "platform"
};

const categoryOrder: readonly ServiceCategoryId[] = [
  "all",
  "commerce",
  "fulfilment",
  "trust",
  "platform"
];

function localePath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (locale === "en") {
    return normalized;
  }

  return `/id${normalized}`;
}

function serviceDocHref(locale: Locale, name: string): string | undefined {
  const path = join(serviceDocsDir, `${name}.mdx`);

  if (!existsSync(path)) {
    return undefined;
  }

  return localePath(locale, `/services/${name}/`);
}

function categoryOf(name: string): DomainCategory {
  const category = serviceCategories[name];

  if (category === undefined) {
    throw new Error(`no landing category mapped for service "${name}"`);
  }

  return category;
}

function landingServices(locale: Locale): readonly LandingServiceItem[] {
  const catalogue = catalogueFor(locale);

  return services.map((service) => {
    const category = categoryOf(service.name);
    const languageLogoUrl = service.language.logo === undefined ? undefined : logos[service.language.logo];
    const frameworkLogoUrl = service.framework.logo === undefined ? undefined : logos[service.framework.logo];

    return {
      name: service.name,
      category,
      categoryLabel: catalogue[`landing.services.cat.${category}`],
      owns: catalogue[service.owns],
      languageName: service.language.name,
      languageLogoUrl,
      frameworkName: service.framework.name,
      frameworkLogoUrl,
      frameworkVersion: service.framework.version,
      repository: service.repository,
      docHref: serviceDocHref(locale, service.name)
    };
  });
}

function serviceCategoryTabs(
  locale: Locale,
  items: readonly LandingServiceItem[]
): readonly ServiceCategoryTab[] {
  const catalogue = catalogueFor(locale);

  return categoryOrder.map((id) => ({
    id,
    label: catalogue[`landing.services.cat.${id}`],
    count: id === "all" ? items.length : items.filter((item) => item.category === id).length
  }));
}

function serviceExplorerLabels(locale: Locale): ServiceExplorerLabels {
  const catalogue = catalogueFor(locale);

  return {
    filterLabel: catalogue["landing.services.filterLabel"],
    docsLink: catalogue["landing.services.docsLink"],
    sourceLink: catalogue["landing.services.sourceLink"]
  };
}

function heroCommands(locale: Locale): readonly HeroCommandItem[] {
  const catalogue = catalogueFor(locale);

  return [
    {
      id: "contracts",
      label: catalogue["landing.hero.cmd.contracts.label"],
      command: `bun add kinetix-contracts@${contractsRelease.version}`,
      note: catalogue["landing.hero.cmd.contracts.note"]
    },
    {
      id: "verifier",
      label: catalogue["landing.hero.cmd.verifier.label"],
      command: `docker run --rm ${notaryVerifier.cliImage}:${notaryVerifier.release} verify proof.json`,
      note: catalogue["landing.hero.cmd.verifier.note"]
    },
    {
      id: "docs",
      label: catalogue["landing.hero.cmd.docs.label"],
      command: "git clone https://github.com/WildanFrananda/kinetix-docs",
      note: catalogue["landing.hero.cmd.docs.note"]
    }
  ];
}

function heroCommandLabels(locale: Locale): HeroCommandLabels {
  const catalogue = catalogueFor(locale);

  return {
    regionLabel: catalogue["landing.hero.cmd.region"],
    copyLabel: catalogue["landing.hero.cmd.copy"],
    copiedLabel: catalogue["landing.hero.cmd.copied"]
  };
}

function heroPulseNodes(locale: Locale): readonly HeroPulseNode[] {
  const catalogue = catalogueFor(locale);

  return [
    {
      id: "clients",
      label: catalogue["landing.pulse.node.clients.label"],
      sublabel: catalogue["landing.pulse.node.clients.sub"],
      detail: catalogue["landing.pulse.node.clients.detail"],
      href: localePath(locale, "/apis/rest/"),
      linkLabel: catalogue["landing.pulse.node.clients.link"]
    },
    {
      id: "gateway",
      label: catalogue["landing.pulse.node.gateway.label"],
      sublabel: catalogue["landing.pulse.node.gateway.sub"],
      detail: catalogue["landing.pulse.node.gateway.detail"],
      href: localePath(locale, "/architecture/gateway/"),
      linkLabel: catalogue["landing.pulse.node.gateway.link"]
    },
    {
      id: "edge",
      label: catalogue["landing.pulse.node.edge.label"],
      sublabel: catalogue["landing.pulse.node.edge.sub"],
      detail: catalogue["landing.pulse.node.edge.detail"],
      href: localePath(locale, "/services/edge/"),
      linkLabel: catalogue["landing.pulse.node.edge.link"]
    },
    {
      id: "contracts",
      label: catalogue["landing.pulse.node.contracts.label"],
      sublabel: catalogue["landing.pulse.node.contracts.sub"],
      detail: catalogue["landing.pulse.node.contracts.detail"],
      href: localePath(locale, "/apis/grpc/"),
      linkLabel: catalogue["landing.pulse.node.contracts.link"]
    },
    {
      id: "commerce",
      label: catalogue["landing.pulse.node.commerce.label"],
      sublabel: catalogue["landing.pulse.node.commerce.sub"],
      detail: catalogue["landing.pulse.node.commerce.detail"],
      href: localePath(locale, "/learn/checkout-saga/"),
      linkLabel: catalogue["landing.pulse.node.commerce.link"]
    },
    {
      id: "fulfilment",
      label: catalogue["landing.pulse.node.fulfilment.label"],
      sublabel: catalogue["landing.pulse.node.fulfilment.sub"],
      detail: catalogue["landing.pulse.node.fulfilment.detail"],
      href: localePath(locale, "/learn/two-buyers-one-item/"),
      linkLabel: catalogue["landing.pulse.node.fulfilment.link"]
    },
    {
      id: "identity",
      label: catalogue["landing.pulse.node.identity.label"],
      sublabel: catalogue["landing.pulse.node.identity.sub"],
      detail: catalogue["landing.pulse.node.identity.detail"],
      href: localePath(locale, "/decisions/0006-identity-is-the-only-issuer/"),
      linkLabel: catalogue["landing.pulse.node.identity.link"]
    },
    {
      id: "notary",
      label: catalogue["landing.pulse.node.notary.label"],
      sublabel: catalogue["landing.pulse.node.notary.sub"],
      detail: catalogue["landing.pulse.node.notary.detail"],
      href: localePath(locale, "/verify/proof-of-liabilities/"),
      linkLabel: catalogue["landing.pulse.node.notary.link"]
    }
  ];
}

function heroPulseLabels(locale: Locale): HeroPulseLabels {
  const catalogue = catalogueFor(locale);

  return {
    regionLabel: catalogue["landing.pulse.region"],
    pauseLabel: catalogue["landing.pulse.pause"],
    playLabel: catalogue["landing.pulse.play"],
    inspectHint: catalogue["landing.pulse.inspectHint"],
    clientsGroup: catalogue["landing.pulse.clientsGroup"],
    edgeGroup: catalogue["landing.pulse.edgeGroup"],
    coreHub: catalogue["landing.pulse.coreHub"],
    servicesGroup: catalogue["landing.pulse.servicesGroup"],
    trustGroup: catalogue["landing.pulse.trustGroup"]
  };
}

function computeLandingStats(lessons: number, adrs: number): LandingStats {
  const languages = new Set(services.map((service) => service.language.name)).size;
  const grpcOperations = architectureNodes.reduce((sum, node) => sum + node.serves.length, 0);

  return {
    services: services.length,
    languages,
    grpcOperations,
    restOperations: restEndpoints.length + restSockets.length,
    lessons,
    adrs
  };
}

export {
  computeLandingStats,
  heroCommandLabels,
  heroCommands,
  heroPulseLabels,
  heroPulseNodes,
  landingServices,
  localePath,
  serviceCategoryTabs,
  serviceExplorerLabels
};
