import type { IconType } from "react-icons";
import {
  Network,
  Brain,
  Smartphone,
  Workflow,
  ShieldCheck,
  ShieldAlert,
  Waypoints,
  Globe,
  Cable,
  ListChecks,
  GitBranch,
  Share2,
  ScanEye,
  Hand,
  Brush,
  Gamepad2,
  Box,
  Plug,
  Spline,
  ScanText,
  Database,
  DatabaseBackup,
  ScrollText,
  KeyRound,
  type LucideIcon,
} from "lucide-react";
import {
  SiPython,
  SiFlutter,
  SiDart,
  SiFlask,
  SiMysql,
  SiThreedotjs,
  SiReact,
  SiTypescript,
  SiCisco,
  SiGooglegemini,
  SiAndroid,
  SiFigma,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiPostgresql,
  SiNodedotjs,
  SiExpress,
  SiSocketdotio,
  SiDocker,
  SiWebgl,
  SiMediapipe,
  SiDotnet,
  SiSqlite,
  SiOpenjdk,
  SiSpringboot,
  SiSpringsecurity,
  SiThymeleaf,
  SiHibernate,
  SiJunit5,
  SiGithubactions,
  SiVite,
} from "react-icons/si";
import { FaCss3Alt } from "react-icons/fa";
import { TbBrandCSharp } from "react-icons/tb";
import type { FilterCategory } from "@/lib/projects";

type IconCmp = IconType | LucideIcon;

export const CATEGORY_ICON: Record<FilterCategory, IconCmp> = {
  Network: Network,
  "AI/ML": Brain,
  "Computer Vision": ScanEye,
  Cybersecurity: ShieldAlert,
  Mobile: Smartphone,
  Web: Globe,
};

// One colour per category, used for the filter tabs and the project titles
export const CATEGORY_STYLE: Record<FilterCategory, { title: string; icon: string; tabOn: string }> = {
  "AI/ML": {
    title: "text-[#C4B5FD]",
    icon: "text-[#A78BFA]",
    tabOn: "bg-[rgba(167,139,250,0.14)] text-[#C4B5FD] shadow-[inset_0_0_0_1px_rgba(167,139,250,0.38)]",
  },
  "Computer Vision": {
    title: "text-[#6EE7B7]",
    icon: "text-[#34D399]",
    tabOn: "bg-[rgba(52,211,153,0.14)] text-[#6EE7B7] shadow-[inset_0_0_0_1px_rgba(52,211,153,0.38)]",
  },
  Network: {
    title: "text-[#93C5FD]",
    icon: "text-[#60A5FA]",
    tabOn: "bg-[rgba(96,165,250,0.14)] text-[#93C5FD] shadow-[inset_0_0_0_1px_rgba(96,165,250,0.38)]",
  },
  Cybersecurity: {
    title: "text-[#FCA5A5]",
    icon: "text-[#F87171]",
    tabOn: "bg-[rgba(248,113,113,0.14)] text-[#FCA5A5] shadow-[inset_0_0_0_1px_rgba(248,113,113,0.38)]",
  },
  Mobile: {
    title: "text-[#FDBA74]",
    icon: "text-[#FB923C]",
    tabOn: "bg-[rgba(251,146,60,0.14)] text-[#FDBA74] shadow-[inset_0_0_0_1px_rgba(251,146,60,0.38)]",
  },
  Web: {
    title: "text-[#F9A8D4]",
    icon: "text-[#F472B6]",
    tabOn: "bg-[rgba(244,114,182,0.14)] text-[#F9A8D4] shadow-[inset_0_0_0_1px_rgba(244,114,182,0.38)]",
  },
};

const TAG_ICON: Record<string, IconCmp> = {
  Networking: Network,
  "AI/ML": Brain,
  Cybersecurity: ShieldAlert,
  Automation: Workflow,
  GNS3: Waypoints,
  "Cisco CLI": SiCisco,
  "Cisco-style CLI": SiCisco,
  Vite: SiVite,
  Python: SiPython,
  "Gemini API": SiGooglegemini,
  Flask: SiFlask,
  MySQL: SiMysql,
  HTML: SiHtml5,
  CSS: FaCss3Alt,
  JavaScript: SiJavascript,
  "PostgreSQL/SQLite": SiPostgresql,
  "Three.js": SiThreedotjs,
  React: SiReact,
  TypeScript: SiTypescript,
  Flutter: SiFlutter,
  Dart: SiDart,
  Android: SiAndroid,
  Figma: SiFigma,
  "TCP/IP": Cable,
  unittest: ListChecks,
  Git: SiGit,
  "Role-Based Access": ShieldCheck,
  NetworkX: GitBranch,
  "REST API": Share2,
  "C#": TbBrandCSharp,
  "Node.js": SiNodedotjs,
  Express: SiExpress,
  "Socket.IO": SiSocketdotio,
  Docker: SiDocker,
  "Computer Vision": ScanEye,
  MediaPipe: SiMediapipe,
  WebGL: SiWebgl,
  "Interaction Logic": Hand,
  "Canvas API": Brush,
  "Game Logic": Gamepad2,
  "3D Modeling": Box,
  "ASP.NET Core": SiDotnet,
  SQLite: SiSqlite,
  Sockets: Plug,
  "vis-network": Spline,
  "Tesseract OCR": ScanText,
  Java: SiOpenjdk,
  "Spring Boot": SiSpringboot,
  "Spring Security": SiSpringsecurity,
  Thymeleaf: SiThymeleaf,
  "Spring Data JPA": SiHibernate,
  "H2 Database": Database,
  BCrypt: KeyRound,
  "JUnit 5": SiJunit5,
  "GitHub Actions": SiGithubactions,
  "Audit Logging": ScrollText,
  "Backup & Restore": DatabaseBackup,
};

export function TagChip({ tag }: { tag: string }) {
  const Icon = TAG_ICON[tag];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(45,212,191,0.22)] bg-[rgba(45,212,191,0.07)] px-2 py-1 font-body text-[11.5px] font-medium leading-none text-[rgba(45,212,191,0.85)]">
      {Icon && <Icon className="h-3 w-3 shrink-0" />}
      {tag}
    </span>
  );
}
