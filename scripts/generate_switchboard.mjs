import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const kitFlagIndex = process.argv.indexOf("--kit");
const kitDir =
  (kitFlagIndex >= 0 ? process.argv[kitFlagIndex + 1] : undefined) ??
  process.env.ANATOMY_KIT_DIR ??
  join(homedir(), ".gemini", "config", "skills", "anatomy", "kit");

const k = await import(pathToFileURL(join(kitDir, "iso-kit.mjs")).href);
const G = await import(pathToFileURL(join(kitDir, "lathe.mjs")).href);
const A = await import(pathToFileURL(join(kitDir, "audit.mjs")).href);
const { tubePieces, tubeSvg } = await import(pathToFileURL(join(kitDir, "tube.mjs")).href);
const { glCamera } = await import(pathToFileURL(join(kitDir, "gl.mjs")).href);
const { turning } = await import(pathToFileURL(join(kitDir, "turn-build.mjs")).href);

const WIDTH = 580;
const HEIGHT = 430;
const PLATE = { x: -104, y: -76, w: 208, d: 152, r: 8 };
const PLATE_Z0 = 0;
const PLATE_Z1 = 6;
const FOOT_H = 5.5;
const DIAL_WELL_TOP = 9.0;
const DIAL_Z0 = 9.0;
const DIAL_R = 32.5;
const SKIRT_TOP = 14.5;
const BEVEL_TOP = 17.5;
const FACE_R = 29.2;
const HUB_R = 11.8;
const HUB_TOP = 22.0;

const CAM = { azimuth: 44, elevation: 30 };
const rawPts = [];
for (const [x, y] of k.corners(PLATE, -4)) {
  for (const z of [-FOOT_H, 42]) {
    rawPts.push([x, y, z]);
  }
}
const P = k.fitProjection(rawPts, WIDTH, HEIGHT, {
  pad: 22,
  headroom: 6,
  azimuth: CAM.azimuth,
  elevation: CAM.elevation
});

const R = A.recorder(P);
const at = (p) => k.iso(p, P);
const S = (paths, opts = {}) => k.solidSvg(paths, opts);
const L = (d, opts = {}) => k.lineSvg(d, opts);
const D = (pts, opts = {}) => k.dotsSvg(pts, opts);
const VERT = (x, y) => G.frameOf([x, y, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
const frameOf = (o, a, u) => {
  const axis = G.unit3(a);
  const uu = u ? G.unit3(G.sub3(u, G.mul3(axis, G.dot3(u, axis)))) : G.frameAlong(o, axis).u;
  return { o, a: axis, u: uu, v: G.cross3(axis, uu) };
};
const put = ({ name, layer, at: p, bias = 0, svg, shapes = [], ...rest }) => {
  const n = R.nameFor(name);
  const tagged = shapes.map((s, i) =>
    R.solid({ ...s, name: s.name ?? (shapes.length > 1 ? `${n}.${i}` : n), owner: s.owner ?? n })
  );
  R.put({ name: n, layer, at: p, bias, svg, shapes: tagged, ...rest });
  return n;
};

const PORT_CENTERS = [
  [0, 60],
  [12, 60],
  [24, 60],
  [36, 60]
];
const GAUGE_AT = [78, -28];
const CODES = ["COM", "FUL", "IDN", "NTR"];

function staticBase() {
  const feet = k.corners(PLATE, 12);
  feet.forEach(([fx, fy], idx) => {
    const F = VERT(fx, fy);
    const pad = G.disc(PLATE_Z0 - FOOT_H, PLATE_Z0 - FOOT_H + 1.5, 7.6, F, P);
    const stem = G.disc(PLATE_Z0 - FOOT_H + 1.5, PLATE_Z0, 5.6, F, P);
    put({
      name: `stand.foot.${idx}`,
      layer: "back",
      at: [fx, fy, PLATE_Z0 - FOOT_H],
      svg: S(pad, { tone: "lo" }) + S(stem, { tone: "mid" }),
      shapes: [
        A.disc(F, PLATE_Z0 - FOOT_H, PLATE_Z0 - FOOT_H + 1.5, 7.6, { ground: true }),
        A.disc(F, PLATE_Z0 - FOOT_H + 1.5, PLATE_Z0, 5.6, { ground: true })
      ]
    });
  });

  const plate = k.slabOf(PLATE, PLATE_Z0, PLATE_Z1 - PLATE_Z0, P, 8, 0.45);
  const bolts = k.corners(PLATE, 10);
  const screwRings = bolts.map(([bx, by]) => k.ring(bx, by, 2.2, PLATE_Z1, P, 16)).join("");
  const innerTrack = k.planOutline(k.insetPlan(PLATE, 3.2), PLATE_Z1, P);
  const scaleLeft = k.topTicks(PLATE.x + 12, PLATE.x + 76, 5, 5, PLATE.y + PLATE.d - 3.2, PLATE_Z1, [-1.8, -3.0], P, "x");
  const scaleFront = k.topTicks(PLATE.y + 20, PLATE.y + 92, 5, 5, PLATE.x + PLATE.w - 3.2, PLATE_Z1, [-1.8, -3.0], P, "y");
  const plateSvg =
    S(plate, {
      tone: "mid",
      inner:
        L(innerTrack, { tone: "faint" }) +
        L(screwRings, { tone: "lo" }) +
        L(scaleLeft.minor, { tone: "faint" }) +
        L(scaleLeft.major, { tone: "lo" }) +
        L(scaleFront.minor, { tone: "faint" }) +
        L(scaleFront.major, { tone: "lo" })
    }) + D(bolts.map(([bx, by]) => at([bx, by, PLATE_Z1])), { size: 0.52, tone: "mid" });

  put({
    name: "stand.bench",
    layer: "back",
    at: [0, 0, PLATE_Z0],
    svg: plateSvg,
    shapes: [A.slab(PLATE, PLATE_Z0, PLATE_Z1 - PLATE_Z0, { ground: true })]
  });

  const SPEC_PLATE = { x: -88, y: 24, w: 38, d: 34, r: 2.4 };
  const specSlab = k.slabOf(SPEC_PLATE, PLATE_Z1, 0.8, P, 8, 0.25);
  const ruleLines = [33, 41, 49].map((ry) =>
    L(k.lineOnTop([SPEC_PLATE.x + 6, ry], [SPEC_PLATE.x + 31, ry], PLATE_Z1 + 0.8, P), { tone: "lo", free: true })
  );
  const specBolts = k.corners(SPEC_PLATE, 4).map(([bx, by]) => at([bx, by, PLATE_Z1 + 0.8]));
  put({
    name: "stand.specplate",
    layer: "back",
    at: [-69, 41, PLATE_Z1],
    svg: `<g data-mat="gunmetal">${S(specSlab, { tone: "lo", inner: ruleLines.join("") })}</g>${D(specBolts, { size: 0.42, tone: "mid" })}`,
    shapes: [A.slab(SPEC_PLATE, PLATE_Z1, 0.8)]
  });

  const PED_F = VERT(0, 0);
  const pedBase = G.disc(PLATE_Z1, PLATE_Z1 + 1.4, 34.4, PED_F, P, { bevel: 0.25 });
  const pedUpper = G.disc(PLATE_Z1 + 1.4, DIAL_WELL_TOP, 33.4, PED_F, P, { bevel: 0.35 });
  const pedBolts = G.dotsOf(PED_F, PLATE_Z1 + 1.4, 33.9, 12, P, { phase: 0.2, all: true });
  put({
    name: "stand.pedestal",
    layer: "back",
    at: [0, 0, PLATE_Z1],
    svg:
      S(pedBase, { tone: "mid" }) +
      D(pedBolts, { size: 0.44, tone: "lo" }) +
      S(pedUpper, { tone: "hi", inner: L(G.circleOf(PED_F, DIAL_WELL_TOP, 32.0, P, 84), { tone: "lo" }) }),
    shapes: [
      A.disc(PED_F, PLATE_Z1, PLATE_Z1 + 1.4, 34.4),
      A.disc(PED_F, PLATE_Z1 + 1.4, DIAL_WELL_TOP, 33.4)
    ]
  });

  const LOCK_BED = { x: 39, y: 10, w: 54, d: 38, r: 2.5 };
  put({
    name: "stand.lockbed",
    layer: "mid",
    at: [66, 29, PLATE_Z1],
    svg: `<g data-mat="gunmetal">${S(k.slabOf(LOCK_BED, PLATE_Z1, 4.0, P, 8, 0.3), { tone: "lo" })}</g>`,
    shapes: [A.slab(LOCK_BED, PLATE_Z1, 4.0)]
  });
}

function staticIntake() {
  const BASE = { x: -88, y: -60, w: 40, d: 34, r: 3.5 };
  const BZ1 = PLATE_Z1 + 8.5;
  const plinth = k.slabOf(BASE, PLATE_Z1, BZ1 - PLATE_Z1, P, 8, 0.4);
  const plinthDots = k.corners(BASE, 4).map(([bx, by]) => at([bx, by, BZ1]));
  put({
    name: "intake.plinth",
    layer: "back",
    at: [-68, -43, PLATE_Z1],
    svg:
      S(plinth, {
        tone: "hi",
        inner: L(k.planOutline(k.insetPlan(BASE, 2.2), BZ1 - 3.0, P), { tone: "faint" })
      }) + D(plinthDots, { size: 0.45, tone: "mid" }),
    shapes: [A.slab(BASE, PLATE_Z1, BZ1 - PLATE_Z1)]
  });

  const CAN_C0 = [-76, -44];
  const CAN_C1 = [-58, -45];
  [CAN_C0, CAN_C1].forEach(([cx, cy], idx) => {
    const F = VERT(cx, cy);
    const flange = G.disc(BZ1, BZ1 + 2.2, 8.2, F, P, { bevel: 0.25 });
    const body = G.lathe([[BZ1 + 2.2, 6.8], [BZ1 + 17.5, 6.8], [BZ1 + 19.6, 5.1, 1], [BZ1 + 20.5, 0, 1]], F, P, { smooth: true });
    const collar = G.disc(BZ1 + 20.4, BZ1 + 22.0, 2.6, F, P);
    const topNut = G.disc(BZ1 + 22.0, BZ1 + 23.0, 1.35, F, P);
    const canRibs = G.ribsOf(F, BZ1 + 4.5, BZ1 + 15.5, 6.8, 22, P, { fade: [0.1, 0.55], seams: true });
    const ribMarkup = k.fadedSvg(canRibs, { tone: "lo" });
    const flDots = G.dotsOf(F, BZ1 + 2.2, 7.5, 6, P, { fade: [0.04, 0.42] });
    put({
      name: `intake.can.${idx}`,
      layer: "back",
      at: [cx, cy, BZ1],
      svg:
        `<g data-mat="${idx === 0 ? "steel" : "gunmetal"}">` +
        S(flange, { tone: "mid" }) +
        D(flDots, { size: 0.42, tone: "mid" }) +
        S(body, { tone: "hi", inner: ribMarkup }) +
        `</g>` +
        `<g data-mat="brass">${S(collar, { tone: "hi" })}</g>` +
        `<g data-mat="chrome">${S(topNut, { tone: "hi" })}</g>`,
      shapes: [
        A.disc(F, BZ1, BZ1 + 2.2, 8.2),
        A.solid(F, [[BZ1 + 2.2, 6.8], [BZ1 + 17.5, 6.8], [BZ1 + 19.6, 5.1, 1], [BZ1 + 20.5, 0, 1]]),
        A.disc(F, BZ1 + 20.4, BZ1 + 22.0, 2.6),
        A.disc(F, BZ1 + 22.0, BZ1 + 23.0, 1.35)
      ]
    });
  });

  const BRIDGE_Z = BZ1 + 5.2;
  const br0 = [-69.2, -44.2, BRIDGE_Z];
  const br1 = [-64.8, -44.8, BRIDGE_Z];
  const bridgeLen = G.len3(G.sub3(br1, br0));
  const F_BR = frameOf(br0, G.sub3(br1, br0), [0, 0, 1]);
  put({
    name: "intake.bridge.flange.0",
    layer: "back",
    at: br0,
    svg: `<g data-mat="brass">${S(G.disc(0, 1.1, 2.0, F_BR, P), { tone: "hi" })}</g>`,
    shapes: [A.disc(F_BR, 0, 1.1, 2.0, { name: "intake.bridge.f0", owner: "intake.bridge" })]
  });
  put({
    name: "intake.bridge.flange.1",
    layer: "back",
    at: br1,
    svg: `<g data-mat="brass">${S(G.disc(bridgeLen - 1.1, bridgeLen, 2.0, F_BR, P), { tone: "hi" })}</g>`,
    shapes: [A.disc(F_BR, bridgeLen - 1.1, bridgeLen, 2.0, { name: "intake.bridge.f1", owner: "intake.bridge" })]
  });
  tubePieces([br0, br1], 1.05, P, { gaps: [[0, 1.1], [bridgeLen - 1.1, bridgeLen]] }).forEach((pc, i) => {
    put({
      name: `intake.bridge.p.${i}`,
      layer: "back",
      route: "intake.bridge",
      chunk: i,
      at: pc.mid,
      svg: `<g data-mat="copper">${tubeSvg(pc, { tone: "hi" })}</g>`,
      shapes: [
        A.tube(pc.points, pc.radii, {
          name: `intake.bridge.p.${i}`,
          owner: "intake.bridge",
          tips: [br0, br1],
          tipAxes: [G.unit3(G.sub3(br1, br0)), G.unit3(G.sub3(br0, br1))],
          tipRims: [2.0, 2.0]
        })
      ]
    });
  });

  const JUNCT = { x: -52, y: -23, w: 12, d: 10, r: 1.4 };
  put({
    name: "intake.junction",
    layer: "back",
    at: [-46, -18, PLATE_Z1],
    svg: `<g data-mat="gunmetal">${S(k.slabOf(JUNCT, PLATE_Z1, 5.2, P, 8, 0.3), { tone: "mid" })}</g>`,
    shapes: [A.slab(JUNCT, PLATE_Z1, 5.2, { name: "intake.junction" })]
  });

  const FEED_Z = 7.6;
  const route0 = G.fillet(
    [
      [-51.2, -45.0, BRIDGE_Z],
      [-45.0, -45.0, BRIDGE_Z],
      [-45.0, -32.0, FEED_Z],
      [-43.0, -23.0, FEED_Z]
    ],
    2.6,
    6,
    { P, tube: 0.78 }
  );
  const len0 = G.pathLength(route0);
  const fStart0 = frameOf(route0[0], G.sub3(route0[1], route0[0]), [0, 0, 1]);
  const fEnd0 = frameOf(route0[route0.length - 1], G.sub3(route0[route0.length - 2], route0[route0.length - 1]), [0, 0, 1]);
  put({
    name: "intake.feed.collar.0",
    layer: "back",
    at: route0[0],
    svg: `<g data-mat="brass">${S(G.disc(0, 1.3, 1.65, fStart0, P), { tone: "hi" })}</g>`,
    shapes: [A.disc(fStart0, 0, 1.3, 1.65, { name: "intake.feed.c0", owner: "intake.feed" })]
  });
  put({
    name: "intake.feed.collar.1",
    layer: "back",
    at: route0[route0.length - 1],
    svg: `<g data-mat="brass">${S(G.disc(0, 1.3, 1.65, fEnd0, P), { tone: "hi" })}</g>`,
    shapes: [A.disc(fEnd0, 0, 1.3, 1.65, { name: "intake.feed.c1", owner: "intake.feed" })]
  });
  tubePieces(route0, 0.78, P, {
    maxLength: 50,
    gaps: [[0, 1.3], [len0 - 1.3, len0]],
    rings: { pitch: 2.2, twist: 1.4, cross: true, tone: "lo" }
  }).forEach((pc, idx) => {
    put({
      name: `intake.feed.p.${idx}`,
      layer: "back",
      route: "intake.feed",
      chunk: idx,
      at: pc.mid,
      svg: `<g data-mat="rubber">${tubeSvg(pc, { tone: "mid" })}</g>`,
      shapes: [
        A.tube(pc.points, pc.radii, {
          name: `intake.feed.p.${idx}`,
          owner: "intake.feed",
          tips: [route0[0], route0[route0.length - 1]],
          tipAxes: [G.unit3(G.sub3(route0[1], route0[0])), G.unit3(G.sub3(route0[route0.length - 2], route0[route0.length - 1]))],
          tipRims: [1.65, 1.65]
        })
      ]
    });
  });

  const bAng = Math.atan2(-14.5, -31.2);
  const bx = Math.cos(bAng) * 34.4;
  const by = Math.sin(bAng) * 34.4;
  const bus0 = [
    [-40.0, -16.5, PLATE_Z1 + 1.1],
    [bx, by, PLATE_Z1 + 1.1]
  ];
  const busLen = G.pathLength(bus0);
  const fb0 = frameOf(bus0[0], G.sub3(bus0[1], bus0[0]), [0, 0, 1]);
  const fb1 = frameOf(bus0[bus0.length - 1], G.sub3(bus0[bus0.length - 2], bus0[bus0.length - 1]), [0, 0, 1]);
  put({
    name: "intake.bus.collar.0",
    layer: "back",
    at: bus0[0],
    svg: `<g data-mat="brass">${S(G.disc(0, 1.2, 1.4, fb0, P), { tone: "hi" })}</g>`,
    shapes: [A.disc(fb0, 0, 1.2, 1.4, { name: "intake.bus.c0", owner: "intake.bus" })]
  });
  put({
    name: "intake.bus.collar.1",
    layer: "back",
    at: bus0[bus0.length - 1],
    svg: `<g data-mat="brass">${S(G.disc(0, 1.2, 1.4, fb1, P), { tone: "hi" })}</g>`,
    shapes: [A.disc(fb1, 0, 1.2, 1.4, { name: "intake.bus.c1", owner: "intake.bus" })]
  });
  tubePieces(bus0, 0.72, P, { maxLength: 40, gaps: [[0, 1.2], [busLen - 1.2, busLen]] }).forEach((pc, idx) => {
    put({
      name: `intake.bus.p.${idx}`,
      layer: "back",
      route: "intake.bus",
      chunk: idx,
      at: pc.mid,
      svg: `<g data-mat="steel">${tubeSvg(pc, { tone: "hi" })}</g>`,
      shapes: [
        A.tube(pc.points, pc.radii, {
          name: `intake.bus.p.${idx}`,
          owner: "intake.bus",
          tips: [bus0[0], bus0[bus0.length - 1]],
          tipAxes: [G.unit3(G.sub3(bus0[1], bus0[0])), G.unit3(G.sub3(bus0[bus0.length - 2], bus0[bus0.length - 1]))],
          tipRims: [1.5, 1.5]
        })
      ]
    });
  });
}

function frontRackAndLock() {
  PORT_CENTERS.forEach(([px, py], idx) => {
    const PB = { x: px - 5, y: py - 4.5, w: 10, d: 9, r: 1.4 };
    const PZ1 = PLATE_Z1 + 5.8;
    const block = k.slabOf(PB, PLATE_Z1, 5.8, P, 8, 0.35);
    const lensF = VERT(px, py);
    const lensRing = G.disc(PZ1, PZ1 + 1.0, 2.5, lensF, P);
    const lensCore = G.disc(PZ1 + 1.0, PZ1 + 1.5, 1.65, lensF, P);
    const frontDots = [
      [px - 3.5, py - 2.8],
      [px + 3.5, py + 2.8]
    ].map(([dx, dy]) => at([dx, dy, PZ1]));
    put({
      name: `port.block.${idx}`,
      layer: "front",
      at: [px, py, PLATE_Z1],
      svg:
        `<g data-mat="gunmetal">${S(block, { tone: "mid" })}</g>` +
        D(frontDots, { size: 0.36, tone: "mid" }) +
        `<g data-mat="brass">${S(lensRing, { tone: "hi" })}</g>` +
        `<g class="kx-port-lens" data-port="${idx}">${S(lensCore, { tone: "hi", lit: true })}</g>`,
      shapes: [
        A.slab(PB, PLATE_Z1, 5.8),
        A.disc(lensF, PZ1, PZ1 + 1.0, 2.5),
        A.disc(lensF, PZ1 + 1.0, PZ1 + 1.5, 1.65)
      ]
    });

    const angle = Math.atan2(py, px);
    const sx = Math.cos(angle) * 34.4;
    const sy = Math.sin(angle) * 34.4;
    const ex = px;
    const ey = py - 4.5;
    const cz = PLATE_Z1 + 1.1;
    const route = G.fillet(
      [
        [sx, sy, cz],
        [px, py - 10.5, cz],
        [ex, ey, cz]
      ],
      2.6,
      6,
      { P, tube: 0.68 }
    );
    const conLen = G.pathLength(route);
    const fc0 = frameOf(route[0], G.sub3(route[1], route[0]), [0, 0, 1]);
    const fc1 = frameOf(route[route.length - 1], G.sub3(route[route.length - 2], route[route.length - 1]), [0, 0, 1]);
    put({
      name: `port.gland.${idx}.0`,
      layer: "back",
      at: route[0],
      svg: `<g data-mat="brass">${S(G.disc(0, 1.2, 1.4, fc0, P), { tone: "hi" })}</g>`,
      shapes: [A.disc(fc0, 0, 1.2, 1.4, { name: `port.gland.${idx}.0`, owner: `port.pipe.${idx}` })]
    });
    put({
      name: `port.gland.${idx}.1`,
      layer: "back",
      at: route[route.length - 1],
      svg: `<g data-mat="brass">${S(G.disc(0, 1.2, 1.4, fc1, P), { tone: "hi" })}</g>`,
      shapes: [A.disc(fc1, 0, 1.2, 1.4, { name: `port.gland.${idx}.1`, owner: `port.pipe.${idx}` })]
    });
    tubePieces(route, 0.68, P, { maxLength: 60, gaps: [[0, 1.2], [conLen - 1.2, conLen]] }).forEach((pc, ci) => {
      put({
        name: `port.pipe.${idx}.${ci}`,
        layer: "back",
        route: `port.pipe.${idx}`,
        chunk: ci,
        at: pc.mid,
        svg: `<g data-mat="copper">${tubeSvg(pc, { tone: "hi" })}</g>`,
        shapes: [
          A.tube(pc.points, pc.radii, {
            owner: `port.pipe.${idx}`,
            tips: [route[0], route[route.length - 1]],
            tipAxes: [G.unit3(G.sub3(route[1], route[0])), G.unit3(G.sub3(route[route.length - 2], route[route.length - 1]))],
            tipRims: [1.4, 1.4]
          })
        ]
      });
    });
  });

  const DETENT = [25, 29];
  const dwF = VERT(DETENT[0], DETENT[1]);
  put({
    name: "front.detent",
    layer: "mid",
    at: [DETENT[0], DETENT[1], PLATE_Z1],
    svg: `<g data-mat="brass">${S(G.disc(PLATE_Z1, DIAL_Z0 + 6.5, 2.2, dwF, P), { tone: "mid" })}${S(G.disc(DIAL_Z0 + 6.5, DIAL_Z0 + 7.4, 2.8, dwF, P), { tone: "hi", lit: true })}</g>`,
    shapes: [
      A.disc(dwF, PLATE_Z1, DIAL_Z0 + 6.5, 2.2),
      A.disc(dwF, DIAL_Z0 + 6.5, DIAL_Z0 + 7.4, 2.8)
    ]
  });

  const gaugeStand = k.slabOf({ x: 64, y: -44, w: 22, d: 22, r: 3.5 }, PLATE_Z1, 8.2, P, 8, 0.35);
  const gf = VERT(GAUGE_AT[0] - 3, GAUGE_AT[1] + 5);
  const gaugePed = G.disc(PLATE_Z1 + 8.2, PLATE_Z1 + 11.2, 7.6, gf, P);
  const gaugeBody = G.disc(PLATE_Z1 + 11.2, PLATE_Z1 + 15.8, 10.6, gf, P, { bevel: 0.3 });
  const gaugeBezel = G.ringBand(PLATE_Z1 + 15.8, PLATE_Z1 + 17.2, 8.2, 10.6, gf, P);
  const ticks = k.radialTicks(GAUGE_AT[0] - 3, GAUGE_AT[1] + 5, 7.6, 12, 3, PLATE_Z1 + 16.0, [1.2, 2.0], P, -Math.PI * 0.75, Math.PI * 1.5);
  const needleAt = at([GAUGE_AT[0] - 3, GAUGE_AT[1] + 5, PLATE_Z1 + 16.3]);
  const needleTip = at([GAUGE_AT[0] - 3 + 5.6 * Math.cos(-0.6), GAUGE_AT[1] + 5 + 5.6 * Math.sin(-0.6), PLATE_Z1 + 16.3]);
  const needleSvg = `<g class="kx-gauge-needle-g"><path class="iso-line kx-gauge-needle" data-tone="lit" data-free="end" d="${k.pathOf([needleAt, needleTip])}"/><circle class="iso-dot" data-tone="lit" cx="${needleAt[0].toFixed(2)}" cy="${needleAt[1].toFixed(2)}" r="2.2"/></g>`;
  put({
    name: "lock.gauge",
    layer: "front",
    at: [GAUGE_AT[0] - 3, GAUGE_AT[1] + 5, PLATE_Z1],
    svg:
      `<g data-mat="gunmetal">${S(gaugeStand, { tone: "mid" })}</g>` +
      `<g data-mat="steel">${S(gaugePed, { tone: "mid" })}${S(gaugeBody, { tone: "hi", inner: L(ticks.minor, { tone: "lo" }) + L(ticks.major, { tone: "mid" }) })}</g>` +
      `<g data-mat="brass">${S(gaugeBezel, { tone: "hi" })}</g>` +
      needleSvg,
    shapes: [
      A.slab({ x: 64, y: -44, w: 22, d: 22, r: 3.5 }, PLATE_Z1, 8.2),
      A.disc(gf, PLATE_Z1 + 8.2, PLATE_Z1 + 11.2, 7.6),
      A.disc(gf, PLATE_Z1 + 11.2, PLATE_Z1 + 17.2, 10.6)
    ]
  });
}

const T = turning(P, { recorder: R });
const dialGroup = T.group("dial", { turn: { pivot: [0, 0] } });
const plungerGroup = T.group("plunger", { slide: { direction: [1, 0, 0], travel: 6.0 } });

const dialLayer = T.layer("dial");
const plungerLayer = T.layer("plunger");
T.stack(["back", "dial", "mid", "plunger", "front"]);

const LOCK_Z0 = PLATE_Z1 + 4.0;
const VAULT_LOCK = { x: 70, y: 12, w: 22, d: 34, r: 2.5 };
const VAULT_TOP = LOCK_Z0 + 15.0;
const PLUNGER_Y0 = VAULT_LOCK.y + VAULT_LOCK.d / 2;
const PLUNGER_Z0 = LOCK_Z0 + 7.5;

T.prism({
  name: "lock.vault",
  layer: plungerLayer,
  plan: VAULT_LOCK,
  z: LOCK_Z0,
  h: 15.0,
  bevel: 0.45,
  tone: "hi",
  crease: "lo",
  material: "gunmetal",
  details: {
    seams: [LOCK_Z0 + 7.5],
    dots: k.corners(VAULT_LOCK, 4).map(([bx, by]) => ({ at: [VAULT_TOP, bx, by], normal: [0, 0, 1], size: 0.48, tone: "mid" }))
  }
});
T.round({
  name: "lock.vault.lamp",
  layer: plungerLayer,
  F: VERT(VAULT_LOCK.x + 11, VAULT_LOCK.y + 17),
  s0: VAULT_TOP,
  s1: VAULT_TOP + 2.2,
  r: 4.6,
  tone: "hi",
  lit: true,
  material: "copper"
});
const GLAND_F = frameOf([VAULT_LOCK.x, PLUNGER_Y0, PLUNGER_Z0], [-1, 0, 0], [0, 0, 1]);
T.round({ name: "lock.gland.flange", layer: plungerLayer, F: GLAND_F, s0: 0, s1: 2.4, r: 5.0, tone: "hi", material: "brass" });
T.round({ name: "lock.gland.boss", layer: plungerLayer, F: GLAND_F, s0: 2.4, s1: 4.8, r: 3.4, tone: "mid", material: "brass" });
const FRONT_PILLOW_X = 41;
T.prism({
  name: "lock.pillow",
  layer: plungerLayer,
  plan: { x: FRONT_PILLOW_X - 2.2, y: VAULT_LOCK.y + 3, w: 4.4, d: VAULT_LOCK.d - 6, r: 1.2 },
  z: LOCK_Z0,
  h: 11.2,
  bevel: 0.3,
  tone: "mid",
  material: "steel"
});
[VAULT_LOCK.y + 6.5, VAULT_LOCK.y + VAULT_LOCK.d - 6.5].forEach((ry, idx) => {
  const railF = frameOf([FRONT_PILLOW_X + 2.2, ry, PLUNGER_Z0], [1, 0, 0], [0, 0, 1]);
  T.round({
    name: `lock.rail.${idx}`,
    layer: plungerLayer,
    F: railF,
    s0: 0,
    s1: VAULT_LOCK.x - (FRONT_PILLOW_X + 2.2),
    r: 1.0,
    tone: "hi",
    material: "chrome"
  });
});

const DIAL_F = VERT(0, 0);
const tick = (angle, from, to) =>
  `M${(Math.sin(angle) * from).toFixed(3)} ${(-Math.cos(angle) * from).toFixed(3)}L${(Math.sin(angle) * to).toFixed(3)} ${(-Math.cos(angle) * to).toFixed(3)}`;
const ringPath = (r, steps) =>
  Array.from(
    { length: steps },
    (_, j) => `${j ? "L" : "M"}${(r * Math.cos((j / steps) * Math.PI * 2)).toFixed(3)} ${(r * Math.sin((j / steps) * Math.PI * 2)).toFixed(3)}`
  ).join("") + "Z";

function dialFaceMarkup() {
  const rim = FACE_R - 0.9;
  const minor = [];
  const major = [];
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    (i % 12 ? minor : major).push(tick(a, rim - (i % 12 ? 1.5 : 3.2), rim));
  }
  const codes = CODES.map((code, i) => {
    const a = (i * Math.PI) / 2;
    const r = rim - 6.6;
    return `<text class="iso-face-text" data-tone="mid" font-size="3.6" font-weight="600" text-anchor="middle" transform="translate(${(Math.sin(a) * r).toFixed(3)} ${(-Math.cos(a) * r).toFixed(3)}) rotate(${(i * 90).toFixed(1)}) translate(0 1.3)">${code}</text>`;
  }).join("");
  return `<path class="iso-line" data-tone="lo" d="${ringPath(rim, 140)}"/><path class="iso-line" data-tone="lo" d="${minor.join("")}"/><path class="iso-line" data-tone="mid" d="${major.join("")}"/>${codes}<path class="iso-line" data-tone="faint" d="${ringPath(16.8, 100)}"/>`;
}

T.round({
  name: "dial.skirt",
  group: dialGroup,
  layer: dialLayer,
  F: DIAL_F,
  s0: DIAL_Z0,
  s1: SKIRT_TOP,
  r: DIAL_R,
  tone: "hi",
  crease: "lo",
  material: "gunmetal",
  details: {
    seams: [DIAL_Z0 + 0.8, SKIRT_TOP - 0.7],
    ribs: { s0: DIAL_Z0 + 0.8, s1: SKIRT_TOP - 0.7, count: 144, fade: [0.08, 0.5], seams: true, tone: "lo" }
  }
});
const dialBevel = T.round({
  name: "dial.bevel",
  group: dialGroup,
  layer: dialLayer,
  F: DIAL_F,
  s0: SKIRT_TOP,
  s1: BEVEL_TOP,
  r: [DIAL_R, FACE_R],
  tone: "hi",
  crease: "lo",
  material: "steel"
});
T.plane({ part: dialBevel, o: [0, 0, BEVEL_TOP], u: [1, 0, 0], v: [0, 1, 0], svg: dialFaceMarkup(), fade: [0.04, 0.3] });

T.round({
  name: "dial.hub",
  group: dialGroup,
  layer: dialLayer,
  F: DIAL_F,
  s0: BEVEL_TOP,
  s1: HUB_TOP,
  r: HUB_R,
  tone: "hi",
  crease: "lo",
  material: "copper",
  details: {
    seams: [BEVEL_TOP + 1.1],
    bolts: [{ s: HUB_TOP, r: 8.6, count: 6, phase: 0.25, size: 0.45, tone: "mid" }]
  }
});

const POINTER_POLY = [
  [-6.5, -3.4],
  [25.5, -2.4],
  [27.2, -1.3],
  [27.2, 1.3],
  [25.5, 2.4],
  [-6.5, 3.4]
];
T.prism({
  name: "dial.pointer",
  group: dialGroup,
  layer: dialLayer,
  F: { o: [0, 0, 0], a: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] },
  polygon: POINTER_POLY,
  s0: HUB_TOP,
  s1: HUB_TOP + 2.8,
  round: 0.7,
  bevel: 0.32,
  tone: "hi",
  crease: "lo",
  material: "gold"
});
T.round({
  name: "dial.reticle",
  group: dialGroup,
  layer: dialLayer,
  F: VERT(22.5, 0),
  s0: HUB_TOP + 2.8,
  s1: HUB_TOP + 3.9,
  r: 1.85,
  tone: "hi",
  lit: true,
  material: "copper"
});

for (let i = 0; i < 4; i++) {
  const ang = (i * Math.PI) / 2;
  const lx = Math.cos(ang) * 23.0;
  const ly = Math.sin(ang) * 23.0;
  T.round({
    name: `dial.lug.${i}`,
    group: dialGroup,
    layer: dialLayer,
    F: VERT(lx, ly),
    s0: BEVEL_TOP,
    s1: BEVEL_TOP + 1.5,
    r: 2.1,
    tone: "hi",
    material: "brass",
    details: { bolts: [{ s: BEVEL_TOP + 1.5, r: 0, count: 1, size: 0.4 }] }
  });
}

const CARRIAGE = { x: 43.4, y: VAULT_LOCK.y + 7.6, w: 7.2, d: VAULT_LOCK.d - 15.2, r: 1.2 };
T.prism({
  name: "plunger.carriage",
  group: plungerGroup,
  layer: plungerLayer,
  plan: CARRIAGE,
  z: LOCK_Z0 + 0.1,
  h: PLUNGER_Z0 + 1.0 - (LOCK_Z0 + 0.1),
  bevel: 0.25,
  tone: "mid",
  crease: "lo",
  material: "brass"
});
T.prism({
  name: "plunger.cap",
  group: plungerGroup,
  layer: plungerLayer,
  plan: { x: CARRIAGE.x, y: VAULT_LOCK.y + 4.8, w: CARRIAGE.w, d: VAULT_LOCK.d - 9.6, r: 1.2 },
  z: PLUNGER_Z0 + 1.05,
  h: 3.4,
  bevel: 0.3,
  tone: "hi",
  crease: "lo",
  material: "brass"
});
const ROD_F = frameOf([50.6, PLUNGER_Y0, PLUNGER_Z0], [1, 0, 0], [0, 0, 1]);
T.round({
  name: "plunger.rod",
  group: plungerGroup,
  layer: plungerLayer,
  F: ROD_F,
  s0: 0,
  s1: 5.4,
  r: 2.0,
  tone: "hi",
  material: "chrome",
  details: { seams: [2.2, 4.2] }
});
T.round({
  name: "plunger.tip",
  group: plungerGroup,
  layer: plungerLayer,
  F: ROD_F,
  s0: 5.4,
  s1: 8.4,
  r: [2.3, 1.7],
  tone: "hi",
  lit: true,
  material: "copper"
});

const poses = () => {
  const out = [];
  for (let d = 0; d < 360; d += 3) {
    out.push({ dial: d, plunger: (Math.sin((d * Math.PI) / 180) * 0.5 + 0.5) * 6.0 });
  }
  return out;
};

staticBase();
staticIntake();
frontRackAndLock();

const out = T.build({ statics: R.items, poses });
A.settle(R, P);
const layerOf = (name) => R.items.filter((item) => item.layer === name).sort((a, b) => a.key - b.key).map((item) => item.svg);
const BACK = [`<path class="iso-halo" d="${k.haloOf(PLATE, PLATE_Z0 - FOOT_H, PLATE_Z1 - PLATE_Z0 + FOOT_H, P)}" style="filter:blur(5px)"/>`, ...layerOf("back")];
const MID = layerOf("mid");
const FRONT = layerOf("front");

const staticSvg = (list) =>
  `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg iso-layer" viewBox="0 0 ${WIDTH} ${HEIGHT}" aria-hidden="true">${list.join("")}</svg>`;

const bundle = {
  turn: out.data,
  gl: {
    width: WIDTH,
    height: HEIGHT,
    camera: glCamera(P),
    plateZ: PLATE_Z1,
    dialRadius: DIAL_R,
    reticle: [22.5, 0, HUB_TOP + 4.1],
    ports: PORT_CENTERS.map(([px, py]) => [px, py, PLATE_Z1 + 7.3]),
    portsScreen: PORT_CENTERS.map(([px, py]) => at([px, py, PLATE_Z1 + 7.3])),
    vaultLampScreen: at([VAULT_LOCK.x + 11, VAULT_LOCK.y + 17, VAULT_TOP + 2.2]),
    gaugeNeedlePivot: at([GAUGE_AT[0] - 3, GAUGE_AT[1] + 5, PLATE_Z1 + 16.3])
  },
  backSvg: k.figureSvg({ width: WIDTH, height: HEIGHT, body: BACK, className: "kx-back-svg" }).replace("<svg ", `<svg aria-hidden="true" `),
  dialSvg: out.layerSvg("dial", { width: WIDTH, height: HEIGHT }).replace("<svg ", `<svg aria-hidden="true" `),
  midSvg: staticSvg(MID),
  plungerSvg: out.layerSvg("plunger", { width: WIDTH, height: HEIGHT }).replace("<svg ", `<svg aria-hidden="true" `),
  frontSvg: staticSvg(FRONT)
};

const themedCss = `${k.ISO_CSS}\n${out.css}\n`.replaceAll(
  /\.iso\[data-theme="(light|dark)"\]([^,{]*)/g,
  (_, mode, tail) => `.iso[data-theme="${mode}"]${tail},:root[data-theme="${mode}"] .iso:not([data-theme])${tail}`
);
const cssTarget = resolve(HERE, "..", "src", "components", "landing", "anatomy", "switchboard_rig.css");
writeFileSync(cssTarget, themedCss);

const target = resolve(HERE, "..", "src", "components", "landing", "anatomy", "switchboard_bundle.ts");
const fileSource =
  `import type { SwitchboardBundle } from "../../../site/types/switchboard_bundle.type";\n\n` +
  `const SWITCHBOARD_BUNDLE: SwitchboardBundle = ${JSON.stringify(bundle)};\n\n` +
  `export { SWITCHBOARD_BUNDLE };\n`;

writeFileSync(target, fileSource);
console.log(`wrote switchboard_bundle.ts (${(fileSource.length / 1024).toFixed(0)} KB, ${out.report.parts} parts) and switchboard_rig.css`);
