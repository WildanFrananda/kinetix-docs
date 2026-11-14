import type { SwitchboardChannel } from "../../../site/types/switchboard_channel.type";
import type { SwitchboardChannelCode } from "../../../site/types/switchboard_channel_code.type";

const SWITCHBOARD_ORDER: readonly SwitchboardChannelCode[] = ["COM", "FUL", "IDN", "NTR"];

const SWITCHBOARD_CHANNELS: Record<SwitchboardChannelCode, SwitchboardChannel> = {
  COM: {
    code: "COM",
    angle: 0,
    locked: 0,
    gauge: 0.28,
    port: 0,
    transport: "gRPC HTTP/2",
    latencyMs: "4.2",
    rps: 84,
    docHrefEn: "/learn/checkout-saga/",
    docHrefId: "/id/learn/checkout-saga/"
  },
  FUL: {
    code: "FUL",
    angle: 90,
    locked: 1,
    gauge: 0.78,
    port: 1,
    transport: "FOR UPDATE",
    latencyMs: "6.8",
    rps: 182,
    docHrefEn: "/learn/two-buyers-one-item/",
    docHrefId: "/id/learn/two-buyers-one-item/"
  },
  IDN: {
    code: "IDN",
    angle: 180,
    locked: 0,
    gauge: 0.44,
    port: 2,
    transport: "JWKS + BFF",
    latencyMs: "3.1",
    rps: 112,
    docHrefEn: "/learn/changing-the-signing-key/",
    docHrefId: "/id/learn/changing-the-signing-key/"
  },
  NTR: {
    code: "NTR",
    angle: 270,
    locked: 1,
    gauge: 0.92,
    port: 3,
    transport: "MERKLE + ZK",
    latencyMs: "11.4",
    rps: 196,
    docHrefEn: "/verify/proof-of-liabilities/",
    docHrefId: "/id/verify/proof-of-liabilities/"
  }
};

function normalizeDegrees(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}

function channelFromAngle(degrees: number): SwitchboardChannel {
  const index = Math.round(normalizeDegrees(degrees) / 90) % SWITCHBOARD_ORDER.length;
  const code = SWITCHBOARD_ORDER[index] ?? "COM";
  return SWITCHBOARD_CHANNELS[code];
}

function nearestSnapAngle(degrees: number): number {
  return Math.round(degrees / 90) * 90;
}

function stepDialSpring(
  state: { angle: number; v: number },
  targetDegrees: number,
  dtSeconds: number
): boolean {
  const dt = Math.min(0.05, Math.max(0.001, dtSeconds));
  const omega = 13;
  const steps = 4;
  const h = dt / steps;
  for (let index = 0; index < steps; index++) {
    const accel = omega * omega * (targetDegrees - state.angle) - 2 * omega * state.v;
    state.v += accel * h;
    state.angle += state.v * h;
  }
  if (Math.abs(targetDegrees - state.angle) < 0.04 && Math.abs(state.v) < 0.04) {
    state.angle = targetDegrees;
    state.v = 0;
    return false;
  }
  return true;
}

function stepScalarSpring(
  state: { x: number; v: number },
  target: number,
  dtSeconds: number,
  omega: number = 18
): boolean {
  const dt = Math.min(0.05, Math.max(0.001, dtSeconds));
  const steps = 4;
  const h = dt / steps;
  for (let index = 0; index < steps; index++) {
    const accel = omega * omega * (target - state.x) - 2 * omega * state.v;
    state.v += accel * h;
    state.x += state.v * h;
  }
  if (Math.abs(target - state.x) < 1e-4 && Math.abs(state.v) < 1e-4) {
    state.x = target;
    state.v = 0;
    return false;
  }
  return true;
}

function formatSwitchboardReadout(
  channel: SwitchboardChannel,
  lockFraction: number,
  lockedText: string
): string {
  const lockPercent = Math.round(lockFraction * 100);
  const lockState = lockPercent >= 85 ? lockedText : `${lockPercent}%`;
  const rps = Math.round(channel.gauge * 140 + lockFraction * 60);
  return `${channel.code} · ${channel.transport} · ${channel.latencyMs}ms · ${lockState} · ${rps} rps`;
}

export {
  SWITCHBOARD_CHANNELS,
  SWITCHBOARD_ORDER,
  channelFromAngle,
  formatSwitchboardReadout,
  nearestSnapAngle,
  normalizeDegrees,
  stepDialSpring,
  stepScalarSpring
};
