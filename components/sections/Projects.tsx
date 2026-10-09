"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, LayoutGrid, Play, FileText, Radio } from "lucide-react";
import { SiGithub } from "react-icons/si";
import {
  PROJECTS,
  FILTER_KEYS,
  GITHUB_URL,
  type FilterKey,
  type FilterCategory,
  type Project,
  type ProjectLink,
  type ProjectMedia,
  linkKind,
} from "@/lib/projects";
import { CATEGORY_ICON, CATEGORY_STYLE, TagChip } from "./projectTags";
import ProjectModal from "./ProjectModal";

const PAGE_SIZE = 4;

const PAGE_BASE =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border font-body text-[11px] font-bold uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(45,212,191,0.5)] disabled:pointer-events-none disabled:opacity-35";
const PAGE_OFF = "border-border bg-[rgba(21,11,41,0.6)] text-slate hover:border-borderHv hover:text-ink";
const PAGE_ON = "border-[rgba(45,212,191,0.5)] bg-[rgba(45,212,191,0.12)] text-cyan";

function countFor(key: FilterKey): number {
  return key === "All"
    ? PROJECTS.length
    : PROJECTS.filter((p) => p.categories.includes(key)).length;
}

// ─── "Video" / "PDF" labels shown on rows that open the media popup ───────────

const MEDIA_PILL =
  "inline-flex items-center gap-1.5 rounded-full border border-[rgba(45,212,191,0.30)] bg-[rgba(45,212,191,0.08)] px-2.5 py-1 font-body text-[11px] font-semibold leading-none text-cyan transition-colors duration-300 group-hover:border-[rgba(45,212,191,0.55)] group-hover:bg-[rgba(45,212,191,0.14)]";

function MediaPills({ media, className = "" }: { media: ProjectMedia; className?: string }) {
  return (
    <span className={`items-center gap-1.5 ${className}`}>
      {media.video && (
        <span className={MEDIA_PILL}>
          <Play className="h-3 w-3" fill="currentColor" aria-hidden="true" />
          Video
        </span>
      )}
      {media.pdf && (
        <span className={MEDIA_PILL}>
          <FileText className="h-3 w-3" aria-hidden="true" />
          PDF
        </span>
      )}
    </span>
  );
}

// ─── "Live" pill — a real link, so it needs to sit outside any <button> ancestor ──

const LIVE_PILL =
  "inline-flex items-center gap-1.5 rounded-full border border-[rgba(248,113,113,0.35)] bg-[rgba(248,113,113,0.08)] px-2.5 py-1 font-body text-[11px] font-semibold leading-none text-[#FCA5A5] transition-colors duration-300 hover:border-[rgba(248,113,113,0.65)] hover:bg-[rgba(248,113,113,0.16)] hover:text-[#FECACA]";

function LivePill({ link }: { link: ProjectLink }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      title={link.kind ? `${link.label} — live demo` : undefined}
      className={LIVE_PILL}
    >
      <Radio className="h-3 w-3" aria-hidden="true" />
      {link.label}
    </a>
  );
}

// ─── "GitHub" pill — same reasoning as the Live pill above ───────────────────

function GitHubPill({ link }: { link: ProjectLink }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      title={link.kind ? `${link.label} — source on GitHub` : undefined}
      className={MEDIA_PILL}
    >
      <SiGithub className="h-3 w-3" aria-hidden="true" />
      {link.label}
    </a>
  );
}

// ─── Compact project row ──────────────────────────────────────────────────────

function ProjectRow({
  project,
  titleCategory,
  onOpen,
}: {
  project: Project;
  titleCategory: FilterCategory;
  onOpen: (project: Project, trigger: HTMLElement) => void;
}) {
  const hasMedia = Boolean(project.media);
  const liveLinks = project.links?.filter((l) => linkKind(l) === "live") ?? [];
  const githubLinks = project.links?.filter((l) => linkKind(l) === "github") ?? [];

  const hasActions = liveLinks.length > 0 || githubLinks.length > 0 || Boolean(project.media);

  const content = (
    <>
      <span className="flex min-w-0 flex-1 flex-col gap-2 text-left">
        <span className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
          <span className="flex min-w-0 flex-1 basis-64 flex-col gap-0.5">
            <span className="font-mono text-[11px] tabular-nums text-muted sm:hidden">{project.year}</span>
            <span className={`font-heading text-[15px] font-semibold leading-snug ${CATEGORY_STYLE[titleCategory].title}`}>
              {project.title}
            </span>
          </span>
          {hasActions && (
            <span className="flex min-w-0 max-w-full flex-wrap items-center justify-start gap-1.5 sm:justify-end">
              {liveLinks.map((l) => (
                <LivePill key={l.href} link={l} />
              ))}
              {githubLinks.map((l) => (
                <GitHubPill key={l.href} link={l} />
              ))}
              {project.media && <MediaPills media={project.media} className="flex" />}
            </span>
          )}
        </span>
        <span className="line-clamp-2 font-body text-[12.5px] leading-relaxed text-body">
          {project.description}
        </span>
        <span className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </span>
      </span>

      <span className="flex shrink-0 items-center gap-3">
        <span className="hidden font-mono text-[11px] tabular-nums text-muted sm:block">{project.year}</span>
        {hasMedia && (
          <ArrowRight className="h-4 w-4 text-cyan transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </span>
    </>
  );

  const base =
    "group relative flex w-full items-center gap-4 rounded-2xl border border-border bg-bgPanel px-5 py-4 transition-all duration-300";

  if (hasMedia) {
    // A <div role="button"> rather than a real <button> — the Live pill above is a genuine
    // <a>, and nesting interactive elements inside a <button> is invalid HTML.
    return (
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-label={`${project.title} — open ${[project.media?.video && "video", project.media?.pdf && "PDF"].filter(Boolean).join(" and ")}`}
        onClick={(e) => onOpen(project, e.currentTarget)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(project, e.currentTarget);
          }
        }}
        className={`${base} cursor-pointer hover:-translate-y-0.5 hover:border-[rgba(45,212,191,0.4)] hover:bg-[rgba(45,212,191,0.04)] hover:shadow-[0_14px_40px_-16px_rgba(45,212,191,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(45,212,191,0.5)]`}
      >
        {content}
      </div>
    );
  }

  return <div className={`${base} hover:border-borderHv`}>{content}</div>;
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");
  // Controls the list opacity during the filter crossfade
  const [gridVisible, setGridVisible] = useState(true);
  const [page, setPage] = useState(0);
  const [openProject, setOpenProject] = useState<Project | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const triggerRef = useRef<HTMLElement | null>(null);

  // Fade-out → apply the change → fade-in
  const swap = useCallback((apply: () => void) => {
    clearTimeout(timerRef.current);
    setGridVisible(false);
    timerRef.current = setTimeout(() => {
      apply();
      setGridVisible(true);
    }, 180);
  }, []);

  const handleFilter = useCallback(
    (key: FilterKey) => {
      if (key === activeFilter) return;
      swap(() => {
        setActiveFilter(key);
        setPage(0);
      });
    },
    [activeFilter, swap]
  );

  const handlePage = useCallback((next: number) => swap(() => setPage(next)), [swap]);

  const handleOpen = useCallback((project: Project, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setOpenProject(project);
  }, []);

  const handleClose = useCallback(() => {
    setOpenProject(null);
    triggerRef.current?.focus();
  }, []);

  // Cleanup on unmount
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const filtered =
    activeFilter === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.categories.includes(activeFilter as FilterCategory));

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  return (
    <section id="projects" className="relative py-28">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/3 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan/[0.04] blur-[120px]"
      />

      <div className="mx-auto w-full max-w-[1050px] px-4">
        {/* ── Section heading ── */}
        <div className="flex flex-col items-center text-center">
          <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.28em]" style={{ color: "#FFD700" }}>
            {"// selected work"}
          </p>
          <h2 className="mb-3 font-heading text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
            Turning technical ideas into working <span className="text-cyan">systems</span>.
          </h2>
          <p className="mb-10 max-w-xl font-body text-sm leading-relaxed text-body">
            A collection of projects exploring networking, automation, cybersecurity, software development, and AI/ML.
          </p>
        </div>

        {/* ── Filter tabs ── */}
        <div className="mb-6 flex justify-center">
          <div
            role="tablist"
            aria-label="Filter projects by category"
            className="flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-border bg-[rgba(21,11,41,0.6)] p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {FILTER_KEYS.map((key) => {
              const isActive = key === activeFilter;
              const Icon = key === "All" ? LayoutGrid : CATEGORY_ICON[key];
              const style = key === "All" ? null : CATEGORY_STYLE[key];
              return (
                <button
                  key={key}
                  id={`filter-${key.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleFilter(key)}
                  className={[
                    "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-body text-[12.5px] font-semibold transition-all duration-200",
                    isActive
                      ? style?.tabOn ?? "bg-[rgba(45,212,191,0.12)] text-cyan shadow-[inset_0_0_0_1px_rgba(45,212,191,0.30)]"
                      : "text-slate hover:text-ink",
                  ].join(" ")}
                >
                  <Icon className={`h-3.5 w-3.5 ${style?.icon ?? "text-cyan"}`} />
                  {key}
                  <span className={["text-[10px] font-medium", isActive ? "opacity-70" : "text-muted"].join(" ")}>
                    {countFor(key)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Project list ── */}
        <div
          className={[
            "mx-auto flex w-full max-w-[860px] flex-col gap-3",
            "transition-opacity duration-[180ms] ease-in-out",
            gridVisible ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          {visible.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              titleCategory={
                activeFilter !== "All" && project.categories.includes(activeFilter as FilterCategory)
                  ? (activeFilter as FilterCategory)
                  : project.categories[0]
              }
              onOpen={handleOpen}
            />
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <p className="py-16 text-center font-body text-xs text-slate">
            No projects in this category yet.
          </p>
        )}

        {/* ── Pagination ── */}
        {pageCount > 1 && (
          <nav aria-label="Projects pagination" className="mt-6 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handlePage(currentPage - 1)}
              disabled={currentPage === 0}
              aria-label="Previous page"
              className={`${PAGE_BASE} ${PAGE_OFF} px-3.5`}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </button>
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => i !== currentPage && handlePage(i)}
                aria-label={`Page ${i + 1}`}
                aria-current={i === currentPage ? "page" : undefined}
                className={`${PAGE_BASE} ${i === currentPage ? PAGE_ON : PAGE_OFF} w-10`}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handlePage(currentPage + 1)}
              disabled={currentPage === pageCount - 1}
              aria-label="Next page"
              className={`${PAGE_BASE} ${PAGE_OFF} px-3.5`}
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </nav>
        )}

        {/* ── View more on GitHub ── */}
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group mx-auto mt-8 flex w-full max-w-[330px] items-center gap-3 rounded-xl border border-border bg-bgPanel px-3.5 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(45,212,191,0.4)] hover:shadow-[0_14px_40px_-16px_rgba(45,212,191,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(45,212,191,0.5)]"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-borderHv bg-surface text-ink transition-colors duration-300 group-hover:border-[rgba(45,212,191,0.45)] group-hover:text-cyan">
            <SiGithub className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-heading text-[13px] font-semibold leading-tight text-ink">View More on GitHub</span>
            <span className="block font-body text-[11px] leading-snug text-muted">Explore all repositories &amp; contributions</span>
          </span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate transition-all duration-300 group-hover:translate-x-1 group-hover:text-cyan" />
        </a>
      </div>

      <ProjectModal project={openProject} onClose={handleClose} />
    </section>
  );
}
