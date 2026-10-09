"use client";

import { useRef, useEffect, useState } from "react";

// ─── useReveal hook ───────────────────────────────────────────────────────────
// Each timeline item owns one IntersectionObserver.
// The observer is disconnected after first intersection so re-scrolling
// past the item never re-triggers the animation.

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(el); // fire once only — no cleanup needed after this
        }
      },
      { threshold: 0.18, rootMargin: "-40px 0px" }
    );

    observer.observe(el);
    // Cleanup if component unmounts before intersection fires
    return () => observer.disconnect();
  }, []); // empty deps → runs once on mount

  return { ref, revealed };
}

// ─── Data ─────────────────────────────────────────────────────────────────────

type ItemType = "Education" | "Certification";

interface TimelineItem {
  id: string;
  period: string;
  type: ItemType;
  title: string;
  institution: string;
  detail: string;
  tags: string[];
  active?: boolean; // shows pulsing ring (current / in-progress)
}

const ITEMS: TimelineItem[] = [
  {
    id: "degree",
    period: "2023 — Present",
    type: "Education",
    title: "B.Eng Computer Engineering",
    institution: "Mae Fah Luang University",
    detail: "Chiang Rai, Thailand · GPAX 3.39",
    tags: ["Networking", "Cybersecurity", "AI / ML", "Automation"],
    active: true,
  },
  {
    id: "hccda",
    period: "2024",
    type: "Certification",
    title: "HCCDA — Tech Essentials",
    institution: "Huawei",
    detail: "Huawei Certified ICT Associate · Tech Essentials",
    tags: ["Cloud", "Data Center", "ICT Fundamentals"],
  },
  {
    id: "hcia",
    period: "2024 — 2025",
    type: "Certification",
    title: "HCIA — Datacom",
    institution: "Huawei",
    detail: "Huawei Certified ICT Associate · Data Communications",
    tags: ["Routing", "Switching", "OSPF", "BGP"],
    active: true,
  },
];

// ─── Single timeline entry ────────────────────────────────────────────────────

function TimelineEntry({
  item,
  index,
  isLast,
}: {
  item: TimelineItem;
  index: number;
  isLast: boolean;
}) {
  const { ref, revealed } = useReveal();
  const isEdu = item.type === "Education";

  return (
    <div
      ref={ref}
      // Each item fades up independently; delay scales with index so items
      // cascade naturally when they all become visible at once.
      style={{ transitionDelay: `${index * 110}ms` }}
      className={[
        "relative pl-10 transition-[opacity,transform] duration-700 ease-out",
        !isLast && "pb-12",
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ── Dot marker ────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-[22px] -translate-x-1/2"
      >
        {/* Outer ping for active items */}
        {item.active && (
          <span
            className={[
              "absolute -inset-1.5 animate-ping rounded-full opacity-40",
              isEdu ? "bg-cyan" : "bg-teal",
            ].join(" ")}
          />
        )}
        {/* Solid dot */}
        <span
          className={[
            "relative flex h-3 w-3 rounded-full",
            isEdu
              ? "bg-cyan shadow-[0_0_10px_rgba(0,229,255,0.55)]"
              : "bg-teal shadow-[0_0_10px_rgba(91,110,245,0.55)]",
          ].join(" ")}
        />
      </div>

      {/* ── Card ──────────────────────────────────────────────────────────── */}
      <div
        className={[
          "rounded-xl border bg-bgPanel/60 p-6 backdrop-blur-sm",
          "transition-colors duration-300 hover:border-borderHv",
          "border-border",
        ].join(" ")}
      >
        {/* Header row: type badge + period */}
        <div className="mb-3 flex flex-wrap items-center gap-2.5">
          <span
            className={[
              "rounded-full px-2.5 py-0.5 font-body text-xs font-semibold",
              isEdu
                ? "bg-cyan/10 text-cyan"
                : "bg-teal/10 text-teal",
            ].join(" ")}
          >
            {item.type}
          </span>
          <span className="font-body text-xs text-slate">{item.period}</span>
        </div>

        {/* Title */}
        <h3 className="mb-1 font-heading text-xs font-semibold leading-snug text-ink">
          {item.title}
        </h3>

        {/* Institution */}
        <p className="mb-1.5 font-body text-xs font-medium text-secondary">
          {item.institution}
        </p>

        {/* Detail */}
        <p className="mb-5 font-body text-xs text-body">{item.detail}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border bg-surface px-2.5 py-0.5 font-body text-[13px] text-slate/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Timeline() {
  return (
    <section id="career" className="relative py-28">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/4 -z-10 h-[480px] w-[480px] rounded-full bg-cyan/[0.03] blur-[120px]"
      />

      <div className="mx-auto w-full max-w-[1050px] mx-auto px-4">
        {/* Section label */}
        <p className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.28em]" style={{ color: "#FFD700" }}>
          {"// path"}
        </p>
        <h2 className="mb-16 font-heading text-2xl font-bold tracking-tight text-ink md:text-3xl">
          Education &amp; Certifications.
        </h2>

        {/* ── Timeline ────────────────────────────────────────────────────── */}
        <div className="relative max-w-[1050px]">
          {/* Single continuous left border */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-[28px] bottom-6 w-px bg-gradient-to-b from-cyan/50 via-teal/25 to-transparent"
          />

          {ITEMS.map((item, i) => (
            <TimelineEntry
              key={item.id}
              item={item}
              index={i}
              isLast={i === ITEMS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
