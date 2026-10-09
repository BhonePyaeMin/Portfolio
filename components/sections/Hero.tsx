"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "@/components/ui/Tooltip";
import { Mail, Briefcase, FileText } from "lucide-react";
import { ResumeModal } from "@/components/ui/ResumeModal";

// ─── Custom Icons ─────────────────────────────────────────────────────────────

function LinkedInIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S9 17.44 9 18v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  { label: "Email",    href: "mailto:bhonepyaemin.tech@gmail.com", icon: Mail },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/bhone-pyae-min-b273a4371", icon: LinkedInIcon },
  { label: "GitHub",   href: "https://github.com/BhonePyaeMin", icon: GitHubIcon },
  { label: "JobsDB",   href: "https://th.jobsdb.com/th/profiles/bhonepyae-min-ns7y634rgd", icon: Briefcase },
];

const ROLES = [
  {
    title: "Computer Engineering",
    description: "Designing high-performance software systems and hardware-software integrations.",
  },
  {
    title: "Network Engineer",
    description: "Building, configuring, and optimizing reliable enterprise networks.",
  },
  {
    title: "Network Automation Engineer",
    description: "Eliminating manual network tasks with smart Python scripts and automated workflows.",
  },
  {
    title: "Cybersecurity Engineer",
    description: "Protecting network infrastructure, data, and systems from digital threats.",
  },
  {
    title: "AI / ML Engineer",
    description: "Integrating machine learning models and intelligent tools to solve complex problems.",
  },
];

// ─── Timings ──────────────────────────────────────────────────────────────────

const CHAR_DELAY   = 60;   // ms per character while typing
const DELETE_DELAY = 40;   // ms per character while deleting
const HOLD_MS      = 2000; // ms to hold after fully typed
const FADE_MS      = 300;  // ms for description cross-fade

// ─── useRoleTypewriter ────────────────────────────────────────────────────────

type TWPhase = "typing" | "holding" | "deleting";

function useRoleTypewriter() {
  const [index, setIndex]       = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase]       = useState<TWPhase>("typing");
  const [descOpacity, setDescOpacity] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const title = ROLES[index].title;

  useEffect(() => {
    const clear = () => { if (timer.current) clearTimeout(timer.current); };

    if (phase === "typing") {
      if (displayed.length < title.length) {
        timer.current = setTimeout(
          () => setDisplayed(title.slice(0, displayed.length + 1)),
          CHAR_DELAY
        );
      } else {
        // Done typing → fade in description → hold
        setDescOpacity(1);
        timer.current = setTimeout(() => setPhase("holding"), HOLD_MS);
      }
    } else if (phase === "holding") {
      // Fade out description, then start deleting after fade finishes
      setDescOpacity(0);
      timer.current = setTimeout(() => setPhase("deleting"), FADE_MS + 50);
    } else if (phase === "deleting") {
      if (displayed.length > 0) {
        timer.current = setTimeout(
          () => setDisplayed((d) => d.slice(0, -1)),
          DELETE_DELAY
        );
      } else {
        // Done deleting → next role
        setIndex((i) => (i + 1) % ROLES.length);
        setPhase("typing");
      }
    }

    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayed, phase, index]);

  return { displayed, descOpacity, description: ROLES[index].description };
}

// ─── Animation ────────────────────────────────────────────────────────────────

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.18 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

// ─── TypewriterRow ─────────────────────────────────────────────────────────────

function TypewriterRow() {
  // Detect prefers-reduced-motion (client-only)
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = () => setReduced(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // ── Reduced-motion: simple cross-fade between whole pairs ──
  const [rmIdx,     setRmIdx]     = useState(0);
  const [rmVisible, setRmVisible] = useState(true);
  useEffect(() => {
    if (!reduced) return;
    const id = setInterval(() => {
      setRmVisible(false);
      setTimeout(() => { setRmIdx((i) => (i + 1) % ROLES.length); setRmVisible(true); }, FADE_MS + 50);
    }, 3500);
    return () => clearInterval(id);
  }, [reduced]);

  // ── Normal typewriter ──
  const { displayed, descOpacity, description } = useRoleTypewriter();

  const titleText  = reduced ? ROLES[rmIdx].title       : displayed;
  const descText   = reduced ? ROLES[rmIdx].description : description;
  const titleAlpha = reduced ? (rmVisible ? 1 : 0)      : 1;
  const descAlpha  = reduced ? (rmVisible ? 1 : 0)      : descOpacity;

  return (
    // Fixed height keeps the hero from reflowing while text changes
    <div className="mx-auto mb-8 max-w-[1050px] text-center" style={{ minHeight: "7rem" }}>

      {/* ── Title + blinking cursor ── */}
      <div
        className="mb-8 inline-flex items-center justify-center font-mono text-xl sm:text-2xl lg:text-3xl"
        style={{
          color: "#2DD4BF",
          opacity: titleAlpha,
          transition: `opacity ${reduced ? FADE_MS : 0}ms ease`,
        }}
      >
        <span>{titleText}</span>

        {/* Thin vertical bar cursor — pure CSS blink, hard cut, no JS */}
        {!reduced && (
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: "2px",
              height: "1.1em",
              marginLeft: "3px",
              backgroundColor: "#2DD4BF",
              verticalAlign: "middle",
              animation: "hero-cursor-blink 1s step-end infinite",
            }}
          />
        )}
      </div>

      {/* ── Synced description ── */}
      <p
        className="font-body text-xs leading-[1.75] text-body sm:text-xs"
        style={{
          opacity: descAlpha,
          transition: `opacity ${FADE_MS}ms ease`,
          minHeight: "1.5rem",
        }}
      >
        {descText}
      </p>

      {/* Keyframe injected once per mount */}
      <style>{`
        @keyframes hero-cursor-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Hero() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <>
      <section
        id="hero"
        aria-label="Introduction"
        className="relative flex min-h-screen items-center justify-center"
      >
        {/* Ambient glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-1/4 -z-10 h-[600px] w-[600px] -translate-x-1/3 rounded-full bg-cyan/[0.04] blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/4 top-1/3 -z-10 h-[400px] w-[400px] rounded-full bg-teal/[0.05] blur-[100px]"
        />

        <div className="mx-auto w-full max-w-[900px] px-4 py-8 text-center lg:py-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {/* ── Kicker ── */}
            <motion.p
              variants={fadeUp}
              className="mb-8 font-mono text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: "#FFD700" }}
            >
              // welcome to my portfolio
            </motion.p>

            {/* ── Headline ── */}
            <motion.h1
              variants={fadeUp}
              className="mb-6 font-heading text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl text-balance"
            >
              Hi, I&apos;m{" "}
              <span style={{ color: "#0ea5e9" }}>BHONE PYAE MIN</span>
            </motion.h1>

            {/* ── Typewriter + synced description ── */}
            <motion.div variants={fadeUp}>
              <TypewriterRow />
            </motion.div>

            {/* ── Icon-Only Contact Links ── */}
            <motion.div
              variants={fadeUp}
              className="mb-8 flex flex-wrap items-center justify-center gap-4"
            >
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <Tooltip key={label} label={label} position="top">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      "border border-border bg-bgPanel",
                      "transition-all duration-300",
                      "text-muted",
                      "hover:-translate-y-1 hover:border-teal/30 hover:bg-teal/[0.08] hover:text-teal hover:shadow-[0_4px_20px_rgba(45,212,191,0.15)]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60",
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </Tooltip>
              ))}
            </motion.div>

            {/* ── CTAs ── */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <a
                href="#projects"
                className={[
                  "group relative inline-flex h-10 items-center overflow-hidden",
                  "rounded-full bg-teal px-8",
                  "font-heading text-xs font-semibold",
                  "transition-all duration-300",
                  "hover:shadow-[0_0_28px_rgba(45,212,191,0.4)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60",
                ].join(" ")}
                style={{ color: "#12081F" }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-500 group-hover:translate-x-full"
                />
                <span className="relative z-10">View Projects</span>
              </a>

              <a
                href="#contact"
                className={[
                  "inline-flex h-10 items-center rounded-full",
                  "border border-border bg-bgPanel px-8",
                  "font-heading text-xs font-semibold text-ink",
                  "transition-all duration-300",
                  "hover:border-teal/30 hover:bg-teal/[0.08] hover:text-teal",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60",
                ].join(" ")}
              >
                Contact Me
              </a>

              <button
                onClick={() => setIsResumeOpen(true)}
                className={[
                  "inline-flex h-10 items-center gap-2 rounded-full",
                  "border border-border bg-bgPanel px-8",
                  "font-heading text-xs font-semibold text-ink",
                  "transition-all duration-300",
                  "hover:border-teal/30 hover:bg-teal/[0.08] hover:text-teal",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/60",
                ].join(" ")}
              >
                <FileText className="h-4 w-4" />
                Resume
              </button>
            </motion.div>
          </motion.div>
        </div>

      </section>

      {/* Resume Modal */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </>
  );
}
