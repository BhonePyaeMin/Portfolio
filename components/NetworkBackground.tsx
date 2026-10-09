"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── Constants ────────────────────────────────────────────────────────────────

const BOUNDS = { x: 11, y: 7, z: 5 };
const BASE_SPEED = 0.35;
const CONNECTION_DISTANCE = 3.6;
const POINT_COLOR = new THREE.Color("#00E5FF");
const LINE_COLOR = new THREE.Color("#5B6EF5");
const LINE_OPACITY = 0.18;
const ROTATION_SPEED = 0.07; // radians per second
const PARALLAX_STRENGTH = 0.18;
const PARALLAX_LERP = 0.04;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildInitialData(pointCount: number) {
  const positions = new Float32Array(pointCount * 3);
  const velocities = new Float32Array(pointCount * 3);

  for (let i = 0; i < pointCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * BOUNDS.x * 2;
    positions[i * 3 + 1] = (Math.random() - 0.5) * BOUNDS.y * 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * BOUNDS.z * 2;

    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const spd = BASE_SPEED * (0.4 + Math.random() * 0.8);
    velocities[i * 3 + 0] = Math.sin(phi) * Math.cos(theta) * spd;
    velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * spd;
    velocities[i * 3 + 2] = Math.cos(phi) * spd * 0.35;
  }

  return { positions, velocities };
}

// ─── Inner scene (runs inside Canvas context) ─────────────────────────────────

function NetworkScene({
  pointCount,
  reducedMotion,
}: {
  pointCount: number;
  reducedMotion: boolean;
}) {
  // Pre-compute max line segments for this point count
  const MAX_LINES = Math.floor((pointCount * (pointCount - 1)) / 2);

  const groupRef = useRef<THREE.Group>(null!);
  const pointsGeoRef = useRef<THREE.BufferGeometry>(null!);
  const linesGeoRef = useRef<THREE.BufferGeometry>(null!);
  const initialised = useRef(false);

  // Mirror reducedMotion into a ref so the useFrame closure always reads
  // the latest value without needing to re-subscribe the callback.
  const reducedMotionRef = useRef(reducedMotion);
  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  // All mutable animation state — never triggers a re-render
  const s = useRef({
    ...buildInitialData(pointCount),
    lineBuf: new Float32Array(MAX_LINES * 6),
    mouse: new THREE.Vector2(0, 0),
    parallax: new THREE.Vector2(0, 0),
    autoRotation: 0,
  });

  // One-time geometry setup + mouse listener
  // Runs fresh each mount (the Canvas key-prop ensures remount on config change)
  useEffect(() => {
    pointsGeoRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(s.current.positions, 3)
    );
    linesGeoRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(s.current.lineBuf, 3)
    );
    linesGeoRef.current.setDrawRange(0, 0);
    initialised.current = true;

    const onMouseMove = (e: MouseEvent) => {
      s.current.mouse.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((_, delta) => {
    if (
      !initialised.current ||
      !groupRef.current ||
      !pointsGeoRef.current ||
      !linesGeoRef.current
    )
      return;

    const { positions, velocities, lineBuf, mouse, parallax } = s.current;
    const dt = Math.min(delta, 0.05); // cap to avoid large jumps on tab-switch

    if (!reducedMotionRef.current) {
      // ── Drift & bounce ──────────────────────────────────────────────────
      for (let i = 0; i < pointCount; i++) {
        const ix = i * 3,
          iy = ix + 1,
          iz = ix + 2;

        positions[ix] += velocities[ix] * dt;
        positions[iy] += velocities[iy] * dt;
        positions[iz] += velocities[iz] * dt;

        if (Math.abs(positions[ix]) > BOUNDS.x) {
          velocities[ix] *= -1;
          positions[ix] = Math.sign(positions[ix]) * BOUNDS.x;
        }
        if (Math.abs(positions[iy]) > BOUNDS.y) {
          velocities[iy] *= -1;
          positions[iy] = Math.sign(positions[iy]) * BOUNDS.y;
        }
        if (Math.abs(positions[iz]) > BOUNDS.z) {
          velocities[iz] *= -1;
          positions[iz] = Math.sign(positions[iz]) * BOUNDS.z;
        }
      }

      (
        pointsGeoRef.current.attributes.position as THREE.BufferAttribute
      ).needsUpdate = true;

      // ── Auto-rotation ────────────────────────────────────────────────────
      s.current.autoRotation += ROTATION_SPEED * dt;

      // ── Parallax lerp ────────────────────────────────────────────────────
      parallax.x +=
        (mouse.y * PARALLAX_STRENGTH - parallax.x) * PARALLAX_LERP;
      parallax.y +=
        (mouse.x * PARALLAX_STRENGTH - parallax.y) * PARALLAX_LERP;
    }

    // Apply group transform (runs even when reduced-motion for static pose)
    groupRef.current.rotation.y = s.current.autoRotation + parallax.y;
    groupRef.current.rotation.x = parallax.x;

    // ── Rebuild line segments ────────────────────────────────────────────────
    const dSq = CONNECTION_DISTANCE * CONNECTION_DISTANCE;
    let lineCount = 0;

    for (let i = 0; i < pointCount; i++) {
      const ax = positions[i * 3],
        ay = positions[i * 3 + 1],
        az = positions[i * 3 + 2];
      for (let j = i + 1; j < pointCount; j++) {
        const dx = ax - positions[j * 3];
        const dy = ay - positions[j * 3 + 1];
        const dz = az - positions[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < dSq) {
          const b = lineCount * 6;
          lineBuf[b] = ax;
          lineBuf[b + 1] = ay;
          lineBuf[b + 2] = az;
          lineBuf[b + 3] = positions[j * 3];
          lineBuf[b + 4] = positions[j * 3 + 1];
          lineBuf[b + 5] = positions[j * 3 + 2];
          lineCount++;
          if (lineCount >= MAX_LINES) break;
        }
      }
      if (lineCount >= MAX_LINES) break;
    }

    (
      linesGeoRef.current.attributes.position as THREE.BufferAttribute
    ).needsUpdate = true;
    linesGeoRef.current.setDrawRange(0, lineCount * 2);
  });

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      <points>
        <bufferGeometry ref={pointsGeoRef} />
        <pointsMaterial
          color={POINT_COLOR}
          size={0.055}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </points>

      {/* Edges */}
      <lineSegments>
        <bufferGeometry ref={linesGeoRef} />
        <lineBasicMaterial
          color={LINE_COLOR}
          transparent
          opacity={LINE_OPACITY}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export default function NetworkBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);
  // Mobile: fewer nodes + lower pixel ratio to protect GPU on small devices
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // ── prefers-reduced-motion ──────────────────────────────────────────────
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mqMotion.matches);
    const motionHandler = (e: MediaQueryListEvent) =>
      setReducedMotion(e.matches);
    mqMotion.addEventListener("change", motionHandler);

    // ── Mobile breakpoint (< 768px) ─────────────────────────────────────────
    // Reduces node count from 90 → 45 and DPR cap from 1.5 → 1.0
    const mqMobile = window.matchMedia("(max-width: 767px)");
    setIsMobile(mqMobile.matches);
    const mobileHandler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mqMobile.addEventListener("change", mobileHandler);

    return () => {
      mqMotion.removeEventListener("change", motionHandler);
      mqMobile.removeEventListener("change", mobileHandler);
    };
  }, []);

  const pointCount = isMobile ? 45 : 90;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/*
       * key={pointCount} causes the entire Canvas (and NetworkScene inside it)
       * to unmount and remount when mobile/desktop switches — this ensures
       * the TypedArrays are re-allocated with the correct sizes.
       * This happens at most once per session (crossing the 768px boundary).
       */}
      <Canvas
        key={pointCount}
        camera={{ position: [0, 0, 16], fov: 55 }}
        gl={{ antialias: !isMobile, alpha: true }}
        style={{ background: "transparent" }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
      >
        <NetworkScene pointCount={pointCount} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
