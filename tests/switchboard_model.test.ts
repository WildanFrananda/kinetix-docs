import { describe, expect, test } from "bun:test";
import {
  SWITCHBOARD_CHANNELS,
  SWITCHBOARD_ORDER,
  channelFromAngle,
  formatSwitchboardReadout,
  nearestSnapAngle,
  normalizeDegrees,
  stepDialSpring,
  stepScalarSpring
} from "../src/components/landing/anatomy/switchboard_model";
import { heroSwitchboardLabels } from "../src/site/switchboard_labels";

describe("switchboard domain model", () => {
  test("maps all four quadrant notches cleanly", () => {
    expect(SWITCHBOARD_ORDER).toEqual(["COM", "FUL", "IDN", "NTR"]);
    expect(channelFromAngle(0).code).toBe("COM");
    expect(channelFromAngle(90).code).toBe("FUL");
    expect(channelFromAngle(180).code).toBe("IDN");
    expect(channelFromAngle(270).code).toBe("NTR");
    expect(channelFromAngle(-90).code).toBe("NTR");
    expect(channelFromAngle(449).code).toBe("FUL");
  });

  test("normalizes degrees and snaps to 90 degree detents", () => {
    expect(normalizeDegrees(-90)).toBe(270);
    expect(normalizeDegrees(450)).toBe(90);
    expect(nearestSnapAngle(44)).toBe(0);
    expect(nearestSnapAngle(46)).toBe(90);
    expect(nearestSnapAngle(-46)).toBe(-90);
  });

  test("converges dial and scalar springs without overshoot traps", () => {
    const dial = { angle: 0, v: 0 };
    for (let step = 0; step < 180; step++) {
      stepDialSpring(dial, 90, 1 / 60);
    }
    expect(Math.abs(dial.angle - 90)).toBeLessThan(0.05);

    const plunger = { x: 0, v: 0 };
    for (let step = 0; step < 180; step++) {
      stepScalarSpring(plunger, 1, 1 / 60);
    }
    expect(Math.abs(plunger.x - 1)).toBeLessThan(0.001);
  });

  test("formats telemetry readout consistently", () => {
    const ful = SWITCHBOARD_CHANNELS.FUL;
    expect(formatSwitchboardReadout(ful, 1, "LOCKED")).toBe("FUL · FOR UPDATE · 6.8ms · LOCKED · 169 rps");
    expect(formatSwitchboardReadout(SWITCHBOARD_CHANNELS.COM, 0, "LOCKED")).toBe(
      "COM · gRPC HTTP/2 · 4.2ms · 0% · 39 rps"
    );
  });

  test("loads symmetric English and Indonesian switchboard labels", () => {
    const en = heroSwitchboardLabels("en");
    const id = heroSwitchboardLabels("id");

    expect(en.channelNames.COM).toBe("Commerce");
    expect(id.channelNames.COM).toBe("Commerce");
    expect(en.lockedBadge).toBe("LOCKED");
    expect(id.lockedBadge).toBe("TERKUNCI");
  });
});
