<script lang="ts">
  import { onMount } from "svelte";
  import type { HeroSwitchboardLabels } from "../../site/types/hero_switchboard_labels.type";
  import type { LandingStats } from "../../site/types/landing_stats.type";
  import type { Locale } from "../../diagrams/types/locale.type";
  import type { SwitchboardChannelCode } from "../../site/types/switchboard_channel_code.type";
  import { burst, glLayer, settle } from "./anatomy/gl_layer";
  import { SWITCHBOARD_BUNDLE } from "./anatomy/switchboard_bundle";
  import {
    SWITCHBOARD_CHANNELS,
    SWITCHBOARD_ORDER,
    channelFromAngle,
    formatSwitchboardReadout,
    nearestSnapAngle,
    stepDialSpring,
    stepScalarSpring
  } from "./anatomy/switchboard_model";
  import "./anatomy/switchboard_rig.css";
  import { FRONT_FRAG, buildBackFragment } from "./anatomy/switchboard_shaders";
  import { TURN } from "./anatomy/turn_runtime.js";

  type Props = {
    locale: Locale;
    labels: HeroSwitchboardLabels;
    stats: LandingStats;
    contractsVersion: string;
  };

  type Particle = {
    p: [number, number, number];
    v: [number, number, number];
    age: number;
    life: number;
    color: [number, number, number];
  };

  let { locale, labels, stats, contractsVersion }: Props = $props();

  let stageElement: HTMLDivElement | null = null;
  let backCanvasElement: HTMLCanvasElement | null = null;
  let frontCanvasElement: HTMLCanvasElement | null = null;

  let selectedCode = $state<SwitchboardChannelCode>("COM");
  let paused = $state(false);
  let theme = $state<"dark" | "light">("dark");
  let lockEngaged = $state(false);
  let readoutText = $state("");

  const activeChannel = $derived(SWITCHBOARD_CHANNELS[selectedCode]);
  const activeHref = $derived(locale === "id" ? activeChannel.docHrefId : activeChannel.docHrefEn);
  const captionText = $derived(
    labels.captionTemplate
      .replace("{services}", String(stats.services))
      .replace("{languages}", String(stats.languages))
      .replace("{grpc}", String(stats.grpcOperations))
      .replace("{contracts}", contractsVersion)
  );

  let selectNotchExternal: ((code: SwitchboardChannelCode) => void) | null = null;
  let triggerLockExternal: (() => void) | null = null;
  let togglePauseExternal: (() => void) | null = null;

  function handleDomainSelect(code: SwitchboardChannelCode): void {
    selectNotchExternal?.(code);
  }

  function handleLockTrigger(): void {
    triggerLockExternal?.();
  }

  function handleTogglePause(): void {
    togglePauseExternal?.();
  }

  onMount(() => {
    const stage = stageElement;
    const backCanvas = backCanvasElement;
    const frontCanvas = frontCanvasElement;
    if (!stage || !backCanvas || !frontCanvas) {
      return;
    }

    const GLD = SWITCHBOARD_BUNDLE.gl;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function syncDocumentTheme(): "dark" | "light" {
      const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
      theme = current;
      return current;
    }

    syncDocumentTheme();
    const themeObserver = new MutationObserver(() => {
      syncDocumentTheme();
      drawnKey = "";
      scheduleTick();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });

    const dialSpring = { angle: 0, v: 0 };
    const plungerSpring = { x: SWITCHBOARD_CHANNELS.COM.locked, v: 0 };
    const gaugeSpring = { x: SWITCHBOARD_CHANNELS.COM.gauge, v: 0 };
    const glFade = { x: 0, v: 0 };

    let targetDeg = 0;
    let touring = !motionQuery.matches;
    let tourClock = 0;
    let lastTourIdx = 0;
    let idleTimer = 0;
    let visible = false;
    let rafId = 0;
    let lastTime = 0;
    let glClock = 0;
    let lockPulseAt = -99;
    let drawnKey = "";

    const PACKETS = 18;
    const packetData = new Float32Array(PACKETS * 4);
    const packetHeat = new Float32Array(PACKETS);
    const packets: Particle[] = [];
    let randSeed = 19;

    function nextRand(): number {
      randSeed = (randSeed * 16807) % 2147483647;
      return randSeed / 2147483647;
    }

    function ignite(worldFrom: readonly [number, number, number], colorRgb: [number, number, number]): void {
      if (motionQuery.matches) {
        return;
      }
      for (let index = 0; index < PACKETS; index++) {
        const a = nextRand() * Math.PI * 2;
        const elev = 0.4 + nextRand() * 0.8;
        const speed = 12 + nextRand() * 18;
        packets[index] = {
          p: [worldFrom[0], worldFrom[1], worldFrom[2]],
          v: [
            Math.cos(a) * Math.sin(elev) * speed,
            Math.sin(a) * Math.sin(elev) * speed,
            Math.cos(elev) * speed
          ],
          age: -nextRand() * 0.06,
          life: 0.28 + nextRand() * 0.35,
          color: colorRgb
        };
      }
    }

    function projectWorld(point: readonly [number, number, number]): [number, number] {
      const origin = GLD.camera.origin;
      const k = GLD.camera.k;
      const cam = GLD.camera.cam;
      const sa = cam[0];
      const ca = cam[1];
      const se = cam[2];
      const ce = cam[3];
      return [
        origin[0] + k * (point[0] * sa - point[1] * ca),
        origin[1] + k * ((point[0] * ca + point[1] * sa) * se - point[2] * ce)
      ];
    }

    const backLayer = glLayer({
      canvas: backCanvas,
      fragment: buildBackFragment(GLD.plateZ),
      view: [GLD.width, GLD.height],
      camera: GLD.camera,
      uniforms: ["uAccent", "uPortXY", "uPipeStart", "uActivePort", "uLockFrac", "uOn", "uLight", "uDialX", "uDialY", "uDialZ", "uDialT"]
    });
    const frontLayer = backLayer
      ? glLayer({
          canvas: frontCanvas,
          fragment: FRONT_FRAG,
          view: [GLD.width, GLD.height],
          camera: GLD.camera,
          uniforms: [
            "uAccent",
            "uReticleVb",
            "uReticleR",
            "uReticleFace",
            "uPortVb",
            "uPortR",
            "uVaultVb",
            "uLockFrac",
            "uLockPulse",
            "uOn",
            "uLight",
            "uSpark",
            "uSparkHeat",
            "uCoverEdge",
            "uCoverCount"
          ]
        })
      : null;

    const roomy = frontLayer ? Number(frontLayer.gl.getParameter(frontLayer.gl.MAX_FRAGMENT_UNIFORM_VECTORS)) >= 128 : false;
    const glEnabled = Boolean(backLayer && frontLayer && roomy);
    if (glEnabled) {
      stage.setAttribute("data-gl", "");
    }

    const needleGroup = stage.querySelector<SVGGElement>(".kx-gauge-needle-g");
    const portXYFlat = GLD.ports.flatMap(([x, y]) => [x, y]);
    const pipeStartFlat = GLD.ports.flatMap(([px, py]) => {
      const a = Math.atan2(py, px);
      return [Math.cos(a) * 34.4, Math.sin(a) * 34.4];
    });

    function describe(deg: number, lockFrac: number): void {
      const channel = channelFromAngle(deg);
      if (selectedCode !== channel.code) {
        selectedCode = channel.code;
      }
      lockEngaged = lockFrac >= 0.5;
      readoutText = formatSwitchboardReadout(channel, lockFrac, labels.lockedBadge);
    }

    let paint: () => void = () => {};

    const controller = TURN.mount(stage, SWITCHBOARD_BUNDLE.turn, {
      follow: null,
      onHold: () => {
        touring = false;
        paused = true;
        window.clearTimeout(idleTimer);
      },
      onFrame: () => {
        paint();
      }
    });

    paint = () => {
      if (!glEnabled || !backLayer || !frontLayer) {
        return;
      }
      const ch = channelFromAngle(dialSpring.angle);
      const isLight = theme === "light" ? 1 : 0;
      const accent: [number, number, number] = isLight ? [0.76, 0.25, 0.05] : [0.94, 0.45, 0.18];
      const dialUniforms = TURN.poseUniforms(controller, "dial", "uDial");

      const reticleAnchor = controller.anchor("dial", GLD.reticle, [0, 0, 1]);
      const viewDir: [number, number, number] = [
        GLD.camera.cam[1] * GLD.camera.cam[3],
        GLD.camera.cam[0] * GLD.camera.cam[3],
        GLD.camera.cam[2]
      ];
      const dir = reticleAnchor.direction ?? [0, 0, 1];
      const reticleFacing = dir[0] * viewDir[0] + dir[1] * viewDir[1] + dir[2] * viewDir[2];
      const cover = TURN.cover(controller, ["dial", "plunger"]);
      const portScreen = GLD.portsScreen[ch.port] ?? GLD.portsScreen[0] ?? [0, 0];
      const pulseAge = glClock - lockPulseAt;
      const lockPulse = lockPulseAt > -50 && pulseAge >= 0 ? burst(pulseAge, 0.08, 0.65) : 0;

      backLayer.draw(
        {
          uAccent: accent,
          uPortXY: portXYFlat,
          uPipeStart: pipeStartFlat,
          uActivePort: ch.port,
          uLockFrac: clamp01(plungerSpring.x),
          uOn: glFade.x,
          uLight: isLight,
          ...dialUniforms
        },
        glClock
      );

      frontLayer.draw(
        {
          uAccent: accent,
          uReticleVb: reticleAnchor.screen,
          uReticleR: 3.1,
          uReticleFace: reticleFacing,
          uPortVb: portScreen,
          uPortR: 3.2,
          uVaultVb: GLD.vaultLampScreen,
          uLockFrac: clamp01(plungerSpring.x),
          uLockPulse: lockPulse,
          uOn: glFade.x,
          uLight: isLight,
          uSpark: packetData,
          uSparkHeat: packetHeat,
          uCoverEdge: cover.uCoverEdge,
          uCoverCount: cover.uCoverCount
        },
        glClock
      );
    };

    function clamp01(value: number): number {
      return Math.min(1, Math.max(0, value));
    }

    function applyPose(angle: number, lockFrac: number, pressure: number): void {
      controller.set({ dial: angle, plunger: lockFrac * 6.0 });
      const channel = channelFromAngle(angle);
      stage?.querySelectorAll(".kx-port-lens").forEach((el) => {
        const idx = el.getAttribute("data-port");
        if (idx === String(channel.port)) {
          el.setAttribute("data-active", "");
        } else {
          el.removeAttribute("data-active");
        }
      });
      if (needleGroup) {
        const degSweep = -45 + pressure * 240;
        const [px, py] = GLD.gaugeNeedlePivot;
        needleGroup.setAttribute("transform", `rotate(${degSweep.toFixed(2)} ${px.toFixed(2)} ${py.toFixed(2)})`);
      }
      describe(angle, lockFrac);
      paint();
    }

    function stepPackets(dt: number): boolean {
      let alive = false;
      for (let index = 0; index < PACKETS; index++) {
        const spark = packets[index];
        if (!spark) {
          packetHeat[index] = 0;
          continue;
        }
        spark.age += dt;
        if (spark.age >= spark.life) {
          packetHeat[index] = 0;
          continue;
        }
        if (spark.age <= 0) {
          packetHeat[index] = 0;
          alive = true;
          continue;
        }
        alive = true;
        spark.v[2] -= 18 * dt;
        const prev: [number, number, number] = [spark.p[0], spark.p[1], spark.p[2]];
        spark.p[0] += spark.v[0] * dt;
        spark.p[1] += spark.v[1] * dt;
        spark.p[2] += spark.v[2] * dt;
        if (spark.p[2] < GLD.plateZ) {
          spark.p[2] = GLD.plateZ;
          spark.v[2] = Math.abs(spark.v[2]) * 0.35;
        }
        const head = projectWorld(spark.p);
        const tail = projectWorld(prev);
        packetData[index * 4] = head[0];
        packetData[index * 4 + 1] = head[1];
        packetData[index * 4 + 2] = tail[0];
        packetData[index * 4 + 3] = tail[1];
        packetHeat[index] = 1 - spark.age / spark.life;
      }
      return alive;
    }

    function scheduleTick(): void {
      if (!rafId && visible) {
        lastTime = 0;
        rafId = window.requestAnimationFrame(tick);
      }
    }

    function nudgeNotch(newDeg: number, ignitePort: boolean = true): void {
      targetDeg = newDeg;
      const ch = channelFromAngle(targetDeg);
      if (ignitePort) {
        const portWorld = GLD.ports[ch.port] ?? GLD.ports[0];
        if (portWorld) {
          ignite(portWorld, [0.95, 0.5, 0.2]);
        }
        if (ch.locked > 0.5) {
          lockPulseAt = glClock;
        }
      }
      scheduleTick();
    }

    function scheduleResumeTour(): void {
      window.clearTimeout(idleTimer);
      if (paused || motionQuery.matches) {
        return;
      }
      idleTimer = window.setTimeout(() => {
        touring = true;
        scheduleTick();
      }, 9000);
    }

    selectNotchExternal = (code: SwitchboardChannelCode) => {
      const target = SWITCHBOARD_CHANNELS[code];
      const currentWrapped = ((targetDeg % 360) + 360) % 360;
      let delta = target.angle - currentWrapped;
      if (delta > 180) {
        delta -= 360;
      }
      if (delta < -180) {
        delta += 360;
      }
      touring = false;
      nudgeNotch(targetDeg + delta, true);
      scheduleResumeTour();
    };

    triggerLockExternal = () => {
      touring = false;
      lockPulseAt = glClock;
      const baseChannel = channelFromAngle(targetDeg);
      const nextLock = plungerSpring.x > 0.5 ? 0 : 1;
      SWITCHBOARD_CHANNELS[baseChannel.code] = {
        ...baseChannel,
        locked: nextLock
      };
      ignite([81, 29, 27], [1.0, 0.45, 0.14]);
      scheduleTick();
      scheduleResumeTour();
    };

    togglePauseExternal = () => {
      paused = !paused;
      if (paused) {
        touring = false;
        window.clearTimeout(idleTimer);
      } else if (!motionQuery.matches) {
        touring = true;
        scheduleTick();
      }
    };

    let dragging = false;
    let dragOffset = 0;

    function viewPointFromEvent(event: PointerEvent): [number, number] {
      const rect = stageElement!.getBoundingClientRect();
      return [
        ((event.clientX - rect.left) / Math.max(1, rect.width)) * GLD.width,
        ((event.clientY - rect.top) / Math.max(1, rect.height)) * GLD.height
      ];
    }

    function pointerAngle(vx: number, vy: number): number {
      const cx = GLD.camera.origin[0];
      const cy = GLD.camera.origin[1] - 12;
      return (Math.atan2(vy - cy, vx - cx) * 180) / Math.PI;
    }

    function onPointerDown(event: PointerEvent): void {
      if (event.button !== 0) {
        return;
      }
      const [vx, vy] = viewPointFromEvent(event);
      const cx = GLD.camera.origin[0];
      const cy = GLD.camera.origin[1] - 12;
      if (Math.hypot(vx - cx, vy - cy) <= 135) {
        dragging = true;
        touring = false;
        window.clearTimeout(idleTimer);
        stageElement?.setPointerCapture(event.pointerId);
        dragOffset = targetDeg - pointerAngle(vx, vy);
        scheduleTick();
        return;
      }
      if (vx >= 355 && vy >= 245) {
        triggerLockExternal?.();
      }
    }

    function onPointerMove(event: PointerEvent): void {
      if (!dragging) {
        return;
      }
      const [vx, vy] = viewPointFromEvent(event);
      targetDeg = pointerAngle(vx, vy) + dragOffset;
      dialSpring.angle = targetDeg;
      dialSpring.v = 0;
      const ch = channelFromAngle(targetDeg);
      plungerSpring.x = ch.locked;
      gaugeSpring.x = ch.gauge;
      applyPose(dialSpring.angle, plungerSpring.x, gaugeSpring.x);
    }

    function onPointerUp(event: PointerEvent): void {
      if (!dragging) {
        return;
      }
      dragging = false;
      try {
        stageElement?.releasePointerCapture(event.pointerId);
      } catch {
      }
      nudgeNotch(nearestSnapAngle(targetDeg), true);
      scheduleResumeTour();
    }

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        event.preventDefault();
        touring = false;
        nudgeNotch(nearestSnapAngle(targetDeg) + 90, true);
        scheduleResumeTour();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        event.preventDefault();
        touring = false;
        nudgeNotch(nearestSnapAngle(targetDeg) - 90, true);
        scheduleResumeTour();
      } else if (event.key === "Home") {
        event.preventDefault();
        selectNotchExternal?.("COM");
      } else if (event.key === "End") {
        event.preventDefault();
        selectNotchExternal?.("NTR");
      } else if (event.key === " ") {
        event.preventDefault();
        triggerLockExternal?.();
      }
    }

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerUp);
    stage.addEventListener("keydown", onKeyDown);

    function tick(now: number): void {
      rafId = 0;
      if (!visible) {
        return;
      }
      const dt = lastTime ? Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000)) : 1 / 60;
      lastTime = now;

      if (!motionQuery.matches) {
        glClock += dt;
      }

      if (touring && !paused && !dragging && !motionQuery.matches) {
        tourClock += dt;
        const step = Math.floor(tourClock / 2.6);
        if (step !== lastTourIdx) {
          lastTourIdx = step;
          nudgeNotch(step * 90, true);
        }
      }

      const active = channelFromAngle(targetDeg);
      const movingDial = dragging ? false : stepDialSpring(dialSpring, targetDeg, dt);
      const movingLock = stepScalarSpring(plungerSpring, active.locked, dt, 18);
      const movingGauge = stepScalarSpring(gaugeSpring, active.gauge, dt, 14);
      const movingFade = settle(glFade, visible ? 1 : 0, dt, 0.35, motionQuery.matches);
      const movingPackets = stepPackets(dt);
      const activePulse = lockPulseAt > -50 && glClock - lockPulseAt < 2.2;
      const shouldDraw = glEnabled && visible && !motionQuery.matches;

      const key = `${dialSpring.angle.toFixed(3)}:${plungerSpring.x.toFixed(4)}:${gaugeSpring.x.toFixed(4)}:${glFade.x.toFixed(3)}:${theme}`;
      if (key !== drawnKey || movingPackets || activePulse || shouldDraw) {
        drawnKey = key;
        applyPose(dialSpring.angle, plungerSpring.x, gaugeSpring.x);
      }

      if (visible && (movingDial || movingLock || movingGauge || movingFade || movingPackets || activePulse || (touring && !paused && !motionQuery.matches))) {
        rafId = window.requestAnimationFrame(tick);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) {
          glFade.x = motionQuery.matches ? 1 : 0;
          lastTime = 0;
          applyPose(dialSpring.angle, plungerSpring.x, gaugeSpring.x);
          rafId = window.requestAnimationFrame(tick);
        } else {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(stage);

    function handleMotionChange(): void {
      if (motionQuery.matches) {
        touring = false;
        paused = true;
        glFade.x = 1;
        applyPose(dialSpring.angle, plungerSpring.x, gaugeSpring.x);
      } else {
        scheduleTick();
      }
    }
    motionQuery.addEventListener("change", handleMotionChange);

    applyPose(0, SWITCHBOARD_CHANNELS.COM.locked, SWITCHBOARD_CHANNELS.COM.gauge);

    return () => {
      window.clearTimeout(idleTimer);
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
      themeObserver.disconnect();
      motionQuery.removeEventListener("change", handleMotionChange);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerUp);
      stage.removeEventListener("keydown", onKeyDown);
    };
  });
</script>

<figure class="iso kx-rig-shell" data-theme={theme} aria-label={labels.regionLabel}>
  <div class="kx-rig-card">
    <header class="kx-rig-head">
      <div class="kx-rig-title-group">
        <span class="kx-rig-fig">{labels.fig}</span>
        <span class="kx-rig-title">{labels.title}</span>
      </div>
      <div class="kx-rig-head-actions">
        <button
          type="button"
          class="kx-rig-ctrl-btn"
          onclick={handleLockTrigger}
          aria-pressed={lockEngaged}
          aria-label={labels.lockTriggerLabel}
        >
          <span class="kx-rig-status-dot" data-engaged={lockEngaged ? "true" : "false"} aria-hidden="true"></span>
          <span>{lockEngaged ? labels.lockedBadge : labels.openBadge}</span>
        </button>
        <button
          type="button"
          class="kx-rig-ctrl-btn"
          onclick={handleTogglePause}
          aria-pressed={paused}
          aria-label={paused ? labels.playLabel : labels.pauseLabel}
        >
          <span>{paused ? labels.playLabel : labels.pauseLabel}</span>
        </button>
      </div>
    </header>

    <div class="kx-rig-plate">
      <div
        bind:this={stageElement}
        class="iso-stage iso-turn kx-stage"
        tabindex="0"
        role="slider"
        aria-label={labels.sliderLabel}
        aria-valuemin={0}
        aria-valuemax={3}
        aria-valuenow={activeChannel.port}
        aria-valuetext={readoutText || activeChannel.code}
      >
        {@html SWITCHBOARD_BUNDLE.backSvg}
        <canvas bind:this={backCanvasElement} class="iso-layer kx-gl" data-canvas="back" aria-hidden="true"></canvas>
        {@html SWITCHBOARD_BUNDLE.dialSvg}
        {@html SWITCHBOARD_BUNDLE.midSvg}
        {@html SWITCHBOARD_BUNDLE.plungerSvg}
        {@html SWITCHBOARD_BUNDLE.frontSvg}
        <canvas bind:this={frontCanvasElement} class="iso-layer kx-gl" data-canvas="front" aria-hidden="true"></canvas>
      </div>

      <div class="kx-rig-plate-foot">
        <span class="kx-rig-hint">{labels.hint}</span>
        <output class="kx-rig-readout" aria-live="polite">{readoutText}</output>
      </div>
    </div>

    <div class="kx-rig-domains" role="group" aria-label={labels.sliderLabel}>
      {#each SWITCHBOARD_ORDER as code}
        <button
          type="button"
          class="kx-rig-domain-btn"
          aria-pressed={selectedCode === code}
          onclick={() => handleDomainSelect(code)}
        >
          <span class="kx-rig-domain-top">
            <span class="kx-rig-domain-code">{code}</span>
            <span class="kx-rig-domain-name">{labels.channelNames[code]}</span>
          </span>
          <span class="kx-rig-domain-note">{labels.channelNotes[code]}</span>
        </button>
      {/each}
    </div>

    <footer class="kx-rig-footer">
      <div class="kx-rig-legend-row">
        <span class="kx-rig-key">
          <span class="kx-rig-swatch kx-swatch-dial" aria-hidden="true"></span>
          <span>{labels.legendDial}</span>
        </span>
        <span class="kx-rig-key">
          <span class="kx-rig-swatch kx-swatch-lit" aria-hidden="true"></span>
          <span>{labels.legendLit}</span>
        </span>
        <span class="kx-rig-key">
          <span class="kx-rig-swatch kx-swatch-lock" aria-hidden="true"></span>
          <span>{labels.legendLock}</span>
        </span>
      </div>
      <div class="kx-rig-meta-row">
        <span class="kx-rig-caption">{captionText}</span>
        <a class="kx-rig-inspect-link" href={activeHref}>
          <span>{labels.inspectCta}: {labels.channelNames[selectedCode]}</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </footer>
  </div>
</figure>

<style>
  .kx-rig-shell {
    margin: 0;
    --anatomy-card: var(--kx-land-card-solid, #171614);
    --anatomy-paper: var(--kx-land-card-solid, #171614);
    --anatomy-lit: var(--sl-color-accent, #f0742f);
    --anatomy-lit-top: #f0742f;
    --anatomy-lit-shade: #8f3e14;
  }

  .kx-rig-shell[data-theme="light"] {
    --anatomy-card: var(--kx-land-card-solid, #ffffff);
    --anatomy-paper: var(--kx-land-card-solid, #ffffff);
    --anatomy-lit: var(--sl-color-accent, #c2410c);
    --anatomy-lit-top: #c2410c;
    --anatomy-lit-shade: #fb923c;
  }

  .kx-rig-card {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--kx-land-border-strong, rgba(246, 242, 234, 0.18));
    border-radius: var(--kx-land-radius-lg, 12px);
    background: var(--anatomy-card);
    box-shadow: var(--kx-land-card-shadow, 0 12px 32px rgba(0, 0, 0, 0.28));
    overflow: hidden;
  }

  .kx-rig-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.65rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--kx-land-border, rgba(246, 242, 234, 0.1));
    background: color-mix(in oklab, var(--anatomy-card) 86%, var(--kx-land-surface-elevated, #1f1d1a));
  }

  .kx-rig-title-group {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    min-inline-size: 0;
  }

  .kx-rig-fig {
    flex: none;
    white-space: nowrap;
    padding: 0.18rem 0.45rem;
    border-radius: 4px;
    border: 1px solid var(--kx-land-border-strong, rgba(246, 242, 234, 0.18));
    color: var(--sl-color-white);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    font-weight: 600;
  }

  .kx-rig-title {
    color: var(--sl-color-gray-2);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .kx-rig-head-actions {
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }

  .kx-rig-ctrl-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-block-size: 2.25rem;
    padding: 0 0.7rem;
    border: 1px solid var(--kx-land-border-strong, rgba(246, 242, 234, 0.18));
    border-radius: 6px;
    background: var(--kx-land-surface-elevated, #1f1d1a);
    color: var(--sl-color-gray-1);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    cursor: pointer;
    transition: border-color 0.16s ease, color 0.16s ease, background-color 0.16s ease;
  }

  .kx-rig-ctrl-btn:hover {
    border-color: var(--sl-color-accent);
    color: var(--sl-color-white);
  }

  .kx-rig-ctrl-btn:focus-visible,
  .kx-rig-domain-btn:focus-visible,
  .kx-rig-inspect-link:focus-visible,
  .kx-stage:focus-visible {
    outline: 2px solid var(--sl-color-accent);
    outline-offset: 2px;
  }

  .kx-rig-status-dot {
    inline-size: 0.45rem;
    block-size: 0.45rem;
    border-radius: 999px;
    background: var(--sl-color-gray-4);
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
  }

  .kx-rig-status-dot[data-engaged="true"] {
    background: var(--sl-color-accent);
    box-shadow: 0 0 8px var(--sl-color-accent);
  }

  .kx-rig-plate {
    position: relative;
    padding: 0.75rem 0.9rem 0.65rem;
    background: var(--anatomy-card);
  }

  .kx-stage {
    position: relative;
    aspect-ratio: 580 / 430;
    inline-size: 100%;
    touch-action: pan-y;
    user-select: none;
    border-radius: 8px;
    --kx-gl-fallback: 1;
  }

  .kx-stage :global(.iso-layer) {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    pointer-events: none;
  }

  .kx-stage :global(.kx-gl) {
    opacity: 1;
  }

  .kx-stage:global([data-gl]) :global([data-name="dial.reticle"]),
  .kx-stage:global([data-gl]) :global([data-name="lock.vault.lamp"]),
  .kx-stage:global([data-gl]) :global(.kx-port-lens) {
    opacity: var(--kx-gl-fallback, 0.15);
    transition: opacity 0.25s ease;
  }

  .kx-stage :global(.kx-port-lens[data-active] .iso-top) {
    fill: var(--anatomy-lit-top);
  }

  .kx-stage :global(.kx-gauge-needle) {
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke: var(--anatomy-lit);
  }

  .kx-rig-plate-foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem 1rem;
    padding-top: 0.35rem;
  }

  .kx-rig-hint {
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .kx-rig-readout {
    color: var(--sl-color-white);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    font-variant-numeric: tabular-nums;
  }

  .kx-rig-domains {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.45rem;
    padding: 0.7rem 0.9rem;
    border-top: 1px solid var(--kx-land-border, rgba(246, 242, 234, 0.1));
    background: color-mix(in oklab, var(--anatomy-card) 92%, var(--kx-land-surface-elevated, #1f1d1a));
  }

  .kx-rig-domain-btn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 0.12rem;
    min-block-size: 2.75rem;
    padding: 0.45rem 0.6rem;
    border: 1px solid var(--kx-land-border, rgba(246, 242, 234, 0.1));
    border-radius: 7px;
    background: transparent;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.16s ease, background-color 0.16s ease;
  }

  .kx-rig-domain-btn:hover {
    border-color: var(--kx-land-border-strong, rgba(246, 242, 234, 0.18));
    background: var(--kx-land-node-active, rgba(240, 116, 47, 0.12));
  }

  .kx-rig-domain-btn[aria-pressed="true"] {
    border-color: var(--sl-color-accent);
    background: var(--kx-land-node-active, rgba(240, 116, 47, 0.12));
  }

  .kx-rig-domain-top {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .kx-rig-domain-code {
    color: var(--sl-color-accent);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    font-weight: 700;
  }

  .kx-rig-domain-name {
    color: var(--sl-color-white);
    font-size: var(--sl-text-xs);
    font-weight: 600;
  }

  .kx-rig-domain-note {
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
    font-size: 0.68rem;
    line-height: 1.25;
  }

  .kx-rig-footer {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    padding: 0.65rem 0.9rem 0.8rem;
    border-top: 1px solid var(--kx-land-border, rgba(246, 242, 234, 0.1));
  }

  .kx-rig-legend-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 1.1rem;
  }

  .kx-rig-key {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
  }

  .kx-rig-swatch {
    inline-size: 0.7rem;
    block-size: 0.45rem;
    border-radius: 2px;
    border: 1px solid var(--anatomy-mid, #6a6a6a);
  }

  .kx-swatch-lit {
    border-color: var(--anatomy-lit);
    background: color-mix(in oklab, var(--anatomy-lit) 38%, transparent);
  }

  .kx-swatch-lock {
    border-color: #d2ad5b;
    background: rgba(189, 150, 70, 0.25);
  }

  .kx-rig-meta-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.45rem 1rem;
  }

  .kx-rig-caption {
    color: var(--sl-color-gray-3);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
  }

  .kx-rig-inspect-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    min-block-size: 2rem;
    color: var(--sl-color-accent);
    font-family: var(--sl-font-mono);
    font-size: var(--sl-text-2xs);
    font-weight: 600;
    text-decoration: none;
  }

  .kx-rig-inspect-link:hover {
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  @media (max-width: 48rem) {
    .kx-rig-domains {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 30rem) {
    .kx-rig-domains {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
