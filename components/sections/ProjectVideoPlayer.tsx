"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Minus, Plus, Maximize, Minimize } from "lucide-react";

const ZOOMS = [1, 1.5, 2, 3, 4];
const DRAG_THRESHOLD = 4;
const SEEK_STEP = 5;

const CTRL_BTN =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/85 transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(45,212,191,0.5)]";

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

type FsVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

export default function ProjectVideoPlayer({
  src,
  poster,
  silent = false,
  title,
}: {
  src: string;
  poster?: string;
  silent?: boolean;
  title: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const drag = useRef<{ startX: number; startY: number; panX: number; panY: number; moved: boolean } | null>(null);

  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [ratio, setRatio] = useState<number | null>(null);
  const [area, setArea] = useState({ w: 0, h: 0 });
  const [zoomIdx, setZoomIdx] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const zoom = ZOOMS[zoomIdx];

  // Keep the picture from being dragged out of the frame: how far it can move depends on
  // the video's own aspect ratio (a 9:16 clip is much narrower than the 16:9 frame at 100%).
  const clampPan = useCallback(
    (x: number, y: number, z: number) => {
      if (!ratio || !area.w || !area.h) return { x: 0, y: 0 };
      const contentW = Math.min(area.w, area.h * ratio);
      const contentH = Math.min(area.h, area.w / ratio);
      const maxX = Math.max(0, (contentW * z - area.w) / 2);
      const maxY = Math.max(0, (contentH * z - area.h) / 2);
      return { x: Math.min(maxX, Math.max(-maxX, x)), y: Math.min(maxY, Math.max(-maxY, y)) };
    },
    [ratio, area.w, area.h]
  );

  useEffect(() => {
    setPan((p) => clampPan(p.x, p.y, zoom));
  }, [zoom, clampPan]);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => setArea({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const seekBy = (delta: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(v.currentTime + delta, 0), v.duration || 0);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (v) v.muted = !v.muted;
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (rootRef.current?.requestFullscreen) {
      rootRef.current.requestFullscreen().catch(() => {});
    } else {
      (videoRef.current as FsVideo | null)?.webkitEnterFullscreen?.();
    }
  };

  const zoomIn = () => setZoomIdx((i) => Math.min(i + 1, ZOOMS.length - 1));
  const zoomOut = () => setZoomIdx((i) => Math.max(i - 1, 0));
  const zoomReset = () => setZoomIdx(0);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest("button,input")) return;
    switch (e.key) {
      case " ":
      case "k":
        e.preventDefault();
        togglePlay();
        break;
      case "ArrowRight":
        e.preventDefault();
        seekBy(SEEK_STEP);
        break;
      case "ArrowLeft":
        e.preventDefault();
        seekBy(-SEEK_STEP);
        break;
      case "f":
        toggleFullscreen();
        break;
      case "m":
        toggleMute();
        break;
      case "+":
      case "=":
        zoomIn();
        break;
      case "-":
        zoomOut();
        break;
      case "0":
        zoomReset();
        break;
    }
  };

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={title}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="relative flex h-full w-full select-none flex-col bg-black focus-visible:outline-none"
    >
      {/* Picture area — click to play/pause, drag to move when zoomed in */}
      <div
        ref={areaRef}
        className="relative min-h-0 flex-1 overflow-hidden"
        style={{
          cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "pointer",
          touchAction: zoom > 1 ? "none" : "auto",
        }}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          drag.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y, moved: false };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          const dx = e.clientX - d.startX;
          const dy = e.clientY - d.startY;
          if (!d.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
            d.moved = true;
            if (zoom > 1) setDragging(true);
          }
          if (d.moved && zoom > 1) setPan(clampPan(d.panX + dx, d.panY + dy, zoom));
        }}
        onPointerUp={() => {
          const d = drag.current;
          drag.current = null;
          setDragging(false);
          if (d && !d.moved) togglePlay();
        }}
        onPointerCancel={() => {
          drag.current = null;
          setDragging(false);
        }}
      >
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: dragging ? "none" : "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            preload="metadata"
            playsInline
            draggable={false}
            className="h-full w-full select-none object-contain"
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              setDuration(v.duration);
              if (v.videoWidth && v.videoHeight) setRatio(v.videoWidth / v.videoHeight);
              setReady(true);
            }}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
            onError={() => setError(true)}
          />
        </div>

        {!ready && !error && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[11px] uppercase tracking-widest text-white/50">
            Loading video…
          </div>
        )}
        {error && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center font-body text-sm text-white/60">
            The video couldn&apos;t be loaded.
          </div>
        )}
        {ready && !playing && !error && (
          <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-black/60 text-white backdrop-blur-sm">
            <Play className="h-6 w-6" fill="currentColor" />
          </span>
        )}
        {zoom > 1 && !error && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-body text-[10.5px] font-medium text-white/70 backdrop-blur-sm">
            Drag to move
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex shrink-0 flex-wrap items-center gap-x-1.5 gap-y-1 border-t border-white/10 bg-[#0c0818] px-2.5 py-1.5">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          title={playing ? "Pause (Space)" : "Play (Space)"}
          className={CTRL_BTN}
        >
          {playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4" fill="currentColor" />}
        </button>

        <span className="whitespace-nowrap px-1 font-mono text-[11px] tabular-nums text-white/70">
          {fmt(time)} / {fmt(duration)}
        </span>

        <input
          type="range"
          aria-label="Seek"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(time, duration || 0)}
          onChange={(e) => {
            const v = videoRef.current;
            if (v) v.currentTime = Number(e.target.value);
            setTime(Number(e.target.value));
          }}
          className="order-first h-1.5 w-full cursor-pointer accent-[#2DD4BF] sm:order-none sm:w-auto sm:min-w-[80px] sm:flex-1"
        />

        {!silent && (
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            title={muted ? "Unmute (M)" : "Mute (M)"}
            className={CTRL_BTN}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        )}

        <div role="group" aria-label="Zoom" className="flex items-center rounded-lg border border-white/10 bg-white/[0.04]">
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoomIdx === 0}
            aria-label="Zoom out"
            title="Zoom out (-)"
            className={CTRL_BTN}
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={zoomReset}
            aria-label="Fit whole video"
            title="Fit whole video (0)"
            className="min-w-[44px] px-1 text-center font-mono text-[11px] tabular-nums text-white/85 transition-colors hover:text-white"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoomIdx === ZOOMS.length - 1}
            aria-label="Zoom in"
            title="Zoom in (+)"
            className={CTRL_BTN}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={fullscreen ? "Exit full screen" : "Full screen"}
          title={fullscreen ? "Exit full screen (F)" : "Full screen (F)"}
          className={CTRL_BTN}
        >
          {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
