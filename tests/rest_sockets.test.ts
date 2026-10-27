import { describe, expect, test } from "bun:test";
import { phoenixRelease } from "../src/site/rest/phoenix_release";
import { restReleases } from "../src/site/rest/rest_releases";
import { restSocket, restSocketMessages, restSockets } from "../src/site/rest/rest_sockets";
import { frameCode } from "../src/site/rest/socket_frame";
import { statusReasons } from "../src/site/rest/status_reasons";
import type { RestService } from "../src/site/types/rest_service.type";

const phoenix = `https://github.com/phoenixframework/phoenix/blob/${phoenixRelease.commit}/`;

function releasePrefix(service: RestService): string {
  const release = restReleases[service];

  return `https://github.com/WildanFrananda/${release.repository}/blob/${release.commit}/`;
}

function pinned(service: RestService, href: string): boolean {
  return href.startsWith(releasePrefix(service)) || href.startsWith(phoenix);
}

function topicPattern(topic: string): RegExp {
  const escaped = topic.replace(/[.*+?^$()|[\]\\]/g, "\\$&").replace(/\{[^}]+\}/g, "[^:]+");

  return new RegExp(`^${escaped}$`);
}

describe("socket frames", () => {
  test("a short frame stays on one line", () => {
    expect(frameCode(["1", "2", "phoenix", "heartbeat", {}])).toBe('["1", "2", "phoenix", "heartbeat", {}]');
  });

  test("a long frame puts each element on its line and keeps what fits compact", () => {
    const code = frameCode(["1", "5", "driver:17", "phx_reply", { status: "ok", response: { stored: [0] } }]);

    expect(code).toBe(
      [
        "[",
        '  "1",',
        '  "5",',
        '  "driver:17",',
        '  "phx_reply",',
        '  {"status": "ok", "response": {"stored": [0]}}',
        "]"
      ].join("\n")
    );
  });

  test("every rendered line fits unless a single value is longer", () => {
    const long = restSocketMessages.flatMap((message) =>
      frameCode(message.frame)
        .split("\n")
        .filter((line) => line.length > 64 && !/^\s*("[^"]*": )?("[^"]*"|-?[\d.]+)(,)?$/.test(line))
    );

    expect(long).toEqual([]);
  });
});

describe("REST sockets", () => {
  test("ids are unique", () => {
    const ids = [...restSockets.map((socket) => socket.id), ...restSocketMessages.map((message) => message.id)];

    expect(ids.filter((id, index) => ids.indexOf(id) !== index)).toEqual([]);
  });

  for (const socket of restSockets) {
    describe(socket.id, () => {
      const prefix = `rest.${socket.service}.`;

      test("the path is a WebSocket path, its values are path fields, and the query is apart", () => {
        const placeholders = [...socket.path.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]);
        const pathFields = socket.request.fields.filter((field) => field.in === "path").map((field) => field.name);

        expect(socket.path.startsWith("/ws/")).toBe(true);
        expect(socket.path).not.toContain("?");
        expect(pathFields.sort()).toEqual(placeholders.sort());
      });

      test("texts belong to its service", () => {
        const keys = [
          socket.summary,
          socket.access.who,
          ...socket.request.fields.map((field) => field.rule),
          ...socket.cases.map((entry) => entry.when)
        ];

        expect(socket.id.startsWith(`${socket.service}.`)).toBe(true);
        expect(keys.filter((key) => !key.startsWith(prefix))).toEqual([]);
      });

      test("every source link is pinned to the release production runs, or to its Phoenix", () => {
        const links = [socket.source, ...socket.cases.map((entry) => entry.source)];

        expect(links.filter((link) => !pinned(socket.service, link.href))).toEqual([]);
      });

      test("handshake answers are ordered, named, and include the upgrade", () => {
        const statuses = socket.cases.map((entry) => entry.status);

        expect(statuses).toEqual([...statuses].sort((a, b) => a - b));
        expect(statuses.filter((status) => statusReasons[status] === undefined)).toEqual([]);
        expect(statuses).toContain(101);
      });
    });
  }

  for (const message of restSocketMessages) {
    describe(message.id, () => {
      test("it belongs to a socket and its texts to that socket's service", () => {
        const socket = restSocket(message.socket);
        const prefix = `rest.${socket.service}.`;
        const keys = [message.summary, ...message.replies.map((reply) => reply.when)];

        expect(message.id.startsWith(`${socket.id}.`)).toBe(true);
        expect(keys.filter((key) => !key.startsWith(prefix))).toEqual([]);
      });

      test("every source link is pinned to the release production runs, or to its Phoenix", () => {
        const service = restSocket(message.socket).service;
        const links = [message.source, ...message.replies.map((reply) => reply.source)];

        expect(links.filter((link) => !pinned(service, link.href))).toEqual([]);
      });

      test("the frame names its topic and event, and only what a client sends gets replies", () => {
        const [, ref, topic, event] = message.frame;

        expect(topic).toMatch(topicPattern(message.topic));
        expect(event.length).toBeGreaterThan(0);
        expect(event).not.toBe("phx_reply");

        if (message.direction === "receive") {
          expect(ref).toBeNull();
          expect(message.replies).toEqual([]);
        } else {
          expect(ref).not.toBeNull();
          expect(message.replies.length).toBeGreaterThan(0);
        }
      });

      test("an ok reply comes before the errors", () => {
        const statuses = message.replies.map((reply) => reply.status);

        expect(statuses).toEqual([...statuses].sort((a, b) => (a === b ? 0 : a === "ok" ? -1 : 1)));
      });
    });
  }
});
