"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network,
  Shield,
  Code2,
  Brain,
  Sparkles,
  Smartphone,
  Cloud,
  Globe,
  MessageSquare,
  Lightbulb,
  Users,
  Flag,
  RefreshCw,
  Wrench,
  Workflow,
  Cable,
  Plug,
  GitBranch,
  KeyRound,
  Share2,
  Brush,
  Spline,
  Database,
  ListChecks,
  ScanEye,
  ScanText,
} from "lucide-react";
import {
  SiPython,
  SiJavascript,
  SiNodedotjs,
  SiHtml5,
  SiFlutter,
  SiDart,
  SiCisco,
  SiHuawei,
  SiGoogle,
  SiVmware,
  SiFlask,
  SiTypescript,
  SiReact,
  SiThreedotjs,
  SiVite,
  SiExpress,
  SiSocketdotio,
  SiDotnet,
  SiOpenjdk,
  SiSpringboot,
  SiSpringsecurity,
  SiHibernate,
  SiThymeleaf,
  SiWebgl,
  SiPostgresql,
  SiSqlite,
  SiJunit5,
  SiDocker,
  SiGithubactions,
  SiMediapipe,
  SiAndroid,
  SiFigma,
} from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";
import { FaCss3Alt } from "react-icons/fa";
import { GNS3Icon } from "@/components/icons/GNS3Icon";

// ─── Types ────────────────────────────────────────────────────────────────────

type AccentColor = "teal" | "blue" | "violet" | "coral" | "copper" | "green";

interface Skill {
  name: string;
  icon: React.ReactNode;
  note?: string;
  /** Official brand / display color for the icon */
  iconColor: string;
}

interface Category {
  id: string;
  label: string;
  tabIcon: React.ReactNode;
  accent: AccentColor;
  description: string;
  focus?: string;
  skills: Skill[];
}

interface SoftSkill {
  name: string;
  icon: React.ReactNode;
  iconColor: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  {
    id: "networking",
    label: "Networking & Security",
    tabIcon: <Network className="h-4 w-4 shrink-0" />,
    accent: "teal",
    focus: "Core focus",
    description:
      "Building a foundation in network infrastructure, security concepts, and network configuration.",
    skills: [
      { name: "Networking", icon: <Network size={28} />, iconColor: "#14B8A6" },
      { name: "Cybersecurity", icon: <Shield size={28} />, iconColor: "#B487D6" },
      { name: "GNS3", icon: <GNS3Icon width={28} height={28} />, iconColor: "#D68A4C" },
      { name: "Cisco CLI", icon: <SiCisco size={28} />, iconColor: "#1BA0D7" },
      { name: "VMware", icon: <SiVmware size={28} />, iconColor: "#1B8FCC" },
      // From projects
      { name: "Network Automation", icon: <Workflow size={28} />, iconColor: "#2DD4BF" },
      { name: "TCP/IP", icon: <Cable size={28} />, iconColor: "#38BDF8" },
      { name: "Sockets", icon: <Plug size={28} />, iconColor: "#FBBF24" },
      { name: "NetworkX", icon: <GitBranch size={28} />, iconColor: "#FB923C" },
      { name: "BCrypt", icon: <KeyRound size={28} />, iconColor: "#FCA5A5" },
    ],
  },
  {
    id: "development",
    label: "Web Dev",
    tabIcon: <Code2 className="h-4 w-4 shrink-0" />,
    accent: "blue",
    description:
      "Programming and web technologies used to build practical software solutions.",
    skills: [
      { name: "Python", icon: <SiPython size={28} />, iconColor: "#FFD43B" },
      { name: "JavaScript", icon: <SiJavascript size={28} />, iconColor: "#F7DF1E" },
      { name: "Node.js", icon: <SiNodedotjs size={28} />, iconColor: "#339933" },
      { name: "C#", icon: <TbBrandCSharp size={28} />, iconColor: "#9B4F96" },
      { name: "HTML", icon: <SiHtml5 size={28} />, iconColor: "#E34F26" },
      { name: "CSS", icon: <FaCss3Alt size={28} />, iconColor: "#1572B6" },
      { name: "Flask", icon: <SiFlask size={28} />, iconColor: "#F5F5F5" },
      // From projects
      { name: "TypeScript", icon: <SiTypescript size={28} />, iconColor: "#3178C6" },
      { name: "Java", icon: <SiOpenjdk size={28} />, iconColor: "#F89820" },
      { name: "React", icon: <SiReact size={28} />, iconColor: "#61DAFB" },
      { name: "Three.js", icon: <SiThreedotjs size={28} />, iconColor: "#E5E7EB" },
      { name: "WebGL", icon: <SiWebgl size={28} />, iconColor: "#F05252" },
      { name: "Canvas API", icon: <Brush size={28} />, iconColor: "#F472B6" },
      { name: "vis-network", icon: <Spline size={28} />, iconColor: "#60A5FA" },
      { name: "Vite", icon: <SiVite size={28} />, iconColor: "#646CFF" },
      { name: "Express", icon: <SiExpress size={28} />, iconColor: "#E5E7EB" },
      { name: "Socket.IO", icon: <SiSocketdotio size={28} />, iconColor: "#E5E7EB" },
      { name: "ASP.NET Core", icon: <SiDotnet size={28} />, iconColor: "#7C6CF0" },
      { name: "Spring Boot", icon: <SiSpringboot size={28} />, iconColor: "#6DB33F" },
      { name: "Spring Security", icon: <SiSpringsecurity size={28} />, iconColor: "#6DB33F" },
      { name: "Spring Data JPA", icon: <SiHibernate size={28} />, iconColor: "#A3B1B8" },
      { name: "Thymeleaf", icon: <SiThymeleaf size={28} />, iconColor: "#3FA34D" },
      { name: "REST API", icon: <Share2 size={28} />, iconColor: "#22D3EE" },
      { name: "PostgreSQL", icon: <SiPostgresql size={28} />, iconColor: "#5B8DEF" },
      { name: "SQLite", icon: <SiSqlite size={28} />, iconColor: "#44A8E0" },
      { name: "H2 Database", icon: <Database size={28} />, iconColor: "#38BDF8" },
      { name: "JUnit 5", icon: <SiJunit5 size={28} />, iconColor: "#25A162" },
      { name: "unittest", icon: <ListChecks size={28} />, iconColor: "#FACC15" },
    ],
  },
  {
    id: "aiml",
    label: "AI / ML",
    tabIcon: <Brain className="h-4 w-4 shrink-0" />,
    accent: "violet",
    description:
      "Exploring applied AI, machine learning fundamentals, and generative AI technologies.",
    skills: [
      { name: "Applied AI / ML", icon: <Brain size={28} />, iconColor: "#B487D6" },
      { name: "Generative AI", icon: <Sparkles size={28} />, iconColor: "#2DD4BF" },
      { name: "Gemini API", icon: <SiGoogle size={28} />, iconColor: "#4285F4" },
      // From projects
      { name: "Computer Vision", icon: <ScanEye size={28} />, iconColor: "#34D399" },
      { name: "MediaPipe", icon: <SiMediapipe size={28} />, iconColor: "#22B8CF" },
      { name: "Tesseract OCR", icon: <ScanText size={28} />, iconColor: "#F59E0B" },
    ],
  },
  {
    id: "mobile",
    label: "Mobile",
    tabIcon: <Smartphone className="h-4 w-4 shrink-0" />,
    accent: "teal",
    description: "Developing mobile applications with Flutter and Dart.",
    skills: [
      { name: "Flutter", icon: <SiFlutter size={28} />, iconColor: "#54C5F8" },
      { name: "Dart", icon: <SiDart size={28} />, iconColor: "#0175C2" },
      // From projects
      { name: "Android", icon: <SiAndroid size={28} />, iconColor: "#3DDC84" },
      { name: "Figma", icon: <SiFigma size={28} />, iconColor: "#F24E1E" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud",
    tabIcon: <Cloud className="h-4 w-4 shrink-0" />,
    accent: "copper",
    description:
      "Building foundational knowledge of cloud platforms, cloud computing concepts, containers, and CI/CD.",
    skills: [
      { name: "Huawei Cloud", icon: <SiHuawei size={28} />, iconColor: "#CF0A2C" },
      { name: "Cloud Computing", icon: <Cloud size={28} />, iconColor: "#38BDF8" },
      // From projects
      { name: "Docker", icon: <SiDocker size={28} />, iconColor: "#2496ED" },
      { name: "GitHub Actions", icon: <SiGithubactions size={28} />, iconColor: "#2088FF" },
    ],
  },
  {
    id: "languages",
    label: "Languages",
    tabIcon: <Globe className="h-4 w-4 shrink-0" />,
    accent: "green",
    description:
      "Languages I use across academic, technical, and everyday communication.",
    skills: [
      {
        name: "Burmese",
        icon: <span className="text-[26px] leading-none select-none">🇲🇲</span>,
        note: "Native",
        iconColor: "#FBBF24",
      },
      {
        name: "English",
        icon: <span className="text-[26px] leading-none select-none">🇬🇧</span>,
        note: "Intermediate",
        iconColor: "#60A5FA",
      },
      {
        name: "Thai",
        icon: <span className="text-[26px] leading-none select-none">🇹🇭</span>,
        note: "Beginner",
        iconColor: "#34D399",
      },
      {
        name: "Japanese",
        icon: <span className="text-[26px] leading-none select-none">🇯🇵</span>,
        note: "Beginner",
        iconColor: "#F87171",
      },
    ],
  },
];

const SOFT_SKILLS: SoftSkill[] = [
  { name: "Communication", icon: <MessageSquare className="h-4 w-4" />, iconColor: "#22D3EE" },
  { name: "Open-mindedness", icon: <Lightbulb className="h-4 w-4" />, iconColor: "#2DD4BF" },
  { name: "Teamwork", icon: <Users className="h-4 w-4" />, iconColor: "#6FC08A" },
  { name: "Leadership", icon: <Flag className="h-4 w-4" />, iconColor: "#60A5FA" },
  { name: "Problem-Solving", icon: <Wrench className="h-4 w-4" />, iconColor: "#D68A4C" },
  { name: "Adaptability", icon: <RefreshCw className="h-4 w-4" />, iconColor: "#FB7185" },
];

// ─── Accent config (all classes pre-declared for Tailwind JIT) ────────────────

const ACCENT_TAB_ACTIVE: Record<AccentColor, string> = {
  teal:   "border-teal/40 bg-teal/10 text-teal",
  blue:   "border-blue/40 bg-blue/10 text-blue",
  violet: "border-violet/40 bg-violet/10 text-violet",
  coral:  "border-coral/40 bg-coral/10 text-coral",
  copper: "border-copper/40 bg-copper/10 text-copper",
  green:  "border-green/40 bg-green/10 text-green",
};

const ACCENT_TEXT: Record<AccentColor, string> = {
  teal:   "text-teal",
  blue:   "text-blue",
  violet: "text-violet",
  coral:  "text-coral",
  copper: "text-copper",
  green:  "text-green",
};

const ACCENT_ICON_BG: Record<AccentColor, string> = {
  teal:   "bg-teal/10",
  blue:   "bg-blue/10",
  violet: "bg-violet/10",
  coral:  "bg-coral/10",
  copper: "bg-copper/10",
  green:  "bg-green/10",
};

const ACCENT_GLOW_PANEL: Record<AccentColor, string> = {
  teal:   "shadow-[0_0_80px_rgba(20,184,166,0.04)]",
  blue:   "shadow-[0_0_80px_rgba(91,155,213,0.04)]",
  violet: "shadow-[0_0_80px_rgba(180,135,214,0.04)]",
  coral:  "shadow-[0_0_80px_rgba(251,113,133,0.04)]",
  copper: "shadow-[0_0_80px_rgba(214,138,76,0.04)]",
  green:  "shadow-[0_0_80px_rgba(111,192,138,0.04)]",
};

// ─── Animation variants ───────────────────────────────────────────────────────

const pageContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};

const fadeUpChild = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const categoryContent = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.16 } },
};

// ─── SkillCard ────────────────────────────────────────────────────────────────

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        // cap the stagger so long lists don't take seconds to appear
        opacity: { delay: Math.min(index, 12) * 0.055, duration: 0.38, ease: [0.22, 1, 0.36, 1] },
        y: { delay: Math.min(index, 12) * 0.055, duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      }}
      style={{
        backgroundColor: "rgba(255,255,255,0.025)",
        borderColor: "rgba(255,255,255,0.07)",
      }}
      className="group relative flex flex-col items-center justify-center gap-3 rounded-xl border p-4"
    >
      {/* Subtle top-highlight line */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px rounded-t-xl"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
        }}
      />

      {/* Icon with brand color */}
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
        style={{
          backgroundColor: `${skill.iconColor}18`,
          color: skill.iconColor,
        }}
      >
        {skill.icon}
      </div>

      {/* Name */}
      <p className="text-center font-body text-[13px] font-medium leading-tight text-[#F8FAFC]">
        {skill.name}
      </p>

      {/* Proficiency note (languages only) */}
      {skill.note && (
        <span
          className="font-mono text-[13px] font-medium opacity-80"
          style={{ color: skill.iconColor }}
        >
          {skill.note}
        </span>
      )}
    </motion.div>
  );
}

// ─── CoreSkillsPanel ──────────────────────────────────────────────────────────

function CoreSkillsPanel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const cat = CATEGORIES[activeIdx];

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) {
    const last = CATEGORIES.length - 1;
    let next: number | null = null;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight":
        e.preventDefault();
        next = idx < last ? idx + 1 : 0;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        e.preventDefault();
        next = idx > 0 ? idx - 1 : last;
        break;
      case "Home":
        e.preventDefault();
        next = 0;
        break;
      case "End":
        e.preventDefault();
        next = last;
        break;
    }
    if (next !== null) {
      setActiveIdx(next);
      tabRefs.current[next]?.focus();
    }
  }

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl",
        "border border-white/[0.09]",
        "bg-white/[0.03] backdrop-blur-2xl",
        "shadow-[0_8px_80px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)]",
        ACCENT_GLOW_PANEL[cat.accent],
        "transition-shadow duration-700",
      ].join(" ")}
    >
      {/* Top highlight */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent"
      />

      {/* Titlebar */}
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-3.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/55" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/55" />
          <span className="h-2.5 w-2.5 rounded-full bg-green/55" />
        </span>
        <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.18em] text-slate/50">
          core_skills.json
        </span>
        <span className="ml-auto font-mono text-[10px] text-slate/30">
          {CATEGORIES.reduce((a, c) => a + c.skills.length, 0)} skills total
        </span>
      </div>

      {/* Body */}
      <div className="flex min-h-[440px] flex-col md:flex-row">

        {/* Tab list */}
        <div
          role="tablist"
          aria-label="Skill categories"
          aria-orientation="vertical"
          className="flex flex-row gap-1.5 overflow-x-auto border-b border-white/[0.07] p-3 md:w-56 md:shrink-0 md:flex-col md:overflow-x-visible md:border-b-0 md:border-r md:p-4"
          style={{ scrollbarWidth: "none" }}
        >
          {CATEGORIES.map((c, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={c.id}
                role="tab"
                id={`tab-${c.id}`}
                aria-selected={isActive}
                aria-controls={`tabpanel-${c.id}`}
                ref={(el) => { tabRefs.current[idx] = el; }}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveIdx(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={[
                  "group/tab flex shrink-0 items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left",
                  "transition-all duration-200 focus-visible:outline-none",
                  "focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0",
                  isActive
                    ? ACCENT_TAB_ACTIVE[c.accent]
                    : "border-transparent text-slate hover:bg-white/[0.05] hover:text-ink",
                ].join(" ")}
              >
                <span className={isActive ? "" : "opacity-60 group-hover/tab:opacity-100 transition-opacity"}>
                  {c.tabIcon}
                </span>
                <span className="min-w-0 flex-1 truncate font-body text-[12.5px] font-medium">
                  {c.label}
                </span>
                <span
                  className={[
                    "shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold",
                    isActive ? "bg-white/10" : "bg-white/[0.04] text-slate/50",
                  ].join(" ")}
                >
                  {c.skills.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content panel */}
        <div
          id={`tabpanel-${cat.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${cat.id}`}
          className="flex-1 p-4"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={cat.id}
              variants={categoryContent}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex h-full flex-col gap-4"
            >
              {/* Category header */}
              <div className="flex flex-wrap items-start gap-4">
                <div
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    ACCENT_ICON_BG[cat.accent],
                    ACCENT_TEXT[cat.accent],
                  ].join(" ")}
                >
                  {cat.tabIcon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-xs font-semibold text-ink">
                      {cat.label}
                    </h3>
                    {cat.focus && (
                      <span
                        className={[
                          "rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
                          ACCENT_TAB_ACTIVE[cat.accent],
                        ].join(" ")}
                      >
                        {cat.focus}
                      </span>
                    )}
                    <span className="font-mono text-xs text-muted">
                      {cat.skills.length} skills
                    </span>
                  </div>
                  <p className="mt-1 font-body text-sm leading-relaxed text-body">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-transparent" />

              {/* Skill grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {cat.skills.map((skill, i) => (
                  <SkillCard key={skill.name} skill={skill} index={i} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── SoftSkillCard ─────────────────────────────────────────────────────────────

function SoftSkillCard({ skill, index }: { skill: SoftSkill; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        opacity: { delay: index * 0.07, duration: 0.42, ease: [0.22, 1, 0.36, 1] },
        y: { delay: index * 0.07, duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      className="group relative flex items-center gap-4 rounded-xl border p-4"
      style={{
        backgroundColor: "rgba(255,255,255,0.025)",
        borderColor: "rgba(251,113,133,0.15)",
      }}
    >
      {/* Icon */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110"
        style={{
          backgroundColor: `${skill.iconColor}20`,
          color: skill.iconColor,
        }}
      >
        {skill.icon}
      </div>

      {/* Name */}
      <span className="font-body text-[14px] font-medium text-[#F8FAFC]">
        {skill.name}
      </span>
    </motion.div>
  );
}

// ─── SoftSkillsPanel ─────────────────────────────────────────────────────────

function SoftSkillsPanel() {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl",
        "border border-coral/15",
        "bg-white/[0.02] backdrop-blur-2xl",
        "shadow-[0_4px_60px_rgba(251,113,133,0.06),inset_0_1px_0_rgba(251,113,133,0.1)]",
      ].join(" ")}
    >
      {/* Top highlight */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-coral/25 to-transparent"
      />

      {/* Titlebar */}
      <div className="flex items-center justify-between border-b border-coral/10 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/55" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/55" />
            <span className="h-2.5 w-2.5 rounded-full bg-coral/55" />
          </span>
          <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.18em] text-coral/60">
            soft_skills.md
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate/30">
          {SOFT_SKILLS.length} attributes
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
        {SOFT_SKILLS.map((skill, i) => (
          <SoftSkillCard key={skill.name} skill={skill} index={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Skills() {
  return (
    <section id="skills" className="relative py-8 lg:py-10">
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 top-1/3 -z-10 h-[400px] w-[500px] rounded-full bg-teal/[0.04] blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 bottom-1/3 -z-10 h-[400px] w-[400px] rounded-full bg-violet/[0.04] blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-blue/[0.03] blur-[90px]"
      />

      <div className="mx-auto w-full w-full max-w-[1050px] mx-auto px-4">
        <motion.div
          variants={pageContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col gap-4"
        >
          {/* Header */}
          <motion.div variants={fadeUpChild} className="mb-8 flex flex-col items-center text-center">
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.28em]" style={{ color: "#FFD700" }}>
              // technical foundation
            </p>
            <h2 className="mb-4 font-heading text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
              The <span className="text-cyan">technologies</span> behind what I build.
            </h2>
            <p className="mx-auto max-w-[1050px] font-body text-xs leading-[1.75] text-body">
              A growing foundation across networking, cybersecurity, network automation, development, cloud, and AI/ML.
            </p>
          </motion.div>

          {/* Core Skills */}
          <motion.div variants={fadeUpChild}>
            <CoreSkillsPanel />
          </motion.div>

          {/* Soft Skills */}
          <motion.div variants={fadeUpChild}>
            <SoftSkillsPanel />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
