import { describe, expect, test } from "bun:test";
import { bff } from "../src/site/rest/bff";
import { messageHeaders, socketHeaders } from "../src/site/rest/message_headers";
import { restOrigins } from "../src/site/rest/rest_origins";
import { restReleases } from "../src/site/rest/rest_releases";
import { restSocket, restSocketMessages, restSockets } from "../src/site/rest/rest_sockets";
import { frameCode } from "../src/site/rest/socket_frame";
import { socketOrigin } from "../src/site/rest/socket_origin";
import { socketUrl } from "../src/site/rest/socket_url";
import { statusReasons } from "../src/site/rest/status_reasons";
import { webAppHosts } from "../src/site/rest/web_app_hosts";
import type { RestService } from "../src/site/types/rest_service.type";
import type { RestSocket } from "../src/site/types/rest_socket.type";
import type { RestWebApp } from "../src/site/types/rest_web_app.type";

function releasePrefix(service: RestService): string {
  const release = restReleases[service];

  return `https://github.com/WildanFrananda/${release.repository}/blob/${release.commit}/`;
}

function pinned(services: readonly RestService[], href: string): boolean {
  return services.some((service) => href.startsWith(releasePrefix(service)));
}

function answering(socket: RestSocket): readonly RestService[] {
  return socket.service === "matching" || socket.service === "edge" ? ["matching", "edge"] : [socket.service];
}

function probe(via: RestWebApp | undefined): RestSocket {
  const socket = restSockets[0]!;
  const direct: RestSocket = {
    id: `${socket.service}.probe`,
    service: socket.service,
    path: "/ws/v1/example",
    summary: socket.summary,
    access: socket.access,
    request: { fields: [], headers: ["Authorization: Bearer <accessToken>"] },
    cases: [],
    source: socket.source
  };

  return via === undefined ? direct : { ...direct, via };
}

describe("socket frames", () => {
  test("a short frame stays on one line", () => {
    expect(frameCode({ event: "system.ping", requestId: "1" })).toBe('{"event": "system.ping", "requestId": "1"}');
  });

  test("a long frame puts each key on its line and keeps what fits compact", () => {
    const code = frameCode({ event: "command.ack", requestId: "5", data: { stored: [0] } });

    expect(code).toBe(
      [
        "{",
        '  "event": "command.ack",',
        '  "requestId": "5",',
        '  "data": {"stored": [0]}',
        "}"
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

describe("socket addresses and headers", () => {
  test("a socket opens on its page's origin with the matching scheme, and an unpublished origin stays a placeholder", () => {
    expect(socketOrigin("https://seller.wildanfrananda.my.id")).toBe("wss://seller.wildanfrananda.my.id");
    expect(socketOrigin("http://example.onion")).toBe("ws://example.onion");
    expect(socketOrigin(restOrigins.backoffice)).toBe("<backoffice origin>");
  });

  test("a socket the client opens directly is on its host, with only the headers it sets", () => {
    const direct = probe(undefined);

    expect(socketUrl(direct)).toBe("wss://api.wildanfrananda.my.id/ws/v1/example");
    expect(socketHeaders(direct)).toEqual(messageHeaders(direct.request));
  });

  test("a socket a web app opens through its edge is on the app's host under /bff, with the cookie and Origin", () => {
    expect(socketUrl(probe("seller-web"))).toBe("wss://seller.wildanfrananda.my.id/bff/ws/v1/example");
    expect(socketUrl(probe("backoffice"))).toBe("<backoffice origin>/bff/ws/v1/example");
    expect(socketHeaders(probe("seller-web"))).toEqual([
      "Cookie: __Host-kx_session=<session>",
      "Origin: https://seller.wildanfrananda.my.id",
      "Authorization: Bearer <accessToken>"
    ]);
  });

  for (const socket of restSockets.filter((candidate) => candidate.via !== undefined)) {
    describe(socket.id, () => {
      const via = socket.via!;

      test("it opens on its web app's host, never one of its own", () => {
        expect(socket.host).toBeUndefined();
        expect(socketUrl(socket).startsWith(`${socketOrigin(restOrigins[webAppHosts[via]])}${bff.prefix}/ws/`)).toBe(true);
      });

      test("the browser sends the session cookie and never a token", () => {
        const headers = socketHeaders(socket);

        expect(headers).toContain(`Cookie: ${bff.sessionCookie}=<session>`);
        expect(headers.filter((header) => /^authorization:|bearer/i.test(header))).toEqual([]);
      });

      test("its handshake answers come from the edge and from the service behind it", () => {
        const edge = socket.cases.filter((entry) => entry.source.href.startsWith(releasePrefix("edge")));
        const service = socket.cases.filter((entry) => !entry.source.href.startsWith(releasePrefix("edge")));

        expect(edge.length).toBeGreaterThan(0);
        expect(service.length).toBeGreaterThan(0);
      });
    });
  }
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

      test("every link is pinned to its release or to the edge", () => {
        const links = [socket.source, ...socket.cases.map((entry) => entry.source)];

        expect(socket.source.href.startsWith(releasePrefix(socket.service))).toBe(true);
        expect(links.filter((link) => !pinned(answering(socket), link.href))).toEqual([]);
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

      test("every source link is pinned to the release production runs", () => {
        const socket = restSocket(message.socket);
        const links = [message.source, ...message.replies.map((reply) => reply.source)];

        expect(links.filter((link) => !pinned(answering(socket), link.href))).toEqual([]);
      });

      test("the frame names its event, and only what a client sends gets replies", () => {
        expect(message.frame.event.length).toBeGreaterThan(0);

        if (message.direction === "receive") {
          expect(message.frame.requestId).toBeUndefined();
          expect(message.replies).toEqual([]);
        } else {
          expect(typeof message.frame.requestId).toBe("string");
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
