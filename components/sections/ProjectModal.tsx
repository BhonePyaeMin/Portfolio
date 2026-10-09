"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Play, FileText, X, ExternalLink, Download, Radio } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { linkKind, type Project, type ProjectMedia } from "@/lib/projects";
import { TagChip } from "./projectTags";
import ProjectVideoPlayer from "./ProjectVideoPlayer";

type Tab = "video" | "pdf";

const TAB_META: Record<Tab, { label: string; Icon: typeof Play }> = {
  video: { label: "Video", Icon: Play },
  pdf: { label: "PDF", Icon: FileText },
};

const ACTION_BTN =
  "inline-flex items-center gap-2 rounded-xl border border-borderHv bg-surface px-4 py-2.5 font-body text-xs font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(45,212,191,0.45)] hover:text-cyan";

const ACTION_BTN_LIVE =
  "inline-flex items-center gap-2 rounded-xl border border-[rgba(248,113,113,0.4)] bg-[rgba(248,113,113,0.08)] px-4 py-2.5 font-body text-xs font-semibold text-[#FCA5A5] transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(248,113,113,0.7)] hover:bg-[rgba(248,113,113,0.14)] hover:text-[#FECACA]";

const THIN_SCROLL =
  "[scrollbar-width:thin] [scrollbar-color:rgba(45,212,191,0.35)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[rgba(45,212,191,0.35)]";

// ─── PDF reader: just the pages, scrolling top to bottom ──────────────────────

function PdfReader({ pdf, title }: { pdf: NonNullable<ProjectMedia["pdf"]>; title: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const midline = el.scrollTop + el.clientHeight / 2;
    let current = 1;
    el.querySelectorAll<HTMLElement>("[data-page]").forEach((p, i) => {
      if (p.offsetTop <= midline) current = i + 1;
    });
    setPage(current);
  };

  return (
    <div className="absolute inset-0">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        tabIndex={0}
        aria-label={`${title} — PDF pages`}
        className={`relative h-full overflow-y-auto overscroll-contain bg-[#0b0718] px-4 py-5 focus-visible:outline-none sm:px-8 ${THIN_SCROLL}`}
      >
        <div className="mx-auto flex max-w-[720px] flex-col gap-4">
          {pdf.pages.map((src, i) => (
            <img
              key={src}
              data-page
              src={src}
              alt={`Page ${i + 1} of ${pdf.pages.length}`}
              width={pdf.pageWidth}
              height={pdf.pageHeight}
              loading={i < 2 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              className="block h-auto w-full rounded-md bg-[#1b1530] shadow-[0_12px_32px_-12px_rgba(0,0,0,0.85)] ring-1 ring-white/10"
            />
          ))}
        </div>
      </div>
      <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-borderHv bg-black/60 px-3 py-1 font-mono text-[11px] tabular-nums text-ink backdrop-blur-md">
        {page} / {pdf.pages.length}
      </span>
    </div>
  );
}

// ─── Dialog ───────────────────────────────────────────────────────────────────

function Dialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const { media } = project;
  const tabs = (["video", "pdf"] as Tab[]).filter((t) => media?.[t]);
  const [tab, setTab] = useState<Tab>(tabs[0]);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const switchTab = (t: Tab) => {
    if (t !== tab) setTab(t);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#04060f]/75 p-3 backdrop-blur-md sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="relative flex max-h-[94vh] w-full max-w-[880px] flex-col overflow-hidden rounded-3xl border border-borderHv bg-[#100a24] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top bar: media tabs + close ── */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div role="tablist" aria-label="Project media" className="flex items-center gap-1.5">
            {tabs.map((t) => {
              const { label, Icon } = TAB_META[t];
              const active = t === tab;
              return (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => switchTab(t)}
                  className={[
                    "inline-flex items-center gap-2 rounded-xl border px-3.5 py-1.5 font-body text-[11px] font-bold uppercase tracking-wider transition-all duration-200",
                    active
                      ? "border-[rgba(45,212,191,0.45)] bg-[rgba(45,212,191,0.10)] text-cyan"
                      : "border-transparent text-slate hover:text-ink",
                  ].join(" ")}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-borderHv bg-surface text-slate transition-all duration-200 hover:border-[rgba(45,212,191,0.45)] hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(45,212,191,0.5)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Scrollable body (only scrolls on very short screens) ── */}
        <div className={`overflow-y-auto ${THIN_SCROLL}`}>
          {/* Media stage */}
          <div className="relative h-[clamp(240px,48vh,460px)] w-full bg-black">
            {tab === "video" && media?.video && (
              <ProjectVideoPlayer
                key="video"
                src={media.video.src}
                poster={media.video.poster}
                silent={media.video.silent}
                title={`${project.title} — demo video`}
              />
            )}
            {tab === "pdf" && media?.pdf && <PdfReader pdf={media.pdf} title={project.title} />}
          </div>

          {/* Details */}
          <div className="px-6 pb-5 pt-4 sm:px-8">
            <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan">
              {project.categories.join(" · ")} · {project.year}
            </p>
            <h2
              id="project-modal-title"
              className="mb-1.5 font-heading text-2xl font-bold leading-tight tracking-tight text-ink"
            >
              {project.title}
            </h2>
            {project.subtitle && (
              <p className="mb-3 font-body text-[13.5px] font-medium text-slate">{project.subtitle}</p>
            )}
            <p className="mb-4 max-w-2xl whitespace-pre-line font-body text-[13px] leading-[1.7] text-body">
              {project.description}
            </p>

            <p className="mb-2 font-body text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted">
              Tech stack
            </p>
            <div className="mb-5 flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <TagChip key={t} tag={t} />
              ))}
            </div>

            {(project.links?.length || media?.pdf) && (
              <div className="flex flex-wrap gap-2.5 border-t border-border pt-4">
                {project.links?.map((l) => {
                  const kind = linkKind(l);
                  const isLive = kind === "live";
                  const isGithub = kind === "github";
                  const text = l.kind ? `${isLive ? "Live" : "GitHub"} · ${l.label}` : l.label;
                  return (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={isLive ? ACTION_BTN_LIVE : ACTION_BTN}
                    >
                      {isLive ? (
                        <Radio className="h-3.5 w-3.5" />
                      ) : isGithub ? (
                        <SiGithub className="h-3.5 w-3.5" />
                      ) : (
                        <ExternalLink className="h-3.5 w-3.5" />
                      )}
                      {text}
                    </a>
                  );
                })}
                {media?.pdf && (
                  <>
                    <a href={media.pdf.src} target="_blank" rel="noopener noreferrer" className={ACTION_BTN}>
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open PDF
                    </a>
                    <a href={media.pdf.src} download className={ACTION_BTN}>
                      <Download className="h-3.5 w-3.5" />
                      Download PDF
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {project?.media && <Dialog key={project.id} project={project} onClose={onClose} />}
    </AnimatePresence>,
    document.body
  );
}
