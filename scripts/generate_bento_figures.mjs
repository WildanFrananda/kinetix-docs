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
const T = await import(pathToFileURL(join(kitDir, "tube.mjs")).href);
const A = await import(pathToFileURL(join(kitDir, "audit.mjs")).href);

const S = (paths, opts = {}) => k.solidSvg(paths, opts);
const L = (d, opts = {}) => k.lineSvg(d, opts);
const D = (pts, opts = {}) => k.dotsSvg(pts, opts);
const VERT = (x, y) => G.frameOf([x, y, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
const frameOf = (o, a, u) => {
  const axis = G.unit3(a);
  const uu = u ? G.unit3(G.sub3(u, G.mul3(axis, G.dot3(u, axis)))) : G.frameAlong(o, axis).u;
  return { o, a: axis, u: uu, v: G.cross3(axis, uu) };
};

function makeRig(W, H, bounds, zMax = 34, cam = { azimuth: 38, elevation: 26 }, pad = 11) {
  const pts = [];
  for (const [x, y] of k.corners(bounds, -2)) {
    pts.push([x, y, -4.5]);
    pts.push([x, y, zMax]);
  }
  const P = k.fitProjection(pts, W, H, { pad, headroom: 4, azimuth: cam.azimuth, elevation: cam.elevation });
  const R = A.recorder(P);
  const put = ({ name, layer = "mid", at: p, bias = 0, svg, shapes = [], ...rest }) => {
    const n = R.nameFor(name);
    const tagged = shapes.map((s, i) =>
      R.solid({ ...s, name: s.name ?? (shapes.length > 1 ? `${n}.${i}` : n), owner: s.owner ?? n })
    );
    R.put({ name: n, layer, at: p, bias, svg, shapes: tagged, ...rest });
    return n;
  };
  return { P, R, put, at: (p) => k.iso(p, P) };
}

function addDeck({ P, put, at }, plan, plateMat = "gunmetal", boltMat = "steel") {
  const Z0 = 0;
  const Z1 = 4.5;
  const FOOT_H = 3.5;
  k.corners(plan, 9).forEach(([fx, fy], idx) => {
    const F = VERT(fx, fy);
    const pad = G.disc(-FOOT_H, -FOOT_H + 1.2, 5.2, F, P);
    const stem = G.disc(-FOOT_H + 1.2, Z0, 3.8, F, P);
    put({
      name: `foot.${idx}`,
      layer: "back",
      at: [fx, fy, -FOOT_H],
      svg: `<g data-mat="rubber">${S(pad, { tone: "lo" })}${S(stem, { tone: "mid" })}</g>`,
      shapes: [
        A.disc(F, -FOOT_H, -FOOT_H + 1.2, 5.2, { ground: true }),
        A.disc(F, -FOOT_H + 1.2, Z0, 3.8, { ground: true })
      ]
    });
  });

  const slab = k.slabOf(plan, Z0, Z1, P, 8, 0.4);
  const bolts = k.corners(plan, 7.5);
  const screwRings = bolts.map(([bx, by]) => k.ring(bx, by, 1.8, Z1, P, 14)).join("");
  const inner = k.planOutline(k.insetPlan(plan, 2.8), Z1, P);
  put({
    name: "deck",
    layer: "back",
    at: [0, 0, Z0],
    svg:
      `<g data-mat="${plateMat}">` +
      S(slab, { tone: "mid", inner: L(inner, { tone: "faint" }) }) +
      `</g><g data-mat="${boltMat}">` +
      L(screwRings, { tone: "lo" }) +
      D(bolts.map(([bx, by]) => at([bx, by, Z1])), { size: 0.45, tone: "mid" }) +
      `</g>`,
    shapes: [A.slab(plan, Z0, Z1, { ground: true })]
  });
  return { Z1, FOOT_H };
}

function addPipe({ P, put }, { name, from, to, r = 1.6, flangeR = 2.8, flangeL = 1.6, layer = "mid", mat = "copper", flangeMat = "chrome", tone = "hi", lit = false, flow = false }) {
  const dir = G.sub3(to, from);
  const len = G.len3(dir);
  const u = G.unit3(dir);
  const negU = G.mul3(u, -1);
  const F = frameOf(from, dir, [0, 0, 1]);
  put({
    name: `${name}.f0`,
    layer,
    at: from,
    svg: `<g data-mat="${flangeMat}">${S(G.disc(0, flangeL, flangeR, F, P, { bevel: 0.2 }), { tone: "mid" })}</g>`,
    shapes: [A.disc(F, 0, flangeL, flangeR, { name: `${name}.f0`, owner: name })]
  });
  put({
    name: `${name}.f1`,
    layer,
    at: to,
    svg: `<g data-mat="${flangeMat}">${S(G.disc(len - flangeL, len, flangeR, F, P, { bevel: 0.2 }), { tone: "mid" })}</g>`,
    shapes: [A.disc(F, len - flangeL, len, flangeR, { name: `${name}.f1`, owner: name })]
  });
  const pcs = T.tubePieces([from, to], r, P, {
    gaps: [[0, flangeL], [len - flangeL, len]],
    steps: 14,
    ends: [false, false]
  });
  pcs.forEach((pc, idx) => {
    const lift = [0, 0, r * 0.92];
    const pStart = pc.points[0];
    const pEnd = pc.points[pc.points.length - 1];
    const trace = flow && pStart && pEnd
      ? L(k.pathOf([k.iso(G.add3(pStart, lift), P), k.iso(G.add3(pEnd, lift), P)]), { tone: "lit", flow: true, free: true })
      : "";
    put({
      name: `${name}.p.${idx}`,
      layer,
      route: name,
      chunk: idx,
      at: pc.mid,
      svg: `<g data-mat="${mat}">${T.tubeSvg(pc, { tone, lit })}</g>${trace}`,
      shapes: [
        A.tube(pc.points, pc.radii, {
          name: `${name}.p.${idx}`,
          owner: name,
          tips: [from, to],
          tipAxes: [u, negU]
        })
      ]
    });
  });
}

function buildContracts() {
  const plan = { x: -78, y: -46, w: 156, d: 92, r: 5.5 };
  const rig = makeRig(380, 185, plan, 36, { azimuth: 38, elevation: 26 }, 11);
  const { P, put, at } = rig;
  const { Z1, FOOT_H } = addDeck(rig, plan, "steel", "gunmetal");

  const bankPlan = { x: -68, y: -34, w: 42, d: 68, r: 3 };
  put({
    name: "bank.base",
    layer: "mid",
    at: [-47, 0, Z1],
    svg: `<g data-mat="gunmetal">${S(k.slabOf(bankPlan, Z1, 14, P, 8, 0.4), { tone: "mid" })}</g>`,
    shapes: [A.slab(bankPlan, Z1, 14)]
  });

  const blades = [
    { y: -23, h: 16, mat: "brass", lit: false },
    { y: -5.5, h: 20, mat: "copper", lit: true },
    { y: 12, h: 16, mat: "brass", lit: false }
  ];
  blades.forEach((b, i) => {
    const bPlan = { x: -62, y: b.y, w: 30, d: 11, r: 1.5 };
    const topZ = Z1 + 14 + b.h;
    const midPt = [-47, b.y + 5.5, topZ];
    put({
      name: `bank.blade.${i}`,
      layer: "mid",
      at: [-47, b.y + 5.5, Z1 + 14],
      svg: `<g data-mat="${b.mat}">${S(k.slabOf(bPlan, Z1 + 14, b.h, P, 8, 0.3), {
        tone: b.lit ? "hi" : "mid",
        lit: b.lit,
        inner: D([at([midPt[0] - 8, midPt[1], topZ]), at([midPt[0] + 8, midPt[1], topZ])], { size: 0.42, tone: b.lit ? "hi" : "mid" })
      })}</g>`,
      shapes: [A.slab(bPlan, Z1 + 14, b.h)]
    });
  });

  const busPlan = { x: 26, y: -34, w: 42, d: 68, r: 3 };
  put({
    name: "collector.body",
    layer: "mid",
    at: [47, 0, Z1],
    svg: `<g data-mat="gunmetal">${S(k.slabOf(busPlan, Z1, 22, P, 8, 0.4), { tone: "mid" })}</g>`,
    shapes: [A.slab(busPlan, Z1, 22)]
  });
  const crownPlan = { x: 32, y: -22, w: 30, d: 44, r: 2.2 };
  put({
    name: "collector.crown",
    layer: "front",
    at: [47, 0, Z1 + 22],
    svg: `<g data-mat="copper">${S(k.slabOf(crownPlan, Z1 + 22, 6, P, 8, 0.28), { tone: "hi", lit: true })}</g>`,
    shapes: [A.slab(crownPlan, Z1 + 22, 6)]
  });
  const studF = VERT(47, 0);
  put({
    name: "collector.stud",
    layer: "front",
    at: [47, 0, Z1 + 28],
    svg: `<g data-mat="gold">${S(G.disc(Z1 + 28, Z1 + 31.5, 5.2, studF, P, { bevel: 0.2 }), { tone: "hi", lit: true })}</g>`,
    shapes: [A.disc(studF, Z1 + 28, Z1 + 31.5, 5.2)]
  });

  [-17.5, 0, 17.5].forEach((py, idx) => {
    const center = idx === 1;
    addPipe(rig, {
      name: `conduit.${idx}`,
      from: [-26, py, Z1 + 7.5],
      to: [26, py, Z1 + 7.5],
      r: center ? 2.1 : 1.7,
      flangeR: 3.1,
      flangeL: 2.0,
      layer: "mid",
      mat: center ? "copper" : "rubber",
      flangeMat: "chrome",
      tone: center ? "hi" : "mid",
      lit: center,
      flow: center
    });
  });

  return { rig, plan, FOOT_H, Z1, width: 380, height: 185, label: "gRPC Proto Schema Cartridge Bank and Tri-Conduit Manifold" };
}

function buildConcurrency() {
  const plan = { x: -64, y: -44, w: 128, d: 88, r: 5 };
  const rig = makeRig(300, 185, plan, 41, { azimuth: 38, elevation: 26 }, 11);
  const { P, put } = rig;
  const { Z1, FOOT_H } = addDeck(rig, plan, "gunmetal", "brass");

  const anvilPlan = { x: -54, y: -26, w: 30, d: 52, r: 2.5 };
  put({
    name: "anvil.block",
    layer: "mid",
    at: [-39, 0, Z1],
    svg: `<g data-mat="steel">${S(k.slabOf(anvilPlan, Z1, 24, P, 8, 0.35), { tone: "mid" })}</g>`,
    shapes: [A.slab(anvilPlan, Z1, 24)]
  });
  const shimPlan = { x: -48, y: -16, w: 18, d: 32, r: 1.5 };
  put({
    name: "anvil.shim",
    layer: "mid",
    at: [-39, 0, Z1 + 24],
    svg: `<g data-mat="brass">${S(k.slabOf(shimPlan, Z1 + 24, 4, P, 8, 0.2), { tone: "hi" })}</g>`,
    shapes: [A.slab(shimPlan, Z1 + 24, 4)]
  });

  const jawPlan = { x: -16, y: -22, w: 32, d: 44, r: 2.2 };
  put({
    name: "lock.jaw",
    layer: "mid",
    at: [0, 0, Z1],
    svg: `<g data-mat="brass">${S(k.slabOf(jawPlan, Z1, 19, P, 8, 0.35), { tone: "hi", lit: true })}</g>`,
    shapes: [A.slab(jawPlan, Z1, 19)]
  });

  const pinF = VERT(0, 0);
  put({
    name: "lock.collar",
    layer: "front",
    at: [0, 0, Z1 + 19],
    svg: `<g data-mat="steel">${S(G.disc(Z1 + 19, Z1 + 22.5, 9.5, pinF, P, { bevel: 0.25 }), { tone: "mid" })}</g>`,
    shapes: [A.disc(pinF, Z1 + 19, Z1 + 22.5, 9.5)]
  });
  put({
    name: "lock.pin",
    layer: "front",
    at: [0, 0, Z1 + 22.5],
    svg: `<g data-mat="copper">${S(G.lathe([
      [Z1 + 22.5, 5.2],
      [Z1 + 31.0, 5.2],
      [Z1 + 32.8, 6.4],
      [Z1 + 35.8, 6.4],
      [Z1 + 36.8, 4.6]
    ], pinF, P, { steps: 20 }), { tone: "hi", lit: true })}</g>`,
    shapes: [A.solid(pinF, [
      [Z1 + 22.5, 5.2],
      [Z1 + 31.0, 5.2],
      [Z1 + 32.8, 6.4],
      [Z1 + 35.8, 6.4],
      [Z1 + 36.8, 4.6]
    ])]
  });

  const housingPlan = { x: 26, y: -24, w: 28, d: 48, r: 2.5 };
  put({
    name: "actuator.body",
    layer: "mid",
    at: [40, 0, Z1],
    svg: `<g data-mat="steel">${S(k.slabOf(housingPlan, Z1, 22, P, 8, 0.35), { tone: "mid" })}</g>`,
    shapes: [A.slab(housingPlan, Z1, 22)]
  });
  const hwF = frameOf([54, 0, Z1 + 11], [1, 0, 0], [0, 0, 1]);
  put({
    name: "actuator.wheel",
    layer: "front",
    at: [54, 0, Z1 + 11],
    svg: `<g data-mat="chrome">${S(G.disc(0, 3.2, 8.2, hwF, P, { bevel: 0.25 }), { tone: "hi", inner: D(G.dotsOf(hwF, 3.2, 6.2, 6, P), { size: 0.42, tone: "hi" }) })}</g>`,
    shapes: [A.disc(hwF, 0, 3.2, 8.2)]
  });

  [-11, 11].forEach((ry, i) => {
    addPipe(rig, {
      name: `guide.${i}`,
      from: [16, ry, Z1 + 10],
      to: [26, ry, Z1 + 10],
      r: 1.5,
      flangeR: 2.5,
      flangeL: 1.3,
      layer: "mid",
      mat: "chrome",
      flangeMat: "gunmetal",
      tone: "mid"
    });
  });

  addPipe(rig, {
    name: "spacer.rail",
    from: [-24, 0, Z1 + 9.5],
    to: [-16, 0, Z1 + 9.5],
    r: 1.7,
    flangeR: 2.8,
    flangeL: 1.3,
    layer: "mid",
    mat: "gold",
    flangeMat: "chrome",
    tone: "hi",
    lit: true
  });

  return { rig, plan, FOOT_H, Z1, width: 300, height: 185, label: "Pessimistic FOR UPDATE Lock Vise and Dowel Pin" };
}

function buildBoundary() {
  const plan = { x: -64, y: -44, w: 128, d: 88, r: 5 };
  const rig = makeRig(300, 185, plan, 39, { azimuth: 38, elevation: 26 }, 11);
  const { P, put } = rig;
  const { Z1, FOOT_H } = addDeck(rig, plan, "steel", "gunmetal");

  const wallPlan = { x: -5.5, y: -35, w: 11, d: 70, r: 2 };
  put({
    name: "firewall.wall",
    layer: "mid",
    at: [0, 0, Z1],
    svg: `<g data-mat="gunmetal">${S(k.slabOf(wallPlan, Z1, 30, P, 8, 0.35), { tone: "mid" })}</g>`,
    shapes: [A.slab(wallPlan, Z1, 30)]
  });
  const capPlan = { x: -7, y: -36, w: 14, d: 72, r: 2 };
  put({
    name: "firewall.cap",
    layer: "front",
    at: [0, 0, Z1 + 30],
    svg: `<g data-mat="copper">${S(k.slabOf(capPlan, Z1 + 30, 4, P, 8, 0.25), { tone: "hi", lit: true })}</g>`,
    shapes: [A.slab(capPlan, Z1 + 30, 4)]
  });

  const drumF = VERT(-38, 0);
  put({
    name: "session.drum",
    layer: "back",
    at: [-38, 0, Z1],
    svg: `<g data-mat="rubber">${S(G.lathe([
      [Z1, 14],
      [Z1 + 16, 14],
      [Z1 + 18.5, 11.5]
    ], drumF, P, { steps: 22 }), { tone: "mid" })}</g>`,
    shapes: [A.solid(drumF, [
      [Z1, 14],
      [Z1 + 16, 14],
      [Z1 + 18.5, 11.5]
    ])]
  });
  put({
    name: "session.cap",
    layer: "mid",
    at: [-38, 0, Z1 + 18.5],
    svg: `<g data-mat="brass">${S(G.disc(Z1 + 18.5, Z1 + 22, 6.8, drumF, P, { bevel: 0.2 }), { tone: "hi" })}</g>`,
    shapes: [A.disc(drumF, Z1 + 18.5, Z1 + 22, 6.8)]
  });

  addPipe(rig, {
    name: "cookie.inlet",
    from: [-24, 0, Z1 + 8.5],
    to: [-5.5, 0, Z1 + 8.5],
    r: 1.9,
    flangeR: 3.1,
    flangeL: 1.8,
    layer: "mid",
    mat: "brass",
    flangeMat: "chrome",
    tone: "mid"
  });

  const mintPlan = { x: 24, y: -22, w: 30, d: 44, r: 2.5 };
  put({
    name: "mint.block",
    layer: "mid",
    at: [39, 0, Z1],
    svg: `<g data-mat="chrome">${S(k.slabOf(mintPlan, Z1, 21, P, 8, 0.35), { tone: "hi" })}</g>`,
    shapes: [A.slab(mintPlan, Z1, 21)]
  });
  const dialF = VERT(39, 0);
  put({
    name: "mint.seal",
    layer: "front",
    at: [39, 0, Z1 + 21],
    svg: `<g data-mat="gold">${S(G.disc(Z1 + 21, Z1 + 25, 8.8, dialF, P, { bevel: 0.25 }), { tone: "hi", lit: true })}</g>`,
    shapes: [A.disc(dialF, Z1 + 21, Z1 + 25, 8.8)]
  });

  addPipe(rig, {
    name: "jwt.outlet",
    from: [5.5, 0, Z1 + 14.5],
    to: [24, 0, Z1 + 14.5],
    r: 1.9,
    flangeR: 3.1,
    flangeL: 1.8,
    layer: "front",
    mat: "copper",
    flangeMat: "chrome",
    tone: "hi",
    lit: true,
    flow: true
  });

  return { rig, plan, FOOT_H, Z1, width: 300, height: 185, label: "Edge BFF Air-Gap Bulkhead and Token Mint" };
}

function buildIdentity() {
  const plan = { x: -78, y: -46, w: 156, d: 92, r: 5.5 };
  const rig = makeRig(380, 185, plan, 40, { azimuth: 38, elevation: 26 }, 11);
  const { P, put } = rig;
  const { Z1, FOOT_H } = addDeck(rig, plan, "gunmetal", "brass");

  const plinthPlan = { x: -64, y: -30, w: 128, d: 60, r: 3.5 };
  put({
    name: "plinth",
    layer: "back",
    at: [0, 0, Z1],
    svg: `<g data-mat="steel">${S(k.slabOf(plinthPlan, Z1, 6, P, 8, 0.3), { tone: "mid" })}</g>`,
    shapes: [A.slab(plinthPlan, Z1, 6)]
  });

  const K1_F = VERT(-37, 0);
  put({
    name: "turret.k1",
    layer: "mid",
    at: [-37, 0, Z1 + 6],
    svg: `<g data-mat="steel">${S(G.lathe([
      [Z1 + 6, 17],
      [Z1 + 16, 17],
      [Z1 + 17.5, 14.5],
      [Z1 + 24, 14.5],
      [Z1 + 25.5, 11.5]
    ], K1_F, P, { steps: 24 }), { tone: "mid" })}</g>`,
    shapes: [A.solid(K1_F, [
      [Z1 + 6, 17],
      [Z1 + 16, 17],
      [Z1 + 17.5, 14.5],
      [Z1 + 24, 14.5],
      [Z1 + 25.5, 11.5]
    ])]
  });
  put({
    name: "turret.k1.cap",
    layer: "mid",
    at: [-37, 0, Z1 + 25.5],
    svg: `<g data-mat="chrome">${S(G.disc(Z1 + 25.5, Z1 + 29, 7.6, K1_F, P, { bevel: 0.2 }), { tone: "mid" })}</g>`,
    shapes: [A.disc(K1_F, Z1 + 25.5, Z1 + 29, 7.6)]
  });

  const K2_F = VERT(37, 0);
  put({
    name: "turret.k2",
    layer: "mid",
    at: [37, 0, Z1 + 6],
    svg: `<g data-mat="copper">${S(G.lathe([
      [Z1 + 6, 17.5],
      [Z1 + 18, 17.5],
      [Z1 + 19.5, 15.2],
      [Z1 + 29, 15.2],
      [Z1 + 31, 12]
    ], K2_F, P, { steps: 24 }), { tone: "hi", lit: true })}</g>`,
    shapes: [A.solid(K2_F, [
      [Z1 + 6, 17.5],
      [Z1 + 18, 17.5],
      [Z1 + 19.5, 15.2],
      [Z1 + 29, 15.2],
      [Z1 + 31, 12]
    ])]
  });
  put({
    name: "turret.k2.cap",
    layer: "front",
    at: [37, 0, Z1 + 31],
    svg: `<g data-mat="gold">${S(G.disc(Z1 + 31, Z1 + 35, 8.2, K2_F, P, { bevel: 0.22 }), { tone: "hi", lit: true })}</g>`,
    shapes: [A.disc(K2_F, Z1 + 31, Z1 + 35, 8.2)]
  });

  const hubPlan = { x: -11, y: -13, w: 22, d: 26, r: 2 };
  put({
    name: "coupler.hub",
    layer: "mid",
    at: [0, 0, Z1 + 6],
    svg: `<g data-mat="gunmetal">${S(k.slabOf(hubPlan, Z1 + 6, 12, P, 8, 0.3), { tone: "mid" })}</g>`,
    shapes: [A.slab(hubPlan, Z1 + 6, 12)]
  });
  const vanePlan = { x: -5, y: -3, w: 13, d: 6, r: 1.2 };
  put({
    name: "coupler.vane",
    layer: "front",
    at: [1.5, 0, Z1 + 18],
    svg: `<g data-mat="brass">${S(k.slabOf(vanePlan, Z1 + 18, 3.5, P, 8, 0.2), { tone: "hi", lit: true })}</g>`,
    shapes: [A.slab(vanePlan, Z1 + 18, 3.5)]
  });

  addPipe(rig, {
    name: "link.left",
    from: [-20, 0, Z1 + 12],
    to: [-11, 0, Z1 + 12],
    r: 1.6,
    flangeR: 2.6,
    flangeL: 1.3,
    layer: "mid",
    mat: "chrome",
    flangeMat: "gunmetal",
    tone: "mid"
  });
  addPipe(rig, {
    name: "link.right",
    from: [11, 0, Z1 + 12],
    to: [19.5, 0, Z1 + 12],
    r: 1.75,
    flangeR: 2.8,
    flangeL: 1.4,
    layer: "mid",
    mat: "copper",
    flangeMat: "chrome",
    tone: "hi",
    lit: true,
    flow: true
  });

  return { rig, plan, FOOT_H, Z1, width: 380, height: 185, label: "Dual-Key JWKS Turret Changer K1 to K2" };
}

function buildVerifier() {
  const plan = { x: -78, y: -46, w: 156, d: 92, r: 5.5 };
  const rig = makeRig(380, 185, plan, 43, { azimuth: 38, elevation: 26 }, 11);
  const { P, put } = rig;
  const { Z1, FOOT_H } = addDeck(rig, plan, "gunmetal", "steel");

  const bedPlan = { x: -56, y: -27, w: 72, d: 54, r: 3 };
  put({
    name: "anvil.bed",
    layer: "back",
    at: [-20, 0, Z1],
    svg: `<g data-mat="steel">${S(k.slabOf(bedPlan, Z1, 7, P, 8, 0.3), { tone: "mid" })}</g>`,
    shapes: [A.slab(bedPlan, Z1, 7)]
  });

  const WF = VERT(-20, 0);
  put({
    name: "wafer.ring",
    layer: "mid",
    at: [-20, 0, Z1 + 7],
    svg: `<g data-mat="copper">${S(G.disc(Z1 + 7, Z1 + 11.5, 14.5, WF, P, { bevel: 0.25 }), { tone: "hi" })}</g>`,
    shapes: [A.disc(WF, Z1 + 7, Z1 + 11.5, 14.5)]
  });
  put({
    name: "wafer.core",
    layer: "mid",
    at: [-20, 0, Z1 + 11.5],
    svg: `<g data-mat="gold">${S(G.disc(Z1 + 11.5, Z1 + 14.5, 7.6, WF, P, { bevel: 0.2 }), { tone: "hi", lit: true })}</g>`,
    shapes: [A.disc(WF, Z1 + 11.5, Z1 + 14.5, 7.6)]
  });

  const sN = { x: -27, y: -38, w: 14, d: 9, r: 1.5 };
  const sS = { x: -27, y: 29, w: 14, d: 9, r: 1.5 };
  put({
    name: "gantry.north",
    layer: "back",
    at: [-20, -33.5, Z1],
    svg: `<g data-mat="gunmetal">${S(k.slabOf(sN, Z1, 32, P, 8, 0.3), { tone: "mid" })}</g>`,
    shapes: [A.slab(sN, Z1, 32)]
  });
  put({
    name: "gantry.south",
    layer: "front",
    at: [-20, 33.5, Z1],
    svg: `<g data-mat="gunmetal">${S(k.slabOf(sS, Z1, 32, P, 8, 0.3), { tone: "mid" })}</g>`,
    shapes: [A.slab(sS, Z1, 32)]
  });
  const beamPlan = { x: -28, y: -39, w: 16, d: 78, r: 2 };
  put({
    name: "gantry.beam",
    layer: "front",
    at: [-20, 0, Z1 + 32],
    svg: `<g data-mat="steel">${S(k.slabOf(beamPlan, Z1 + 32, 6, P, 8, 0.25), { tone: "hi" })}</g>`,
    shapes: [A.slab(beamPlan, Z1 + 32, 6)]
  });

  const probeF = frameOf([-20, 0, Z1 + 32], [0, 0, -1], [1, 0, 0]);
  put({
    name: "probe.head",
    layer: "front",
    at: [-20, 0, Z1 + 32],
    svg: `<g data-mat="brass">${S(G.lathe([
      [0, 5.4],
      [7, 5.4],
      [8.2, 3.4],
      [13, 3.4],
      [14, 1.8]
    ], probeF, P, { steps: 18 }), { tone: "hi", lit: true })}</g>`,
    shapes: [A.solid(probeF, [
      [0, 5.4],
      [7, 5.4],
      [8.2, 3.4],
      [13, 3.4],
      [14, 1.8]
    ])]
  });

  const dialF = VERT(46, 0);
  put({
    name: "dial.pod",
    layer: "mid",
    at: [46, 0, Z1],
    svg: `<g data-mat="brass">${S(G.disc(Z1, Z1 + 12.5, 14.5, dialF, P, { bevel: 0.3 }), { tone: "mid" })}</g>`,
    shapes: [A.disc(dialF, Z1, Z1 + 12.5, 14.5)]
  });
  const dialTicks = k.radialTicks(46, 0, 8.8, 12, 3.0, Z1 + 14.5, [1.2, 2.2], P, 0, Math.PI * 2);
  const innerRing = k.ring(46, 0, 8.8, Z1 + 14.5, P, 24);
  const cPt = rig.at([46, 0, Z1 + 14.5]);
  const tipPt = rig.at([46 + 5.8 * Math.cos(-0.65), 5.8 * Math.sin(-0.65), Z1 + 14.5]);
  const needle = L(k.pathOf([cPt, tipPt]), { tone: "lit", free: "end" });
  const centerDot = D([cPt], { size: 1.5, tone: "hi" });
  put({
    name: "dial.bezel",
    layer: "front",
    at: [46, 0, Z1 + 12.5],
    svg: `<g data-mat="chrome">${S(G.disc(Z1 + 12.5, Z1 + 14.5, 11.8, dialF, P, { bevel: 0.2 }), {
      tone: "hi",
      lit: true,
      inner: L(innerRing, { tone: "lo" }) + L(dialTicks.minor, { tone: "lo" }) + L(dialTicks.major, { tone: "hi" }) + needle + centerDot
    })}</g>`,
    shapes: [A.disc(dialF, Z1 + 12.5, Z1 + 14.5, 11.8)]
  });

  return { rig, plan, FOOT_H, Z1, width: 380, height: 185, label: "Browser WASM Merkle Specimen Anvil and Probe" };
}

function buildLearn() {
  const plan = { x: -68, y: -40, w: 136, d: 80, r: 5 };
  const rig = makeRig(300, 185, plan, 37, { azimuth: 38, elevation: 26 }, 11);
  const { P, put } = rig;
  const { Z1, FOOT_H } = addDeck(rig, plan, "gunmetal", "steel");

  const pL = { x: -60, y: -8, w: 8, d: 16, r: 1.5 };
  const pR = { x: 52, y: -8, w: 8, d: 16, r: 1.5 };
  put({
    name: "pillow.left",
    layer: "mid",
    at: [-56, 0, Z1],
    svg: `<g data-mat="steel">${S(k.slabOf(pL, Z1, 17, P, 8, 0.25), { tone: "mid" })}</g>`,
    shapes: [A.slab(pL, Z1, 17)]
  });
  put({
    name: "pillow.right",
    layer: "mid",
    at: [56, 0, Z1],
    svg: `<g data-mat="steel">${S(k.slabOf(pR, Z1, 17, P, 8, 0.25), { tone: "mid" })}</g>`,
    shapes: [A.slab(pR, Z1, 17)]
  });
  const fwF = frameOf([60, 0, Z1 + 10.5], [1, 0, 0], [0, 0, 1]);
  put({
    name: "flywheel",
    layer: "front",
    at: [60, 0, Z1 + 10.5],
    svg: `<g data-mat="brass">${S(G.disc(0, 3.2, 8.8, fwF, P, { bevel: 0.25 }), { tone: "hi" })}</g>`,
    shapes: [A.disc(fwF, 0, 3.2, 8.8)]
  });

  const cams = [
    { x: -39, h: 14, mat: "steel", lit: false },
    { x: -13, h: 19, mat: "steel", lit: false },
    { x: 13, h: 24, mat: "brass", lit: false },
    { x: 39, h: 29, mat: "copper", lit: true }
  ];
  cams.forEach((c, idx) => {
    const cPlan = { x: c.x - 9, y: -18, w: 18, d: 36, r: 2 };
    put({
      name: `cam.${idx}`,
      layer: "mid",
      at: [c.x, 0, Z1],
      svg: `<g data-mat="${c.mat}">${S(k.slabOf(cPlan, Z1, c.h, P, 8, 0.3), {
        tone: c.lit ? "hi" : "mid",
        lit: c.lit
      })}</g>`,
      shapes: [A.slab(cPlan, Z1, c.h)]
    });
    const capF = VERT(c.x, 0);
    put({
      name: `cam.cap.${idx}`,
      layer: "front",
      at: [c.x, 0, Z1 + c.h],
      svg: `<g data-mat="${c.lit ? "gold" : "chrome"}">${S(G.disc(Z1 + c.h, Z1 + c.h + 3.2, 4.4, capF, P, { bevel: 0.18 }), {
        tone: c.lit ? "hi" : "mid",
        lit: c.lit
      })}</g>`,
      shapes: [A.disc(capF, Z1 + c.h, Z1 + c.h + 3.2, 4.4)]
    });
  });

  const joints = [
    [-52, -48],
    [-30, -22],
    [-4, 4],
    [22, 30],
    [48, 52]
  ];
  joints.forEach(([x0, x1], idx) => {
    addPipe(rig, {
      name: `axle.${idx}`,
      from: [x0, 0, Z1 + 10.5],
      to: [x1, 0, Z1 + 10.5],
      r: 1.4,
      flangeR: 2.1,
      flangeL: 0.9,
      layer: "mid",
      mat: "chrome",
      flangeMat: "gunmetal",
      tone: "mid"
    });
  });

  return { rig, plan, FOOT_H, Z1, width: 300, height: 185, label: "Four-Stage Stepped Fault Cam Sequencer" };
}

const specs = [
  ["contracts", buildContracts],
  ["concurrency", buildConcurrency],
  ["boundary", buildBoundary],
  ["identity", buildIdentity],
  ["verifier", buildVerifier],
  ["learn", buildLearn]
];

const shouldAudit = process.argv.includes("--audit");
const bundle = {};
for (const [id, fn] of specs) {
  const { rig, plan, FOOT_H, Z1, width, height, label } = fn();
  if (shouldAudit) {
    A.auditOrExit(rig.R, rig.P);
  }
  A.settle(rig.R, rig.P);
  const backHalo = `<path class="iso-halo" d="${k.haloOf(plan, -FOOT_H, Z1 + FOOT_H, rig.P)}"/>`;
  const body = [backHalo, ...rig.R.items.sort((a, b) => a.key - b.key).map((item) => item.svg)];
  const svg = k.figureSvg({ width, height, label, body });
  bundle[id] = { id, width, height, label, svg };
}

const target = resolve(HERE, "..", "src", "components", "landing", "anatomy", "bento_figures_bundle.ts");
const fileSource =
  `import type { BentoFiguresBundle } from "../../../site/types/bento_figures_bundle.type";\n\n` +
  `const BENTO_FIGURES_BUNDLE: BentoFiguresBundle = ${JSON.stringify(bundle)};\n\n` +
  `export { BENTO_FIGURES_BUNDLE };\n`;

writeFileSync(target, fileSource);
console.log(`wrote bento_figures_bundle.ts (${(fileSource.length / 1024).toFixed(0)} KB, ${Object.keys(bundle).length} figures)`);
