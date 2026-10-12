"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Maximize2, Minus, Plus } from "lucide-react";

const PDF_SRC = "/resume.pdf";

// Link hotspots are fractions of the page, taken from the PDF's own link annotations
const PAGE = {
  src: "/docs/resume/page-1.webp",
  width: 2382,
  height: 3369,
  links: [
    {
      href: "https://www.linkedin.com/in/bhone-pyae-min-77314b434",
      label: "Open LinkedIn profile",
      x: 0.0808,
      y: 0.3049,
      w: 0.0908,
      h: 0.017,
    },
    {
      href: "https://bhonepyaemin.com/",
      label: "Open portfolio site",
      x: 0.0502,
      y: 0.3541,
      w: 0.0181,
      h: 0.0129,
    },
    {
      href: "https://bhonepyaemin.com/",
      label: "Open portfolio site",
      x: 0.0808,
      y: 0.3521,
      w: 0.1429,
      h: 0.0166,
    },
    {
      href: "https://bhonepyaemin.com/",
      label: "Open portfolio site",
      x: 0.5146,
      y: 0.9381,
      w: 0.1827,
      h: 0.0142,
    },
    {
      href: "https://github.com/BhonePyaeMin",
      label: "Open GitHub profile",
      x: 0.5033,
      y: 0.9524,
      w: 0.2268,
      h: 0.0143,
    },
  ],
};

const ZOOMS = [0.75, 1, 1.25, 1.5, 2];
const DEFAULT_ZOOM = 1;
const BASE_MAX_WIDTH = 800;
const PAD = 24;

const ICON_BTN =
  "flex h-9 w-9 items-center justify-center rounded-lg text-slate transition-colors hover:bg-white/10 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(45,212,191,0.5)]";

const ZOOM_BTN =
  "flex h-8 w-8 items-center justify-center rounded-lg text-slate transition-colors hover:bg-white/10 hover:text-ink disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(45,212,191,0.5)]";

const THIN_SCROLL =
  "[scrollbar-width:thin] [scrollbar-color:rgba(45,212,191,0.35)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[rgba(45,212,191,0.35)]";

export function ResumeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [zoomIdx, setZoomIdx] = useState(ZOOMS.indexOf(DEFAULT_ZOOM));
  const [viewW, setViewW] = useState(0);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const zoomIn = () => setZoomIdx((i) => Math.min(i + 1, ZOOMS.length - 1));
  const zoomOut = () => setZoomIdx((i) => Math.max(i - 1, 0));
  const zoomReset = () => setZoomIdx(ZOOMS.indexOf(DEFAULT_ZOOM));

  // Lock body scroll while open, and start every opening at the default zoom
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    setZoomIdx(ZOOMS.indexOf(DEFAULT_ZOOM));
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard: Esc closes, +/- zoom, 0 resets
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "+" || e.key === "=") setZoomIdx((i) => Math.min(i + 1, ZOOMS.length - 1));
      else if (e.key === "-" || e.key === "_") setZoomIdx((i) => Math.max(i - 1, 0));
      else if (e.key === "0") setZoomIdx(ZOOMS.indexOf(DEFAULT_ZOOM));
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Track the reader width so the page can be sized in pixels (and scroll sideways when zoomed)
  useEffect(() => {
    if (!isOpen) return;
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setViewW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);

  const zoom = ZOOMS[zoomIdx];
  const baseW = Math.min(Math.max(viewW - PAD * 2, 240), BASE_MAX_WIDTH);
  const pageW = baseW * zoom;

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#04060f]/75 backdrop-blur-md"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Resume"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative flex h-full max-h-[92vh] w-full max-w-[920px] flex-col overflow-hidden rounded-3xl border border-borderHv bg-[#100a24] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
              <h2 className="font-heading text-sm font-semibold text-ink">Resume</h2>

              <div className="flex items-center gap-2">
                <div
                  role="group"
                  aria-label="Zoom"
                  className="flex items-center rounded-xl border border-border bg-surface p-0.5"
                >
                  <button
                    type="button"
                    onClick={zoomOut}
                    disabled={zoomIdx === 0}
                    aria-label="Zoom out"
                    title="Zoom out (-)"
                    className={ZOOM_BTN}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={zoomReset}
                    aria-label="Reset zoom"
                    title="Reset zoom (0)"
                    className="min-w-[48px] px-1 text-center font-mono text-[11px] tabular-nums text-ink transition-colors hover:text-cyan"
                  >
                    {Math.round(zoom * 100)}%
                  </button>
                  <button
                    type="button"
                    onClick={zoomIn}
                    disabled={zoomIdx === ZOOMS.length - 1}
                    aria-label="Zoom in"
                    title="Zoom in (+)"
                    className={ZOOM_BTN}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <span aria-hidden="true" className="mx-0.5 hidden h-5 w-px bg-white/10 sm:block" />

                <a href={PDF_SRC} download="Bhone_Pyae_Min_Resume.pdf" className={ICON_BTN} title="Download PDF">
                  <Download className="h-4 w-4" />
                </a>
                <a
                  href={PDF_SRC}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${ICON_BTN} hidden sm:flex`}
                  title="Open in new tab"
                >
                  <Maximize2 className="h-4 w-4" />
                </a>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate transition-colors hover:bg-red-500/20 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(45,212,191,0.5)]"
                  title="Close (Esc)"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Reader — just the page, scrolls (and pans when zoomed) */}
            <div
              ref={scrollRef}
              tabIndex={0}
              aria-label="Resume page"
              className={`min-h-0 flex-1 overflow-auto bg-[#0b0718] focus-visible:outline-none ${THIN_SCROLL}`}
            >
              {viewW > 0 && (
                <div
                  className="flex justify-center"
                  style={{ width: Math.max(pageW + PAD * 2, viewW), padding: PAD }}
                >
                  <div className="relative shrink-0" style={{ width: pageW }}>
                    <img
                      src={PAGE.src}
                      alt="Resume of Bhone Pyae Min"
                      width={PAGE.width}
                      height={PAGE.height}
                      draggable={false}
                      className="block h-auto w-full rounded-md bg-white shadow-[0_16px_48px_-12px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
                    />
                    {PAGE.links.map((l, i) => (
                      <a
                        key={`${l.href}-${i}`}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={l.label}
                        title={l.label}
                        className="absolute rounded-sm transition-colors hover:bg-[rgba(45,212,191,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[rgba(45,212,191,0.7)]"
                        style={{
                          left: `${l.x * 100}%`,
                          top: `${l.y * 100}%`,
                          width: `${l.w * 100}%`,
                          height: `${l.h * 100}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
