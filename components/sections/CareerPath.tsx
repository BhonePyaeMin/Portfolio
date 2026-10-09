"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import {
  GraduationCap,
  Code2,
  ShieldCheck,
  Smartphone,
  BarChart3,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { GNS3Icon } from "@/components/icons/GNS3Icon";

// ─── useReveal ────────────────────────────────────────────────────────────────

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setRevealed(true); obs.unobserve(el); } },
      { threshold, rootMargin: "-20px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, revealed };
}

// ─── Types ────────────────────────────────────────────────────────────────────

type AccentKey = "copper" | "blue" | "cyan" | "violet" | "purple";

interface RoadmapCard {
  id: string;
  year: string;
  category: string;
  title: string;
  organization: string;
  location?: string;
  description: string;
  skills: string[];
  icon: React.ReactNode;
  accent: AccentKey;
  /** true = card sits on the RIGHT of center line; false = LEFT */
  right: boolean;
  isLatest?: boolean;
}

// ─── Accent palette ───────────────────────────────────────────────────────────

type AccentCfg = {
  hex: string;
  yearBg: string;
  yearText: string;
  catBg: string;
  catText: string;
  iconBg: string;
  iconText: string;
  border: string;
  borderHover: string;
  dotShadow: string;
  pillBg: string;
  pillText: string;
  pillBorder: string;
  glow: string;
};

const ACCENT: Record<AccentKey, AccentCfg> = {
  copper: {
    hex: "#2DD4BF",
    yearBg: "bg-copper/15",        yearText: "text-copper",
    catBg: "bg-copper/10",          catText: "text-copper/80",
    iconBg: "bg-copper/12",         iconText: "text-copper",
    border: "border-copper/20",     borderHover: "hover:border-copper/50",
    dotShadow: "shadow-[0_0_12px_4px_rgba(45,212,191,0.45)]",
    pillBg: "bg-copper/8",          pillText: "text-copper/70",  pillBorder: "border-copper/20",
    glow: "rgba(45,212,191,0.10)",
  },
  blue: {
    hex: "#5EEAD4",
    yearBg: "bg-blue/15",           yearText: "text-blue",
    catBg: "bg-blue/10",            catText: "text-blue/80",
    iconBg: "bg-blue/12",           iconText: "text-blue",
    border: "border-blue/20",       borderHover: "hover:border-blue/50",
    dotShadow: "shadow-[0_0_12px_4px_rgba(94,234,212,0.45)]",
    pillBg: "bg-blue/8",            pillText: "text-blue/70",    pillBorder: "border-blue/20",
    glow: "rgba(94,234,212,0.10)",
  },
  cyan: {
    hex: "#22D3C5",
    yearBg: "bg-cyan/15",           yearText: "text-cyan",
    catBg: "bg-cyan/10",            catText: "text-cyan/80",
    iconBg: "bg-cyan/12",           iconText: "text-cyan",
    border: "border-cyan/20",       borderHover: "hover:border-cyan/50",
    dotShadow: "shadow-[0_0_12px_4px_rgba(34,211,197,0.45)]",
    pillBg: "bg-cyan/8",            pillText: "text-cyan/70",    pillBorder: "border-cyan/20",
    glow: "rgba(34,211,197,0.10)",
  },
  violet: {
    hex: "#0F766E",
    yearBg: "bg-violet/15",         yearText: "text-violet",
    catBg: "bg-violet/10",          catText: "text-violet/80",
    iconBg: "bg-violet/12",         iconText: "text-violet",
    border: "border-violet/20",     borderHover: "hover:border-violet/50",
    dotShadow: "shadow-[0_0_12px_4px_rgba(15,118,110,0.45)]",
    pillBg: "bg-violet/8",          pillText: "text-violet/70",  pillBorder: "border-violet/20",
    glow: "rgba(15,118,110,0.10)",
  },
  purple: {
    hex: "#0D9488",
    yearBg: "bg-violet/20",         yearText: "text-violet",
    catBg: "bg-cyan/10",            catText: "text-cyan/80",
    iconBg: "bg-violet/15",         iconText: "text-cyan",
    border: "border-violet/30",     borderHover: "hover:border-cyan/50",
    dotShadow: "shadow-[0_0_16px_6px_rgba(13,148,136,0.55)]",
    pillBg: "bg-violet/10",         pillText: "text-violet/80",  pillBorder: "border-violet/30",
    glow: "rgba(13,148,136,0.14)",
  },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const CARDS: RoadmapCard[] = [
  {
    id: "rm-1",
    year: "2023 — PRESENT",
    category: "EDUCATION",
    title: "Bachelor of Computer Engineering",
    organization: "Mae Fah Luang University",
    location: "Chiang Rai, Thailand",
    description:
      "Currently pursuing a Bachelor of Engineering in Computer Engineering, building strong foundations in computer systems, networking, software development, and modern technologies.",
    skills: ["Computer Engineering", "Networking", "Cybersecurity", "AI / ML"],
    icon: <GraduationCap strokeWidth={1.5} size={28} />,
    accent: "copper",
    right: true,
  },
  {
    id: "rm-2",
    year: "2024",
    category: "WEB DEVELOPMENT",
    title: "Web Developer",
    organization: "Mae Fah Luang University",
    description:
      "Developed practical web development skills by building responsive web applications and working across frontend, backend, databases, and user-focused interfaces.",
    skills: ["HTML / CSS", "JavaScript", "Python", "Node.js"],
    icon: <Code2 strokeWidth={1.5} size={28} />,
    accent: "blue",
    right: false,
  },
  {
    id: "rm-3",
    year: "2025",
    category: "NETWORK & SECURITY",
    title: "Service Provider Network / Network System Security",
    organization: "Mae Fah Luang University",
    description:
      "Explored service-provider networking and network system security, focusing on network architecture, routing, switching, troubleshooting, and secure network configuration.",
    skills: ["Networking", "Routing & Switching", "GNS3", "Network Security"],
    icon: <ShieldCheck strokeWidth={1.5} size={28} />,
    accent: "cyan",
    right: true,
  },
  {
    id: "rm-4",
    year: "2025",
    category: "MOBILE DEVELOPMENT",
    title: "Mobile Developer",
    organization: "Mae Fah Luang University",
    description:
      "Developed a multi-role mobile application for asset borrowing workflows, including real-time status management, approval and rejection logic, inventory control, and usage history.",
    skills: ["Flutter", "Dart", "Mobile Development", "RBAC"],
    icon: <Smartphone strokeWidth={1.5} size={28} />,
    accent: "violet",
    right: false,
  },
  {
    id: "rm-5",
    year: "2026",
    category: "NETWORK ANALYTICS",
    title: "Network Analytics & Telemetry",
    organization: "Mae Fah Luang University",
    description:
      "Focused on analyzing network behavior and telemetry data to understand performance, detect anomalies, monitor systems, and support smarter network operations.",
    skills: ["Network Analytics", "Telemetry", "Python", "Monitoring"],
    icon: <BarChart3 strokeWidth={1.5} size={28} />,
    accent: "purple",
    right: true,
    isLatest: true,
  },
];

// ─── Decorative grid pattern (SVG) ───────────────────────────────────────────

function CardGridPattern({ color }: { color: string }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={`grid-${color}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={color} strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#grid-${color})`} />
    </svg>
  );
}

// ─── GNS3 pill icon ──────────────────────────────────────────────────────────

function SkillPill({
  label,
  accent,
}: {
  label: string;
  accent: AccentKey;
}) {
  const a = ACCENT[accent];
  const isGNS3 = label === "GNS3";
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-[3px] font-mono text-[13px]",
        a.pillBg, a.pillText, a.pillBorder,
      ].join(" ")}
    >
      {isGNS3 && (
        <GNS3Icon width={11} height={11} className="shrink-0 opacity-80" />
      )}
      {label}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function TimelineCard({
  card,
  index,
}: {
  card: RoadmapCard;
  index: number;
}) {
  const { ref, revealed } = useReveal(0.08);
  const a = ACCENT[card.accent];

  const cardBase = [
    "relative overflow-hidden rounded-2xl border p-4",
    "backdrop-blur-md",
    "transition-all duration-400 ease-out",
    a.border, a.borderHover,
    "hover:-translate-y-0.5",
  ].join(" ");

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 100}ms` }}
      className={[
        "w-full transition-[opacity,transform] duration-700 ease-out",
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
      ].join(" ")}
    >
      <div className={cardBase} style={{ backgroundColor: `rgba(7,26,61,0.70)` }}>
        {/* Decorative grid */}
        <CardGridPattern color={a.hex} />

        {/* Top accent gradient bar */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${a.hex}80 50%, transparent 100%)`,
          }}
        />

        {/* Ambient glow blob */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl"
          style={{ backgroundColor: a.glow }}
        />

        {/* Header row */}
        <div className="relative z-10 mb-4 flex flex-wrap items-center gap-2">
          {/* Year badge */}
          <span className={["rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider", a.yearBg, a.yearText].join(" ")}>
            {card.year}
          </span>
          {/* Category badge */}
          <span className={["rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest uppercase", a.catBg, a.catText].join(" ")}>
            {card.category}
          </span>
          {/* Latest indicator */}
          {card.isLatest && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet/15 px-2.5 py-0.5 font-mono text-[10px] text-violet">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet" />
              </span>
              Latest
            </span>
          )}
        </div>

        {/* Content area: icon + text */}
        <div className="relative z-10 flex items-start gap-4">
          {/* Icon box — larger for the MFU logo photo */}
          <div
            className={[
              "flex shrink-0 items-center justify-center rounded-xl border transition-all duration-300",
              card.id === "rm-1" ? "h-10 w-10 overflow-hidden" : "h-10 w-10",
              card.id !== "rm-1" ? [a.iconBg, a.iconText].join(" ") : "bg-black/80",
              a.border,
              "group-hover:scale-110",
            ].join(" ")}
          >
            {card.id === "rm-1" ? (
              <Image
                src="/images/logo.png"
                alt="Mae Fah Luang University"
                width={56}
                height={56}
                className="h-full w-full object-contain"
                style={{ padding: "3px" }}
              />
            ) : (
              card.icon
            )}
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1">
            <h3 className="mb-0.5 font-heading text-sm font-semibold font-semibold leading-snug" style={{ color: "#FFD700" }}>
              {card.title}
            </h3>
            <p className="mb-0.5 font-mono text-[13px] text-secondary">
              {card.organization}
            </p>
            {card.location && (
              <p className="mb-3 flex items-center gap-1 font-mono text-[10px] text-body/70">
                <MapPin size={9} strokeWidth={1.5} />
                {card.location}
              </p>
            )}
            {!card.location && <div className="mb-3" />}
            <p className="mb-4 font-body text-[13px] leading-[1.72] text-body">
              {card.description}
            </p>
          </div>
        </div>

        {/* Skills row */}
        <div className="relative z-10 flex flex-wrap gap-1.5">
          {card.skills.map((s) => (
            <SkillPill key={s} label={s} accent={card.accent} />
          ))}
        </div>

        {/* Arrow */}
        <div className="absolute bottom-4 right-5" aria-hidden="true">
          <ArrowRight size={14} className={a.iconText} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

// ─── Timeline dot ─────────────────────────────────────────────────────────────

function TimelineDot({ accent }: { accent: AccentKey }) {
  const a = ACCENT[accent];
  return (
    <div
      className={["bulb-shine h-3.5 w-3.5 shrink-0 scale-125 rounded-full border-2 border-white/20", a.dotShadow].join(" ")}
      style={{ backgroundColor: a.hex, color: a.hex }}
    />
  );
}

// ─── Timeline row (card + dot + connector) ────────────────────────────────────

function TimelineRow({
  card,
  index,
}: {
  card: RoadmapCard;
  index: number;
}) {
  return (
    <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-0">
      {/* LEFT slot */}
      {card.right ? (
        /* empty left */
        <div />
      ) : (
        /* card on the left */
        <div className="pr-6">
          <TimelineCard card={card} index={index} />
        </div>
      )}

      {/* Centre: dot on the line */}
      <div className="flex flex-col items-center">
        <TimelineDot accent={card.accent} />
      </div>

      {/* RIGHT slot */}
      {card.right ? (
        /* card on the right */
        <div className="pl-6">
          <TimelineCard card={card} index={index} />
        </div>
      ) : (
        /* empty right */
        <div />
      )}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function CareerPath() {
  return (
    <section id="career" className="relative py-8 lg:py-10 flex flex-col items-center">
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-cyan/[0.04] blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 bottom-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-teal/[0.04] blur-[110px]"
      />

      <div className="mx-auto w-full max-w-[900px] px-4">

        {/* ── Section heading ───────────────────────────────────────────────── */}
        <p className="mb-4 text-center font-mono text-xs font-bold uppercase tracking-[0.28em]" style={{ color: "#FFD700" }}>
          // career
        </p>
        <h2 className="mb-3 text-center font-heading text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
          Growing through <span className="text-cyan">engineering</span> and <span className="text-cyan">experience</span>.
        </h2>
        <p className="mb-16 text-center mx-auto max-w-xl font-body text-sm leading-relaxed text-body">
          An evolving journey through education, technical projects, hands-on learning, and professional development.
        </p>


        {/* ── Timeline container ────────────────────────────────────────────── */}
        {/*
          Desktop:  3-col grid [card | dot | card]
          Mobile:   all cards to the right, dot on the left
        */}
        <div className="relative hidden md:block">
          {/* Vertical centre line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2"
            style={{
              background:
                "linear-gradient(to bottom, rgba(34,211,197,0.5) 0%, rgba(34,211,197,0.4) 40%, rgba(34,211,197,0.3) 65%, rgba(34,211,197,0.1) 100%)",
            }}
          />

          {/* Cards */}
          <div className="flex flex-col gap-14">
            {CARDS.map((card, i) => (
              <TimelineRow key={card.id} card={card} index={i} />
            ))}
          </div>
        </div>

        {/* ── Mobile layout: left dot, right cards ──────────────────────────── */}
        <div className="relative md:hidden">
          {/* Left vertical line */}
          <div
            aria-hidden="true"
            className="absolute left-[5px] top-2 bottom-2 w-px"
            style={{
              background:
                "linear-gradient(to bottom, rgba(34,211,197,0.5) 0%, rgba(34,211,197,0.35) 60%, rgba(34,211,197,0.1) 100%)",
            }}
          />

          <div className="flex flex-col gap-10 pl-8">
            {CARDS.map((card, i) => {
              const a = ACCENT[card.accent];
              return (
                <div key={card.id} className="relative">
                  {/* Dot */}
                  <div
                    className="bulb-shine absolute -left-8 top-4 h-3 w-3 scale-125 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: a.hex, color: a.hex, boxShadow: `0 0 10px 3px ${a.hex}55` }}
                  />
                  <TimelineCard card={card} index={i} />
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
