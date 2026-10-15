"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── Look ─────────────────────────────────────────────────────────────────────

const COLORS = {
  fur: "#E8762D",
  white: "#FFF4E8",
  sock: "#2B1F1A",
  earTip: "#3A2A22",
  innerEar: "#F7D3C2",
  eye: "#140F0D",
};

// ─── Motion tuning (all distances in CSS px) ──────────────────────────────────

const SPEED = 40;          // walking speed
const STRIDE = 19;         // px covered per step
const EDGE = 21;           // stay on the flat top, clear of the pill's rounded ends
const WALK_YAW = 1.15;     // three-quarter view while walking (radians)
const JUMP_H = 16;         // jump arc height
const CROUCH_T = 0.13;
const AIR_T = 0.5;
const LAND_T = 0.15;
const NOTICE_PX = 90;      // cursor this close makes the fox stop and look

type Bar = { left: number; right: number; top: number; height: number };
type Mode = "rest" | "walk" | "turn" | "crouch" | "air" | "land";

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const damp = (cur: number, target: number, rate: number, dt: number) =>
  cur + (target - cur) * (1 - Math.exp(-rate * dt));

/** Button rects relative to the overlay; null when they wrap onto several rows. */
function readBars(overlay: HTMLElement, els: (HTMLElement | null)[]): Bar[] | null {
  const o = overlay.getBoundingClientRect();
  const bars: Bar[] = [];
  for (const el of els) {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    bars.push({ left: r.left - o.left, right: r.right - o.left, top: r.top - o.top, height: r.height });
  }
  if (bars.length === 0 || bars.some((b) => Math.abs(b.top - bars[0].top) > 3)) return null;
  return bars;
}

// ─── The fox (fox units: feet at y = 0, ear tips at ~1.06, facing +z) ──────────

type FoxParts = {
  root: THREE.Group | null;
  body: THREE.Group | null;
  head: THREE.Group | null;
  earL: THREE.Group | null;
  earR: THREE.Group | null;
  eyeL: THREE.Group | null;
  eyeR: THREE.Group | null;
  armL: THREE.Group | null;
  armR: THREE.Group | null;
  hipL: THREE.Group | null;
  hipR: THREE.Group | null;
  kneeL: THREE.Group | null;
  kneeR: THREE.Group | null;
  tail: (THREE.Group | null)[];
};

function useFoxMaterials() {
  return useMemo(() => {
    const m = (color: string, roughness = 0.85) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 });
    return {
      fur: m(COLORS.fur),
      white: m(COLORS.white),
      sock: m(COLORS.sock, 0.7),
      earTip: m(COLORS.earTip),
      innerEar: m(COLORS.innerEar),
      eye: m(COLORS.eye, 0.25),
      shine: new THREE.MeshBasicMaterial({ color: "#FFFFFF" }),
    };
  }, []);
}

function useFoxGeometry() {
  return useMemo(
    () => ({
      ball: new THREE.SphereGeometry(1, 28, 20),
      thigh: new THREE.CapsuleGeometry(0.052, 0.07, 6, 14),
      shin: new THREE.CapsuleGeometry(0.044, 0.06, 6, 14),
      upperArm: new THREE.CapsuleGeometry(0.036, 0.08, 6, 12),
      foreArm: new THREE.CapsuleGeometry(0.034, 0.05, 6, 12),
      ear: new THREE.ConeGeometry(0.068, 0.19, 24),
      innerEar: new THREE.ConeGeometry(0.045, 0.14, 20),
      earTip: new THREE.ConeGeometry(0.031, 0.075, 20),
    }),
    []
  );
}

function Fox({ parts }: { parts: MutableRefObject<FoxParts> }) {
  const mat = useFoxMaterials();
  const geo = useFoxGeometry();
  const p = parts.current;

  // Shared geometry/materials are passed as props, so free them ourselves
  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose());
      Object.values(mat).forEach((m) => m.dispose());
    },
    [geo, mat]
  );

  const ball = (
    material: THREE.Material,
    position: [number, number, number],
    radius: number,
    stretch: [number, number, number] = [1, 1, 1]
  ) => (
    <mesh
      geometry={geo.ball}
      material={material}
      position={position}
      scale={[radius * stretch[0], radius * stretch[1], radius * stretch[2]]}
    />
  );

  const leg = (side: 1 | -1) => (
    <group position={[side * 0.07, 0.31, 0]} ref={(g) => { if (side > 0) p.hipL = g; else p.hipR = g; }}>
      <mesh geometry={geo.thigh} material={mat.fur} position={[0, -0.065, 0]} />
      <group position={[0, -0.13, 0]} ref={(g) => { if (side > 0) p.kneeL = g; else p.kneeR = g; }}>
        <mesh geometry={geo.shin} material={mat.sock} position={[0, -0.07, 0]} />
        {ball(mat.sock, [0, -0.15, 0.03], 0.055, [0.9, 0.55, 1.45])}
      </group>
    </group>
  );

  const arm = (side: 1 | -1) => (
    <group
      position={[side * 0.155, 0.58, 0]}
      rotation={[0, 0, side * 0.2]}
      ref={(g) => { if (side > 0) p.armL = g; else p.armR = g; }}
    >
      <mesh geometry={geo.upperArm} material={mat.fur} position={[0, -0.07, 0]} />
      <mesh geometry={geo.foreArm} material={mat.sock} position={[0, -0.16, 0]} />
      {ball(mat.sock, [0, -0.205, 0.006], 0.042)}
    </group>
  );

  const ear = (side: 1 | -1) => (
    <group
      position={[side * 0.095, 0.115, -0.015]}
      rotation={[0, 0, -side * 0.36]}
      ref={(g) => { if (side > 0) p.earL = g; else p.earR = g; }}
    >
      <mesh geometry={geo.ear} material={mat.fur} position={[0, 0.085, 0]} scale={[1, 1, 0.55]} />
      <mesh geometry={geo.innerEar} material={mat.innerEar} position={[0, 0.07, 0.022]} scale={[1, 1, 0.35]} />
      <mesh geometry={geo.earTip} material={mat.earTip} position={[0, 0.1425, 0]} scale={[1, 1, 0.62]} />
    </group>
  );

  const eye = (side: 1 | -1) => (
    <group position={[side * 0.07, 0.01, 0.142]} ref={(g) => { if (side > 0) p.eyeL = g; else p.eyeR = g; }}>
      {ball(mat.eye, [0, 0, 0], 0.027, [1, 1.15, 0.6])}
      {ball(mat.shine, [side * 0.006 + 0.004, 0.012, 0.014], 0.0085)}
    </group>
  );

  // Fluffy tail: a chain of joints, so a sway ripples down to the white tip
  const TAIL: { offset: [number, number, number]; r: number; white?: boolean }[] = [
    { offset: [0, 0, 0], r: 0.06 },
    { offset: [0, 0.02, -0.1], r: 0.09 },
    { offset: [0, 0.06, -0.1], r: 0.105 },
    { offset: [0, 0.09, -0.07], r: 0.095 },
    { offset: [0, 0.08, -0.03], r: 0.072, white: true },
  ];
  const tailChain = (i: number): React.ReactNode =>
    i >= TAIL.length ? null : (
      <group position={TAIL[i].offset} ref={(g) => { p.tail[i] = g; }}>
        {ball(TAIL[i].white ? mat.white : mat.fur, [0, 0, 0], TAIL[i].r, [1, 1, 1.25])}
        {/* filler halfway to the next joint keeps the brush smooth instead of beaded */}
        {i + 1 < TAIL.length &&
          ball(
            TAIL[i + 1].white ? mat.white : mat.fur,
            [TAIL[i + 1].offset[0] / 2, TAIL[i + 1].offset[1] / 2, TAIL[i + 1].offset[2] / 2],
            (TAIL[i].r + TAIL[i + 1].r) / 2 + 0.008,
            [1, 1, 1.2]
          )}
        {TAIL[i].white && ball(mat.white, [0, 0.05, 0.005], 0.045)}
        {tailChain(i + 1)}
      </group>
    );

  return (
    <group ref={(g) => { p.root = g; }}>
      {leg(1)}
      {leg(-1)}

      <group ref={(g) => { p.body = g; }} position={[0, 0.31, 0]}>
        <group position={[0, -0.31, 0]}>
          {ball(mat.fur, [0, 0.31, 0], 0.13, [1.1, 0.8, 0.95])}
          {ball(mat.fur, [0, 0.45, 0], 0.165, [1, 1.2, 0.9])}
          {ball(mat.white, [0, 0.43, 0.085], 0.13, [0.85, 1.15, 0.55])}
          {arm(1)}
          {arm(-1)}

          <group position={[0, 0.33, -0.12]}>{tailChain(0)}</group>

          <group position={[0, 0.78, 0.01]} ref={(g) => { p.head = g; }}>
            {ball(mat.fur, [0, 0, 0], 0.165, [1.12, 0.95, 1])}
            {ball(mat.white, [0.1, -0.075, 0.07], 0.085, [1.25, 0.85, 0.9])}
            {ball(mat.white, [-0.1, -0.075, 0.07], 0.085, [1.25, 0.85, 0.9])}
            {ball(mat.fur, [0, -0.035, 0.16], 0.07, [0.85, 0.7, 1.45])}
            {ball(mat.white, [0, -0.075, 0.15], 0.06, [0.85, 0.6, 1.3])}
            {ball(mat.eye, [0, -0.03, 0.262], 0.024)}
            {eye(1)}
            {eye(-1)}
            {ear(1)}
            {ear(-1)}
          </group>
        </group>
      </group>
    </group>
  );
}

// ─── Behaviour: walk the buttons, jump the gaps, turn, rest, watch the cursor ──

function FoxRig({
  overlay,
  bars: barEls,
  pointer,
  reduced,
}: {
  overlay: MutableRefObject<HTMLDivElement | null>;
  bars: MutableRefObject<(HTMLElement | null)[]>;
  pointer: MutableRefObject<{ x: number; y: number } | null>;
  reduced: boolean;
}) {
  const parts = useRef<FoxParts>({
    root: null, body: null, head: null, earL: null, earR: null, eyeL: null, eyeR: null,
    armL: null, armR: null, hipL: null, hipR: null, kneeL: null, kneeR: null, tail: [],
  });

  const st = useRef({
    ready: false,
    bar: 0,
    x: 0,
    dir: 1 as 1 | -1,
    mode: "rest" as Mode,
    modeT: 0,
    restFor: 2.2,
    walkFor: 6,
    yaw: 0,
    phase: 0,
    walkW: 0,
    airW: 0,
    crouch: 0,
    jump: { x0: 0, x1: 0, y0: 0, y1: 0, to: 0 },
    headYaw: 0,
    headPitch: 0,
    blinkIn: 2.5,
    blinkT: 0,
    earIn: 4,
    earT: 0,
    earSide: 1,
    time: 0,
  });

  useFrame((state, delta) => {
    const f = parts.current;
    const s = st.current;
    if (!f.root || !overlay.current) return;

    const bars = readBars(overlay.current, barEls.current);
    if (!bars) {
      f.root.visible = false;
      return;
    }
    f.root.visible = true;

    const dt = Math.min(delta, 1 / 20);
    s.time += dt;
    s.modeT += dt;
    const { width: W, height: H } = state.size;
    const S = clamp(bars[0].height, 30, 48); // the fox is about as tall as a button

    const setMode = (m: Mode) => {
      s.mode = m;
      s.modeT = 0;
    };

    if (!s.ready) {
      s.bar = Math.floor(bars.length / 2);
      s.x = (bars[s.bar].left + bars[s.bar].right) / 2;
      s.ready = true;
      setMode("rest");
      s.restFor = reduced ? Infinity : 2.2;
    }
    s.bar = clamp(s.bar, 0, bars.length - 1);

    let bar = bars[s.bar];
    let lo = bar.left + EDGE;
    let hi = bar.right - EDGE;
    let ground = bar.top;
    let lift = 0;

    // Cursor in overlay coordinates
    let cur: { x: number; y: number } | null = null;
    if (pointer.current) {
      const o = overlay.current.getBoundingClientRect();
      cur = { x: pointer.current.x - o.left, y: pointer.current.y - o.top };
    }
    const near = !!cur && Math.hypot(cur.x - s.x, cur.y - (bar.top - 0.55 * S)) < NOTICE_PX;

    let yawTarget = s.yaw;

    switch (s.mode) {
      case "rest": {
        yawTarget = 0; // face the visitor
        if (near && s.restFor !== Infinity) s.modeT = Math.min(s.modeT, s.restFor - 1);
        if (s.modeT >= s.restFor) {
          if (s.x <= lo + 2) s.dir = 1;
          else if (s.x >= hi - 2) s.dir = -1;
          else if (Math.random() < 0.3) s.dir = s.dir > 0 ? -1 : 1;
          s.walkFor = rand(5, 9);
          setMode("walk");
        }
        break;
      }
      case "walk": {
        yawTarget = s.dir * WALK_YAW;
        s.x += s.dir * SPEED * dt;
        s.phase += (dt * SPEED * Math.PI) / STRIDE;
        s.walkFor -= dt;
        const atEnd = s.dir > 0 ? s.x >= hi : s.x <= lo;
        if (atEnd) {
          s.x = s.dir > 0 ? hi : lo;
          const next = s.bar + s.dir;
          if (next >= 0 && next < bars.length) {
            const nb = bars[next];
            s.jump = {
              x0: s.x,
              x1: s.dir > 0 ? nb.left + EDGE : nb.right - EDGE,
              y0: bar.top,
              y1: nb.top,
              to: next,
            };
            setMode("crouch");
          } else if (Math.random() < 0.45) {
            s.restFor = rand(1.5, 3);
            setMode("rest"); // pause at the very end, then head back
          } else {
            s.dir = s.dir > 0 ? -1 : 1;
            setMode("turn");
          }
        } else if (near || s.walkFor <= 0) {
          s.restFor = near ? 1.2 : rand(2.5, 4.5);
          setMode("rest");
        }
        break;
      }
      case "turn": {
        yawTarget = s.dir * WALK_YAW;
        s.phase += dt * 3; // little steps on the spot while turning
        if (Math.abs(s.yaw - yawTarget) < 0.07) {
          s.walkFor = Math.max(s.walkFor, rand(4, 7));
          setMode("walk");
        }
        break;
      }
      case "crouch": {
        s.crouch = s.modeT / CROUCH_T;
        if (s.modeT >= CROUCH_T) setMode("air");
        break;
      }
      case "air": {
        const t = clamp(s.modeT / AIR_T, 0, 1);
        const e = t * t * (3 - 2 * t);
        s.x = s.jump.x0 + (s.jump.x1 - s.jump.x0) * e;
        ground = s.jump.y0 + (s.jump.y1 - s.jump.y0) * t;
        lift = 4 * JUMP_H * t * (1 - t);
        s.crouch = 0;
        if (t >= 1) {
          s.bar = s.jump.to;
          s.x = s.jump.x1;
          setMode("land");
        }
        break;
      }
      case "land": {
        s.crouch = 1 - s.modeT / LAND_T;
        if (s.modeT >= LAND_T) {
          s.crouch = 0;
          setMode("walk");
        }
        break;
      }
    }

    // Keep the fox on its button if the layout changed (resize, fonts loading)
    bar = bars[s.bar];
    lo = bar.left + EDGE;
    hi = bar.right - EDGE;
    if (s.mode !== "air") {
      ground = bar.top;
      s.x = clamp(s.x, lo, Math.max(lo, hi));
    }

    // ── Blend weights ──
    const walking = s.mode === "walk";
    s.walkW = damp(s.walkW, walking ? 1 : s.mode === "turn" ? 0.35 : 0, 8, dt);
    s.airW = damp(s.airW, s.mode === "air" ? 1 : 0, 14, dt);
    s.yaw = damp(s.yaw, yawTarget, s.mode === "turn" ? 6 : 9, dt);
    const crouch = s.mode === "crouch" || s.mode === "land" ? clamp(s.crouch, 0, 1) : 0;

    // ── Root: position on the button, facing, squash & stretch ──
    const bob = Math.abs(Math.sin(s.phase)) * 1.3 * s.walkW;
    f.root.position.set(s.x - W / 2, H / 2 - ground + lift + bob - crouch * 2.5, 0);
    f.root.rotation.y = s.yaw;
    const stretch = s.mode === "air" ? 0.06 * (1 - Math.abs(clamp(s.modeT / AIR_T, 0, 1) * 2 - 1)) : 0;
    f.root.scale.set(S * (1 + 0.07 * crouch), S * (1 - 0.12 * crouch + stretch), S * (1 + 0.07 * crouch));

    // ── Body: lean into the walk, breathe while resting ──
    if (f.body) {
      f.body.rotation.x = 0.08 * s.walkW - 0.12 * s.airW;
      f.body.scale.y = 1 + (reduced ? 0 : Math.sin(s.time * 2.2) * 0.014 * (1 - s.walkW));
    }

    // ── Legs & arms: walk cycle, tucked in the air ──
    const sw = Math.sin(s.phase);
    const cw = Math.cos(s.phase);
    const A = 0.55 * s.walkW;
    if (f.hipL) f.hipL.rotation.x = -sw * A - 0.6 * s.airW - 0.25 * crouch;
    if (f.hipR) f.hipR.rotation.x = sw * A - 0.6 * s.airW - 0.25 * crouch;
    if (f.kneeL) f.kneeL.rotation.x = Math.max(0, cw) * 0.8 * s.walkW + 1.1 * s.airW + 0.5 * crouch;
    if (f.kneeR) f.kneeR.rotation.x = Math.max(0, -cw) * 0.8 * s.walkW + 1.1 * s.airW + 0.5 * crouch;
    if (f.armL) f.armL.rotation.x = sw * 0.6 * s.walkW - 1.3 * s.airW + 0.3 * crouch;
    if (f.armR) f.armR.rotation.x = -sw * 0.6 * s.walkW - 1.3 * s.airW + 0.3 * crouch;

    // ── Head: watch the cursor (fully when resting, a glance while walking) ──
    let wantYaw = 0;
    let wantPitch = 0;
    if (cur && s.mode !== "air") {
      const hx = s.x;
      const hy = ground - lift - 0.78 * S;
      const D = 160;
      const dist = Math.hypot(cur.x - hx, cur.y - hy);
      const weight = s.mode === "rest" ? 1 : dist < 320 ? 0.5 : 0;
      wantYaw = clamp(Math.atan2(cur.x - hx, D) - s.yaw, -0.85, 0.85) * weight;
      wantPitch = -clamp(Math.atan2(hy - cur.y, D), -0.45, 0.5) * weight;
    }
    s.headYaw = damp(s.headYaw, wantYaw, 7, dt);
    s.headPitch = damp(s.headPitch, wantPitch, 7, dt);
    if (f.head) {
      f.head.rotation.set(
        s.headPitch + Math.sin(s.phase * 2) * 0.03 * s.walkW,
        s.headYaw,
        s.mode === "rest" && !reduced ? Math.sin(s.time * 0.9) * 0.05 : 0
      );
    }

    // ── Blink & ear twitch ──
    if (!reduced) {
      s.blinkIn -= dt;
      if (s.blinkIn <= 0) {
        s.blinkT = 0.13;
        s.blinkIn = rand(2.5, 5.5);
      }
      s.earIn -= dt;
      if (s.earIn <= 0) {
        s.earT = 0.28;
        s.earSide = Math.random() < 0.5 ? 1 : -1;
        s.earIn = rand(3, 7);
      }
    }
    s.blinkT = Math.max(0, s.blinkT - dt);
    s.earT = Math.max(0, s.earT - dt);
    const eyeY = s.blinkT > 0 ? 0.12 : 1;
    f.eyeL?.scale.set(1, eyeY, 1);
    f.eyeR?.scale.set(1, eyeY, 1);
    const twitch = s.earT > 0 ? Math.sin((1 - s.earT / 0.28) * Math.PI) * 0.45 : 0;
    if (f.earL) f.earL.rotation.x = -0.1 * s.airW - (s.earSide > 0 ? twitch : 0);
    if (f.earR) f.earR.rotation.x = -0.1 * s.airW - (s.earSide < 0 ? twitch : 0);

    // ── Tail: swings with the steps, slow sway at rest, streams out in a jump ──
    const tailPhase = s.walkW > 0.2 ? s.phase : s.time * 2.1;
    const amp = reduced ? 0 : 0.12 + 0.3 * s.walkW + 0.15 * s.airW;
    f.tail.forEach((j, i) => {
      if (!j || i === 0) return;
      j.rotation.y = Math.sin(tailPhase - i * 0.7) * amp * (1 + i * 0.15);
      j.rotation.x = 0.18 * s.airW - 0.04 * i * s.walkW;
    });
    if (f.tail[0]) f.tail[0].rotation.set(0.35 * s.airW, Math.sin(tailPhase) * amp * 0.6, 0);
  });

  return <Fox parts={parts} />;
}

// ─── Overlay ──────────────────────────────────────────────────────────────────

/**
 * A 3D fox that lives on the hero buttons. Positioned over the button row,
 * transparent to clicks, and only rendered while the hero is on screen.
 */
export default function HeroFox({ bars }: { bars: MutableRefObject<(HTMLElement | null)[]> }) {
  const overlay = useRef<HTMLDivElement | null>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const [inView, setInView] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 640px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setEnabled(wide.matches);
      setReduced(calm.matches);
    };
    sync();
    wide.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
    };
    const leave = () => {
      pointer.current = null;
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  useEffect(() => {
    const el = overlay.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={overlay}
      aria-hidden="true"
      className="pointer-events-none absolute z-10"
      style={{ left: -32, right: -32, top: -76, bottom: 0 }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 400], zoom: 1, near: 1, far: 1000 }}
        dpr={[1, 2]}
        flat
        frameloop={inView ? "always" : "never"}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        style={{ pointerEvents: "none" }}
        fallback={null}
      >
        <ambientLight intensity={1.15} />
        <directionalLight position={[-160, 260, 420]} intensity={1.9} />
        <directionalLight position={[220, 120, -300]} intensity={0.9} color="#5EEAD4" />
        <FoxRig overlay={overlay} bars={bars} pointer={pointer} reduced={reduced} />
      </Canvas>
    </div>
  );
}
