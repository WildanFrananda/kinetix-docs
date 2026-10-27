import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { bff } from "../src/site/rest/bff";
import { restAnswers } from "../src/site/rest/rest_answers";
import { restEndpoint, restEndpoints } from "../src/site/rest/rest_endpoints";
import { restSocketMessages, restSockets } from "../src/site/rest/rest_sockets";
import type { RestWebApp } from "../src/site/types/rest_web_app.type";

const docs = join(import.meta.dir, "../src/content/docs");
const english = join(docs, "apis/rest");

function pages(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    return entry.isDirectory() ? pages(path) : entry.name.endsWith(".mdx") ? [path] : [];
  });
}

function mentions(path: string, component: string, attribute: string): string[] {
  const pattern = new RegExp(`<${component} ${attribute}="([^"]+)"`, "g");

  return [...readFileSync(path, "utf8").matchAll(pattern)].map((match) => match[1]!);
}

function rendered(path: string): string[] {
  const pattern = /<RestEndpoint id="([^"]+)"(?: via="([^"]+)")? \/>/g;

  return [...readFileSync(path, "utf8").matchAll(pattern)].map((match) => `${match[1]!}@${match[2] ?? ""}`);
}

function sockets(path: string): string[] {
  const pattern = /<RestSocket(Message)? id="([^"]+)" \/>/g;

  return [...readFileSync(path, "utf8").matchAll(pattern)].map((match) => match[2]!);
}

const webApps: Readonly<Record<string, RestWebApp>> = {
  "seller-web": "seller-web",
  backoffice: "backoffice"
};

const englishPages = pages(english);
const known = new Set(restEndpoints.map((endpoint) => endpoint.id));

describe("REST pages", () => {
  test("every endpoint a page names exists", () => {
    const unknown = englishPages.flatMap((page) =>
      mentions(page, "RestEndpoint", "id").filter((id) => !known.has(id))
    );

    expect(unknown).toEqual([]);
  });

  test("every endpoint is on at least one page", () => {
    const named = new Set(englishPages.flatMap((page) => mentions(page, "RestEndpoint", "id")));

    expect(restEndpoints.map((endpoint) => endpoint.id).filter((id) => !named.has(id))).toEqual([]);
  });

  test("every socket and socket message is on at least one page", () => {
    const named = new Set(englishPages.flatMap((page) => sockets(page)));
    const ids = [...restSockets.map((socket) => socket.id), ...restSocketMessages.map((message) => message.id)];

    expect(ids.filter((id) => !named.has(id))).toEqual([]);
  });

  test("a WebSocket is written as a wss:// address, never as an HTTP request", () => {
    const every = [...englishPages, ...pages(join(docs, "id/apis/rest"))];
    const wrong = every.flatMap((page) =>
      readFileSync(page, "utf8")
        .split("\n")
        .filter((line) => /\/ws\/v\d/.test(line) && !/wss:\/\/[a-z.]+\/ws\/v\d/.test(line))
        .map((line) => `${relative(docs, page)}: ${line.trim()}`)
    );

    expect(wrong).toEqual([]);
  });

  test("the overview lists every service's answers", () => {
    const listed = mentions(join(english, "index.mdx"), "RestServiceAnswers", "service");

    expect(listed.sort()).toEqual(Object.keys(restAnswers).sort());
  });

  test("every RestEndpoint tag is one the pattern reads", () => {
    const tags = englishPages.flatMap((page) => readFileSync(page, "utf8").match(/<RestEndpoint [^>]*>/g) ?? []);

    expect(tags.filter((tag) => !/^<RestEndpoint id="[^"]+"(?: via="[^"]+")? \/>$/.test(tag))).toEqual([]);
  });

  for (const page of englishPages) {
    const path = relative(docs, page);
    const twin = join(docs, "id", path);
    const app = webApps[relative(english, page).split("/")[0]!];

    test(`${path}: a web app's page calls through its own edge, every other page calls the API directly`, () => {
      const wrong = rendered(page).filter((entry) => {
        const [id, via] = entry.split("@");
        const service = restEndpoint(id!).service;

        return app === undefined ? via !== "" || service === "edge" : via !== app;
      });

      expect(wrong).toEqual([]);
    });

    test(`${path}: no call through the edge is one the edge refuses`, () => {
      const refused = rendered(page).filter((entry) => {
        const [id, via] = entry.split("@");
        const path = restEndpoint(id!).path.toLowerCase();

        return via !== "" && bff.refusedPaths.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
      });

      expect(refused).toEqual([]);
    });

    test(`${path}: the Indonesian page names the same endpoints in the same order`, () => {
      expect(existsSync(twin)).toBe(true);
      expect(rendered(twin)).toEqual(rendered(page));
      expect(sockets(twin)).toEqual(sockets(page));
      expect(mentions(twin, "RestServiceAnswers", "service")).toEqual(
        mentions(page, "RestServiceAnswers", "service")
      );
    });
  }
});
